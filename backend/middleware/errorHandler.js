const multer = require("multer");

/**
 * Centralized error handling middleware.
 * Maps error codes and types to proper HTTP responses.
 */
function errorHandler(err, req, res, _next) {
  console.error(`[ERROR] ${err.code || "UNKNOWN"}: ${err.message}`);

  // ── Multer errors (file too large, etc.) ──
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        success: false,
        error: `File too large. Maximum allowed size is ${process.env.MAX_FILE_SIZE_MB || 10}MB.`,
        errorCode: "FILE_TOO_LARGE",
      });
    }
    return res.status(400).json({
      success: false,
      error: `Upload error: ${err.message}`,
      errorCode: "UPLOAD_ERROR",
    });
  }

  // ── Invalid file type ──
  if (err.code === "INVALID_FILE" || (err.message && err.message.startsWith("Unsupported file type"))) {
    return res.status(415).json({
      success: false,
      error: err.message,
      errorCode: "INVALID_FILE",
    });
  }

  // ── OCR / extraction failure ──
  if (err.code === "OCR_FAILURE") {
    return res.status(422).json({
      success: false,
      error: "Failed to extract text from the file. The file may be corrupted or the image quality too low for OCR.",
      errorCode: "OCR_FAILURE",
    });
  }

  // ── AI service errors (for when AI team connects their service) ──
  if (err.code === "AI_FAILURE" || err.code === "AI_CONFIG_ERROR" || err.code === "AI_PARSE_ERROR" || err.code === "AI_EMPTY_RESPONSE") {
    return res.status(502).json({
      success: false,
      error: `AI service error: ${err.message}`,
      errorCode: err.code,
    });
  }

  // ── Fallback: unexpected errors ──
  return res.status(500).json({
    success: false,
    error: "Something went wrong while processing your report. Please try again.",
    errorCode: "INTERNAL_ERROR",
  });
}

module.exports = { errorHandler };
