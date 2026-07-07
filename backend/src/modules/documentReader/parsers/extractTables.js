const { XMLParser } = require("fast-xml-parser");

function extractTables(documentXml) {
    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "",
    });

    const parsed = parser.parse(documentXml);
    const body = parsed["w:document"]["w:body"];

    const rawTables = body["w:tbl"] || [];

    const tablesArray = Array.isArray(rawTables)
        ? rawTables
        : [rawTables];

    return tablesArray.map((table, index) => {
        const rows = extractRows(table);

        return {
            id: `table_${index + 1}`,
            type: "table",
            order: null,
            sectionId: "section_1",

            pageEstimate: {
                startPage: null,
                endPage: null,
                confidence: "low",
            },

            content: {
                rowCount: rows.length,
                columnCount: rows[0]?.length || 0,
                rows,
            },

            style: {},

            layout: {
                alignment: null,
                width: null,
                fitToPage: null,
            },

            relationships: {
                previousBlockId: null,
                nextBlockId: null,
                parentId: null,
                childrenIds: [],
                captionId: null,
            },
        };
    });
}

function extractRows(table) {
    const rawRows = table["w:tr"] || [];
    const rowsArray = Array.isArray(rawRows) ? rawRows : [rawRows];

    return rowsArray.map((row) => {
        const rawCells = row["w:tc"] || [];
        const cellsArray = Array.isArray(rawCells) ? rawCells : [rawCells];

        return cellsArray.map((cell) => extractCellText(cell));
    });
}

function extractCellText(cell) {
    const paragraphs = cell["w:p"] || [];
    const paragraphsArray = Array.isArray(paragraphs)
        ? paragraphs
        : [paragraphs];

    return paragraphsArray
        .map((paragraph) => extractParagraphText(paragraph))
        .join(" ")
        .trim();
}

function extractParagraphText(paragraph) {
    const runs = paragraph["w:r"] || [];
    const runsArray = Array.isArray(runs) ? runs : [runs];

    return runsArray
        .map((run) => {
            const textNode = run["w:t"];

            if (!textNode) return "";
            if (typeof textNode === "string") return textNode;

            return textNode["#text"] || "";
        })
        .join("");
}

module.exports = { extractTables };