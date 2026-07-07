function analyzeDocument(documentModel) {
    const blocks = documentModel.blocks;

    const headings = blocks.filter((block) => block.type === "heading");
    const paragraphs = blocks.filter((block) => block.type === "paragraph");
    const listItems = blocks.filter((block) => block.type === "listItem");
    const images = blocks.filter((block) => block.type === "image");
    const tables = blocks.filter((block) => block.type === "table");

    const fontsUsed = getUniqueValues(
        blocks.map((block) => block.resolvedStyle?.fontFamily || block.style?.fontFamily)
    );

    const fontSizesUsed = getUniqueValues(
        blocks.map((block) => block.resolvedStyle?.fontSize || block.style?.fontSize)
    );

    return {
        summary: {
            totalBlocks: blocks.length,
            headingCount: headings.length,
            paragraphCount: paragraphs.length,
            listItemCount: listItems.length,
            imageCount: images.length,
            tableCount: tables.length,
            wordCount: documentModel.metadata.wordCount,
            styleDefinitionCount: documentModel.styles.definitions?.length || 0,
        },

        formatting: {
            fontsUsed,
            fontSizesUsed,
            multipleFontsDetected: fontsUsed.length > 1,
            multipleFontSizesDetected: fontSizesUsed.length > 3,
        },

        issues: [],
    };
}

function getUniqueValues(values) {
    return [...new Set(values.filter((value) => value !== null && value !== undefined))];
}

module.exports = { analyzeDocument };