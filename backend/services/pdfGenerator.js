const PDFDocument = require("pdfkit");

/**
 * Generate a downloadable PDF summary from a ReportAnalysis object.
 * Uses the frontend's exact schema: glanceSummary, keyFindings, whatThisMeans, doctorQuestions.
 *
 * @param {object} report - The ReportAnalysis object.
 * @param {string} originalFileName - Original uploaded file name.
 * @returns {Promise<Buffer>} The PDF as a Buffer.
 */
function generatePDF(report, originalFileName) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: "A4" });
      const chunks = [];

      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      const colors = {
        primary: "#1a73e8",
        heading: "#202124",
        body: "#3c4043",
        critical: "#d93025",
        warning: "#f9ab00",
        normal: "#1e8e3e",
        divider: "#dadce0",
      };

      // ── Header ──
      doc.rect(0, 0, doc.page.width, 85).fill(colors.primary);

      doc
        .font("Helvetica-Bold")
        .fontSize(22)
        .fillColor("#ffffff")
        .text("Medical Report Summary", 50, 20);

      doc
        .font("Helvetica")
        .fontSize(10)
        .fillColor("#e8f0fe")
        .text(`Source: ${originalFileName}`, 50, 48);

      doc
        .text(`Test Type: ${report.testType || "Medical Report"}  |  Date: ${report.dateProcessed || new Date().toLocaleDateString()}`, 50, 62);

      doc.moveDown(2);
      let y = 105;

      // ── Helpers ──
      function sectionTitle(title) {
        if (doc.y > 700) doc.addPage();
        doc
          .font("Helvetica-Bold")
          .fontSize(14)
          .fillColor(colors.primary)
          .text(title, 50, doc.y + 10);
        doc
          .moveTo(50, doc.y + 2)
          .lineTo(545, doc.y + 2)
          .strokeColor(colors.divider)
          .stroke();
        doc.moveDown(0.5);
      }

      function bodyText(text) {
        if (doc.y > 720) doc.addPage();
        doc
          .font("Helvetica")
          .fontSize(10)
          .fillColor(colors.body)
          .text(text, 50, doc.y, { width: 495, lineGap: 3 });
        doc.moveDown(0.5);
      }

      function bulletPoint(text) {
        if (doc.y > 720) doc.addPage();
        doc
          .font("Helvetica")
          .fontSize(10)
          .fillColor(colors.body)
          .text(`  -  ${text}`, 55, doc.y, { width: 490, lineGap: 3 });
        doc.moveDown(0.3);
      }

      function statusColor(status) {
        const s = (status || "").toLowerCase();
        if (s === "critical") return colors.critical;
        if (s === "high" || s === "low" || s === "slightly_high" || s === "slightly_low" || s === "abnormal") return colors.warning;
        return colors.normal;
      }

      // ── 1. At-a-Glance Summary ──
      sectionTitle("AT-A-GLANCE SUMMARY");
      bodyText(report.glanceSummary || "No summary available.");

      // ── 2. Key Findings ──
      if (report.keyFindings && report.keyFindings.length > 0) {
        sectionTitle("KEY FINDINGS");

        for (const f of report.keyFindings) {
          if (doc.y > 700) doc.addPage();

          // Finding header with status badge
          doc
            .font("Helvetica-Bold")
            .fontSize(10)
            .fillColor(statusColor(f.status))
            .text(`[${(f.statusLabel || f.status || "NORMAL").toUpperCase()}]`, 55, doc.y, { continued: true })
            .fillColor(colors.heading)
            .text(`  ${f.name || "Test"}`);

          // Value and reference
          if (f.value) {
            doc
              .font("Helvetica")
              .fontSize(9)
              .fillColor(colors.body)
              .text(`Value: ${f.value}${f.referenceRange ? `  |  Reference: ${f.referenceRange}` : ""}`, 70, doc.y, { width: 475 });
          }

          // Explanation
          if (f.explanation) {
            doc
              .font("Helvetica")
              .fontSize(9)
              .fillColor(colors.body)
              .text(f.explanation, 70, doc.y, { width: 475, lineGap: 2 });
          }

          // Clinical meaning
          if (f.clinicalMeaning) {
            doc
              .font("Helvetica-Oblique")
              .fontSize(9)
              .fillColor("#5f6368")
              .text(f.clinicalMeaning, 70, doc.y, { width: 475, lineGap: 2 });
          }

          doc.moveDown(0.5);
        }
      }

      // ── 3. Medical Terms ──
      if (report.medicalTerms && report.medicalTerms.length > 0) {
        sectionTitle("MEDICAL TERMS EXPLAINED");
        for (const t of report.medicalTerms) {
          if (doc.y > 720) doc.addPage();
          doc
            .font("Helvetica-Bold")
            .fontSize(10)
            .fillColor(colors.heading)
            .text(t.term, 55, doc.y, { continued: true })
            .font("Helvetica")
            .fillColor(colors.body)
            .text(`  --  ${t.simpleMeaning}`, { width: 475 });
          doc.moveDown(0.3);
        }
      }

      // ── 4. What This Means ──
      sectionTitle("WHAT THIS MEANS FOR YOU");
      bodyText(report.whatThisMeans || "No simplified explanation available.");

      // ── 5. Questions for Your Doctor ──
      if (report.doctorQuestions && report.doctorQuestions.length > 0) {
        sectionTitle("QUESTIONS TO ASK YOUR DOCTOR");
        for (const q of report.doctorQuestions) {
          bulletPoint(q);
        }
      }

      // ── Disclaimer ──
      if (doc.y > 680) doc.addPage();
      doc.moveDown(1);
      doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor(colors.divider).stroke();
      doc.moveDown(0.5);
      doc
        .font("Helvetica-Oblique")
        .fontSize(8)
        .fillColor("#80868b")
        .text(
          "DISCLAIMER: This is an AI-generated summary for informational purposes only. " +
          "It does not constitute medical advice, diagnosis, or treatment. " +
          "Always consult your healthcare provider for medical decisions.",
          50, doc.y, { width: 495, lineGap: 2, align: "center" }
        );

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = { generatePDF };
