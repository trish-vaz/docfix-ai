function mergeBlocks({ blockOrder, paragraphBlocks, tableBlocks, imageBlocks }) {
    const paragraphsQueue = [...paragraphBlocks];
    const tablesQueue = [...tableBlocks];

    const merged = [];

    blockOrder.forEach((entry) => {
        if (entry.type === "paragraph") {
            const matchIndex = paragraphsQueue.findIndex((block) => {
                return normalizeText(block.content.text) === entry.text;
            });

            if (matchIndex !== -1) {
                merged.push(paragraphsQueue.splice(matchIndex, 1)[0]);
            }
        }

        if (entry.type === "table") {
            if (tablesQueue.length) {
                merged.push(tablesQueue.shift());
            }
        }
    });

    // Add anything not matched
    merged.push(...paragraphsQueue);
    merged.push(...tablesQueue);
    merged.push(...imageBlocks);

    return merged.map((block, index) => ({
        ...block,
        order: index + 1,
    }));
}

function normalizeText(text) {
    return String(text || "").replace(/\s+/g, " ").trim();
}

module.exports = {
    mergeBlocks,
};