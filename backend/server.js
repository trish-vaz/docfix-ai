const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");

const { readDocument } = require("./src/modules/documentReader");

const app = express();

if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
}

const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("DocFix AI backend running");
});

app.post("/upload", upload.single("document"), async (req, res) => {
    try {
        const documentInfo = await readDocument(req.file.path, req.file.originalname);

        console.log("Analysis:", JSON.stringify(documentInfo.analysis, null, 2));

        console.log("Health Report:", JSON.stringify(documentInfo.healthReport, null, 2));

        console.log("Layout Plan:", JSON.stringify(documentInfo.layoutPlan, null, 2));

        console.log(
            "Editing Instructions:",
            JSON.stringify(documentInfo.editingInstructions, null, 2)
        );

        console.log("Summary:", {
            paragraphCount: documentInfo.paragraphCount,
            imageCount: documentInfo.imageCount,
            tableCount: documentInfo.tableCount,
            styleDefinitions: documentInfo.styleDefinitions,
        });

        res.json({
            message: "Document opened successfully",
            documentInfo,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to open document",
            error: error.message,
        });
    }
});

app.listen(5001, () => {
    console.log("Backend running on http://localhost:5001");
});