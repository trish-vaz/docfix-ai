function analyzeDocument(documentModel) {
    const blocks = documentModel.blocks;

    const headings = blocks.filter(block => block.type === "heading");
    const paragraphs = blocks.filter(block => block.type === "paragraph");

    return {
        summary: {
            totalBlocks: blocks.length,
            headingCount: headings.length,
            paragraphCount: paragraphs.length,
            wordCount: documentModel.metadata.wordCount,
        },

        issues: [],
    };
}

module.exports = { analyzeDocument };