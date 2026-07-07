async function extractImages(files, zip) {
    const imageFiles = files.filter((file) => file.startsWith("word/media/"));

    const imageBlocks = [];

    for (let index = 0; index < imageFiles.length; index++) {
        const file = imageFiles[index];
        const imageFile = zip.file(file);

        if (!imageFile) continue;

        const buffer = await imageFile.async("nodebuffer");

        imageBlocks.push({
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
                buffer,
            },

            style: {},

            layout: {
                width: 400,
                height: 250,
                position: "inline",
                alignment: "center",
            },

            relationships: {
                previousBlockId: null,
                nextBlockId: null,
                parentId: null,
                childrenIds: [],
                captionId: null,
            },
        });
    }

    return imageBlocks;
}

module.exports = { extractImages };