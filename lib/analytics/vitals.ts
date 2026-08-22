/**
 * Patient Health Analytics & Chronic Disease Progression Tracker
 * Generates vitals history, blood pressure trends, glucose logs, and dosage adjustments
 */

export interface VitalsRecord {
  date: string;
  systolicBp: number; // mmHg
  diastolicBp: number; // mmHg
  bloodSugarFasting: number; // mg/dL
  bloodSugarPostPrandial?: number; // mg/dL
  hbA1c?: number; // %
  pulse: number; // bpm
  weight: number; // kg
  dosageNotes?: string;
}

export interface ChronicDiseaseAnalytics {
  patientId: string;
  primaryCondition: 'Hypertension' | 'Type 2 Diabetes' | 'Respiratory / Asthma' | 'General Wellness';
  vitalsHistory: VitalsRecord[];
  trendSummary: {
    bpStatus: 'Optimal' | 'Elevated' | 'Stage 1 HTN' | 'Controlled';
    sugarStatus: 'Normal' | 'Prediabetes' | 'Elevated' | 'Well Controlled';
    dosageTrend: 'Stable Dosage' | 'Dosage Escalated' | 'Dosage Reduced (Improving)';
    clinicalAdvice: string;
  };
}

/**
 * Generates realistic longitudinal vitals and analytics for chronic disease tracking
 */
export function getPatientHealthAnalytics(patientId: string, patientName: string): ChronicDiseaseAnalytics {
  const isDiabetic = patientName.toLowerCase().includes('marcus') || patientName.toLowerCase().includes('david');
  
  const history: VitalsRecord[] = [
    {
      date: '18-Feb-2026',
      systolicBp: 142,
      diastolicBp: 92,
      bloodSugarFasting: 154,
      bloodSugarPostPrandial: 210,
      hbA1c: 7.8,
      pulse: 82,
      weight: 76.5,
      dosageNotes: 'Started Metformin 500mg BD + Telmisartan 40mg',
    },
    {
      date: '20-Apr-2026',
      systolicBp: 135,
      diastolicBp: 86,
      bloodSugarFasting: 138,
      bloodSugarPostPrandial: 185,
      hbA1c: 7.2,
      pulse: 78,
      weight: 75.0,
      dosageNotes: 'Maintained Metformin 500mg BD. Added dietary exercise plan.',
    },
    {
      date: '15-Jun-2026',
      systolicBp: 128,
      diastolicBp: 82,
      bloodSugarFasting: 122,
      bloodSugarPostPrandial: 160,
      hbA1c: 6.8,
      pulse: 74,
      weight: 73.8,
      dosageNotes: 'Dosage maintained. Blood pressure normalized.',
    },
    {
      date: '18-Aug-2026',
      systolicBp: 122,
      diastolicBp: 78,
      bloodSugarFasting: 112,
      bloodSugarPostPrandial: 142,
      hbA1c: 6.4,
      pulse: 72,
      weight: 72.5,
      dosageNotes: 'HbA1c controlled (<6.5%). Target goals achieved.',
    },
  ];

  return {
    patientId,
    primaryCondition: isDiabetic ? 'Type 2 Diabetes' : 'Hypertension',
    vitalsHistory: history,
    trendSummary: {
      bpStatus: 'Controlled',
      sugarStatus: 'Well Controlled',
      dosageTrend: 'Dosage Reduced (Improving)',
      clinicalAdvice: 'Longitudinal trend shows ~14% improvement in glycemic control and normalized BP over the last 6 months. Maintain current regimen.',
    },
  };
}
