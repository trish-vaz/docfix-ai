async function loadXml(zip, filePath) {
    const file = zip.file(filePath);

    if (!file) {
        throw new Error(`${filePath} not found inside DOCX`);
    }

    const xml = await file.async("text");
    return xml;
}

module.exports = { loadXml };