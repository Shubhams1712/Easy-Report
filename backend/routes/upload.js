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

/**
 * POST /api/upload
 *
 * Pipeline: Upload file → OCR/Extract text → Return extracted text + AI simplified report
 *
 * Request:  multipart/form-data with field "file" (PDF, PNG, JPG, WEBP)
 * Response: Extracted text + structured report from AI service
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
    console.log(`[UPLOAD] Received: ${req.file.originalname} (${req.file.mimetype}, ${(req.file.size / 1024).toFixed(1)}KB)`);

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

    // ── Step 2: AI Simplification (calls aiSimplifier service) ──
    console.log("[PIPELINE] Step 2: AI analysis & simplification...");
    const structuredReport = await simplifyReport(extractedText);
    console.log("[PIPELINE] Step 2 complete: Structured report generated");

    // ── Step 3: Return response ──
    return res.json({
      success: true,
      data: {
        originalFileName: req.file.originalname,
        fileType: req.file.mimetype,
        extractedTextLength: extractedText.length,
        extractedText: extractedText,
        report: {
          reportSummary: structuredReport.reportSummary,
          importantFindings: structuredReport.importantFindings,
          medicalTermsExplained: structuredReport.medicalTermsExplained,
          measurementsAndValues: structuredReport.measurementsAndValues,
          simpleMeaning: structuredReport.simpleMeaning,
          doctorQuestions: structuredReport.doctorQuestions,
        },
      },
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
 * Standalone endpoint for AI team integration.
 * Accepts raw text → passes to AI service → returns structured report.
 *
 * This allows the AI team member to test their integration independently
 * without needing to upload a file each time.
 *
 * Request body (JSON):
 *   { "text": "raw extracted text from medical report..." }
 *
 * Response: Structured report JSON (same schema as /api/upload response)
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

    const structuredReport = await simplifyReport(text);

    return res.json({
      success: true,
      data: {
        report: {
          reportSummary: structuredReport.reportSummary,
          importantFindings: structuredReport.importantFindings,
          medicalTermsExplained: structuredReport.medicalTermsExplained,
          measurementsAndValues: structuredReport.measurementsAndValues,
          simpleMeaning: structuredReport.simpleMeaning,
          doctorQuestions: structuredReport.doctorQuestions,
        },
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/download
 *
 * Generate and download a PDF summary from a structured report.
 *
 * Request body (JSON):
 *   {
 *     "report": { ...structured report object... },
 *     "originalFileName": "blood-test.pdf"
 *   }
 *
 * Response: PDF file download
 */
router.post("/download", async (req, res, next) => {
  try {
    const { report, originalFileName } = req.body;

    if (!report) {
      return res.status(400).json({
        success: false,
        error: "Missing 'report' in request body. Send the report object from the /api/upload response.",
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
