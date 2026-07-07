function checkFontSizes(documentModel) {
    const fontSizes = new Set();

    documentModel.blocks.forEach((block) => {
        const fontSize =
            block.resolvedStyle?.fontSize ||
            block.style?.fontSize;

        if (fontSize) {
            fontSizes.add(Number(fontSize.toFixed ? fontSize.toFixed(1) : fontSize));
        }
    });

    const fontSizesUsed = [...fontSizes];

    return {
        id: "font-size-consistency",
        name: "Font Size Consistency",
        passed: fontSizesUsed.length <= 3,
        severity:
            fontSizesUsed.length > 5
                ? "high"
                : fontSizesUsed.length > 3
                    ? "medium"
                    : "none",

        score: fontSizesUsed.length <= 3 ? 100 : fontSizesUsed.length <= 5 ? 75 : 50,

        details: {
            fontSizesUsed,
            totalFontSizes: fontSizesUsed.length,
        },

        recommendation:
            fontSizesUsed.length > 3
                ? "Reduce the number of different font sizes for a cleaner layout."
                : null,
    };
}

module.exports = {
    checkFontSizes,
};