import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

const databaseUrl = process.env.DATABASE_URL;

// If DATABASE_URL is provided, initialize Neon serverless client
export const db = databaseUrl
  ? drizzle(neon(databaseUrl), { schema })
  : null;

export const isRealDatabaseConfigured = !!databaseUrl;

// In-Memory persistent store for development/demo when DATABASE_URL is not provided
interface MemoryStore {
  patients: (schema.PatientSelect & { prescriptionCount?: number })[];
  prescriptions: schema.PrescriptionSelect[];
  triageAssessments: schema.TriageAssessmentSelect[];
  referrals: schema.ReferralSelect[];
  teleconsultations: schema.TeleconsultationSelect[];
  opdQueue: schema.OpdQueueSelect[];
  essentialDrugs: schema.EssentialDrugSelect[];
  maternalNcdRecords: schema.MaternalNcdRecordSelect[];
}

const globalForStore = globalThis as unknown as { clinicMemoryStore?: MemoryStore };

export const memoryStore: MemoryStore = globalForStore.clinicMemoryStore || {
  patients: [
    {
      id: 'd9b1c784-9642-47e1-88f1-a1b7521ea801',
      name: 'Sunita Kashinath Shinde',
      age: 28,
      gender: 'Female',
      phone: '+91 98221 45678',
      abhaId: '91-4521-8842-1092',
      village: 'Khed Shivapur, Haveli',
      district: 'Pune, Maharashtra',
      bloodGroup: 'B+',
      emergencyContact: '+91 98221 45679 (Husband: Kashinath)',
      highRiskCategory: 'ANC High Risk (Severe Anemia Hb 7.8)',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      prescriptionCount: 2,
    },
    {
      id: 'f4a2b910-3819-48c2-99d3-b2c8632fb902',
      name: 'Ramesh Tukaram Patil',
      age: 58,
      gender: 'Male',
      phone: '+91 94230 12345',
      abhaId: '91-7712-3301-9874',
      village: 'Manchar Gram, Ambegaon',
      district: 'Pune, Maharashtra',
      bloodGroup: 'O+',
      emergencyContact: '+91 94230 12346 (Son: Sachin)',
      highRiskCategory: 'Severe Hypertension (BP 170/105)',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      prescriptionCount: 1,
    },
    {
      id: 'c8e3d021-1928-49d4-aa04-c3d9743ea013',
      name: 'Aarav Ganesh Jadhav',
      age: 4,
      gender: 'Male',
      phone: '+91 97654 32109',
      abhaId: '91-8821-4402-5512',
      village: 'Saswad, Purandar',
      district: 'Pune, Maharashtra',
      bloodGroup: 'A+',
      emergencyContact: '+91 97654 32109 (Mother: Priya)',
      highRiskCategory: 'Pediatric SAM (Severe Acute Malnutrition)',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      prescriptionCount: 1,
    },
    {
      id: 'e1f5b632-4720-41e5-bb15-d4e0854fa124',
      name: 'Kamalabai Dnyaneshwar Pawar',
      age: 67,
      gender: 'Female',
      phone: '+91 91580 87654',
      abhaId: '91-6632-1194-4482',
      village: 'Shirur Rural',
      district: 'Pune, Maharashtra',
      bloodGroup: 'AB+',
      emergencyContact: '+91 91580 87655 (Daughter: Savita)',
      highRiskCategory: 'Type 2 Diabetes with Diabetic Foot Ulcer',
      createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      prescriptionCount: 1,
    },
  ],
  prescriptions: [
    {
      id: 'a1111111-2222-3333-4444-555555555555',
      patientId: 'd9b1c784-9642-47e1-88f1-a1b7521ea801',
      imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800',
      rawOcr: `PHC Khed - Dr. Rajesh Kulkarni MBBS
Patient: Sunita Kashinath Shinde | Age: 28 F | G2P1 28 Wks
Tab Ferrous Ascorbate 100mg + Folic Acid 1.5mg - 1 OD x 30 days
Tab Calcium Carbonate 500mg + Vit D3 - 1 BD x 30 days
Tab Paracetamol 500mg - 1 SOS
Advise: Iron rich diet (Palak/Jaggery). Recheck Hb after 15 days.`,
      correctedText: `PHC Khed - Dr. Rajesh Kulkarni MBBS
Patient: Sunita Kashinath Shinde | Age: 28 Female | G2P1 28 Weeks Gestation
1. Tab. Ferrous Ascorbate 100mg + Folic Acid 1.5mg - 1 tablet once daily after dinner x 30 days
2. Tab. Calcium Carbonate 500mg + Vitamin D3 - 1 tablet twice daily after meals (do not take with iron) x 30 days
3. Tab. Paracetamol 500mg - 1 tablet as needed (SOS) for body ache/fever
Advice: Iron rich diet (Green leafy vegetables, Jaggery, Chana). Recheck Hemoglobin at PHC in 15 days.`,
      aiSummary: 'Second trimester maternal anemia management (Hb 7.8 g/dL). High dose therapeutic oral iron with elemental calcium and dietary counseling.',
      medicinesJson: [
        { name: 'Ferrous Ascorbate + Folic Acid', dosage: '100mg/1.5mg', frequency: '1 tablet OD post dinner', isUncertain: false, janAushadhiSubstitute: 'Jan Aushadhi Ferrous Sulphate & FA (₹18 vs ₹180)', estimatedSavings: '90% Savings' },
        { name: 'Calcium Carbonate + Vit D3', dosage: '500mg/250IU', frequency: '1 tablet BD post meals', isUncertain: false, janAushadhiSubstitute: 'Jan Aushadhi Calcium 500mg (₹22 vs ₹140)', estimatedSavings: '84% Savings' },
        { name: 'Paracetamol', dosage: '500mg', frequency: '1 tablet SOS for mild aches', isUncertain: false, janAushadhiSubstitute: 'Jan Aushadhi Paracetamol 500mg (₹8 vs ₹45)', estimatedSavings: '82% Savings' },
      ],
      doctorNotes: 'High risk ANC alert flagged. ASHA worker Sunita Tai to conduct weekly home visits.',
      tags: ['Maternal ANC', 'Anemia', 'Iron Therapy', 'Jan Aushadhi'],
      important: true,
      ocrConfidence: {
        score: 96,
        level: 'Excellent',
        uncertainWords: [],
      },
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'b2222222-3333-4444-5555-666666666666',
      patientId: 'f4a2b910-3819-48c2-99d3-b2c8632fb902',
      imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800',
      rawOcr: `Ambegaon Rural Hospital - Dr. S. Deshmukh MD
Ramesh Patil | 58 M | BP: 170/105 mmHg
Tab Telmisartan 40mg + Amlodipine 5mg - 1 OD morning
Tab Hydrochlorothiazide 12.5mg - 1 OD
Tab Ecosprin 75mg - 1 OD post lunch
Advise: Low salt diet, daily BP monitoring by ASHA.`,
      correctedText: `Ambegaon Rural Hospital - Dr. S. Deshmukh MD
Patient: Ramesh Tukaram Patil | 58 Male | BP: 170/105 mmHg
1. Tab. Telmisartan 40mg + Amlodipine 5mg - 1 tablet once daily in the morning
2. Tab. Hydrochlorothiazide 12.5mg - 1 tablet once daily in the morning
3. Tab. Ecosprin (Aspirin) 75mg - 1 tablet once daily after lunch
Advice: Low salt diet (< 5g/day), avoid smoking/tobacco, weekly BP check by ASHA.`,
      aiSummary: 'Stage 2 Hypertension with cardiovascular risk. Dual ARB + CCB combination with low-dose diuretic and antiplatelet coverage.',
      medicinesJson: [
        { name: 'Telmisartan + Amlodipine', dosage: '40mg + 5mg', frequency: '1 tablet once daily morning', isUncertain: false, janAushadhiSubstitute: 'Jan Aushadhi Telmisartan-Amlodipine (₹28 vs ₹195)', estimatedSavings: '85% Savings' },
        { name: 'Hydrochlorothiazide', dosage: '12.5mg', frequency: '1 tablet OD morning', isUncertain: false, janAushadhiSubstitute: 'Jan Aushadhi HCTZ 12.5 (₹12 vs ₹65)', estimatedSavings: '81% Savings' },
        { name: 'Aspirin (Ecosprin)', dosage: '75mg', frequency: '1 tablet OD post lunch', isUncertain: false, janAushadhiSubstitute: 'Jan Aushadhi Aspirin 75mg (₹6 vs ₹38)', estimatedSavings: '84% Savings' },
      ],
      doctorNotes: 'Recheck lipid profile and renal function tests next month.',
      tags: ['Hypertension', 'Cardiovascular', 'NCD', 'Chronic Care'],
      important: true,
      ocrConfidence: {
        score: 91,
        level: 'Excellent',
        uncertainWords: [],
      },
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'c3333333-4444-5555-6666-777777777777',
      patientId: 'c8e3d021-1928-49d4-aa04-c3d9743ea013',
      imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800',
      rawOcr: `Sub-District Hospital Saswad - Dr. Anjali More MD (Peds)
Aarav Jadhav | 4 yrs | Wt: 11.2kg (SAM)
Syp Amoxicillin + Clavulanic Acid 228.5mg/5ml - 5ml BD x 7 days
Syp Zinc Acetate 20mg/5ml - 5ml OD x 14 days
Multivitamin Drops + Iron Folic Syrup
Advise: RUTF (Ready to Use Therapeutic Food) and NRC referral if weight stagnates.`,
      correctedText: `Sub-District Hospital Saswad - Dr. Anjali More MD (Pediatrics)
Patient: Aarav Ganesh Jadhav | 4 yrs | Wt: 11.2kg (Severe Acute Malnutrition)
1. Syrup Amoxicillin + Clavulanate (228.5mg/5ml) - 5ml twice daily (BD) for 7 days
2. Syrup Zinc Acetate (20mg/5ml) - 5ml once daily for 14 days
3. Pediatric Multivitamin & Iron Syrup - 2.5ml OD post meals x 30 days
Advice: High calorie local diet (khichdi with ghee, boiled eggs, peanut chikki). Enroll in Nutrition Rehabilitation Centre (NRC).`,
      aiSummary: 'Pediatric chest infection complicating Severe Acute Malnutrition (SAM). Antibiotic course with therapeutic Zinc supplementation and NRC follow-up.',
      medicinesJson: [
        { name: 'Amoxicillin-Clavulanate Syrup', dosage: '228.5mg/5ml', frequency: '5ml BD x 7 days', isUncertain: false, janAushadhiSubstitute: 'Jan Aushadhi Amoxy-Clav Syrup (₹45 vs ₹190)', estimatedSavings: '76% Savings' },
        { name: 'Zinc Acetate Syrup', dosage: '20mg/5ml', frequency: '5ml OD x 14 days', isUncertain: false, janAushadhiSubstitute: 'Jan Aushadhi Zinc Syrup (₹15 vs ₹60)', estimatedSavings: '75% Savings' },
      ],
      doctorNotes: 'Weight tracking every 7 days by Anganwadi Worker.',
      tags: ['Pediatric', 'SAM', 'Malnutrition', 'Child Health'],
      important: true,
      ocrConfidence: {
        score: 95,
        level: 'Excellent',
        uncertainWords: [],
      },
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    }
  ],
  triageAssessments: [
    {
      id: 't1111111-0000-0000-0000-000000000001',
      patientId: 'd9b1c784-9642-47e1-88f1-a1b7521ea801',
      triageLevel: 'YELLOW',
      chiefComplaints: ['Severe dizziness and extreme fatigue', 'Breathlessness on mild walking', 'Pale conjunctiva and nailbeds'],
      vitals: { bpSystolic: 104, bpDiastolic: 66, spo2: 97, pulse: 94, temperature: 98.4 },
      aiRiskScore: 68,
      aiRecommendations: 'High Risk Maternal Pregnancy (Severe Anemia). Urgent teleconsultation with Obstetrician and parenteral iron therapy evaluation.',
      frontlineWorkerName: 'Sunita Tai (ASHA Worker, Sub-Centre Ward 4)',
      facilityTier: 'Sub-Centre / Ayushman Arogya Mandir',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: 't2222222-0000-0000-0000-000000000002',
      patientId: 'f4a2b910-3819-48c2-99d3-b2c8632fb902',
      triageLevel: 'RED',
      chiefComplaints: ['Sudden occipital headache', 'Blurry vision in left eye', 'Chest tightness'],
      vitals: { bpSystolic: 185, bpDiastolic: 110, spo2: 95, pulse: 102, temperature: 98.6 },
      aiRiskScore: 92,
      aiRecommendations: 'CRITICAL EMERGENCY: Hypertensive Urgency / Impending Stroke. Immediate 108 Emergency Ambulance escalation to District Hospital ICU.',
      frontlineWorkerName: 'Rekha Tai (ANM, PHC Manchar)',
      facilityTier: 'Primary Health Centre (PHC)',
      createdAt: new Date(Date.now() - 45 * 60 * 1000),
    }
  ],
  referrals: [
    {
      id: 'r1111111-1111-1111-1111-111111111111',
      patientId: 'f4a2b910-3819-48c2-99d3-b2c8632fb902',
      fromFacility: 'Manchar Primary Health Centre (PHC)',
      toFacility: 'Sassoon General & District Hospital, Pune',
      urgency: 'EMERGENCY_108',
      reason: 'Hypertensive crisis (BP 185/110) with neurological symptoms (transient visual blurring). Requires urgent CT Brain and IV labetalol infusion.',
      transportAssigned: '108 Ambulance (MH-12-EM-2041)',
      status: 'IN_TRANSIT',
      escortWorker: 'Rekha Tai (ANM)',
      ambulanceTrackingId: 'GPS-AMB-108-PUNE-42',
      createdAt: new Date(Date.now() - 35 * 60 * 1000),
    },
    {
      id: 'r2222222-2222-2222-2222-222222222222',
      patientId: 'd9b1c784-9642-47e1-88f1-a1b7521ea801',
      fromFacility: 'Khed Shivapur Sub-Centre',
      toFacility: 'Chakan Rural Hospital (RH)',
      urgency: 'URGENT_24H',
      reason: '28 Weeks ANC with severe nutritional anemia (Hb 7.8). Scheduled for IV Ferric Carboxymaltose infusion at Day-care ward.',
      transportAssigned: 'Facility Shuttle Van',
      status: 'INITIATED',
      escortWorker: 'Sunita Tai (ASHA)',
      ambulanceTrackingId: null,
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    }
  ],
  teleconsultations: [
    {
      id: 'tc111111-1111-1111-1111-111111111111',
      patientId: 'd9b1c784-9642-47e1-88f1-a1b7521ea801',
      doctorName: 'Dr. Anand Joshi, MD (Obstetrics & Gynaecology)',
      specialty: 'Maternal & Fetal Medicine',
      ashaWorkerName: 'Sunita Tai (ASHA)',
      status: 'IN_PROGRESS',
      tokenNumber: 104,
      clinicalNotes: 'Advised IV Iron sucrose at nearest Rural Hospital. Continue oral calcium and folic acid.',
      digitalRxGiven: true,
      durationMinutes: 14,
      createdAt: new Date(Date.now() - 15 * 60 * 1000),
    },
    {
      id: 'tc222222-2222-2222-2222-222222222222',
      patientId: 'e1f5b632-4720-41e5-bb15-d4e0854fa124',
      doctorName: 'Dr. Meera Nambiar, MD (General Medicine)',
      specialty: 'Diabetology & Endocrinology',
      ashaWorkerName: 'Usha Tai (ASHA)',
      status: 'WAITING',
      tokenNumber: 105,
      clinicalNotes: 'Pre-consultation vitals recorded: Fasting Sugar 214 mg/dL. Non-healing left toe fissure.',
      digitalRxGiven: false,
      durationMinutes: 0,
      createdAt: new Date(Date.now() - 30 * 60 * 1000),
    }
  ],
  opdQueue: [
    {
      id: 'q1111111-1111-1111-1111-111111111111',
      patientId: 'd9b1c784-9642-47e1-88f1-a1b7521ea801',
      tokenNumber: 104,
      facilityName: 'Khed Model PHC - Telemedicine Room 1',
      department: 'Tele-Obstetrics Specialist OPD',
      status: 'IN_CONSULTATION',
      estimatedWaitMinutes: 0,
      createdAt: new Date(Date.now() - 20 * 60 * 1000),
    },
    {
      id: 'q2222222-2222-2222-2222-222222222222',
      patientId: 'e1f5b632-4720-41e5-bb15-d4e0854fa124',
      tokenNumber: 105,
      facilityName: 'Khed Model PHC - Telemedicine Room 1',
      department: 'NCD & Chronic Care Tele-OPD',
      status: 'WAITING',
      estimatedWaitMinutes: 8,
      createdAt: new Date(Date.now() - 18 * 60 * 1000),
    },
    {
      id: 'q3333333-3333-3333-3333-333333333333',
      patientId: 'c8e3d021-1928-49d4-aa04-c3d9743ea013',
      tokenNumber: 106,
      facilityName: 'Khed Model PHC - General OPD',
      department: 'Pediatric Care & Immunization',
      status: 'WAITING',
      estimatedWaitMinutes: 18,
      createdAt: new Date(Date.now() - 10 * 60 * 1000),
    }
  ],
  essentialDrugs: [
    {
      id: 'ed111111-1111-1111-1111-111111111111',
      drugName: 'Tab. Telmisartan 40mg',
      category: 'Antihypertensive',
      phcStockUnits: 850,
      minThreshold: 300,
      stockStatus: 'IN_STOCK',
      janAushadhiName: 'Pradhan Mantri Jan Aushadhi Telmisartan 40mg',
      marketPriceRs: 110,
      janAushadhiPriceRs: 14,
      lastUpdated: new Date(),
    },
    {
      id: 'ed222222-2222-2222-2222-222222222222',
      drugName: 'Tab. Metformin 500mg SR',
      category: 'Antidiabetic',
      phcStockUnits: 1200,
      minThreshold: 500,
      stockStatus: 'IN_STOCK',
      janAushadhiName: 'PMBJP Metformin Hydrochloride 500mg',
      marketPriceRs: 45,
      janAushadhiPriceRs: 6,
      lastUpdated: new Date(),
    },
    {
      id: 'ed333333-3333-3333-3333-333333333333',
      drugName: 'Inj. Oxytocin 10 IU',
      category: 'Maternal Life-Saving',
      phcStockUnits: 45,
      minThreshold: 100,
      stockStatus: 'LOW_STOCK',
      janAushadhiName: 'Jan Aushadhi Oxytocin Injection',
      marketPriceRs: 85,
      janAushadhiPriceRs: 18,
      lastUpdated: new Date(),
    },
    {
      id: 'ed444444-4444-4444-4444-444444444444',
      drugName: 'Tab. Amoxicillin + Clavulanic Acid 625mg',
      category: 'Antibiotic',
      phcStockUnits: 25,
      minThreshold: 200,
      stockStatus: 'OUT_OF_STOCK',
      janAushadhiName: 'PMBJP Amoxy-Clav 625mg (Available at Khed Kendra #4)',
      marketPriceRs: 220,
      janAushadhiPriceRs: 42,
      lastUpdated: new Date(),
    },
    {
      id: 'ed555555-5555-5555-5555-555555555555',
      drugName: 'Tab. IFA (Iron & Folic Acid) Large',
      category: 'Maternal & Anemia',
      phcStockUnits: 3400,
      minThreshold: 1000,
      stockStatus: 'IN_STOCK',
      janAushadhiName: 'Jan Aushadhi Ferrous Sulphate & Folic Acid',
      marketPriceRs: 75,
      janAushadhiPriceRs: 12,
      lastUpdated: new Date(),
    }
  ],
  maternalNcdRecords: [
    {
      id: 'mn111111-1111-1111-1111-111111111111',
      patientId: 'd9b1c784-9642-47e1-88f1-a1b7521ea801',
      recordType: 'ANC_MATERNAL',
      trimesterOrStage: '2nd Trimester (28 Weeks)',
      hemoglobin: '7.8 g/dL (Severe)',
      bloodPressure: '104/66 mmHg',
      bloodSugar: '88 mg/dL (Normal)',
      highRiskAlert: true,
      riskFactors: ['Severe Nutritional Anemia (Hb < 8)', 'Second Pregnancy (G2P1)', 'Prior history of postpartum weakness'],
      nextFollowUpDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      ashaAssigned: 'Sunita Tai (ASHA Worker)',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'mn222222-2222-2222-2222-222222222222',
      patientId: 'f4a2b910-3819-48c2-99d3-b2c8632fb902',
      recordType: 'CHRONIC_NCD',
      trimesterOrStage: 'Chronic Follow-up (Year 4)',
      hemoglobin: '13.2 g/dL',
      bloodPressure: '170/105 mmHg (Stage 2 Hypertensive)',
      bloodSugar: '142 mg/dL (Postprandial)',
      highRiskAlert: true,
      riskFactors: ['Uncontrolled Systolic BP > 160', 'Irregular medication adherence due to travel distance', 'Cardiovascular risk'],
      nextFollowUpDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      ashaAssigned: 'Rekha Tai (ANM)',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    }
  ]
};

if (process.env.NODE_ENV !== 'production') {
  globalForStore.clinicMemoryStore = memoryStore;
}

