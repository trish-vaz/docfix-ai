const { XMLParser } = require("fast-xml-parser");

function extractStyles(stylesXml) {
    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "",
    });

    const parsed = parser.parse(stylesXml);

    const rawStyles =
        parsed["w:styles"]?.["w:style"] || [];

    const stylesArray = Array.isArray(rawStyles)
        ? rawStyles
        : [rawStyles];

    return stylesArray.map((style) => {
        const runProps = style["w:rPr"] || {};
        const paragraphProps = style["w:pPr"] || {};

        return {
            id: style["w:styleId"] || style["styleId"] || normalizeStyleName(style["w:name"]?.["w:val"]),

            type: style["w:type"],

            name:
                style["w:name"]?.["w:val"] || null,

            fontFamily:
                runProps?.["w:rFonts"]?.["w:ascii"] || null,

            fontSize:
                runProps?.["w:sz"]?.["w:val"]
                    ? Number(runProps["w:sz"]["w:val"]) / 2
                    : null,

            bold: Boolean(runProps["w:b"]),

            italic: Boolean(runProps["w:i"]),

            spacingBefore:
                paragraphProps?.["w:spacing"]?.["w:before"] || null,

            spacingAfter:
                paragraphProps?.["w:spacing"]?.["w:after"] || null,

            alignment:
                paragraphProps?.["w:jc"]?.["w:val"] || null,
        };
    });
}

function normalizeStyleName(name) {
    if (!name) return null;

    return name
        .replace(/\s+/g, "")
        .replace(/^heading(\d+)$/i, "Heading$1")
        .replace(/^normal$/i, "Normal");
}

module.exports = {
    extractStyles,
};