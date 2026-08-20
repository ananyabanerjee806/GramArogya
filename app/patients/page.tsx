import { getPatients } from "@/actions/patients";
import { Header } from "@/components/layout/header";
import { PatientsClientView } from "./patients-client";

export default async function PatientsPage() {
  const patients = await getPatients();

  return (
    <div>
      <Header
        title="Patients Directory"
        subtitle="Search, register, and manage patient medical records"
      />

      <div className="p-8 max-w-7xl mx-auto">
        <PatientsClientView initialPatients={patients} />
      </div>
    </div>
  );
}
