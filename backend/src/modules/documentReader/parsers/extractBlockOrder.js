const { XMLParser } = require("fast-xml-parser");

function extractBlockOrder(documentXml) {
    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "",
        preserveOrder: true,
    });

    const parsed = parser.parse(documentXml);

    const documentNode = parsed.find((node) => node["w:document"]);
    const bodyNode = documentNode["w:document"].find((node) => node["w:body"]);
    const bodyChildren = bodyNode["w:body"];

    const order = [];

    bodyChildren.forEach((node) => {
        if (node["w:p"]) {
            const text = extractTextFromPreservedParagraph(node["w:p"]);

            if (text.trim()) {
                order.push({
                    type: "paragraph",
                    text: normalizeText(text),
                });
            }
        }

        if (node["w:tbl"]) {
            order.push({
                type: "table",
            });
        }
    });

    return order;
}

function extractTextFromPreservedParagraph(paragraphNodes) {
    let text = "";

    function walk(nodes) {
        if (!Array.isArray(nodes)) return;

        nodes.forEach((node) => {
            if (node["w:t"]) {
                const textNode = node["w:t"];

                if (Array.isArray(textNode)) {
                    textNode.forEach((item) => {
                        if (item["#text"]) text += item["#text"];
                    });
                }
            }

            Object.values(node).forEach((value) => {
                if (Array.isArray(value)) walk(value);
            });
        });
    }

    walk(paragraphNodes);

    return text;
}

function normalizeText(text) {
    return text.replace(/\s+/g, " ").trim();
}

module.exports = {
    extractBlockOrder,
};