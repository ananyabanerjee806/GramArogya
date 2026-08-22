import { getPatients } from "@/actions/patients";
import { getTriageAssessments } from "@/actions/triage";
import { Header } from "@/components/layout/header";
import { TriageClientView } from "./triage-client";

export default async function TriagePage() {
  const patients = await getPatients();
  const assessments = await getTriageAssessments();

  return (
    <div>
      <Header
        title="AI Digital Triage & Risk Assessment"
        subtitle="Frontline ASHA/ANM symptom checker, automated risk stratification, and emergency escalation"
      />
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <TriageClientView initialPatients={patients} initialAssessments={assessments} />
      </div>
    </div>
  );
}
