function createEmptyDocumentModel(fileName) {
    return {
        metadata: {
            fileName,
            fileType: "docx",
            createdAt: new Date().toISOString(),
            pageCount: null,
            wordCount: 0,
        },

        documentProfile: {
            estimatedType: "unknown",
            language: "en",
            readingLevel: "normal",
        },

        styles: {
            fontsUsed: [],
            fontSizesUsed: [],
            headingStyles: [],
            paragraphStyles: [],
        },

        layout: {
            margins: {
                top: null,
                bottom: null,
                left: null,
                right: null,
            },
            defaultLineSpacing: null,
            defaultParagraphSpacing: null,
        },

        blocks: [],
    };
}

module.exports = {
    createEmptyDocumentModel,
};