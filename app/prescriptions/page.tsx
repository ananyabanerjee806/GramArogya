import { getPrescriptions } from "@/actions/prescriptions";
import { getPatients } from "@/actions/patients";
import { Header } from "@/components/layout/header";
import { PrescriptionsSearchClient } from "./prescriptions-search-client";

export default async function PrescriptionsPage() {
  const prescriptions = await getPrescriptions();
  const patients = await getPatients();

  return (
    <div>
      <Header
        title="Prescriptions Search & Archive"
        subtitle="Search by patient name, phone number, medicine name, or date range"
      />

      <div className="p-8 max-w-7xl mx-auto">
        <PrescriptionsSearchClient
          initialPrescriptions={prescriptions}
          patients={patients}
        />
      </div>
    </div>
  );
}
