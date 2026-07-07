function extractImages(files) {
    const imageFiles = files.filter((file) =>
        file.startsWith("word/media/")
    );

    return imageFiles.map((file, index) => {
        return {
            id: `image_${index + 1}`,
            type: "image",
            order: null,
            sectionId: "section_1",

            pageEstimate: {
                startPage: null,
                endPage: null,
                confidence: "low",
            },

            content: {
                filePath: file,
                fileName: file.split("/").pop(),
            },

            style: {},

            layout: {
                width: null,
                height: null,
                position: "unknown",
                alignment: null,
            },

            relationships: {
                previousBlockId: null,
                nextBlockId: null,
                parentId: null,
                childrenIds: [],
                captionId: null,
            },
        };
    });
}

module.exports = { extractImages };