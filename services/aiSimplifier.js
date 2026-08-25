/**
 * AI Simplifier Service — STUB
 * ============================
 * This is a placeholder for the AI team member to implement.
 *
 * INPUT:  Raw text extracted from a medical report (string)
 * OUTPUT: A structured JSON object with the following schema:
 *
 * {
 *   "reportSummary":          string   — 2-4 sentence summary of the report
 *   "importantFindings":      array    — [{ finding, status, detail }]
 *   "medicalTermsExplained":  array    — [{ term, meaning }]
 *   "measurementsAndValues":  array    — [{ parameter, value, referenceRange, status }]
 *   "simpleMeaning":          string   — 3-5 sentence plain-language explanation
 *   "doctorQuestions":        array    — list of question strings
 * }
 *
 * STATUS values: "normal" | "high" | "low" | "abnormal" | "critical"
 *
 * INSTRUCTIONS FOR AI TEAM MEMBER:
 * 1. Replace the placeholder response below with your actual AI call.
 * 2. Make sure your AI returns the EXACT schema above.
 * 3. The frontend and PDF generator depend on this schema — do NOT change field names.
 * 4. If your AI service is external, make an HTTP call here and parse the response.
 *
 * Example integration:
 *   const response = await fetch("https://your-ai-service.com/simplify", {
 *     method: "POST",
 *     headers: { "Content-Type": "application/json" },
 *     body: JSON.stringify({ text: reportText }),
 *   });
 *   return await response.json();
 */

/**
 * Send extracted report text to AI and get a structured simplified report.
 * @param {string} reportText - The raw text extracted from the medical report.
 * @returns {Promise<object>} The structured report object.
 */
async function simplifyReport(reportText) {
  // ┌─────────────────────────────────────────────────┐
  // │  TODO: AI TEAM — Replace this placeholder with  │
  // │  your actual AI integration.                    │
  // └─────────────────────────────────────────────────┘

  // Placeholder response so the endpoint works during development
  return {
    reportSummary:
      "[AI NOT CONNECTED] This is a placeholder response. The AI service needs to be integrated by the AI team member.",
    importantFindings: [
      {
        finding: "Placeholder Finding",
        status: "normal",
        detail: "This is a placeholder. Connect the AI service to get real analysis.",
      },
    ],
    medicalTermsExplained: [
      {
        term: "Placeholder Term",
        meaning: "This is a placeholder. Connect the AI service to get real definitions.",
      },
    ],
    measurementsAndValues: [
      {
        parameter: "Placeholder",
        value: "N/A",
        referenceRange: null,
        status: "normal",
      },
    ],
    simpleMeaning:
      "[AI NOT CONNECTED] This is a placeholder. Once the AI team member integrates their service, this will contain a plain-language explanation of the report.",
    doctorQuestions: [
      "This is a placeholder question. Connect the AI service to generate real questions.",
    ],
  };
}

module.exports = { simplifyReport };
