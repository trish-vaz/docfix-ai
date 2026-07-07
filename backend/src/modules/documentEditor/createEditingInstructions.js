const { getStyleById } = require("../../styleLibrary");

function createEditingInstructions(documentModel, layoutPlan) {
    const style = getStyleById(layoutPlan.style.id);

    const typography = style.typography || {};
    const spacing = style.spacing || {};
    const alignment = style.alignment || {};

    const instructions = layoutPlan.operations.map((operation) => {
        switch (operation.type) {
            case "normalize_fonts":
                return {
                    type: "normalize_fonts",
                    target: "text_blocks",
                    value: {
                        fontFamily: typography.bodyFont || "Times New Roman",
                    },
                    reason: operation.reason,
                };

            case "normalize_spacing":
                return {
                    type: "normalize_spacing",
                    target: "text_blocks",
                    value: {
                        lineSpacing: spacing.lineSpacing || 1.5,
                        paragraphSpacingBefore: spacing.paragraphSpacingBefore ?? 0,
                        paragraphSpacingAfter: spacing.paragraphSpacingAfter ?? 8,
                    },
                    reason: operation.reason,
                };

            case "standardize_headings":
                return {
                    type: "standardize_headings",
                    target: "heading_like_blocks",
                    value: {
                        headingFont: typography.headingFont || "Times New Roman",
                        headingFontSize: typography.headingFontSize || 16,
                        subheadingFontSize: typography.subheadingFontSize || 14,
                        alignment: alignment.headings || "center",
                    },
                    reason: operation.reason,
                };

            default:
                return {
                    type: operation.type,
                    target: "manual_review",
                    value: {},
                    reason: operation.reason,
                };
        }
    });

    return instructions;
}

module.exports = {
    createEditingInstructions,
};