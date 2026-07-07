const { XMLParser } = require("fast-xml-parser");
const { extractParagraphBlockFromNode } = require("./extractParagraphs");
const { extractTableBlockFromNode } = require("./extractTables");

function extractBlocks(documentXml) {
    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "",
        preserveOrder: true,
    });

    const parsed = parser.parse(documentXml);

    const documentNode = parsed.find((node) => node["w:document"]);
    const bodyNode = documentNode["w:document"].find((node) => node["w:body"]);
    const bodyChildren = bodyNode["w:body"];

    const blocks = [];
    let order = 1;

    bodyChildren.forEach((node) => {
        if (node["w:p"]) {
            const paragraphBlock = extractParagraphBlockFromNode(node["w:p"], order);

            if (paragraphBlock) {
                blocks.push(paragraphBlock);
                order++;
            }
        }

        if (node["w:tbl"]) {
            const tableBlock = extractTableBlockFromNode(node["w:tbl"], order);

            if (tableBlock) {
                blocks.push(tableBlock);
                order++;
            }
        }
    });

    return blocks;
}

module.exports = {
    extractBlocks,
};