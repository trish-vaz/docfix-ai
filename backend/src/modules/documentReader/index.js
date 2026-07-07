const { buildDocumentModel } = require("./buildDocumentModel");

async function readDocument(filePath, originalFileName = "unknown.docx") {
    return await buildDocumentModel(filePath, originalFileName);
}

module.exports = {
    readDocument,
};