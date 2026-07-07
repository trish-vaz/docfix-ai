const { openDocx } = require("./reader/openDocx");
const { loadXml } = require("./reader/loadXml");
const { extractParagraphs } = require("./parsers/extractParagraphs");
const { createEmptyDocumentModel } = require("../../models/documentModel");
const { analyzeDocument } = require("../documentAnalysis");

async function readDocument(filePath, originalFileName = "unknown.docx") {
    const result = await openDocx(filePath);

    if (!result.isValidDocx) {
        throw new Error("Invalid DOCX file");
    }

    const documentXml = await loadXml(result.zip, "word/document.xml");

    const documentModel = createEmptyDocumentModel(originalFileName);

    const paragraphBlocks = extractParagraphs(documentXml);

    documentModel.blocks.push(...paragraphBlocks);

    documentModel.metadata.wordCount = paragraphBlocks.reduce((count, block) => {
        return count + block.content.text.split(/\s+/).filter(Boolean).length;
    }, 0);

    const analysis = analyzeDocument(documentModel);

    return {
        isValidDocx: true,
        fileCount: result.files.length,
        paragraphCount: paragraphBlocks.length,
        wordCount: documentModel.metadata.wordCount,

        blocksPreview: documentModel.blocks.slice(0, 5).map((block) => ({
            id: block.id,
            type: block.type,
            order: block.order,
            text: block.content.text.substring(0, 100),
            style: block.style,
            layout: block.layout,
        })),
        analysis,
        documentModel,
    };
}

module.exports = { readDocument };