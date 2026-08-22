import { getPatients } from "@/actions/patients";
import { getReferrals } from "@/actions/referrals";
import { Header } from "@/components/layout/header";
import { ReferralsClientView } from "./referrals-client";

export default async function ReferralsPage() {
  const patients = await getPatients();
  const referrals = await getReferrals();

  return (
    <div>
      <Header
        title="Multi-Tier Care Continuum & Referral Tracking"
        subtitle="End-to-end patient journey across Sub-Centres, PHCs, Rural Hospitals, and District Hospitals with 108 Ambulance Dispatch"
      />
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <ReferralsClientView initialPatients={patients} initialReferrals={referrals} />
      </div>
    </div>
  );
}
