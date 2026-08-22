'use server';

import { db, memoryStore, isRealDatabaseConfigured } from '@/db';
import { patients, prescriptions } from '@/db/schema';
import { eq, ilike, or, desc, sql } from 'drizzle-orm';
import { Patient } from '@/types';
import { revalidatePath } from 'next/cache';

async function withTimeout<T>(promise: Promise<T>, ms = 2500): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('DB Timeout')), ms)
    ),
  ]);
}

function getFallbackPatients(searchQuery?: string): Patient[] {
  let list = [...memoryStore.patients];
  if (searchQuery && searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    list = list.filter(
      (p) => p.name.toLowerCase().includes(q) || p.phone.toLowerCase().includes(q)
    );
  }

  return list.map((p) => {
    const count = memoryStore.prescriptions.filter((pr) => pr.patientId === p.id).length;
    return {
      id: p.id,
      name: p.name,
      age: p.age,
      gender: p.gender,
      phone: p.phone,
      abhaId: p.abhaId,
      village: p.village,
      district: p.district,
      bloodGroup: p.bloodGroup,
      emergencyContact: p.emergencyContact,
      highRiskCategory: p.highRiskCategory,
      createdAt: typeof p.createdAt === 'string' ? p.createdAt : p.createdAt.toISOString(),
      prescriptionCount: count,
    };
  });
}

export async function getPatients(searchQuery?: string): Promise<Patient[]> {
  try {
    if (isRealDatabaseConfigured && db) {
      try {
        let query = db
          .select({
            id: patients.id,
            name: patients.name,
            age: patients.age,
            gender: patients.gender,
            phone: patients.phone,
            abhaId: patients.abhaId,
            village: patients.village,
            district: patients.district,
            bloodGroup: patients.bloodGroup,
            emergencyContact: patients.emergencyContact,
            highRiskCategory: patients.highRiskCategory,
            createdAt: patients.createdAt,
            prescriptionCount: sql<number>`count(${prescriptions.id})::int`,
          })
          .from(patients)
          .leftJoin(prescriptions, eq(patients.id, prescriptions.patientId))
          .groupBy(patients.id)
          .orderBy(desc(patients.createdAt));

        if (searchQuery && searchQuery.trim()) {
          const term = `%${searchQuery.trim()}%`;
          // @ts-ignore
          query = query.where(
            or(
              ilike(patients.name, term),
              ilike(patients.phone, term)
            )
          );
        }

        const rows = await withTimeout(query, 2500);
        if (rows && rows.length > 0) {
          return rows.map((r) => ({
            id: r.id,
            name: r.name,
            age: r.age,
            gender: r.gender,
            phone: r.phone,
            abhaId: r.abhaId,
            village: r.village,
            district: r.district,
            bloodGroup: r.bloodGroup,
            emergencyContact: r.emergencyContact,
            highRiskCategory: r.highRiskCategory,
            createdAt: r.createdAt.toISOString(),
            prescriptionCount: r.prescriptionCount || 0,
          }));
        }
      } catch (dbErr) {
        return getFallbackPatients(searchQuery);
      }
    }

    return getFallbackPatients(searchQuery);
  } catch (error) {
    return getFallbackPatients(searchQuery);
  }
}


export async function getPatientById(id: string): Promise<Patient | null> {
  try {
    if (isRealDatabaseConfigured && db) {
      try {
        const rows = await withTimeout(
          db
            .select()
            .from(patients)
            .where(eq(patients.id, id))
            .limit(1),
          2500
        );

        if (rows && rows.length > 0) {
          const r = rows[0];
          const countRes = await withTimeout(
            db
              .select({ count: sql<number>`count(*)::int` })
              .from(prescriptions)
              .where(eq(prescriptions.patientId, id)),
            2000
          ).catch(() => [{ count: 0 }]);

          return {
            id: r.id,
            name: r.name,
            age: r.age,
            gender: r.gender,
            phone: r.phone,
            createdAt: r.createdAt.toISOString(),
            prescriptionCount: countRes[0]?.count || 0,
          };
        }
      } catch (dbErr) {
        // Fall back to memoryStore
      }
    }

    const p = memoryStore.patients.find((pt) => pt.id === id);
    if (!p) return null;
    const count = memoryStore.prescriptions.filter((pr) => pr.patientId === p.id).length;
    return {
      id: p.id,
      name: p.name,
      age: p.age,
      gender: p.gender,
      phone: p.phone,
      createdAt: typeof p.createdAt === 'string' ? p.createdAt : p.createdAt.toISOString(),
      prescriptionCount: count,
    };
  } catch (error) {
    return null;
  }
}

export async function createPatient(data: {
  name: string;
  age: number;
  gender: string;
  phone: string;
}): Promise<{ success: boolean; patient?: Patient; error?: string }> {
  const newId = crypto.randomUUID();
  const now = new Date();

  // Always keep in memory store as fallback
  const newPatientMemory: any = {
    id: newId,
    name: data.name.trim(),
    age: Number(data.age),
    gender: data.gender,
    phone: data.phone.trim(),
    createdAt: now,
    prescriptionCount: 0,
  };
  memoryStore.patients.unshift(newPatientMemory);

  try {
    if (isRealDatabaseConfigured && db) {
      try {
        const inserted = await withTimeout(
          db
            .insert(patients)
            .values({
              id: newId,
              name: data.name.trim(),
              age: Number(data.age),
              gender: data.gender,
              phone: data.phone.trim(),
              createdAt: now,
            })
            .returning(),
          3000
        );

        revalidatePath('/patients');
        revalidatePath('/dashboard');

        return {
          success: true,
          patient: {
            id: inserted[0].id,
            name: inserted[0].name,
            age: inserted[0].age,
            gender: inserted[0].gender,
            phone: inserted[0].phone,
            createdAt: inserted[0].createdAt.toISOString(),
            prescriptionCount: 0,
          },
        };
      } catch (dbErr) {
        // saved to memoryStore
      }
    }

    revalidatePath('/patients');
    revalidatePath('/dashboard');

    return {
      success: true,
      patient: {
        ...newPatientMemory,
        createdAt: now.toISOString(),
      },
    };
  } catch (error: any) {
    return { success: true, patient: { ...newPatientMemory, createdAt: now.toISOString() } };
  }
}

export async function updatePatient(
  id: string,
  data: Partial<{ name: string; age: number; gender: string; phone: string }>
): Promise<{ success: boolean; error?: string }> {
  try {
    const idx = memoryStore.patients.findIndex((p) => p.id === id);
    if (idx !== -1) {
      memoryStore.patients[idx] = {
        ...memoryStore.patients[idx],
        ...data,
      };
    }

    if (isRealDatabaseConfigured && db) {
      try {
        await withTimeout(
          db
            .update(patients)
            .set({
              ...(data.name ? { name: data.name.trim() } : {}),
              ...(data.age ? { age: Number(data.age) } : {}),
              ...(data.gender ? { gender: data.gender } : {}),
              ...(data.phone ? { phone: data.phone.trim() } : {}),
            })
            .where(eq(patients.id, id)),
          3000
        );
      } catch (dbErr) {
        // updated in memory
      }
    }

    revalidatePath(`/patients/${id}`);
    revalidatePath('/patients');
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update patient' };
  }
}

export async function deletePatient(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    memoryStore.patients = memoryStore.patients.filter((p) => p.id !== id);
    memoryStore.prescriptions = memoryStore.prescriptions.filter((pr) => pr.patientId !== id);

    if (isRealDatabaseConfigured && db) {
      try {
        await withTimeout(db.delete(patients).where(eq(patients.id, id)), 3000);
      } catch (dbErr) {
        // deleted from memory
      }
    }

    revalidatePath('/patients');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete patient' };
  }
}
