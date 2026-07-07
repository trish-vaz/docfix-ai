function applyEditingInstructions(documentModel, editingInstructions) {
    const updatedModel = structuredClone(documentModel);

    editingInstructions.forEach((instruction) => {
        switch (instruction.type) {
            case "normalize_fonts":
                applyFontNormalization(updatedModel, instruction.value);
                break;

            case "normalize_spacing":
                applySpacingNormalization(updatedModel, instruction.value);
                break;

            case "standardize_headings":
                // Temporarily disabled until heading detection is more accurate
                break;
            default:
                break;
        }
    });

    return updatedModel;
}

function applyFontNormalization(documentModel, value) {
    documentModel.blocks.forEach((block) => {
        if (isTextBlock(block)) {
            block.finalStyle = {
                ...(block.finalStyle || block.resolvedStyle || block.style || {}),
                fontFamily: value.fontFamily,
            };
        }
    });
}

function applySpacingNormalization(documentModel, value) {
    documentModel.blocks.forEach((block) => {
        if (isTextBlock(block)) {
            block.finalLayout = {
                ...(block.finalLayout || block.layout || {}),
                lineSpacing: value.lineSpacing,
                paragraphSpacingBefore: value.paragraphSpacingBefore,
                paragraphSpacingAfter: value.paragraphSpacingAfter,
            };
        }
    });
}

function applyHeadingStandardization(documentModel, value) {
    documentModel.blocks.forEach((block) => {
        if (block.type === "heading" || looksLikeHeading(block)) {
            block.type = "heading";

            block.finalStyle = {
                ...(block.finalStyle || block.resolvedStyle || block.style || {}),
                fontFamily: value.headingFont,
                fontSize: value.headingFontSize,
                bold: true,
                alignment: value.alignment,
            };
        }
    });
}

function isTextBlock(block) {
    return ["paragraph", "heading", "listItem"].includes(block.type);
}

function looksLikeHeading(block) {
    if (!block.content?.text) return false;

    const text = block.content.text.trim();

    return (
        text.length < 90 &&
        (
            /^\d+[\.\)]\s+/.test(text) ||
            /^(aim|objective|objectives|outcome|outcomes|introduction|conclusion|references)$/i.test(text)
        )
    );
}

module.exports = {
    applyEditingInstructions,
};