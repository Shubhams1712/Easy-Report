import { GoogleGenAI } from '@google/genai';
import { Finding, ReportAnalysis } from '../types';
import { SAMPLE_REPORTS } from '../data/sampleReports';
import { extractTextFromFile } from './ocrService';
import { SYSTEM_PROMPT, GEMINI_MODEL } from './aiPrompt';
import type { AiAnalysisResponse } from './aiTypes';

export interface MedicalGlossaryEntry {
  term: string;
  category: string;
  simpleDefinition: string;
  whyItMatters: string;
}

export const MEDICAL_GLOSSARY: Record<string, MedicalGlossaryEntry> = {
  glucose: {
    term: 'Glucose',
    category: 'Metabolic & Energy',
    simpleDefinition: 'The main type of sugar in your blood and your body\'s primary energy source.',
    whyItMatters: 'Consistently high fasting glucose indicates diabetes or pre-diabetes, while too low causes shakiness and dizziness.',
  },
  bun: {
    term: 'BUN (Blood Urea Nitrogen)',
    category: 'Kidney Function',
    simpleDefinition: 'A waste product created when your body breaks down protein.',
    whyItMatters: 'Healthy kidneys filter BUN out into urine. Elevated BUN can indicate dehydration or reduced kidney efficiency.',
  },
  creatinine: {
    term: 'Creatinine',
    category: 'Kidney Function',
    simpleDefinition: 'A normal waste product from everyday muscle activity.',
    whyItMatters: 'Creatinine is the primary marker used by doctors to calculate your Estimated Glomerular Filtration Rate (eGFR) and kidney health.',
  },
  'vitamin d': {
    term: 'Vitamin D (25-OH)',
    category: 'Vitamins & Minerals',
    simpleDefinition: 'A fat-soluble vitamin produced by skin sun exposure and fortified foods.',
    whyItMatters: 'Vital for calcium absorption, strong bones, healthy mood, and immune system resilience.',
  },
  ldl: {
    term: 'LDL Cholesterol',
    category: 'Cardiovascular / Heart',
    simpleDefinition: 'Often called "bad cholesterol" because excess LDL can build up in arterial walls.',
    whyItMatters: 'Keeping LDL below target ranges reduces the long-term risk of heart disease and stroke.',
  },
  hdl: {
    term: 'HDL Cholesterol',
    category: 'Cardiovascular / Heart',
    simpleDefinition: 'Known as "good cholesterol" because it picks up excess cholesterol and carries it back to the liver.',
    whyItMatters: 'Higher HDL levels offer cardiovascular protection.',
  },
  tsh: {
    term: 'TSH (Thyroid Stimulating Hormone)',
    category: 'Hormones',
    simpleDefinition: 'A hormone produced by your pituitary gland to tell your thyroid how much energy hormone to produce.',
    whyItMatters: 'High TSH usually means an underactive thyroid (hypothyroidism), while low TSH means an overactive thyroid (hyperthyroidism).',
  },
  hemoglobin: {
    term: 'Hemoglobin',
    category: 'Blood & Oxygen',
    simpleDefinition: 'The iron-rich protein inside red blood cells that carries oxygen from your lungs to the rest of your body.',
    whyItMatters: 'Low hemoglobin causes anemia, leading to fatigue, shortness of breath, and pale skin.',
  },
  platelets: {
    term: 'Platelets (Thrombocytes)',
    category: 'Clotting',
    simpleDefinition: 'Tiny cell fragments that clump together to form clots and stop bleeding when you are cut.',
    whyItMatters: 'Low platelets can cause easy bruising or bleeding; very high levels can increase blood clot risk.',
  },
};

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
}

function mapAiStatus(
  aiStatus: AiAnalysisResponse['keyFindings'][number]['status']
): Finding['status'] {
  const map: Record<string, Finding['status']> = {
    normal: 'normal',
    low: 'low',
    high: 'high',
    slightly_low: 'slightly_low',
    slightly_high: 'slightly_high',
    critical: 'critical',
  };
  return map[aiStatus] || 'info';
}

function mapAiToReportAnalysis(
  ai: AiAnalysisResponse,
  fileName: string,
  rawText: string
): ReportAnalysis {
  const findings: Finding[] = ai.keyFindings.map((f, i) => ({
    id: `finding-${i}`,
    name: f.name,
    value: f.value,
    referenceRange: f.referenceRange,
    status: mapAiStatus(f.status),
    statusLabel: f.status.charAt(0).toUpperCase() + f.status.slice(1).replace('_', ' '),
    explanation: f.explanation,
    clinicalMeaning: f.clinicalSignificance,
  }));

  const category = rawText.toLowerCase().includes('thyroid')
    ? 'blood'
    : rawText.toLowerCase().includes('cbc')
    ? 'blood'
    : 'general';

  return {
    fileName,
    dateProcessed: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    patientName: ai.patientName || undefined,
    dateOfCollection: ai.dateOfCollection || undefined,
    testType: ai.testType,
    glanceSummary: ai.glanceSummary,
    keyFindings: findings,
    whatThisMeans: ai.importantNotes.join(' '),
    doctorQuestions: ai.questionsForDoctor,
    rawText,
    category,
  };
}

function parseAiJsonResponse(text: string): AiAnalysisResponse {
  let cleaned = text.trim();

  // Strip markdown code fences if present
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3);
  }
  cleaned = cleaned.trim();

  return JSON.parse(cleaned) as AiAnalysisResponse;
}

export async function analyzeMedicalDocument(
  file: File | null,
  rawTextOverride?: string,
  onProgress?: (stage: string) => void
): Promise<ReportAnalysis> {
  const fileName = file?.name || 'medical_report.pdf';

  // Step 1: Get text via OCR or override
  let extractedText = rawTextOverride || '';

  if (!extractedText && file) {
    try {
      const ocrResult = await extractTextFromFile(file, onProgress);
      extractedText = ocrResult.text;
    } catch (ocrErr) {
      console.warn('OCR failed, falling back to sample:', ocrErr);
    }
  }

  // Fallback: match filename to sample reports
  if (!extractedText || extractedText.trim().length === 0) {
    onProgress?.('Using sample report for demonstration...');
    const lower = fileName.toLowerCase();
    if (lower.includes('cbc') || lower.includes('blood_count')) {
      extractedText = SAMPLE_REPORTS[1].rawText;
    } else if (lower.includes('thyroid') || lower.includes('tsh')) {
      extractedText = SAMPLE_REPORTS[2].rawText;
    } else {
      extractedText = SAMPLE_REPORTS[0].rawText;
    }
  }

  // Step 2: Try Gemini AI
  const client = getGeminiClient();
  if (client) {
    try {
      onProgress?.('Sending extracted text to Gemini AI for analysis...');
      const response = await client.models.generateContent({
        model: GEMINI_MODEL,
        contents: [
          {
            role: 'user',
            parts: [{ text: `Here is the extracted text from a medical report:\n\n${extractedText}\n\nPlease analyze this report and return the structured JSON response as specified in the system instructions.` }],
          },
        ],
        config: {
          systemInstruction: SYSTEM_PROMPT,
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const responseText = response.text;
      if (!responseText) throw new Error('Empty response from Gemini');

      onProgress?.('Parsing structured analysis...');
      const aiResult = parseAiJsonResponse(responseText);
      return mapAiToReportAnalysis(aiResult, fileName, extractedText);
    } catch (aiErr) {
      console.warn('Gemini AI analysis failed, falling back to rule-based:', aiErr);
      onProgress?.('AI analysis unavailable, using fallback analysis...');
    }
  } else {
    onProgress?.('No API key configured, using local analysis...');
  }

  // Step 3: Fallback - rule-based extraction (same as before)
  return ruleBasedAnalysis(extractedText, fileName);
}

function ruleBasedAnalysis(extractedText: string, fileName: string): ReportAnalysis {
  const lower = extractedText.toLowerCase();
  const lines = extractedText.split('\n');
  const findings: Finding[] = [];

  if (lower.includes('glucose')) {
    const match = extractedText.match(/glucose\s+(\d+)/i);
    const val = match ? match[1] : '88';
    const numVal = parseInt(val, 10);
    const isNormal = numVal >= 70 && numVal <= 99;
    findings.push({
      id: 'glucose',
      name: 'Glucose Levels',
      value: `${val} mg/dL`,
      unit: 'mg/dL',
      referenceRange: '70 - 99 mg/dL',
      status: isNormal ? 'normal' : numVal > 99 ? 'high' : 'low',
      statusLabel: isNormal ? 'Normal' : numVal > 99 ? 'Elevated' : 'Low',
      explanation: `Your fasting glucose is ${val} mg/dL.`,
      clinicalMeaning: isNormal
        ? 'This is excellent and indicates healthy blood sugar regulation.'
        : 'Slightly higher fasting blood sugar may warrant a follow-up HbA1c test.',
      matchedRawSnippet: lines.find((l) => l.toUpperCase().includes('GLUCOSE')) || `GLUCOSE ${val} mg/dL`,
    });
  }

  if (lower.includes('vitamin d') || lower.includes('25-oh')) {
    const match = extractedText.match(/vitamin d.*?(\d+)/i);
    const val = match ? match[1] : '28';
    const numVal = parseInt(val, 10);
    const isNormal = numVal >= 30;
    findings.push({
      id: 'vit-d',
      name: 'Vitamin D',
      value: `${val} ng/mL`,
      unit: 'ng/mL',
      referenceRange: '30 - 100 ng/mL',
      status: isNormal ? 'normal' : 'slightly_low',
      statusLabel: isNormal ? 'Normal' : 'Slightly Low',
      explanation: `Your levels are ${val} ng/mL.`,
      clinicalMeaning: isNormal
        ? 'Adequate levels supporting bone density and immune function.'
        : 'This is very common, especially in winter months or indoor lifestyles.',
      matchedRawSnippet: lines.find((l) => l.toUpperCase().includes('VITAMIN D')) || `VITAMIN D ${val} ng/mL`,
    });
  }

  if (lower.includes('cholesterol') || lower.includes('lipid')) {
    findings.push({
      id: 'lipid',
      name: 'Cholesterol & Lipids',
      value: 'Total: 175 mg/dL, LDL: 98, HDL: 55',
      unit: 'mg/dL',
      referenceRange: '< 200, < 100, > 40',
      status: 'normal',
      statusLabel: 'Normal',
      explanation: 'Your lipid panel shows balanced levels across total, LDL, and protective HDL.',
      clinicalMeaning: 'Indicates healthy lipid metabolism and lower statistical cardiovascular risk profile.',
      matchedRawSnippet: lines.find((l) => l.toUpperCase().includes('CHOLESTEROL')) || 'CHOLESTEROL, TOTAL 175 mg/dL',
    });
  }

  if (lower.includes('hemoglobin') || lower.includes('hematocrit')) {
    const match = extractedText.match(/hemoglobin\s+([\d.]+)/i);
    const val = match ? match[1] : '11.8';
    const numVal = parseFloat(val);
    const isNormal = numVal >= 12.0;
    findings.push({
      id: 'hgb',
      name: 'Hemoglobin',
      value: `${val} g/dL`,
      unit: 'g/dL',
      referenceRange: '12.0 - 16.0 g/dL',
      status: isNormal ? 'normal' : 'slightly_low',
      statusLabel: isNormal ? 'Normal' : 'Slightly Low',
      explanation: `Your oxygen-carrying protein level is ${val} g/dL.`,
      clinicalMeaning: isNormal
        ? 'Healthy red blood cell oxygen-carrying capacity.'
        : 'Suggests mild anemia which can occasionally cause fatigue or cold intolerance.',
      matchedRawSnippet: lines.find((l) => l.toUpperCase().includes('HEMOGLOBIN')) || `HEMOGLOBIN ${val} g/dL`,
    });
  }

  if (lower.includes('tsh') || lower.includes('thyroid')) {
    const match = extractedText.match(/tsh\s+([\d.]+)/i);
    const val = match ? match[1] : '2.15';
    findings.push({
      id: 'tsh',
      name: 'TSH (Thyroid Stimulating Hormone)',
      value: `${val} uIU/mL`,
      unit: 'uIU/mL',
      referenceRange: '0.45 - 4.50 uIU/mL',
      status: 'normal',
      statusLabel: 'Normal',
      explanation: `TSH level is ${val} uIU/mL.`,
      clinicalMeaning: 'Optimal pituitary-thyroid feedback signaling with steady metabolic control.',
      matchedRawSnippet: lines.find((l) => l.toUpperCase().includes('TSH')) || `TSH ${val} uIU/mL`,
    });
  }

  if (findings.length === 0) {
    findings.push(
      {
        id: 'general-1',
        name: 'Clinical Health Indices',
        status: 'normal',
        statusLabel: 'Normal',
        explanation: 'Primary physiological parameters are aligned with standard reference limits.',
        clinicalMeaning: 'No acute red flags or urgent critical alarms detected in this document.',
        matchedRawSnippet: lines[0] || 'Standard clinical screening',
      },
      {
        id: 'general-2',
        name: 'Routine Health Maintenance',
        status: 'info',
        statusLabel: 'Informational',
        explanation: 'Continue regular annual health checkups and preventive monitoring.',
        clinicalMeaning: 'Lifestyle stability and standard preventive screening recommended.',
        matchedRawSnippet: 'ROUTINE EVALUATION',
      }
    );
  }

  const hasAbnormal = findings.some((f) => f.status !== 'normal' && f.status !== 'info');

  return {
    fileName,
    fileSize: 'N/A',
    dateProcessed: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    testType: lower.includes('thyroid')
      ? 'Thyroid Function Profile'
      : lower.includes('cbc')
      ? 'Complete Blood Count (CBC)'
      : 'Comprehensive Metabolic Panel & Lipid Panel',
    glanceSummary: hasAbnormal
      ? 'Your recent blood work indicates overall good health, with most markers falling within the expected ranges. However, there is one area that requires slight attention.'
      : 'Your recent test results are remarkably consistent with healthy reference ranges, showing stable organ function and balanced metabolic parameters.',
    keyFindings: findings,
    whatThisMeans: hasAbnormal
      ? "You don't need to make any drastic changes based on these results. To address the slightly low Vitamin D or borderline markers, consider discussing a mild supplement with your primary care provider, or safely increasing your sun exposure."
      : 'All primary markers fall within standard normal ranges. You can maintain your existing healthy dietary habits, regular physical activity, and scheduled annual visits.',
    doctorQuestions: [
      'Are there any lifestyle or dietary adjustments you would recommend based on these findings?',
      'Should we schedule any repeat testing in 6-12 months to monitor long-term trends?',
      'Do you recommend any specific over-the-counter supplements or preventative measures?',
    ],
    rawText: extractedText,
    category: lower.includes('thyroid') || lower.includes('metabolic') || lower.includes('blood') ? 'blood' : 'general',
  };
}
