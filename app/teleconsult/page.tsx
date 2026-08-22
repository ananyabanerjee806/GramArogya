import { getPatients } from "@/actions/patients";
import { getTeleconsultations, getOpdQueue } from "@/actions/teleconsult";
import { Header } from "@/components/layout/header";
import { TeleconsultClientView } from "./teleconsult-client";

export default async function TeleconsultPage() {
  const patients = await getPatients();
  const teleconsultations = await getTeleconsultations();
  const queue = await getOpdQueue();

  return (
    <div>
      <Header
        title="Assisted Teleconsultation Suite"
        subtitle="Low-bandwidth video link connecting Sub-Centre ASHA workers, rural patients, and specialist doctors"
      />
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <TeleconsultClientView
          initialPatients={patients}
          initialSessions={teleconsultations}
          initialQueue={queue}
        />
      </div>
    </div>
  );
}
