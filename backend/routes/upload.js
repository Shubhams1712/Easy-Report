const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { extractText } = require("../services/textExtractor");
const { simplifyReport } = require("../services/aiSimplifier");
const { generatePDF } = require("../services/pdfGenerator");

const router = express.Router();

// ── Multer config ──
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const MAX_SIZE = (parseInt(process.env.MAX_FILE_SIZE_MB) || 10) * 1024 * 1024;

const fileFilter = (req, file, cb) => {
  const allowed = [
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
  ];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const err = new Error(`Unsupported file type: ${file.mimetype}. Allowed: PDF, PNG, JPG, WEBP`);
    err.code = "INVALID_FILE";
    cb(err, false);
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: MAX_SIZE } });

// Helper: clean up temp file
function cleanupFile(filePath) {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) console.error("Failed to delete temp file:", err.message);
    });
  }
}

// Helper: format file size
function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * POST /api/upload
 *
 * Pipeline: Upload file → OCR/Extract text → AI Analysis → ReportAnalysis JSON
 *
 * Request:  multipart/form-data with field "file" (PDF, PNG, JPG, WEBP)
 * Response: ReportAnalysis object matching the frontend's expected schema
 */
router.post("/upload", upload.single("file"), async (req, res, next) => {
  let filePath = null;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded. Please upload a PDF or image file.",
        errorCode: "NO_FILE",
      });
    }

    filePath = req.file.path;
    const fileName = req.file.originalname;
    const fileSize = formatFileSize(req.file.size);

    console.log(`[UPLOAD] Received: ${fileName} (${req.file.mimetype}, ${fileSize})`);

    // ── Step 1: OCR / Text Extraction ──
    console.log("[PIPELINE] Step 1: Extracting text...");
    const extractedText = await extractText(filePath, req.file.mimetype);

    if (!extractedText || extractedText.trim().length === 0) {
      return res.status(422).json({
        success: false,
        error: "Could not extract any text from the uploaded file. Please ensure the file contains readable text or a clearer image.",
        errorCode: "EMPTY_REPORT",
      });
    }

    console.log(`[PIPELINE] Step 1 complete: ${extractedText.length} characters extracted`);

    // ── Step 2: AI Analysis → ReportAnalysis format ──
    console.log("[PIPELINE] Step 2: AI analysis & simplification...");
    const reportAnalysis = await simplifyReport(extractedText, fileName, fileSize);
    console.log("[PIPELINE] Step 2 complete");

    // ── Step 3: Return ReportAnalysis ──
    return res.json({
      success: true,
      data: reportAnalysis,
    });
  } catch (err) {
    next(err);
  } finally {
    cleanupFile(filePath);
  }
});

/**
 * POST /api/simplify
 *
 * Standalone text simplification endpoint.
 * Accepts raw text → returns ReportAnalysis.
 *
 * Request body (JSON):
 *   { "text": "raw extracted text from medical report..." }
 *
 * Response: { success: true, data: ReportAnalysis }
 */
router.post("/simplify", async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Missing or empty 'text' in request body. Send the extracted report text.",
        errorCode: "MISSING_TEXT",
      });
    }

    console.log(`[SIMPLIFY] Received ${text.length} characters of text`);

    const reportAnalysis = await simplifyReport(text);

    return res.json({
      success: true,
      data: reportAnalysis,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/download
 *
 * Generate and download a PDF summary from a ReportAnalysis object.
 *
 * Request body (JSON):
 *   { "report": ReportAnalysis, "originalFileName": "blood-test.pdf" }
 *
 * Response: PDF file download
 */
router.post("/download", async (req, res, next) => {
  try {
    const { report, originalFileName } = req.body;

    if (!report) {
      return res.status(400).json({
        success: false,
        error: "Missing 'report' in request body. Send the ReportAnalysis object from the /api/upload response.",
        errorCode: "MISSING_REPORT",
      });
    }

    console.log(`[DOWNLOAD] Generating PDF for: ${originalFileName || "report"}`);

    const pdfBuffer = await generatePDF(report, originalFileName || "Medical Report");

    const downloadName = `simplified-${(originalFileName || "report").replace(/\.[^.]+$/, "")}.pdf`;

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${downloadName}"`,
      "Content-Length": pdfBuffer.length,
    });

    return res.send(pdfBuffer);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
