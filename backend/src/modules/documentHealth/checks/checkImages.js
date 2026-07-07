function checkImages(documentModel) {
    const images = documentModel.blocks.filter((block) => block.type === "image");

    const hasImages = images.length > 0;

    return {
        id: "image-layout",
        name: "Image Layout",
        passed: true,
        severity: "none",
        score: 100,

        details: {
            imageCount: images.length,
            images: images.map((image) => ({
                id: image.id,
                fileName: image.content.fileName,
                position: image.layout.position,
                alignment: image.layout.alignment,
            })),
        },

        recommendation: hasImages
            ? "Images were detected. DocFix AI can later align, resize, or arrange them neatly."
            : null,
    };
}

module.exports = {
    checkImages,
};