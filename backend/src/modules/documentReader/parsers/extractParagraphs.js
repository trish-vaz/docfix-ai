const { XMLParser } = require("fast-xml-parser");
const { extractListInfoFromParagraph } = require("./extractLists");

function extractParagraphs(documentXml) {
    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "",
    });

    const parsed = parser.parse(documentXml);

    const body = parsed["w:document"]["w:body"];
    const rawParagraphs = body["w:p"] || [];

    const paragraphsArray = Array.isArray(rawParagraphs)
        ? rawParagraphs
        : [rawParagraphs];

    const paragraphBlocks = paragraphsArray
        .map((paragraph, index) => {
            const text = extractTextFromParagraph(paragraph);

            if (!text.trim()) return null;

            return {
                id: `block_${index + 1}`,
                type: detectParagraphType(paragraph),
                order: index + 1,
                sectionId: "section_1",

                pageEstimate: {
                    startPage: null,
                    endPage: null,
                    confidence: "low",
                },

                content: {
                    text,
                },

                list: extractListInfoFromParagraph(paragraph),

                style: extractStyleFromParagraph(paragraph),

                layout: extractLayoutFromParagraph(paragraph),

                relationships: {
                    previousBlockId: index === 0 ? null : `block_${index}`,
                    nextBlockId: `block_${index + 2}`,
                    parentId: null,
                    childrenIds: [],
                },
            };
        })
        .filter(Boolean);

    return paragraphBlocks;
}

function extractTextFromParagraph(paragraph) {
    const runs = paragraph["w:r"];

    if (!runs) return "";

    const runsArray = Array.isArray(runs) ? runs : [runs];

    return runsArray
        .map((run) => {
            const textNode = run["w:t"];

            if (!textNode) return "";

            if (typeof textNode === "string") return textNode;

            return textNode["#text"] || "";
        })
        .join("");
}

function detectParagraphType(paragraph) {
    const listInfo = extractListInfoFromParagraph(paragraph);

    if (listInfo) return "listItem";
    const styleId = paragraph?.["w:pPr"]?.["w:pStyle"]?.["w:val"];

    if (!styleId) return "paragraph";

    const lowerStyle = styleId.toLowerCase();

    if (lowerStyle.includes("heading") || lowerStyle.includes("title")) {
        return "heading";
    }

    return "paragraph";
}

function extractStyleFromParagraph(paragraph) {
    const firstRun = getFirstRun(paragraph);
    const runProps = firstRun?.["w:rPr"] || {};
    const paragraphProps = paragraph?.["w:pPr"] || {};

    const fontFamily =
        runProps?.["w:rFonts"]?.["w:ascii"] ||
        runProps?.["w:rFonts"]?.["w:hAnsi"] ||
        null;

    const fontSizeRaw = runProps?.["w:sz"]?.["w:val"];
    const fontSize = fontSizeRaw ? Number(fontSizeRaw) / 2 : null;

    const alignment = paragraphProps?.["w:jc"]?.["w:val"] || null;

    const paragraphStyle = paragraphProps?.["w:pStyle"]?.["w:val"] || null;

    return {
        paragraphStyle,
        fontFamily,
        fontSize,
        bold: Boolean(runProps["w:b"]),
        italic: Boolean(runProps["w:i"]),
        underline: Boolean(runProps["w:u"]),
        alignment,
    };
}

function extractLayoutFromParagraph(paragraph) {
    const paragraphProps = paragraph?.["w:pPr"] || {};
    const spacing = paragraphProps?.["w:spacing"] || {};

    return {
        spaceBefore: spacing?.["w:before"] || null,
        spaceAfter: spacing?.["w:after"] || null,
        lineSpacing: spacing?.["w:line"] || null,
    };
}

function getFirstRun(paragraph) {
    const runs = paragraph["w:r"];

    if (!runs) return null;

    return Array.isArray(runs) ? runs[0] : runs;
}

module.exports = { extractParagraphs };