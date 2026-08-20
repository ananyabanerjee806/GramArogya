"use client";

import { useState } from "react";
import { Prescription, Patient } from "@/types";
import { PrescriptionCard } from "@/components/prescriptions/prescription-card";
import { PrescriptionDetailModal } from "@/components/prescriptions/prescription-detail-modal";
import { PatientModal } from "@/components/patients/patient-modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { 
  FileText, 
  UploadCloud, 
  Users, 
  Search, 
  Sparkles, 
  ChevronRight, 
  UserPlus, 
  Filter 
} from "lucide-react";
import { useRouter } from "next/navigation";

interface DashboardClientViewProps {
  initialPrescriptions: Prescription[];
  initialPatients: Patient[];
}

export function DashboardClientView({
  initialPrescriptions,
  initialPatients,
}: DashboardClientViewProps) {
  const router = useRouter();
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");

  const filteredPrescriptions = initialPrescriptions.filter((p) => {
    if (!filterQuery.trim()) return true;
    const q = filterQuery.toLowerCase();
    return (
      (p.patientName || "").toLowerCase().includes(q) ||
      (p.aiSummary || "").toLowerCase().includes(q) ||
      (p.tags || []).some((t) => t.toLowerCase().includes(q)) ||
      (p.medicinesJson || []).some((m) => m.name.toLowerCase().includes(q))
    );
  });

  const handleOpenDetail = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setIsDetailModalOpen(true);
  };

  const getPatientForPrescription = (patientId: string) => {
    return initialPatients.find((p) => p.id === patientId) || null;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-sky-600" />
            Recent Digitized Prescriptions
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified handwritten records stored in the clinical archive
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <Input
              placeholder="Quick search prescription..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="pl-9 h-9 w-60 text-xs rounded-xl"
            />
          </div>

          <Link href="/prescriptions">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs font-semibold">
              <Filter className="w-3.5 h-3.5" />
              Advanced Search
            </Button>
          </Link>
        </div>
      </div>

      {/* Prescriptions Grid */}
      {filteredPrescriptions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center bg-white/50 dark:bg-slate-900/50 dark:border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-3 dark:bg-sky-950 dark:text-sky-400">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No Prescriptions Found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            Upload your first handwritten prescription image to start digitizing patient medical records.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/upload">
              <Button variant="primary" size="sm" className="gap-1.5 font-semibold">
                <UploadCloud className="w-4 h-4" />
                Upload Prescription
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPatientModalOpen(true)}
              className="gap-1.5 font-semibold"
            >
              <UserPlus className="w-4 h-4 text-sky-600" />
              Add Patient
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPrescriptions.map((prescription) => (
            <PrescriptionCard
              key={prescription.id}
              prescription={prescription}
              patient={getPatientForPrescription(prescription.patientId)}
              onViewDetails={handleOpenDetail}
              onToggleStar={() => router.refresh()}
            />
          ))}
        </div>
      )}

      {/* Prescription Detail Modal */}
      {selectedPrescription && (
        <PrescriptionDetailModal
          open={isDetailModalOpen}
          onOpenChange={setIsDetailModalOpen}
          prescription={selectedPrescription}
          patient={getPatientForPrescription(selectedPrescription.patientId)}
          onUpdated={() => {
            router.refresh();
          }}
        />
      )}

      {/* Patient Register Modal */}
      <PatientModal
        open={isPatientModalOpen}
        onOpenChange={setIsPatientModalOpen}
        onSuccess={() => {
          router.refresh();
        }}
      />
    </div>
  );
}
