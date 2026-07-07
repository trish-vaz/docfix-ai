const { XMLParser } = require("fast-xml-parser");

function extractRelationships(relsXml) {
    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "",
    });

    const parsed = parser.parse(relsXml);

    const rawRelationships = parsed.Relationships?.Relationship || [];

    const relationshipsArray = Array.isArray(rawRelationships)
        ? rawRelationships
        : [rawRelationships];

    const relationshipMap = {};

    relationshipsArray.forEach((rel) => {
        if (!rel.Id || !rel.Target) return;

        relationshipMap[rel.Id] = {
            id: rel.Id,
            type: rel.Type,
            target: rel.Target.startsWith("media/")
                ? `word/${rel.Target}`
                : rel.Target,
        };
    });

    return relationshipMap;
}

module.exports = {
    extractRelationships,
};