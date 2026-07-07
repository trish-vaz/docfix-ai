function createLayoutPlan({
    styleId = "college_assignment",
    scope = { type: "document" },
    operations = [],
    constraints = {},
    warnings = [],
}) {
    return {
        createdAt: new Date().toISOString(),

        style: {
            id: styleId,
        },

        scope,

        operations,

        constraints: {
            preserveContent: true,
            preserveImages: constraints.preserveImages ?? false,
            preserveTables: constraints.preserveTables ?? false,
            ...constraints,
        },

        warnings,
    };
}

module.exports = {
    createLayoutPlan,
};