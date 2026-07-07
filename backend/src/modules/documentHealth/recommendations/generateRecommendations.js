function generateRecommendations(checks) {
    return checks
        .filter((check) => !check.passed && check.recommendation)
        .map((check) => ({
            checkId: check.id,
            title: check.name,
            severity: check.severity,
            recommendation: check.recommendation,
            actionType: mapCheckToAction(check.id),
        }));
}

function mapCheckToAction(checkId) {
    const actionMap = {
        "mixed-fonts": "normalize_fonts",
        "font-size-consistency": "normalize_font_sizes",
        "spacing-consistency": "normalize_spacing",
        "heading-structure": "standardize_headings",
        "image-layout": "align_images",
        "table-layout": "fit_tables_to_page",
        "list-formatting": "normalize_lists",
    };

    return actionMap[checkId] || "review_document";
}

module.exports = {
    generateRecommendations,
};