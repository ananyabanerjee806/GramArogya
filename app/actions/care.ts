import { db } from '@/db';
import { careJourneys, careDebts } from '@/db/schema';

/**
 * Server action to fetch care journeys.
 * Replace the mock return with a real DB query when ready.
 */
export async function getCareJourneys() {
  // Example: return await db.select().from(careJourneys).all();
  return [] as any[]; // placeholder
}

/**
 * Server action to fetch care debts.
 * Replace the mock return with a real DB query when ready.
 */
export async function getCareDebts() {
  // Example: return await db.select().from(careDebts).all();
  return [] as any[]; // placeholder
}
