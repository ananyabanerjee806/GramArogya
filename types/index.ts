export type Gender = 'Male' | 'Female' | 'Other' | 'Prefer not to say';

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  abhaId?: string | null;
  village?: string | null;
  district?: string | null;
  bloodGroup?: string | null;
  emergencyContact?: string | null;
  highRiskCategory?: string | null;
  createdAt: string;
  prescriptionCount?: number;
}


export interface MedicineItem {
  name: string;
  dosage: string;
  frequency: string;
  isUncertain?: boolean;
}

export interface Prescription {
  id: string;
  patientId: string;
  imageUrl: string;
  rawOcr: string;
  correctedText: string;
  aiSummary: string;
  medicinesJson: MedicineItem[];
  doctorNotes: string;
  tags: string[];
  important: boolean;
  ocrConfidence?: {
    score: number; // 0 to 100
    level: 'Excellent' | 'Good' | 'Needs Review';
    uncertainWords?: string[];
  };
  createdAt: string;
  patientName?: string;
  patientPhone?: string;
}

export interface ImageQualityReport {
  isAcceptable: boolean;
  score: number; // 0 - 100
  warnings: string[];
  brightness: 'Low' | 'Normal' | 'High';
  isBlurry: boolean;
  isLowLight: boolean;
  isTiltedOrCropped: boolean;
  dimensions: { width: number; height: number };
}

export interface OCRResult {
  rawText: string;
  confidenceScore: number;
  confidenceLevel: 'Excellent' | 'Good' | 'Needs Review';
  words: {
    text: string;
    confidence: number;
    isUncertain: boolean;
  }[];
  uncertainWords: string[];
}

export interface GeminiAnalysisResult {
  corrected_text: string;
  summary: string;
  medicines: {
    name: string;
    dosage: string;
    frequency: string;
  }[];
  important_findings: string[];
  tags: string[];
}

export interface AnalysisPipelineResponse {
  success: boolean;
  qualityReport?: ImageQualityReport;
  ocrResult: OCRResult;
  aiAnalysis: GeminiAnalysisResult;
  error?: string;
}
