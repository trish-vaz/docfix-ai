function checkTables(documentModel) {
    const tables = documentModel.blocks.filter((block) => block.type === "table");

    const largeTables = tables.filter((table) => {
        return table.content.columnCount > 4;
    });

    const hasIssues = largeTables.length > 0;

    return {
        id: "table-layout",
        name: "Table Layout",
        passed: !hasIssues,
        severity: hasIssues ? "medium" : "none",
        score: hasIssues ? 75 : 100,

        details: {
            tableCount: tables.length,
            largeTableCount: largeTables.length,
            largeTables: largeTables.map((table) => ({
                id: table.id,
                rowCount: table.content.rowCount,
                columnCount: table.content.columnCount,
            })),
        },

        recommendation: hasIssues
            ? "Some tables have many columns and may need to be resized or fit to page width."
            : null,
    };
}

module.exports = {
    checkTables,
};