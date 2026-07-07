const fs = require("fs");
const JSZip = require("jszip");

async function openDocx(filePath) {
    if (!fs.existsSync(filePath)) {
        throw new Error("DOCX file not found");
    }

    const fileBuffer = fs.readFileSync(filePath);
    const zip = await JSZip.loadAsync(fileBuffer);

    const files = Object.keys(zip.files);

    return {
        zip,
        files,
        isValidDocx: files.includes("word/document.xml"),
    };
}
module.exports = {
    openDocx,
};