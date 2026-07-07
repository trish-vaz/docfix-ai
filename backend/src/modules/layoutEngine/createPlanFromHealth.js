const { createLayoutPlan } = require("../../models/layoutPlanModel");

function createPlanFromHealth(healthReport, styleId = "college_assignment") {
    const operations = healthReport.recommendations.map((rec) => ({
        type: rec.actionType,
        reason: rec.recommendation,
        severity: rec.severity,
        sourceCheckId: rec.checkId,
    }));

    return createLayoutPlan({
        styleId,
        scope: { type: "document" },
        operations,
        constraints: {
            preserveContent: true,
        },
        warnings: [],
    });
}

module.exports = {
    createPlanFromHealth,
};