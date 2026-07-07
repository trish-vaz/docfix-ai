function checkHeadings(documentModel) {
    const headings = documentModel.blocks.filter((block) => block.type === "heading");

    const hasHeadings = headings.length > 0;

    return {
        id: "heading-structure",
        name: "Heading Structure",
        passed: hasHeadings,
        severity: hasHeadings ? "none" : "medium",
        score: hasHeadings ? 100 : 65,

        details: {
            headingCount: headings.length,
            headingBlocks: headings.map((heading) => ({
                id: heading.id,
                text: heading.content.text?.substring(0, 80),
                style: heading.style?.paragraphStyle,
            })),
        },

        recommendation: hasHeadings
            ? null
            : "Use proper heading styles so the document structure is easier to read.",
    };
}

module.exports = {
    checkHeadings,
};