'use server'

import { db } from '@/db';
import { referrals, careJourneys, careEvents } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function acceptReferral(referralId: string) {
  await db.update(referrals)
    .set({ 
      status: 'ACCEPTED',
      acceptanceTime: new Date()
    })
    .where(eq(referrals.id, referralId));

  const referral = await db.query.referrals.findFirst({
    where: eq(referrals.id, referralId)
  });

  if (referral) {
    // We should log this event in careEvents
    const activeJourney = await db.query.careJourneys.findFirst({
      where: eq(careJourneys.patientId, referral.patientId)
    });

    if (activeJourney) {
      await db.insert(careEvents).values({
        journeyId: activeJourney.id,
        patientId: referral.patientId,
        eventType: 'ACCEPTED',
        description: `Referral accepted by ${referral.toFacility}`,
        actor: 'Receiving Facility'
      });
    }
  }

  revalidatePath('/dashboard/care-command');
  revalidatePath('/dashboard/asha-action');
}

export async function rerouteReferral(referralId: string, newFacilityId: string, newFacilityName: string) {
  await db.update(referrals)
    .set({ 
      status: 'SEARCHING_FACILITY',
      toFacilityId: newFacilityId,
      toFacility: newFacilityName
    })
    .where(eq(referrals.id, referralId));

  revalidatePath('/dashboard/care-command');
}

export async function markPatientArrived(referralId: string) {
  await db.update(referrals)
    .set({ 
      status: 'ARRIVED',
      arrivalTime: new Date()
    })
    .where(eq(referrals.id, referralId));

  const referral = await db.query.referrals.findFirst({
    where: eq(referrals.id, referralId)
  });

  if (referral) {
    const activeJourney = await db.query.careJourneys.findFirst({
      where: eq(careJourneys.patientId, referral.patientId)
    });

    if (activeJourney) {
      await db.insert(careEvents).values({
        journeyId: activeJourney.id,
        patientId: referral.patientId,
        eventType: 'ARRIVED',
        description: `Patient arrived at ${referral.toFacility}`,
        actor: 'Receiving Facility'
      });
    }
  }

  revalidatePath('/dashboard/care-command');
}
