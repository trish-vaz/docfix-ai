const { openDocx } = require("./reader/openDocx");
const { loadXml } = require("./reader/loadXml");

const { extractParagraphs } = require("./parsers/extractParagraphs");
const { extractImages } = require("./parsers/extractImages");
const { extractTables } = require("./parsers/extractTables");
const { extractStyles } = require("./parsers/extractStyles");

const { resolveStyles } = require("./resolvers/resolveStyles");

const { createEmptyDocumentModel } = require("../../models/documentModel");
const { analyzeDocument } = require("../documentAnalysis");

async function buildDocumentModel(filePath, originalFileName = "unknown.docx") {
    const result = await openDocx(filePath);

    if (!result.isValidDocx) {
        throw new Error("Invalid DOCX file");
    }

    const documentXml = await loadXml(result.zip, "word/document.xml");
    const stylesXml = await loadXml(result.zip, "word/styles.xml");

    const documentModel = createEmptyDocumentModel(originalFileName);

    const paragraphBlocks = extractParagraphs(documentXml);
    const imageBlocks = extractImages(result.files);
    const tableBlocks = extractTables(documentXml);
    const styles = extractStyles(stylesXml);

    const resolvedBlocks = resolveStyles(paragraphBlocks, styles);

    documentModel.styles = {
        definitions: styles,
        fontsUsed: [],
        fontSizesUsed: [],
        headingStyles: styles.filter((style) =>
            style.id?.toLowerCase().includes("heading")
        ),
        paragraphStyles: styles.filter((style) => style.type === "paragraph"),
    };

    documentModel.blocks.push(...resolvedBlocks);
    documentModel.blocks.push(...imageBlocks);
    documentModel.blocks.push(...tableBlocks);

    documentModel.metadata.wordCount = paragraphBlocks.reduce((count, block) => {
        return count + block.content.text.split(/\s+/).filter(Boolean).length;
    }, 0);

    const analysis = analyzeDocument(documentModel);

    return {
        isValidDocx: true,
        fileCount: result.files.length,
        paragraphCount: paragraphBlocks.length,
        wordCount: documentModel.metadata.wordCount,

        blocksPreview: documentModel.blocks.slice(0, 10).map((block) => ({
            id: block.id,
            type: block.type,
            order: block.order,
            text: block.content.text
                ? block.content.text.substring(0, 100)
                : block.content.fileName ||
                `Table: ${block.content.rowCount} rows x ${block.content.columnCount} columns`,
            rawStyle: block.style,
            resolvedStyle: block.resolvedStyle || null,
            layout: block.layout,
        })),

        analysis,
        documentModel,
        imageCount: imageBlocks.length,
        tableCount: tableBlocks.length,
        styleDefinitions: styles.length,
    };
}

module.exports = {
    buildDocumentModel,
};