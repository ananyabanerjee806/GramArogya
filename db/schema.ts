import { pgTable, text, integer, timestamp, uuid, boolean, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const patients = pgTable('patients', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  age: integer('age').notNull(),
  gender: text('gender').notNull(),
  phone: text('phone').notNull(),
  abhaId: text('abha_id'),
  village: text('village').default('Gram Panchayat Ward 4'),
  district: text('district').default('Pune / Rural Maharashtra'),
  bloodGroup: text('blood_group').default('O+'),
  emergencyContact: text('emergency_contact'),
  highRiskCategory: text('high_risk_category'), // e.g., 'ANC High Risk', 'Severe Hypertension', 'Type 2 Diabetes', 'Pediatric Malnutrition'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const prescriptions = pgTable('prescriptions', {
  id: uuid('id').defaultRandom().primaryKey(),
  patientId: uuid('patient_id')
    .notNull()
    .references(() => patients.id, { onDelete: 'cascade' }),
  imageUrl: text('image_url').notNull(),
  rawOcr: text('raw_ocr').notNull(),
  correctedText: text('corrected_text').notNull(),
  aiSummary: text('ai_summary').notNull(),
  medicinesJson: jsonb('medicines_json').$type<{ 
    name: string; 
    dosage: string; 
    frequency: string; 
    isUncertain?: boolean;
    janAushadhiSubstitute?: string;
    estimatedSavings?: string;
  }[]>().notNull(),
  doctorNotes: text('doctor_notes').default(''),
  tags: jsonb('tags').$type<string[]>().default([]),
  important: boolean('important').default(false).notNull(),
  ocrConfidence: jsonb('ocr_confidence').$type<{
    score: number;
    level: 'Excellent' | 'Good' | 'Needs Review';
    uncertainWords?: string[];
  }>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const triageAssessments = pgTable('triage_assessments', {
  id: uuid('id').defaultRandom().primaryKey(),
  patientId: uuid('patient_id')
    .notNull()
    .references(() => patients.id, { onDelete: 'cascade' }),
  triageLevel: text('triage_level').notNull(), // 'RED' (Emergency) | 'YELLOW' (Urgent) | 'GREEN' (Routine)
  chiefComplaints: jsonb('chief_complaints').$type<string[]>().notNull(),
  vitals: jsonb('vitals').$type<{
    bpSystolic?: number;
    bpDiastolic?: number;
    spo2?: number;
    pulse?: number;
    temperature?: number;
    bloodSugar?: number;
  }>().notNull(),
  aiRiskScore: integer('ai_risk_score').notNull(), // 0 - 100
  aiRecommendations: text('ai_recommendations').notNull(),
  frontlineWorkerName: text('frontline_worker_name').default('Sunita Tai (ASHA)'),
  facilityTier: text('facility_tier').default('Sub-Centre / Arogya Mandir'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const referrals = pgTable('referrals', {
  id: uuid('id').defaultRandom().primaryKey(),
  patientId: uuid('patient_id')
    .notNull()
    .references(() => patients.id, { onDelete: 'cascade' }),
  fromFacility: text('from_facility').notNull(), // e.g. "Khed Sub-Centre"
  toFacility: text('to_facility').notNull(), // e.g. "Chakan Rural Hospital" or "Sassoon District Hospital"
  urgency: text('urgency').notNull(), // 'EMERGENCY_108' | 'URGENT_24H' | 'ROUTINE'
  reason: text('reason').notNull(),
  transportAssigned: text('transport_assigned').default('Self-Arranged'), // '108 Ambulance' | 'Facility Vehicle' | 'Self'
  status: text('status').default('PENDING_TRANSFER').notNull(), // 'INITIATED' | 'IN_TRANSIT' | 'ADMITTED' | 'COMPLETED'
  escortWorker: text('escort_worker'),
  ambulanceTrackingId: text('ambulance_tracking_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const teleconsultations = pgTable('teleconsultations', {
  id: uuid('id').defaultRandom().primaryKey(),
  patientId: uuid('patient_id')
    .notNull()
    .references(() => patients.id, { onDelete: 'cascade' }),
  doctorName: text('doctor_name').notNull(),
  specialty: text('specialty').notNull(),
  ashaWorkerName: text('asha_worker_name').notNull(),
  status: text('status').default('SCHEDULED').notNull(), // 'IN_PROGRESS' | 'COMPLETED' | 'WAITING'
  tokenNumber: integer('token_number').notNull(),
  clinicalNotes: text('clinical_notes').default(''),
  digitalRxGiven: boolean('digital_rx_given').default(false),
  durationMinutes: integer('duration_minutes').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const opdQueue = pgTable('opd_queue', {
  id: uuid('id').defaultRandom().primaryKey(),
  patientId: uuid('patient_id')
    .notNull()
    .references(() => patients.id, { onDelete: 'cascade' }),
  tokenNumber: integer('token_number').notNull(),
  facilityName: text('facility_name').notNull(),
  department: text('department').notNull(),
  status: text('status').default('WAITING').notNull(), // 'WAITING' | 'IN_CONSULTATION' | 'COMPLETED' | 'REFERRED'
  estimatedWaitMinutes: integer('estimated_wait_minutes').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const essentialDrugs = pgTable('essential_drugs', {
  id: uuid('id').defaultRandom().primaryKey(),
  drugName: text('drug_name').notNull(),
  category: text('category').notNull(), // 'Antibiotic' | 'Antihypertensive' | 'Antidiabetic' | 'Analgesic' | 'Maternal'
  phcStockUnits: integer('phc_stock_units').notNull(),
  minThreshold: integer('min_threshold').notNull(),
  stockStatus: text('stock_status').notNull(), // 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK'
  janAushadhiName: text('jan_aushadhi_name').notNull(),
  marketPriceRs: integer('market_price_rs').notNull(),
  janAushadhiPriceRs: integer('jan_aushadhi_price_rs').notNull(),
  lastUpdated: timestamp('last_updated').defaultNow().notNull(),
});

export const maternalNcdRecords = pgTable('maternal_ncd_records', {
  id: uuid('id').defaultRandom().primaryKey(),
  patientId: uuid('patient_id')
    .notNull()
    .references(() => patients.id, { onDelete: 'cascade' }),
  recordType: text('record_type').notNull(), // 'ANC_MATERNAL' | 'PNC_INFANT' | 'CHRONIC_NCD'
  trimesterOrStage: text('trimester_or_stage'),
  hemoglobin: text('hemoglobin'),
  bloodPressure: text('blood_pressure'),
  bloodSugar: text('blood_sugar'),
  highRiskAlert: boolean('high_risk_alert').default(false),
  riskFactors: jsonb('risk_factors').$type<string[]>().default([]),
  nextFollowUpDate: timestamp('next_follow_up_date'),
  ashaAssigned: text('asha_assigned').default('Sunita Tai (ASHA)'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const patientsRelations = relations(patients, ({ many }) => ({
  prescriptions: many(prescriptions),
  triageAssessments: many(triageAssessments),
  referrals: many(referrals),
  teleconsultations: many(teleconsultations),
  opdQueue: many(opdQueue),
  maternalNcdRecords: many(maternalNcdRecords),
}));

export const prescriptionsRelations = relations(prescriptions, ({ one }) => ({
  patient: one(patients, {
    fields: [prescriptions.patientId],
    references: [patients.id],
  }),
}));

export type PatientInsert = typeof patients.$inferInsert;
export type PatientSelect = typeof patients.$inferSelect;
export type PrescriptionInsert = typeof prescriptions.$inferInsert;
export type PrescriptionSelect = typeof prescriptions.$inferSelect;
export type TriageAssessmentSelect = typeof triageAssessments.$inferSelect;
export type ReferralSelect = typeof referrals.$inferSelect;
export type TeleconsultationSelect = typeof teleconsultations.$inferSelect;
export type OpdQueueSelect = typeof opdQueue.$inferSelect;
export type EssentialDrugSelect = typeof essentialDrugs.$inferSelect;
export type MaternalNcdRecordSelect = typeof maternalNcdRecords.$inferSelect;
