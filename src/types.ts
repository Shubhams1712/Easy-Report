export type PageView = 'home' | 'upload' | 'results' | 'privacy' | 'about';

export type FindingStatus = 'normal' | 'low' | 'high' | 'slightly_low' | 'slightly_high' | 'critical' | 'info';

export interface Finding {
  id: string;
  name: string;
  value?: string;
  unit?: string;
  referenceRange?: string;
  status: FindingStatus;
  statusLabel: string;
  explanation: string;
  clinicalMeaning: string;
  matchedRawSnippet?: string;
}

export interface ReportAnalysis {
  fileName: string;
  fileSize?: string;
  dateProcessed: string;
  patientName?: string;
  dateOfCollection?: string;
  testType: string;
  glanceSummary: string;
  keyFindings: Finding[];
  whatThisMeans: string;
  doctorQuestions: string[];
  rawText: string;
  category?: 'blood' | 'imaging' | 'cardiac' | 'urine' | 'general';
}

export interface SampleReport {
  id: string;
  title: string;
  fileName: string;
  fileSize: string;
  category: string;
  description: string;
  rawText: string;
  analysis: ReportAnalysis;
}
