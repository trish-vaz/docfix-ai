function checkSpacing(documentModel) {
    const spacingValues = [];

    documentModel.blocks.forEach((block) => {
        if (block.type !== "paragraph" && block.type !== "heading" && block.type !== "listItem") {
            return;
        }

        const spaceBefore = Number(block.layout?.spaceBefore || 0);
        const spaceAfter = Number(block.layout?.spaceAfter || 0);
        const lineSpacing = Number(block.layout?.lineSpacing || 0);

        spacingValues.push({
            blockId: block.id,
            spaceBefore,
            spaceAfter,
            lineSpacing,
        });
    });

    const excessiveSpacingBlocks = spacingValues.filter(
        (item) => item.spaceBefore > 300 || item.spaceAfter > 300
    );

    const inconsistentLineSpacing = new Set(
        spacingValues.map((item) => item.lineSpacing).filter(Boolean)
    );

    const hasIssues =
        excessiveSpacingBlocks.length > 0 || inconsistentLineSpacing.size > 3;

    return {
        id: "spacing-consistency",
        name: "Spacing Consistency",
        passed: !hasIssues,
        severity:
            excessiveSpacingBlocks.length > 3 || inconsistentLineSpacing.size > 4
                ? "high"
                : hasIssues
                    ? "medium"
                    : "none",

        score: !hasIssues ? 100 : excessiveSpacingBlocks.length > 3 ? 50 : 70,

        details: {
            excessiveSpacingCount: excessiveSpacingBlocks.length,
            excessiveSpacingBlocks: excessiveSpacingBlocks.slice(0, 10),
            lineSpacingValues: [...inconsistentLineSpacing],
        },

        recommendation: hasIssues
            ? "Normalize paragraph spacing and line spacing for a cleaner layout."
            : null,
    };
}

module.exports = {
    checkSpacing,
};