import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import * as dotenv from 'dotenv';
import { sql } from 'drizzle-orm';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

async function seed() {
  if (!databaseUrl) {
    console.error('DATABASE_URL is not set');
    return;
  }

  const sqlClient = neon(databaseUrl);
  const db = drizzle(sqlClient, { schema });

  console.log('Seeding Neon database...');

  const existingPatients = await db.select({ count: sql<number>`count(*)::int` }).from(schema.patients);
  if (existingPatients[0]?.count && existingPatients[0].count > 0) {
    console.log(`Database already has ${existingPatients[0].count} patients. Skipping seed.`);
    return;
  }

  // Insert Patients
  const patient1Id = 'd9b1c784-9642-47e1-88f1-a1b7521ea801';
  const patient2Id = 'f4a2b910-3819-48c2-99d3-b2c8632fb902';
  const patient3Id = 'c8e3d021-1928-49d4-aa04-c3d9743ea013';
  const patient4Id = 'e1f5b632-4720-41e5-bb15-d4e0854fa124';

  await db.insert(schema.patients).values([
    {
      id: patient1Id,
      name: 'Eleanor Vance',
      age: 42,
      gender: 'Female',
      phone: '+1 (555) 234-5678',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      id: patient2Id,
      name: 'Marcus Chen',
      age: 35,
      gender: 'Male',
      phone: '+1 (555) 876-5432',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      id: patient3Id,
      name: 'Sophia Rodriguez',
      age: 8,
      gender: 'Female',
      phone: '+1 (555) 345-6789',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      id: patient4Id,
      name: 'David Miller',
      age: 68,
      gender: 'Male',
      phone: '+1 (555) 456-7890',
      createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    },
  ]);

  // Insert Prescriptions
  await db.insert(schema.prescriptions).values([
    {
      id: 'a1111111-2222-3333-4444-555555555555',
      patientId: patient1Id,
      imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800',
      rawOcr: `Rx Dr. Robert Smith MD\nPatient: Eleanor Vance | Age: 42 | Date: 12-Aug-2026\nTab Amoxicillin 500mg - 1 tid x 5 days\nTab Paracetamol 650mg - 1 SOS for fever\nCap Omeprazole 20mg - 1 OD before breakfast\nDx: Acute Bronchitis`,
      correctedText: `Rx Dr. Robert Smith MD\nPatient: Eleanor Vance | Age: 42\nTab Amoxicillin 500mg - 1 tablet 3 times a day for 5 days\nTab Paracetamol 650mg - 1 tablet as needed (SOS) for fever\nCap Omeprazole 20mg - 1 capsule once daily (OD) before breakfast\nDiagnosis: Acute Bronchitis\nAdvice: Drink plenty of warm fluids.`,
      aiSummary: 'Acute Bronchitis management with 5-day course of Amoxicillin, Paracetamol for fever, and Omeprazole for gastric relief.',
      medicinesJson: [
        { name: 'Amoxicillin', dosage: '500mg', frequency: '1 tablet 3 times daily (tid) x 5 days', isUncertain: false },
        { name: 'Paracetamol', dosage: '650mg', frequency: '1 tablet SOS for fever', isUncertain: false },
        { name: 'Omeprazole', dosage: '20mg', frequency: '1 capsule once daily before breakfast', isUncertain: false },
      ],
      doctorNotes: 'Patient advised to complete full antibiotic course and stay hydrated.',
      tags: ['Antibiotic', 'Fever', 'Bronchitis', 'Respiratory'],
      important: true,
      ocrConfidence: { score: 94, level: 'Excellent', uncertainWords: [] },
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'b2222222-3333-4444-5555-666666666666',
      patientId: patient2Id,
      imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800',
      rawOcr: `Dr. Sarah Jenkins\nMarcus Chen | 35 M\nPantoprazole 40mg 1 OD AC\nLevocetirizine 5mg 1 HS\nPossibly Levolin inhaler 2 puffs PRN`,
      correctedText: `Dr. Sarah Jenkins\nMarcus Chen | 35 Male\nTab. Pantoprazole 40mg - 1 OD before breakfast (AC)\nTab. Levocetirizine 5mg - 1 at bedtime (HS)\nPossibly Levolin Inhaler - 2 puffs PRN (as needed for wheezing)`,
      aiSummary: 'Allergic rhinitis and hyperacidity therapy. Antihistamine for allergy, PPI for reflux, and bronchodilator SOS.',
      medicinesJson: [
        { name: 'Pantoprazole', dosage: '40mg', frequency: '1 tablet once daily before food', isUncertain: false },
        { name: 'Levocetirizine', dosage: '5mg', frequency: '1 tablet at bedtime (HS)', isUncertain: false },
        { name: 'Possibly Levolin Inhaler', dosage: '50mcg', frequency: '2 puffs PRN (as needed)', isUncertain: true },
      ],
      doctorNotes: 'Check spirometry if nocturnal cough persists.',
      tags: ['Allergy', 'Asthma', 'Antihistamine', 'Gastric'],
      important: false,
      ocrConfidence: { score: 82, level: 'Good', uncertainWords: ['Levolin'] },
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  ]);

  console.log('Seeding completed successfully!');
}

seed().catch(console.error);
