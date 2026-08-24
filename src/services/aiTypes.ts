export interface AiFinding {
  name: string;
  value: string;
  referenceRange: string;
  status: 'normal' | 'low' | 'high' | 'slightly_low' | 'slightly_high' | 'critical';
  explanation: string;
  clinicalSignificance: string;
}

export interface AiMedicalTerm {
  term: string;
  simpleMeaning: string;
}

export interface AiAnalysisResponse {
  testType: string;
  patientName: string | null;
  dateOfCollection: string | null;
  glanceSummary: string;
  keyFindings: AiFinding[];
  medicalTerms: AiMedicalTerm[];
  importantNotes: string[];
  questionsForDoctor: string[];
}
