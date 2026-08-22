"use server";

import { memoryStore, isRealDatabaseConfigured, db } from "@/db";
import { teleconsultations, opdQueue, TeleconsultationSelect, OpdQueueSelect } from "@/db/schema";
import { revalidatePath } from "next/cache";

export async function getTeleconsultations(): Promise<TeleconsultationSelect[]> {
  try {
    if (isRealDatabaseConfigured && db) {
      const rows = await db.select().from(teleconsultations);
      if (rows && rows.length > 0) return rows;
    }
    return [...memoryStore.teleconsultations];
  } catch (err) {
    return memoryStore.teleconsultations;
  }
}

export async function getOpdQueue(): Promise<OpdQueueSelect[]> {
  try {
    if (isRealDatabaseConfigured && db) {
      const rows = await db.select().from(opdQueue);
      if (rows && rows.length > 0) return rows;
    }
    return [...memoryStore.opdQueue];
  } catch (err) {
    return memoryStore.opdQueue;
  }
}


export async function createTeleconsultationSession(data: {
  patientId: string;
  doctorName: string;
  specialty: string;
  ashaWorkerName: string;
}) {
  const tokenNumber = memoryStore.teleconsultations.length + 101;
  const newSession: TeleconsultationSelect = {
    id: crypto.randomUUID(),
    patientId: data.patientId,
    doctorName: data.doctorName,
    specialty: data.specialty,
    ashaWorkerName: data.ashaWorkerName,
    status: "SCHEDULED",
    tokenNumber,
    clinicalNotes: "",
    digitalRxGiven: false,
    durationMinutes: 0,
    createdAt: new Date(),
  };

  const queueEntry: OpdQueueSelect = {
    id: crypto.randomUUID(),
    patientId: data.patientId,
    tokenNumber,
    facilityName: "Telemedicine Hub Room 1",
    department: data.specialty,
    status: "WAITING",
    estimatedWaitMinutes: 12,
    createdAt: new Date(),
  };

  memoryStore.teleconsultations.unshift(newSession);
  memoryStore.opdQueue.push(queueEntry);

  if (isRealDatabaseConfigured && db) {
    try {
      await db.insert(teleconsultations).values(newSession);
      await db.insert(opdQueue).values(queueEntry);
    } catch (e) {
      console.warn("DB insert error for teleconsult session:", e);
    }
  }

  revalidatePath("/teleconsult");
  revalidatePath("/queue");
  return { success: true, session: newSession, queueEntry };
}

export async function completeTeleconsultation(id: string, clinicalNotes: string, digitalRxGiven: boolean) {
  const session = memoryStore.teleconsultations.find((s) => s.id === id);
  if (session) {
    session.status = "COMPLETED";
    session.clinicalNotes = clinicalNotes;
    session.digitalRxGiven = digitalRxGiven;
    session.durationMinutes = 15;
  }
  revalidatePath("/teleconsult");
  return { success: true };
}
