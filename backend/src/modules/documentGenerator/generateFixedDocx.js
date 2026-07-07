const fs = require("fs");
const path = require("path");
const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    AlignmentType,
    Table,
    TableRow,
    TableCell,
    WidthType,
    ImageRun,
} = require("docx");

async function generateFixedDocxFromModel(updatedDocumentModel, outputFileName) {
    const children = updatedDocumentModel.blocks
        .filter((block) =>
            ["paragraph", "heading", "listItem", "table", "image"].includes(block.type)
        )
        .map((block) => {
            if (block.type === "table") {
                return createTable(block);
            }
            if (block.type === "image") {
                return createImage(block);
            }
            const style = block.finalStyle || block.resolvedStyle || block.style || {};
            const layout = block.finalLayout || block.layout || {};

            return new Paragraph({
                alignment: mapAlignment(style.alignment),
                spacing: {
                    before: convertSpacing(layout.paragraphSpacingBefore ?? 0),
                    after: convertSpacing(layout.paragraphSpacingAfter ?? 8),
                    line: convertLineSpacing(layout.lineSpacing ?? 1.15),
                },
                numbering:
                    block.type === "listItem"
                        ? {
                            reference: "default-bullet-list",
                            level: Number(block.list?.level || 0),
                        }
                        : undefined,
                children: [
                    new TextRun({
                        text: block.content.text || "",
                        font: style.fontFamily || "Times New Roman",
                        size: convertFontSize(style.fontSize || 12),
                        bold: Boolean(style.bold),
                        italics: Boolean(style.italic),
                        underline: style.underline ? {} : undefined,
                    }),
                ],
            });
        });

    const doc = new Document({
        numbering: {
            config: [
                {
                    reference: "default-bullet-list",
                    levels: [
                        {
                            level: 0,
                            format: "bullet",
                            text: "•",
                            alignment: "left",
                        },
                    ],
                },
            ],
        },

        sections: [
            {
                children,
            },
        ],
    });

    const outputBuffer = await Packer.toBuffer(doc);

    const outputDir = path.join(__dirname, "../../../outputs");

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, outputFileName);
    fs.writeFileSync(outputPath, outputBuffer);

    return outputPath;
}

function mapAlignment(alignment) {
    if (alignment === "center") return AlignmentType.CENTER;
    if (alignment === "right") return AlignmentType.RIGHT;
    if (alignment === "both" || alignment === "justified") return AlignmentType.JUSTIFIED;
    return AlignmentType.LEFT;
}

function convertFontSize(size) {
    return Math.round(Number(size) * 2);
}

function convertSpacing(value) {
    if (value === null || value === undefined) return undefined;
    return Math.round(Number(value) * 20);
}

function convertLineSpacing(value) {
    if (!value) return undefined;

    if (Number(value) <= 3) {
        return Math.round(Number(value) * 240);
    }

    return Math.round(Number(value));
}

function createTable(block) {
    const rows = Array.isArray(block.content.rows)
        ? block.content.rows.filter((row) => Array.isArray(row) && row.length > 0)
        : [];

    if (rows.length === 0) {
        return new Paragraph({
            children: [
                new TextRun({
                    text: "[Empty table]",
                    italics: true,
                }),
            ],
        });
    }

    return new Table({
        width: {
            size: 100,
            type: WidthType.PERCENTAGE,
        },
        rows: rows.map(
            (row) =>
                new TableRow({
                    children: row.map(
                        (cellText) =>
                            new TableCell({
                                children: [
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: String(cellText || ""),
                                                size: convertFontSize(10),
                                            }),
                                        ],
                                    }),
                                ],
                            })
                    ),
                })
        ),
    });
}

function createImage(block) {
    if (!block.content?.buffer) {
        return new Paragraph({
            children: [
                new TextRun({
                    text: `[Image missing: ${block.content?.fileName || "unknown"}]`,
                    italics: true,
                }),
            ],
        });
    }

    return new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
            new ImageRun({
                data: block.content.buffer,
                transformation: {
                    width: block.layout.width || 400,
                    height: block.layout.height || 250,
                },
            }),
        ],
    });
}

module.exports = {
    generateFixedDocxFromModel,
};