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
}

const globalForStore = globalThis as unknown as { clinicMemoryStore?: MemoryStore };

export const memoryStore: MemoryStore = globalForStore.clinicMemoryStore || {
  patients: [
    {
      id: 'd9b1c784-9642-47e1-88f1-a1b7521ea801',
      name: 'Eleanor Vance',
      age: 42,
      gender: 'Female',
      phone: '+1 (555) 234-5678',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      prescriptionCount: 2,
    },
    {
      id: 'f4a2b910-3819-48c2-99d3-b2c8632fb902',
      name: 'Marcus Chen',
      age: 35,
      gender: 'Male',
      phone: '+1 (555) 876-5432',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      prescriptionCount: 1,
    },
    {
      id: 'c8e3d021-1928-49d4-aa04-c3d9743ea013',
      name: 'Sophia Rodriguez',
      age: 8,
      gender: 'Female',
      phone: '+1 (555) 345-6789',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      prescriptionCount: 1,
    },
    {
      id: 'e1f5b632-4720-41e5-bb15-d4e0854fa124',
      name: 'David Miller',
      age: 68,
      gender: 'Male',
      phone: '+1 (555) 456-7890',
      createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      prescriptionCount: 1,
    },
  ],
  prescriptions: [
    {
      id: 'a1111111-2222-3333-4444-555555555555',
      patientId: 'd9b1c784-9642-47e1-88f1-a1b7521ea801',
      imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800',
      rawOcr: `Rx Dr. Robert Smith MD
Patient: Eleanor Vance | Age: 42 | Date: 12-Aug-2026
Tab Amoxicillin 500mg - 1 tid x 5 days
Tab Paracetamol 650mg - 1 SOS for fever
Cap Omeprazole 20mg - 1 OD before breakfast
Dx: Acute Bronchitis
Notes: Drink warm fluids, follow up if fever persists.`,
      correctedText: `Rx Dr. Robert Smith MD
Patient: Eleanor Vance | Age: 42 | Date: 12-Aug-2026
Tab Amoxicillin 500mg - 1 tablet 3 times a day for 5 days
Tab Paracetamol 650mg - 1 tablet as needed (SOS) for fever
Cap Omeprazole 20mg - 1 capsule once daily (OD) before breakfast
Diagnosis: Acute Bronchitis
Advice: Drink plenty of warm fluids. Review if fever persists after 3 days.`,
      aiSummary: 'Prescribed for Acute Bronchitis. 5-day course of Amoxicillin with Paracetamol for symptomatic fever management and Omeprazole for gastric protection.',
      medicinesJson: [
        { name: 'Amoxicillin', dosage: '500mg', frequency: '1 tablet 3 times daily (tid) x 5 days', isUncertain: false },
        { name: 'Paracetamol', dosage: '650mg', frequency: '1 tablet SOS (as needed) for fever', isUncertain: false },
        { name: 'Omeprazole', dosage: '20mg', frequency: '1 capsule once daily before breakfast', isUncertain: false },
      ],
      doctorNotes: 'Patient advised to complete full antibiotic course and rest.',
      tags: ['Antibiotic', 'Fever', 'Bronchitis', 'Respiratory'],
      important: true,
      ocrConfidence: {
        score: 94,
        level: 'Excellent',
        uncertainWords: [],
      },
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'b2222222-3333-4444-5555-666666666666',
      patientId: 'f4a2b910-3819-48c2-99d3-b2c8632fb902',
      imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800',
      rawOcr: `Dr. Sarah Jenkins
Marcus Chen | 35 M
Pantoprazole 40mg 1 OD AC
Levocetirizine 5mg 1 HS
Possibly Levolin inhaler 2 puffs PRN
Advise: Avoid allergen exposure.`,
      correctedText: `Dr. Sarah Jenkins
Marcus Chen | 35 Male
Tab. Pantoprazole 40mg - 1 OD before breakfast (AC)
Tab. Levocetirizine 5mg - 1 at bedtime (HS)
Possibly Levolin Inhaler - 2 puffs PRN (as needed for wheezing)
Advice: Avoid allergen exposure and cold drafts.`,
      aiSummary: 'Allergic rhinitis and mild hyperacidity management. Antihistamine for allergy, PPI for reflux, and bronchodilator SOS.',
      medicinesJson: [
        { name: 'Pantoprazole', dosage: '40mg', frequency: '1 tablet once daily before food', isUncertain: false },
        { name: 'Levocetirizine', dosage: '5mg', frequency: '1 tablet at bedtime (HS)', isUncertain: false },
        { name: 'Possibly Levolin Inhaler', dosage: '50mcg', frequency: '2 puffs PRN (as needed)', isUncertain: true },
      ],
      doctorNotes: 'Check spirometry if nocturnal cough persists.',
      tags: ['Allergy', 'Asthma', 'Antihistamine', 'Gastric'],
      important: false,
      ocrConfidence: {
        score: 82,
        level: 'Good',
        uncertainWords: ['Levolin'],
      },
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'c3333333-4444-5555-6666-777777777777',
      patientId: 'c8e3d021-1928-49d4-aa04-c3d9743ea013',
      imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800',
      rawOcr: `Pediatric Clinic - Dr. K. Sharma
Sophia Rodriguez | 8 yrs | Wt: 24kg
Syp Ibuprofen 100mg/5ml - 5ml TDS x 3 days
Syp Augmentin Duo - 5ml BD x 5 days
Saline Nasal Drops - 2 drops in each nostril TID`,
      correctedText: `Pediatric Clinic - Dr. K. Sharma
Patient: Sophia Rodriguez | 8 yrs | Wt: 24kg
Syrup Ibuprofen (100mg/5ml) - 5ml three times a day (TDS) for 3 days
Syrup Augmentin Duo - 5ml twice daily (BD) for 5 days
Saline Nasal Drops - 2 drops in each nostril 3 times daily`,
      aiSummary: 'Pediatric upper respiratory tract infection. Weight-adjusted Augmentin Duo antibacterial course with Ibuprofen for discomfort and fever.',
      medicinesJson: [
        { name: 'Ibuprofen Syrup', dosage: '100mg/5ml', frequency: '5ml TDS (3 times/day) x 3 days', isUncertain: false },
        { name: 'Augmentin Duo Syrup', dosage: '228mg/5ml', frequency: '5ml BD (twice daily) x 5 days', isUncertain: false },
        { name: 'Saline Nasal Drops', dosage: '0.9%', frequency: '2 drops each nostril TID', isUncertain: false },
      ],
      doctorNotes: 'Encourage hydration. Review after 3 days if fever continues.',
      tags: ['Pediatric', 'Fever', 'Antibiotic', 'Pain Relief'],
      important: true,
      ocrConfidence: {
        score: 96,
        level: 'Excellent',
        uncertainWords: [],
      },
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    }
  ]
};

if (process.env.NODE_ENV !== 'production') {
  globalForStore.clinicMemoryStore = memoryStore;
}
