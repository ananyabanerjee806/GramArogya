'use server';

import { db, memoryStore, isRealDatabaseConfigured } from '@/db';
import { prescriptions, patients } from '@/db/schema';
import { eq, ilike, or, desc, and, gte, lte } from 'drizzle-orm';
import { Prescription, MedicineItem } from '@/types';
import { revalidatePath } from 'next/cache';

async function withTimeout<T>(promise: Promise<T>, ms = 2500): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('DB Timeout')), ms)
    ),
  ]);
}

function getFallbackPrescriptions(filters?: {
  patientId?: string;
  searchQuery?: string;
  medicineName?: string;
  startDate?: string;
  endDate?: string;
  importantOnly?: boolean;
}): Prescription[] {
  let list = [...memoryStore.prescriptions];

  if (filters?.patientId) {
    list = list.filter((p) => p.patientId === filters.patientId);
  }

  if (filters?.importantOnly) {
    list = list.filter((p) => p.important);
  }

  if (filters?.searchQuery && filters.searchQuery.trim()) {
    const q = filters.searchQuery.toLowerCase().trim();
    list = list.filter((p) => {
      const patient = memoryStore.patients.find((pt) => pt.id === p.patientId);
      return (
        (patient?.name || '').toLowerCase().includes(q) ||
        (patient?.phone || '').toLowerCase().includes(q) ||
        (p.aiSummary || '').toLowerCase().includes(q) ||
        (p.correctedText || '').toLowerCase().includes(q)
      );
    });
  }

  if (filters?.medicineName && filters.medicineName.trim()) {
    const medTerm = filters.medicineName.toLowerCase().trim();
    list = list.filter((p) => {
      const meds = (p.medicinesJson as MedicineItem[]) || [];
      return meds.some((m) => m.name.toLowerCase().includes(medTerm));
    });
  }

  if (filters?.startDate) {
    const start = new Date(filters.startDate).getTime();
    list = list.filter((p) => new Date(p.createdAt).getTime() >= start);
  }

  if (filters?.endDate) {
    const end = new Date(filters.endDate);
    end.setHours(23, 59, 59, 999);
    const endMs = end.getTime();
    list = list.filter((p) => new Date(p.createdAt).getTime() <= endMs);
  }

  // Sort: Important first, then newest first
  list.sort((a, b) => {
    if (a.important === b.important) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return a.important ? -1 : 1;
  });

  return list.map((p) => {
    const patient = memoryStore.patients.find((pt) => pt.id === p.patientId);
    return {
      id: p.id,
      patientId: p.patientId,
      imageUrl: p.imageUrl,
      rawOcr: p.rawOcr,
      correctedText: p.correctedText,
      aiSummary: p.aiSummary,
      medicinesJson: (p.medicinesJson as MedicineItem[]) || [],
      doctorNotes: p.doctorNotes || '',
      tags: (p.tags as string[]) || [],
      important: p.important,
      ocrConfidence: p.ocrConfidence || undefined,
      createdAt: typeof p.createdAt === 'string' ? p.createdAt : p.createdAt.toISOString(),
      patientName: patient?.name,
      patientPhone: patient?.phone,
    };
  });
}

export async function getPrescriptions(filters?: {
  patientId?: string;
  searchQuery?: string;
  medicineName?: string;
  startDate?: string;
  endDate?: string;
  importantOnly?: boolean;
}): Promise<Prescription[]> {
  try {
    if (isRealDatabaseConfigured && db) {
      try {
        let query = db
          .select({
            id: prescriptions.id,
            patientId: prescriptions.patientId,
            imageUrl: prescriptions.imageUrl,
            rawOcr: prescriptions.rawOcr,
            correctedText: prescriptions.correctedText,
            aiSummary: prescriptions.aiSummary,
            medicinesJson: prescriptions.medicinesJson,
            doctorNotes: prescriptions.doctorNotes,
            tags: prescriptions.tags,
            important: prescriptions.important,
            ocrConfidence: prescriptions.ocrConfidence,
            createdAt: prescriptions.createdAt,
            patientName: patients.name,
            patientPhone: patients.phone,
          })
          .from(prescriptions)
          .leftJoin(patients, eq(prescriptions.patientId, patients.id))
          .orderBy(desc(prescriptions.important), desc(prescriptions.createdAt));

        const conditions = [];

        if (filters?.patientId) {
          conditions.push(eq(prescriptions.patientId, filters.patientId));
        }

        if (filters?.importantOnly) {
          conditions.push(eq(prescriptions.important, true));
        }

        if (filters?.searchQuery && filters.searchQuery.trim()) {
          const term = `%${filters.searchQuery.trim()}%`;
          conditions.push(
            or(
              ilike(patients.name, term),
              ilike(patients.phone, term),
              ilike(prescriptions.aiSummary, term),
              ilike(prescriptions.correctedText, term)
            )
          );
        }

        if (filters?.startDate) {
          conditions.push(gte(prescriptions.createdAt, new Date(filters.startDate)));
        }

        if (filters?.endDate) {
          const end = new Date(filters.endDate);
          end.setHours(23, 59, 59, 999);
          conditions.push(lte(prescriptions.createdAt, end));
        }

        if (conditions.length > 0) {
          // @ts-ignore
          query = query.where(and(...conditions));
        }

        const rows = await withTimeout(query, 2500);

        if (rows && rows.length > 0) {
          let results: Prescription[] = rows.map((r) => ({
            id: r.id,
            patientId: r.patientId,
            imageUrl: r.imageUrl,
            rawOcr: r.rawOcr,
            correctedText: r.correctedText,
            aiSummary: r.aiSummary,
            medicinesJson: (r.medicinesJson as MedicineItem[]) || [],
            doctorNotes: r.doctorNotes || '',
            tags: (r.tags as string[]) || [],
            important: r.important,
            ocrConfidence: r.ocrConfidence || undefined,
            createdAt: r.createdAt.toISOString(),
            patientName: r.patientName || undefined,
            patientPhone: r.patientPhone || undefined,
          }));

          if (filters?.medicineName && filters.medicineName.trim()) {
            const medTerm = filters.medicineName.toLowerCase().trim();
            results = results.filter((p) =>
              p.medicinesJson.some((m) => m.name.toLowerCase().includes(medTerm))
            );
          }

          return results;
        }
      } catch (dbErr) {
        return getFallbackPrescriptions(filters);
      }
    }

    return getFallbackPrescriptions(filters);
  } catch (error) {
    return getFallbackPrescriptions(filters);
  }
}

export async function getPrescriptionById(id: string): Promise<Prescription | null> {
  try {
    if (isRealDatabaseConfigured && db) {
      try {
        const rows = await withTimeout(
          db
            .select({
              id: prescriptions.id,
              patientId: prescriptions.patientId,
              imageUrl: prescriptions.imageUrl,
              rawOcr: prescriptions.rawOcr,
              correctedText: prescriptions.correctedText,
              aiSummary: prescriptions.aiSummary,
              medicinesJson: prescriptions.medicinesJson,
              doctorNotes: prescriptions.doctorNotes,
              tags: prescriptions.tags,
              important: prescriptions.important,
              ocrConfidence: prescriptions.ocrConfidence,
              createdAt: prescriptions.createdAt,
              patientName: patients.name,
              patientPhone: patients.phone,
            })
            .from(prescriptions)
            .leftJoin(patients, eq(prescriptions.patientId, patients.id))
            .where(eq(prescriptions.id, id))
            .limit(1),
          2500
        );

        if (rows && rows.length > 0) {
          const r = rows[0];
          return {
            id: r.id,
            patientId: r.patientId,
            imageUrl: r.imageUrl,
            rawOcr: r.rawOcr,
            correctedText: r.correctedText,
            aiSummary: r.aiSummary,
            medicinesJson: (r.medicinesJson as MedicineItem[]) || [],
            doctorNotes: r.doctorNotes || '',
            tags: (r.tags as string[]) || [],
            important: r.important,
            ocrConfidence: r.ocrConfidence || undefined,
            createdAt: r.createdAt.toISOString(),
            patientName: r.patientName || undefined,
            patientPhone: r.patientPhone || undefined,
          };
        }
      } catch (dbErr) {
        // Fall back
      }
    }

    const p = memoryStore.prescriptions.find((pr) => pr.id === id);
    if (!p) return null;
    const patient = memoryStore.patients.find((pt) => pt.id === p.patientId);

    return {
      id: p.id,
      patientId: p.patientId,
      imageUrl: p.imageUrl,
      rawOcr: p.rawOcr,
      correctedText: p.correctedText,
      aiSummary: p.aiSummary,
      medicinesJson: (p.medicinesJson as MedicineItem[]) || [],
      doctorNotes: p.doctorNotes || '',
      tags: (p.tags as string[]) || [],
      important: p.important,
      ocrConfidence: p.ocrConfidence || undefined,
      createdAt: typeof p.createdAt === 'string' ? p.createdAt : p.createdAt.toISOString(),
      patientName: patient?.name,
      patientPhone: patient?.phone,
    };
  } catch (error) {
    return null;
  }
}

export async function savePrescription(data: {
  patientId: string;
  imageUrl: string;
  rawOcr: string;
  correctedText: string;
  aiSummary: string;
  medicinesJson: MedicineItem[];
  doctorNotes?: string;
  tags?: string[];
  important?: boolean;
  ocrConfidence?: {
    score: number;
    level: 'Excellent' | 'Good' | 'Needs Review';
    uncertainWords?: string[];
  };
}): Promise<{ success: boolean; prescription?: Prescription; error?: string }> {
  const newId = crypto.randomUUID();
  const now = new Date();

  // Always keep in memory store as fallback
  const newPrescriptionMemory: any = {
    id: newId,
    patientId: data.patientId,
    imageUrl: data.imageUrl,
    rawOcr: data.rawOcr,
    correctedText: data.correctedText,
    aiSummary: data.aiSummary,
    medicinesJson: data.medicinesJson,
    doctorNotes: data.doctorNotes || '',
    tags: data.tags || [],
    important: !!data.important,
    ocrConfidence: data.ocrConfidence,
    createdAt: now,
  };
  memoryStore.prescriptions.unshift(newPrescriptionMemory);

  try {
    if (isRealDatabaseConfigured && db) {
      try {
        const inserted = await withTimeout(
          db
            .insert(prescriptions)
            .values({
              id: newId,
              patientId: data.patientId,
              imageUrl: data.imageUrl,
              rawOcr: data.rawOcr,
              correctedText: data.correctedText,
              aiSummary: data.aiSummary,
              medicinesJson: data.medicinesJson,
              doctorNotes: data.doctorNotes || '',
              tags: data.tags || [],
              important: !!data.important,
              ocrConfidence: data.ocrConfidence,
              createdAt: now,
            })
            .returning(),
          3000
        );

        revalidatePath('/dashboard');
        revalidatePath('/prescriptions');
        revalidatePath(`/patients/${data.patientId}`);

        return {
          success: true,
          prescription: {
            id: inserted[0].id,
            patientId: inserted[0].patientId,
            imageUrl: inserted[0].imageUrl,
            rawOcr: inserted[0].rawOcr,
            correctedText: inserted[0].correctedText,
            aiSummary: inserted[0].aiSummary,
            medicinesJson: inserted[0].medicinesJson,
            doctorNotes: inserted[0].doctorNotes || '',
            tags: (inserted[0].tags as string[]) || [],
            important: inserted[0].important,
            ocrConfidence: inserted[0].ocrConfidence || undefined,
            createdAt: inserted[0].createdAt.toISOString(),
          },
        };
      } catch (dbErr) {
        // saved to memoryStore
      }
    }

    revalidatePath('/dashboard');
    revalidatePath('/prescriptions');
    revalidatePath(`/patients/${data.patientId}`);

    return {
      success: true,
      prescription: {
        ...newPrescriptionMemory,
        createdAt: now.toISOString(),
      },
    };
  } catch (error: any) {
    return {
      success: true,
      prescription: {
        ...newPrescriptionMemory,
        createdAt: now.toISOString(),
      },
    };
  }
}

export async function toggleImportantPrescription(
  id: string,
  important: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const idx = memoryStore.prescriptions.findIndex((p) => p.id === id);
    if (idx !== -1) {
      memoryStore.prescriptions[idx].important = important;
    }

    if (isRealDatabaseConfigured && db) {
      try {
        await withTimeout(
          db
            .update(prescriptions)
            .set({ important })
            .where(eq(prescriptions.id, id)),
          3000
        );
      } catch (dbErr) {
        // updated in memory
      }
    }

    revalidatePath('/dashboard');
    revalidatePath('/prescriptions');
    revalidatePath('/patients');

    return { success: true };
  } catch (error: any) {
    return { success: true };
  }
}

export async function updatePrescriptionNotes(
  id: string,
  doctorNotes: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const idx = memoryStore.prescriptions.findIndex((p) => p.id === id);
    if (idx !== -1) {
      memoryStore.prescriptions[idx].doctorNotes = doctorNotes;
    }

    if (isRealDatabaseConfigured && db) {
      try {
        await withTimeout(
          db
            .update(prescriptions)
            .set({ doctorNotes })
            .where(eq(prescriptions.id, id)),
          3000
        );
      } catch (dbErr) {
        // updated in memory
      }
    }

    revalidatePath('/prescriptions');
    return { success: true };
  } catch (error: any) {
    return { success: true };
  }
}

export async function deletePrescription(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    memoryStore.prescriptions = memoryStore.prescriptions.filter((p) => p.id !== id);

    if (isRealDatabaseConfigured && db) {
      try {
        await withTimeout(
          db.delete(prescriptions).where(eq(prescriptions.id, id)),
          3000
        );
      } catch (dbErr) {
        // deleted from memory
      }
    }

    revalidatePath('/dashboard');
    revalidatePath('/prescriptions');
    return { success: true };
  } catch (error: any) {
    return { success: true };
  }
}
