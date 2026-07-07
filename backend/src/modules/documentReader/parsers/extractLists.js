function extractListInfoFromParagraph(paragraph) {
    const paragraphProps = paragraph?.["w:pPr"] || {};
    const numberingProps = paragraphProps?.["w:numPr"];

    if (!numberingProps) {
        return null;
    }

    return {
        isListItem: true,
        level: numberingProps?.["w:ilvl"]?.["w:val"] ?? null,
        numberingId: numberingProps?.["w:numId"]?.["w:val"] ?? null,
    };
}

module.exports = {
    extractListInfoFromParagraph,
};