"use server";

import { memoryStore, isRealDatabaseConfigured, db } from "@/db";
import { maternalNcdRecords, MaternalNcdRecordSelect } from "@/db/schema";
import { revalidatePath } from "next/cache";

export async function getMaternalNcdRecords(): Promise<MaternalNcdRecordSelect[]> {
  try {
    if (isRealDatabaseConfigured && db) {
      const rows = await db.select().from(maternalNcdRecords);
      if (rows && rows.length > 0) return rows;
    }
    return [...memoryStore.maternalNcdRecords];
  } catch (err) {
    return memoryStore.maternalNcdRecords;
  }
}


export async function createMaternalNcdRecord(data: {
  patientId: string;
  recordType: "ANC_MATERNAL" | "PNC_INFANT" | "CHRONIC_NCD";
  trimesterOrStage: string;
  hemoglobin?: string;
  bloodPressure?: string;
  bloodSugar?: string;
  highRiskAlert: boolean;
  riskFactors: string[];
  nextFollowUpDays: number;
  ashaAssigned?: string;
}) {
  const newRecord: MaternalNcdRecordSelect = {
    id: crypto.randomUUID(),
    patientId: data.patientId,
    recordType: data.recordType,
    trimesterOrStage: data.trimesterOrStage,
    hemoglobin: data.hemoglobin || null,
    bloodPressure: data.bloodPressure || null,
    bloodSugar: data.bloodSugar || null,
    highRiskAlert: data.highRiskAlert,
    riskFactors: data.riskFactors,
    nextFollowUpDate: new Date(Date.now() + data.nextFollowUpDays * 24 * 60 * 60 * 1000),
    ashaAssigned: data.ashaAssigned || "Sunita Tai (ASHA)",
    createdAt: new Date(),
  };

  memoryStore.maternalNcdRecords.unshift(newRecord);

  if (isRealDatabaseConfigured && db) {
    try {
      await db.insert(maternalNcdRecords).values(newRecord);
    } catch (e) {
      console.warn("DB insert error for maternal/ncd record:", e);
    }
  }

  revalidatePath("/maternal-ncd");
  revalidatePath("/dashboard");
  return { success: true, record: newRecord };
}
