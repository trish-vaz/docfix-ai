function checkLists(documentModel) {
    const listItems = documentModel.blocks.filter(
        (block) => block.type === "listItem"
    );

    const listLevels = new Set(
        listItems
            .map((item) => item.list?.level)
            .filter((level) => level !== null && level !== undefined)
    );

    return {
        id: "list-formatting",
        name: "List Formatting",
        passed: true,
        severity: "none",
        score: 100,

        details: {
            listItemCount: listItems.length,
            listLevels: [...listLevels],
        },

        recommendation:
            listItems.length > 0
                ? "List items were detected. DocFix AI can later normalize bullet spacing and indentation."
                : null,
    };
}

module.exports = {
    checkLists,
};