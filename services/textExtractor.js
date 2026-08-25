const fs = require("fs");
const pdfParse = require("pdf-parse");
const Tesseract = require("tesseract.js");

/**
 * Extract text from a PDF or image file.
 * @param {string} filePath - Absolute path to the uploaded file.
 * @param {string} mimeType - The MIME type of the file.
 * @returns {Promise<string>} Extracted text content.
 */
async function extractText(filePath, mimeType) {
  try {
    if (mimeType === "application/pdf") {
      return await extractFromPDF(filePath);
    } else {
      return await extractFromImage(filePath);
    }
  } catch (err) {
    const ocrErr = new Error(`Text extraction failed: ${err.message}`);
    ocrErr.code = "OCR_FAILURE";
    throw ocrErr;
  }
}

/**
 * Extract text from a PDF file using pdf-parse.
 */
async function extractFromPDF(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
}

/**
 * Extract text from an image file using Tesseract.js OCR.
 */
async function extractFromImage(filePath) {
  const { data } = await Tesseract.recognize(filePath, "eng", {
    logger: (info) => {
      if (info.status === "recognizing text") {
        const pct = Math.round((info.progress || 0) * 100);
        process.stdout.write(`\rOCR progress: ${pct}%`);
      }
    },
  });
  console.log(); // newline after progress
  return data.text;
}

module.exports = { extractText };
