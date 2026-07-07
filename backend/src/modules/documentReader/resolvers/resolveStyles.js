function resolveStyles(blocks, styleDefinitions) {
    const styleMap = {};

    // Create a lookup map by style ID
    styleDefinitions.forEach((style) => {
        if (style.id) {
            styleMap[style.id] = style;
        }
    });

    return blocks.map((block) => {
        if (block.type !== "paragraph" && block.type !== "heading") {
            return block;
        }

        const paragraphStyle = block.style.paragraphStyle;

        const styleDefinition = styleMap[paragraphStyle];

        if (!styleDefinition) {
            return block;
        }

        return {
            ...block,

            resolvedStyle: {
                fontFamily:
                    block.style.fontFamily || styleDefinition.fontFamily,

                fontSize:
                    block.style.fontSize || styleDefinition.fontSize,

                bold:
                    block.style.bold || styleDefinition.bold,

                italic:
                    block.style.italic || styleDefinition.italic,

                alignment:
                    block.style.alignment || styleDefinition.alignment,

                spacingBefore:
                    block.layout.spaceBefore || styleDefinition.spacingBefore,

                spacingAfter:
                    block.layout.spaceAfter || styleDefinition.spacingAfter,
            },
        };
    });
}

module.exports = {
    resolveStyles,
};