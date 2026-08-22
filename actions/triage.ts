"use server";

import { memoryStore, isRealDatabaseConfigured, db } from "@/db";
import { triageAssessments, TriageAssessmentSelect } from "@/db/schema";
import { revalidatePath } from "next/cache";

export async function getTriageAssessments(): Promise<TriageAssessmentSelect[]> {
  try {
    if (isRealDatabaseConfigured && db) {
      const rows = await db.select().from(triageAssessments);
      if (rows && rows.length > 0) return rows;
    }
    return [...memoryStore.triageAssessments];
  } catch (err) {
    return memoryStore.triageAssessments;
  }
}


export async function createTriageAssessment(data: {
  patientId: string;
  triageLevel: "RED" | "YELLOW" | "GREEN";
  chiefComplaints: string[];
  vitals: {
    bpSystolic?: number;
    bpDiastolic?: number;
    spo2?: number;
    pulse?: number;
    temperature?: number;
    bloodSugar?: number;
  };
  aiRiskScore: number;
  aiRecommendations: string;
  frontlineWorkerName?: string;
  facilityTier?: string;
}) {
  const newRecord: TriageAssessmentSelect = {
    id: crypto.randomUUID(),
    patientId: data.patientId,
    triageLevel: data.triageLevel,
    chiefComplaints: data.chiefComplaints,
    vitals: data.vitals,
    aiRiskScore: data.aiRiskScore,
    aiRecommendations: data.aiRecommendations,
    frontlineWorkerName: data.frontlineWorkerName || "Sunita Tai (ASHA)",
    facilityTier: data.facilityTier || "Sub-Centre / Ayushman Arogya Mandir",
    createdAt: new Date(),
  };

  memoryStore.triageAssessments.unshift(newRecord);

  if (isRealDatabaseConfigured && db) {
    try {
      await db.insert(triageAssessments).values(newRecord);
    } catch (e) {
      console.warn("DB insert error for triage, stored in memoryStore:", e);
    }
  }

  revalidatePath("/triage");
  revalidatePath("/dashboard");
  return { success: true, assessment: newRecord };
}
