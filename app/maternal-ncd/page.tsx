import { getPatients } from "@/actions/patients";
import { getMaternalNcdRecords } from "@/actions/maternal-ncd";
import { Header } from "@/components/layout/header";
import { MaternalNcdClientView } from "./maternal-ncd-client";

export default async function MaternalNcdPage() {
  const patients = await getPatients();
  const records = await getMaternalNcdRecords();

  return (
    <div>
      <Header
        title="High-Risk Maternal, Child & Chronic NCD Care"
        subtitle="Longitudinal follow-up tracking for ANC/PNC mothers, severe malnutrition, hypertension, and diabetes"
      />
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <MaternalNcdClientView initialPatients={patients} initialRecords={records} />
      </div>
    </div>
  );
}
