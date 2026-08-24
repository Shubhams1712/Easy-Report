const PDFDocument = require("pdfkit");

/**
 * Generate a downloadable PDF summary from a structured report.
 * @param {object} report - The structured report object from the AI.
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
        accent: "#e8f0fe",
        critical: "#d93025",
        warning: "#f9ab00",
        normal: "#1e8e3e",
        divider: "#dadce0",
      };

      // ── Header ──
      doc
        .rect(0, 0, doc.page.width, 80)
        .fill(colors.primary);

      doc
        .font("Helvetica-Bold")
        .fontSize(22)
        .fillColor("#ffffff")
        .text("Medical Report Summary", 50, 25);

      doc
        .font("Helvetica")
        .fontSize(10)
        .fillColor("#e8f0fe")
        .text(`Source: ${originalFileName}  |  Generated: ${new Date().toLocaleDateString()}`, 50, 52);

      doc.moveDown(2);
      let y = 100;

      // ── Helper functions ──
      function sectionTitle(title) {
        y = doc.y;
        if (y > 700) { doc.addPage(); y = 50; }
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
        if (doc.y > 720) { doc.addPage(); }
        doc
          .font("Helvetica")
          .fontSize(10)
          .fillColor(colors.body)
          .text(text, 50, doc.y, { width: 495, lineGap: 3 });
        doc.moveDown(0.5);
      }

      function bulletPoint(text) {
        if (doc.y > 720) { doc.addPage(); }
        doc
          .font("Helvetica")
          .fontSize(10)
          .fillColor(colors.body)
          .text(`•  ${text}`, 60, doc.y, { width: 485, lineGap: 3 });
        doc.moveDown(0.3);
      }

      function statusColor(status) {
        const s = (status || "").toLowerCase();
        if (s === "critical") return colors.critical;
        if (s === "high" || s === "low" || s === "abnormal") return colors.warning;
        return colors.normal;
      }

      // ── 1. Report Summary ──
      sectionTitle("REPORT SUMMARY");
      bodyText(report.reportSummary || "No summary available.");

      // ── 2. Important Findings ──
      if (report.importantFindings && report.importantFindings.length > 0) {
        sectionTitle("IMPORTANT FINDINGS");
        for (const finding of report.importantFindings) {
          if (doc.y > 710) { doc.addPage(); }
          doc
            .font("Helvetica-Bold")
            .fontSize(10)
            .fillColor(statusColor(finding.status))
            .text(`[${(finding.status || "info").toUpperCase()}]`, 60, doc.y, { continued: true })
            .fillColor(colors.heading)
            .text(`  ${finding.finding}`);
          doc
            .font("Helvetica")
            .fontSize(9)
            .fillColor(colors.body)
            .text(finding.detail, 75, doc.y, { width: 470, lineGap: 2 });
          doc.moveDown(0.5);
        }
      }

      // ── 3. Medical Terms Explained ──
      if (report.medicalTermsExplained && report.medicalTermsExplained.length > 0) {
        sectionTitle("MEDICAL TERMS EXPLAINED");
        for (const term of report.medicalTermsExplained) {
          if (doc.y > 720) { doc.addPage(); }
          doc
            .font("Helvetica-Bold")
            .fontSize(10)
            .fillColor(colors.heading)
            .text(term.term, 60, doc.y, { continued: true })
            .font("Helvetica")
            .fillColor(colors.body)
            .text(`  —  ${term.meaning}`, { width: 470 });
          doc.moveDown(0.3);
        }
      }

      // ── 4. Measurements & Values ──
      if (report.measurementsAndValues && report.measurementsAndValues.length > 0) {
        sectionTitle("MEASUREMENTS & VALUES");

        // Table header
        const tableTop = doc.y;
        doc
          .font("Helvetica-Bold")
          .fontSize(9)
          .fillColor(colors.heading);
        doc.text("Parameter", 55, tableTop, { width: 140 });
        doc.text("Value", 200, tableTop, { width: 90 });
        doc.text("Reference Range", 300, tableTop, { width: 120 });
        doc.text("Status", 430, tableTop, { width: 80 });
        doc.moveDown(0.3);
        doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor(colors.divider).stroke();
        doc.moveDown(0.3);

        for (const m of report.measurementsAndValues) {
          if (doc.y > 720) { doc.addPage(); }
          const rowY = doc.y;
          doc.font("Helvetica").fontSize(9).fillColor(colors.body);
          doc.text(m.parameter || "-", 55, rowY, { width: 140 });
          doc.text(m.value || "-", 200, rowY, { width: 90 });
          doc.text(m.referenceRange || "-", 300, rowY, { width: 120 });
          doc
            .font("Helvetica-Bold")
            .fillColor(statusColor(m.status))
            .text((m.status || "-").toUpperCase(), 430, rowY, { width: 80 });
          doc.moveDown(0.3);
        }
      }

      // ── 5. What This Means ──
      sectionTitle("WHAT THIS MEANS IN SIMPLE LANGUAGE");
      bodyText(report.simpleMeaning || "No simplified explanation available.");

      // ── 6. Questions for Your Doctor ──
      if (report.doctorQuestions && report.doctorQuestions.length > 0) {
        sectionTitle("QUESTIONS TO DISCUSS WITH YOUR DOCTOR");
        for (const q of report.doctorQuestions) {
          bulletPoint(q);
        }
      }

      // ── Footer / Disclaimer ──
      if (doc.y > 680) { doc.addPage(); }
      doc.moveDown(1);
      doc
        .moveTo(50, doc.y)
        .lineTo(545, doc.y)
        .strokeColor(colors.divider)
        .stroke();
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
