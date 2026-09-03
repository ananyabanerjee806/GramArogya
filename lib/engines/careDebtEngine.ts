import { CareDebtSelect, ReferralSelect, PatientSelect } from '@/db/schema';

export interface CareDebtCreationRequest {
  patientId: string;
  type: 'MISSED_REFERRAL' | 'MISSED_FOLLOWUP' | 'TEST_NOT_DONE';
  clinicalSeverity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  expectedCompletionDate: Date;
  responsiblePerson?: string;
  responsibleFacility?: string;
  recommendedAction?: string;
}

// Mock Engine implementation for Care Debts
export function evaluateCareDebts(
  careDebts: CareDebtSelect[],
  referrals: ReferralSelect[],
  currentDate: Date = new Date()
): {
  activeDebts: CareDebtSelect[];
  newDebtsToCreate: CareDebtCreationRequest[];
  debtsToClose: string[]; // IDs of debts that should be closed
} {
  const newDebtsToCreate: CareDebtCreationRequest[] = [];
  const debtsToClose: string[] = [];
  const activeDebts = careDebts.filter(d => d.status === 'OPEN');

  // Example Logic 1: Check for missed referrals
  // If a referral was accepted but the patient didn't arrive within 6 hours, create a Care Debt.
  const activeReferrals = referrals.filter(r => 
    r.status === 'ACCEPTED' || r.status === 'IN_TRANSIT'
  );

  for (const referral of activeReferrals) {
    if (referral.acceptanceTime) {
      const hoursSinceAcceptance = (currentDate.getTime() - new Date(referral.acceptanceTime).getTime()) / (1000 * 60 * 60);
      
      if (hoursSinceAcceptance > 6) {
        // Create debt if one doesn't exist for this patient's missed referral
        const existingDebt = activeDebts.find(d => 
          d.patientId === referral.patientId && 
          d.type === 'MISSED_REFERRAL'
        );

        if (!existingDebt) {
          newDebtsToCreate.push({
            patientId: referral.patientId,
            type: 'MISSED_REFERRAL',
            clinicalSeverity: referral.urgency === 'EMERGENCY_108' ? 'CRITICAL' : 'HIGH',
            expectedCompletionDate: new Date(referral.acceptanceTime.getTime() + (6 * 60 * 60 * 1000)),
            responsiblePerson: 'ASHA Worker',
            responsibleFacility: referral.fromFacility,
            recommendedAction: 'Contact patient / arrange transport immediately'
          });
        }
      }
    }
  }

  // Logic to close debts
  for (const debt of activeDebts) {
    if (debt.type === 'MISSED_REFERRAL') {
      const relatedReferral = referrals.find(r => r.patientId === debt.patientId && (r.status === 'ARRIVED' || r.status === 'COMPLETED'));
      if (relatedReferral) {
        debtsToClose.push(debt.id);
      }
    }
  }

  return {
    activeDebts,
    newDebtsToCreate,
    debtsToClose
  };
}

export function getCareDebtStatus(debt: CareDebtSelect, currentDate: Date = new Date()): 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED' {
  if (debt.status === 'CLOSED') return 'GREEN';

  const timeDiffHours = (currentDate.getTime() - new Date(debt.expectedCompletionDate).getTime()) / (1000 * 60 * 60);

  if (timeDiffHours < 0) return 'GREEN'; // Not due yet
  if (timeDiffHours < 24) return 'YELLOW'; // Approaching or recently due
  if (timeDiffHours < 48) return 'ORANGE'; // Overdue
  return 'RED'; // Clinically dangerous delay
}
