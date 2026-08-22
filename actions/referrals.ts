"use server";

import { memoryStore, isRealDatabaseConfigured, db } from "@/db";
import { referrals, ReferralSelect } from "@/db/schema";
import { revalidatePath } from "next/cache";

export async function getReferrals(): Promise<ReferralSelect[]> {
  try {
    if (isRealDatabaseConfigured && db) {
      const rows = await db.select().from(referrals);
      if (rows && rows.length > 0) return rows;
    }
    return [...memoryStore.referrals];
  } catch (err) {
    return memoryStore.referrals;
  }
}


export async function createReferral(data: {
  patientId: string;
  fromFacility: string;
  toFacility: string;
  urgency: "EMERGENCY_108" | "URGENT_24H" | "ROUTINE";
  reason: string;
  transportAssigned?: string;
  escortWorker?: string;
  ambulanceTrackingId?: string;
}) {
  const newReferral: ReferralSelect = {
    id: crypto.randomUUID(),
    patientId: data.patientId,
    fromFacility: data.fromFacility,
    toFacility: data.toFacility,
    urgency: data.urgency,
    reason: data.reason,
    transportAssigned: data.transportAssigned || (data.urgency === "EMERGENCY_108" ? "108 Ambulance Dispatch" : "Self-Arranged"),
    status: data.urgency === "EMERGENCY_108" ? "IN_TRANSIT" : "INITIATED",
    escortWorker: data.escortWorker || "Sunita Tai (ASHA)",
    ambulanceTrackingId: data.ambulanceTrackingId || (data.urgency === "EMERGENCY_108" ? `GPS-108-MH-${Math.floor(1000 + Math.random() * 9000)}` : null),
    createdAt: new Date(),
  };

  memoryStore.referrals.unshift(newReferral);

  if (isRealDatabaseConfigured && db) {
    try {
      await db.insert(referrals).values(newReferral);
    } catch (e) {
      console.warn("DB insert error for referral, stored in memoryStore:", e);
    }
  }

  revalidatePath("/referrals");
  revalidatePath("/dashboard");
  return { success: true, referral: newReferral };
}

export async function updateReferralStatus(referralId: string, status: "INITIATED" | "IN_TRANSIT" | "ADMITTED" | "COMPLETED") {
  const ref = memoryStore.referrals.find((r) => r.id === referralId);
  if (ref) {
    ref.status = status;
  }
  revalidatePath("/referrals");
  return { success: true };
}
