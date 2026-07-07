const CHECK_WEIGHTS = {
    "mixed-fonts": 20,
    "font-size-consistency": 15,
    "spacing-consistency": 25,
    "heading-structure": 20,
    "image-layout": 5,
    "table-layout": 5,
    "list-formatting": 10,
};

function calculateHealthScore(checks) {
    if (!checks.length) return 100;

    let weightedScore = 0;
    let totalWeight = 0;

    checks.forEach((check) => {
        const weight = CHECK_WEIGHTS[check.id] || 10;

        weightedScore += check.score * weight;
        totalWeight += weight;
    });

    return Math.round(weightedScore / totalWeight);
}

module.exports = {
    calculateHealthScore,
};