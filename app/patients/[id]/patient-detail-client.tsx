"use client";

import { useState } from "react";
import { Patient, Prescription } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PrescriptionCard } from "@/components/prescriptions/prescription-card";
import { PrescriptionDetailModal } from "@/components/prescriptions/prescription-detail-modal";
import { PatientModal } from "@/components/patients/patient-modal";
import { HealthAnalyticsChart } from "@/components/analytics/health-analytics-chart";
import { AbhaCardModal } from "@/components/abha/abha-card-modal";
import { RegionalTranslationSelector } from "@/components/clinical/regional-translation-selector";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  User, 
  Phone, 
  Calendar, 
  UploadCloud, 
  Edit, 
  Star, 
  FileText, 
  Pill, 
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Activity,
  Languages
} from "lucide-react";

interface PatientDetailClientProps {
  patient: Patient;
  initialPrescriptions: Prescription[];
}

export function PatientDetailClient({
  patient,
  initialPrescriptions,
}: PatientDetailClientProps) {
  const router = useRouter();
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [isAbhaModalOpen, setIsAbhaModalOpen] = useState(false);

  // Group: Important pinned at top, then regular
  const importantPrescriptions = initialPrescriptions.filter((p) => p.important);
  const regularPrescriptions = initialPrescriptions.filter((p) => !p.important);

  const handleOpenDetail = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setIsDetailModalOpen(true);
  };

  // Extract all prescribed medications for translation
  const allMedications = initialPrescriptions.flatMap((p) => p.medicinesJson || []);

  return (
    <div className="space-y-8">
      {/* Back Link & Patient Demographics Card */}
      <div className="space-y-4">
        <Link
          href="/patients"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-sky-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Patients Directory
        </Link>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-600 to-blue-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-sky-500/20">
              {patient.name.charAt(0).toUpperCase()}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {patient.name}
                </h1>
                <Badge variant="info" className="text-xs font-semibold">
                  {patient.age} years old
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {patient.gender}
                </Badge>
                
                {/* Official ABHA Badge */}
                <button
                  type="button"
                  onClick={() => setIsAbhaModalOpen(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-900 border border-orange-300 hover:bg-orange-200 transition-colors dark:bg-orange-950 dark:text-orange-200 cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
                  ABHA ID: 91-8472-XXXX
                </button>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{patient.phone}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Registered: {formatDate(patient.createdAt)}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-sky-600" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {initialPrescriptions.length} Records
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAbhaModalOpen(true)}
              className="gap-1.5 font-semibold text-xs border-orange-300 text-orange-800 hover:bg-orange-50 dark:text-orange-300 dark:border-orange-800"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
              View ABHA Card
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPatientModalOpen(true)}
              className="gap-1.5 font-semibold text-xs"
            >
              <Edit className="w-3.5 h-3.5" />
              Edit Details
            </Button>

            <Link href="/upload">
              <Button
                variant="primary"
                size="sm"
                className="gap-1.5 font-semibold shadow-sm text-xs"
              >
                <UploadCloud className="w-4 h-4" />
                Upload Prescription
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Feature 7: Patient Health Analytics & Chronic Disease Progression Tracker */}
      <HealthAnalyticsChart patientId={patient.id} patientName={patient.name} />

      {/* Feature 5: Multi-Language Regional Translation Engine */}
      {allMedications.length > 0 && (
        <RegionalTranslationSelector frequencies={allMedications} />
      )}

      {/* Pinned Important Prescriptions Section */}
      {importantPrescriptions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs dark:bg-amber-950 dark:text-amber-300">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Pinned Important Prescriptions
              </h2>
              <p className="text-xs text-slate-500">
                Critical medical records flagged by physician
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {importantPrescriptions.map((prescription) => (
              <PrescriptionCard
                key={prescription.id}
                prescription={prescription}
                patient={patient}
                onViewDetails={handleOpenDetail}
                onToggleStar={() => router.refresh()}
              />
            ))}
          </div>
        </div>
      )}

      {/* Chronological Prescription History Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-xs dark:bg-sky-950 dark:text-sky-300">
              <FileText className="w-4 h-4 text-sky-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Prescription History Timeline
              </h2>
              <p className="text-xs text-slate-500">
                All digitized medical consultations and prescription records
              </p>
            </div>
          </div>

          <Badge variant="outline" className="text-xs">
            {initialPrescriptions.length} Total Prescriptions
          </Badge>
        </div>

        {initialPrescriptions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center bg-white dark:border-slate-800 dark:bg-slate-900">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-3 dark:bg-sky-950">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No Prescriptions Digitized Yet
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              Scan and digitize the first handwritten prescription for {patient.name}.
            </p>
            <Link href="/upload">
              <Button variant="primary" size="sm" className="gap-1.5 font-semibold">
                <UploadCloud className="w-4 h-4" />
                Upload Prescription Image
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {regularPrescriptions.map((prescription) => (
              <PrescriptionCard
                key={prescription.id}
                prescription={prescription}
                patient={patient}
                onViewDetails={handleOpenDetail}
                onToggleStar={() => router.refresh()}
              />
            ))}
          </div>
        )}
      </div>

      {/* Prescription Detail Modal */}
      {selectedPrescription && (
        <PrescriptionDetailModal
          open={isDetailModalOpen}
          onOpenChange={setIsDetailModalOpen}
          prescription={selectedPrescription}
          patient={patient}
          onUpdated={() => router.refresh()}
        />
      )}

      {/* Edit Patient Modal */}
      <PatientModal
        open={isPatientModalOpen}
        onOpenChange={setIsPatientModalOpen}
        patient={patient}
        onSuccess={() => router.refresh()}
      />

      {/* Feature 9: ABHA Digital Card Modal */}
      <AbhaCardModal
        open={isAbhaModalOpen}
        onOpenChange={setIsAbhaModalOpen}
        patientName={patient.name}
        patientPhone={patient.phone}
      />
    </div>
  );
}
