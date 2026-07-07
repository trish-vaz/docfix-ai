const { checkFonts } = require("./checks/checkFonts");
const { checkFontSizes } = require("./checks/checkFontSizes");
const { checkSpacing } = require("./checks/checkSpacing");
const { checkHeadings } = require("./checks/checkHeadings");
const { checkImages } = require("./checks/checkImages");
const { checkTables } = require("./checks/checkTables");
const { checkLists } = require("./checks/checkLists");

const { calculateHealthScore } = require("./scoring/calculateHealthScore");
const { generateRecommendations } = require("./recommendations/generateRecommendations");

function analyzeDocumentHealth(documentModel) {
    const checks = [
        checkFonts(documentModel),
        checkFontSizes(documentModel),
        checkSpacing(documentModel),
        checkHeadings(documentModel),
        checkImages(documentModel),
        checkTables(documentModel),
        checkLists(documentModel),
    ];

    const healthScore = calculateHealthScore(checks);
    const recommendations = generateRecommendations(checks);

    return {
        healthScore,
        status: getHealthStatus(healthScore),
        totalChecks: checks.length,
        passedChecks: checks.filter((check) => check.passed).length,
        failedChecks: checks.filter((check) => !check.passed).length,
        checks,
        recommendations,
    };
}

function getHealthStatus(score) {
    if (score >= 85) return "excellent";
    if (score >= 70) return "good";
    if (score >= 50) return "needs_improvement";
    return "poor";
}

module.exports = {
    analyzeDocumentHealth,
};