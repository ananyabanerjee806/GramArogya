import { getPatientById } from "@/actions/patients";
import { getPrescriptions } from "@/actions/prescriptions";
import { Header } from "@/components/layout/header";
import { notFound } from "next/navigation";
import { PatientDetailClient } from "./patient-detail-client";

export default async function PatientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const patient = await getPatientById(id);

  if (!patient) {
    notFound();
  }

  const prescriptions = await getPrescriptions({ patientId: id });

  return (
    <div>
      <Header
        title={`Patient Record: ${patient.name}`}
        subtitle={`${patient.age} yrs • ${patient.gender} • ${patient.phone}`}
      />

      <div className="p-8 max-w-7xl mx-auto">
        <PatientDetailClient patient={patient} initialPrescriptions={prescriptions} />
      </div>
    </div>
  );
}
