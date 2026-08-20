import { pgTable, text, integer, timestamp, uuid, boolean, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const patients = pgTable('patients', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  age: integer('age').notNull(),
  gender: text('gender').notNull(),
  phone: text('phone').notNull(),
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
  medicinesJson: jsonb('medicines_json').$type<{ name: string; dosage: string; frequency: string; isUncertain?: boolean }[]>().notNull(),
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

export const patientsRelations = relations(patients, ({ many }) => ({
  prescriptions: many(prescriptions),
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
