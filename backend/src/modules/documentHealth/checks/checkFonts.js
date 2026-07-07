function checkFonts(documentModel) {
    const fonts = new Set();

    documentModel.blocks.forEach((block) => {
        const font =
            block.resolvedStyle?.fontFamily ||
            block.style?.fontFamily;

        if (font) {
            fonts.add(font);
        }
    });

    const fontsUsed = [...fonts];

    return {
        id: "mixed-fonts",
        name: "Font Consistency",
        passed: fontsUsed.length <= 1,
        severity:
            fontsUsed.length > 2
                ? "high"
                : fontsUsed.length > 1
                    ? "medium"
                    : "none",

        score: fontsUsed.length <= 1 ? 100 : 60,

        details: {
            fontsUsed,
            totalFonts: fontsUsed.length,
        },

        recommendation:
            fontsUsed.length > 1
                ? "Use one primary font family for body text."
                : null,
    };
}

module.exports = {
    checkFonts,
};