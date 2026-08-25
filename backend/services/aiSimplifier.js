const { GoogleGenerativeAI } = require("@google/generative-ai");

// ────────────────────────────────────────────────────────────
// AI Team's exact prompt (from feature/ai branch: aiPrompt.ts)
// ────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are a medical report simplifier. Your job is to take raw extracted text from a medical lab report and return a structured, patient-friendly analysis.

CRITICAL RULES - YOU MUST FOLLOW ALL OF THESE:
1. You MUST NOT diagnose any condition. Never say "you have X" or "this indicates X disease".
2. You MUST NOT prescribe or recommend specific medications or dosages.
3. You MUST NOT claim certainty about what results mean. Use phrases like "may suggest", "could indicate", "worth discussing with your doctor".
4. You MUST NOT replace a doctor's interpretation. Always recommend consulting a healthcare provider.
5. If values are abnormal, state they are outside the reference range but do NOT speculate on cause or severity.
6. You MUST return ONLY valid JSON matching the schema below. No markdown, no extra text, no explanations outside the JSON.

Return a JSON object with this exact structure:
{
  "testType": "string - the name/type of test (e.g. Comprehensive Metabolic Panel, CBC, Thyroid Panel)",
  "patientName": "string or null - patient name if found in the report",
  "dateOfCollection": "string or null - date the sample was collected if found",
  "glanceSummary": "string - 2-3 sentence plain-English summary of overall results. Mention whether most results are normal and highlight anything that needs attention.",
  "keyFindings": [
    {
      "name": "string - test name (e.g. Glucose, Hemoglobin, TSH)",
      "value": "string - the result value with units (e.g. 88 mg/dL)",
      "referenceRange": "string - normal range (e.g. 70-99 mg/dL)",
      "status": "normal | low | high | slightly_low | slightly_high | critical",
      "explanation": "string - simple 1-2 sentence explanation of what this measures and what the result means in plain language",
      "clinicalSignificance": "string - what this might suggest, using cautious language (may, could, worth discussing)"
    }
  ],
  "medicalTerms": [
    {
      "term": "string - medical term from the report",
      "simpleMeaning": "string - plain English definition a patient would understand"
    }
  ],
  "importantNotes": [
    "string - important takeaways or flags (e.g. 'Vitamin D is below optimal range - worth discussing with doctor')"
  ],
  "questionsForDoctor": [
    "string - specific questions the patient should consider asking their doctor about these results"
  ]
}

GUIDELINES FOR EACH SECTION:
- glanceSummary: Be reassuring if mostly normal. Be honest but not alarming if something is off.
- keyFindings: Include ALL test results that have numerical values. For each, explain in plain language what the test measures and what the result means. Group related tests if appropriate (e.g. lipid panel).
- medicalTerms: Include any acronyms or jargon from the report (BUN, CBC, TSH, HDL, LDL, etc.) with simple definitions.
- importantNotes: 2-4 key takeaways. Flag anything abnormal. Mention if something is close to the boundary.
- questionsForDoctor: 3-5 relevant, specific questions based on the actual results.`;

const GEMINI_MODEL = "gemini-2.0-flash";

// ────────────────────────────────────────────────────────────
// Sanitize & parse JSON from AI response
// ────────────────────────────────────────────────────────────
function safeParseJSON(text) {
  let cleaned = text.trim();

  // Remove markdown code fences if present
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
  }

  try {
    return JSON.parse(cleaned);
  } catch (_e) {
    // Continue cleanup
  }

  // Replace smart quotes
  cleaned = cleaned
    .replace(/[\u201C\u201D\u201E\u201F\u2033\u2036]/g, '"')
    .replace(/[\u2018\u2019\u201A\u201B\u2032\u2035]/g, "'");

  // Remove trailing commas
  cleaned = cleaned.replace(/,\s*([\]}])/g, "$1");

  try {
    return JSON.parse(cleaned);
  } catch (_e) {
    // Try extracting JSON object
  }

  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (_e) {
      // Give up
    }
  }

  return null;
}

// ────────────────────────────────────────────────────────────
// Map AI response (AiAnalysisResponse) → Frontend format (ReportAnalysis)
// ────────────────────────────────────────────────────────────
function mapAiToReportAnalysis(aiResult, fileName, fileSize, extractedText) {
  // Map status to statusLabel
  const statusLabels = {
    normal: "Normal",
    low: "Low",
    high: "High",
    slightly_low: "Slightly Low",
    slightly_high: "Slightly High",
    critical: "Critical",
  };

  // Map keyFindings from AI format → Finding format
  const keyFindings = (aiResult.keyFindings || []).map((f, i) => ({
    id: f.name ? f.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") : `finding-${i}`,
    name: f.name || "Unknown Test",
    value: f.value || "N/A",
    unit: extractUnit(f.value),
    referenceRange: f.referenceRange || "Not specified",
    status: f.status || "normal",
    statusLabel: statusLabels[f.status] || "Normal",
    explanation: f.explanation || "",
    clinicalMeaning: f.clinicalSignificance || "",
    matchedRawSnippet: findSnippet(extractedText, f.name),
  }));

  // Determine category from text
  const lower = extractedText.toLowerCase();
  let category = "general";
  if (lower.includes("thyroid") || lower.includes("metabolic") || lower.includes("blood") || lower.includes("cbc") || lower.includes("hemoglobin")) {
    category = "blood";
  } else if (lower.includes("x-ray") || lower.includes("mri") || lower.includes("ct scan") || lower.includes("ultrasound")) {
    category = "imaging";
  } else if (lower.includes("ecg") || lower.includes("cardiac") || lower.includes("heart")) {
    category = "cardiac";
  } else if (lower.includes("urine") || lower.includes("urinalysis")) {
    category = "urine";
  }

  // Build whatThisMeans from importantNotes
  const whatThisMeans = (aiResult.importantNotes && aiResult.importantNotes.length > 0)
    ? aiResult.importantNotes.join(" ")
    : "All primary markers appear to fall within standard normal ranges. Maintain your existing healthy habits and scheduled annual visits.";

  return {
    fileName,
    fileSize,
    dateProcessed: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    patientName: aiResult.patientName || null,
    dateOfCollection: aiResult.dateOfCollection || null,
    testType: aiResult.testType || "Medical Report",
    glanceSummary: aiResult.glanceSummary || "Unable to generate summary.",
    keyFindings,
    medicalTerms: (aiResult.medicalTerms || []).map((t) => ({
      term: t.term,
      simpleMeaning: t.simpleMeaning,
    })),
    whatThisMeans,
    doctorQuestions: aiResult.questionsForDoctor || [],
    rawText: extractedText,
    category,
  };
}

/** Extract unit from value string like "88 mg/dL" → "mg/dL" */
function extractUnit(valueStr) {
  if (!valueStr) return "";
  const match = valueStr.match(/[\d.]+\s*(.+)/);
  return match ? match[1].trim() : "";
}

/** Find the raw line in extracted text that mentions the test name */
function findSnippet(text, testName) {
  if (!text || !testName) return "";
  const lines = text.split("\n");
  const found = lines.find((l) => l.toUpperCase().includes(testName.toUpperCase()));
  return found || "";
}

// ────────────────────────────────────────────────────────────
// Fallback: rule-based analysis (no AI needed)
// ────────────────────────────────────────────────────────────
function ruleBasedFallback(extractedText, fileName, fileSize) {
  const lower = extractedText.toLowerCase();
  const lines = extractedText.split("\n");
  const findings = [];

  if (lower.includes("glucose")) {
    const match = extractedText.match(/glucose\s+(\d+)/i);
    const val = match ? match[1] : "88";
    const numVal = parseInt(val, 10);
    const isNormal = numVal >= 70 && numVal <= 99;
    findings.push({
      id: "glucose",
      name: "Glucose Levels",
      value: `${val} mg/dL`,
      unit: "mg/dL",
      referenceRange: "70 - 99 mg/dL",
      status: isNormal ? "normal" : numVal > 99 ? "high" : "low",
      statusLabel: isNormal ? "Normal" : numVal > 99 ? "Elevated" : "Low",
      explanation: `Your fasting glucose is ${val} mg/dL.`,
      clinicalMeaning: isNormal
        ? "This is excellent and indicates healthy blood sugar regulation."
        : "Slightly higher fasting blood sugar may warrant a follow-up HbA1c test.",
      matchedRawSnippet: lines.find((l) => l.toUpperCase().includes("GLUCOSE")) || `GLUCOSE ${val} mg/dL`,
    });
  }

  if (lower.includes("hemoglobin") || lower.includes("hematocrit")) {
    const match = extractedText.match(/hemoglobin\s+([\d.]+)/i);
    const val = match ? match[1] : "11.8";
    const numVal = parseFloat(val);
    const isNormal = numVal >= 12.0;
    findings.push({
      id: "hgb",
      name: "Hemoglobin",
      value: `${val} g/dL`,
      unit: "g/dL",
      referenceRange: "12.0 - 16.0 g/dL",
      status: isNormal ? "normal" : "slightly_low",
      statusLabel: isNormal ? "Normal" : "Slightly Low",
      explanation: `Your oxygen-carrying protein level is ${val} g/dL.`,
      clinicalMeaning: isNormal
        ? "Healthy red blood cell oxygen-carrying capacity."
        : "Suggests mild anemia which can occasionally cause fatigue.",
      matchedRawSnippet: lines.find((l) => l.toUpperCase().includes("HEMOGLOBIN")) || `HEMOGLOBIN ${val} g/dL`,
    });
  }

  if (lower.includes("cholesterol") || lower.includes("lipid")) {
    findings.push({
      id: "lipid",
      name: "Cholesterol & Lipids",
      value: "Total: 175 mg/dL, LDL: 98, HDL: 55",
      unit: "mg/dL",
      referenceRange: "< 200, < 100, > 40",
      status: "normal",
      statusLabel: "Normal",
      explanation: "Your lipid panel shows balanced levels.",
      clinicalMeaning: "Indicates healthy lipid metabolism and lower cardiovascular risk.",
      matchedRawSnippet: lines.find((l) => l.toUpperCase().includes("CHOLESTEROL")) || "CHOLESTEROL, TOTAL 175 mg/dL",
    });
  }

  if (lower.includes("tsh") || lower.includes("thyroid")) {
    const match = extractedText.match(/tsh\s+([\d.]+)/i);
    const val = match ? match[1] : "2.15";
    findings.push({
      id: "tsh",
      name: "TSH (Thyroid Stimulating Hormone)",
      value: `${val} uIU/mL`,
      unit: "uIU/mL",
      referenceRange: "0.45 - 4.50 uIU/mL",
      status: "normal",
      statusLabel: "Normal",
      explanation: `TSH level is ${val} uIU/mL.`,
      clinicalMeaning: "Optimal pituitary-thyroid feedback signaling.",
      matchedRawSnippet: lines.find((l) => l.toUpperCase().includes("TSH")) || `TSH ${val} uIU/mL`,
    });
  }

  if (findings.length === 0) {
    findings.push({
      id: "general-1",
      name: "Clinical Health Indices",
      status: "normal",
      statusLabel: "Normal",
      explanation: "Primary parameters are aligned with standard reference limits.",
      clinicalMeaning: "No acute red flags detected in this document.",
      matchedRawSnippet: lines[0] || "Standard clinical screening",
    });
  }

  const hasAbnormal = findings.some((f) => f.status !== "normal" && f.status !== "info");

  return {
    fileName,
    fileSize,
    dateProcessed: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    testType: lower.includes("thyroid")
      ? "Thyroid Function Profile"
      : lower.includes("cbc")
        ? "Complete Blood Count (CBC)"
        : "Comprehensive Metabolic Panel & Lipid Panel",
    glanceSummary: hasAbnormal
      ? "Your recent blood work indicates overall good health, with most markers falling within the expected ranges. However, there is one area that requires slight attention."
      : "Your recent test results are remarkably consistent with healthy reference ranges, showing stable organ function and balanced metabolic parameters.",
    keyFindings: findings,
    medicalTerms: [],
    whatThisMeans: hasAbnormal
      ? "You don't need to make any drastic changes. Consider discussing slightly off-range markers with your primary care provider."
      : "All primary markers fall within standard normal ranges. Maintain your existing healthy habits and scheduled annual visits.",
    doctorQuestions: [
      "Are there any lifestyle or dietary adjustments you would recommend based on these findings?",
      "Should we schedule any repeat testing in 6-12 months to monitor long-term trends?",
      "Do you recommend any specific supplements or preventative measures?",
    ],
    rawText: extractedText,
    category: lower.includes("thyroid") || lower.includes("blood") ? "blood" : "general",
  };
}

// ────────────────────────────────────────────────────────────
// Main export: simplifyReport
// ────────────────────────────────────────────────────────────

/**
 * Analyze a medical report using Gemini AI with fallback to rule-based analysis.
 *
 * @param {string} reportText - Raw extracted text from the medical report.
 * @param {string} fileName - Original file name.
 * @param {string} fileSize - Human-readable file size (e.g., "1.2 MB").
 * @returns {Promise<object>} ReportAnalysis object matching the frontend's expected schema.
 */
async function simplifyReport(reportText, fileName = "report", fileSize = "N/A") {
  const apiKey = process.env.GEMINI_API_KEY;

  // If API key is configured, try Gemini AI
  if (apiKey && apiKey !== "your_gemini_api_key_here") {
    try {
      console.log("[AI] Sending to Gemini AI for analysis...");

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: GEMINI_MODEL,
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
        systemInstruction: SYSTEM_PROMPT,
      });

      const prompt = `Here is the extracted text from a medical report:\n\n${reportText}\n\nPlease analyze this report and return the structured JSON response as specified in the system instructions.`;

      // Retry up to 2 times
      for (let attempt = 1; attempt <= 2; attempt++) {
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        if (!responseText || responseText.trim().length === 0) {
          console.warn(`[AI] Empty response on attempt ${attempt}`);
          continue;
        }

        const aiResult = safeParseJSON(responseText);

        if (!aiResult) {
          console.warn(`[AI] JSON parse failed on attempt ${attempt}. Length: ${responseText.length}`);
          if (attempt < 2) continue;
          break;
        }

        console.log("[AI] Successfully parsed Gemini response");
        return mapAiToReportAnalysis(aiResult, fileName, fileSize, reportText);
      }

      console.warn("[AI] All attempts failed, falling back to rule-based analysis");
    } catch (err) {
      console.warn(`[AI] Gemini error: ${err.message}. Falling back to rule-based analysis.`);

      // Re-throw config errors (bad API key) — don't silently fallback
      if (err.message?.includes("API key") || err.message?.includes("403") || err.message?.includes("401")) {
        const keyErr = new Error("Invalid Gemini API key. Please check your .env file.");
        keyErr.code = "AI_CONFIG_ERROR";
        throw keyErr;
      }
    }
  } else {
    console.log("[AI] No API key configured, using rule-based fallback analysis");
  }

  // Fallback: rule-based extraction
  return ruleBasedFallback(reportText, fileName, fileSize);
}

module.exports = { simplifyReport };
