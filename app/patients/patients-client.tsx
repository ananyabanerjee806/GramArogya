"use client";

import { useState } from "react";
import { Patient } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PatientModal } from "@/components/patients/patient-modal";
import { deletePatient } from "@/actions/patients";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  Calendar, 
  FileText, 
  Edit, 
  Trash2, 
  ChevronRight, 
  UserPlus, 
  UploadCloud 
} from "lucide-react";

interface PatientsClientViewProps {
  initialPatients: Patient[];
}

export function PatientsClientView({
  initialPatients,
}: PatientsClientViewProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  const filteredPatients = initialPatients.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      p.name.toLowerCase().includes(q) ||
      p.phone.toLowerCase().includes(q) ||
      p.gender.toLowerCase().includes(q)
    );
  });

  const handleEdit = (e: React.MouseEvent, patient: Patient) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingPatient(patient);
    setIsModalOpen(true);
  };

  const handleDelete = async (e: React.MouseEvent, patientId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this patient and all their prescription records?")) {
      return;
    }

    setIsDeletingId(patientId);
    try {
      const res = await deletePatient(patientId);
      if (res.success) {
        toast.success("Patient deleted successfully");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to delete patient");
      }
    } finally {
      setIsDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <Input
            placeholder="Search patients by name, phone, or gender..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 rounded-xl"
          />
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="primary"
            onClick={() => {
              setEditingPatient(null);
              setIsModalOpen(true);
            }}
            className="gap-2 font-semibold shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            Register Patient
          </Button>
        </div>
      </div>

      {/* Patient Cards / Table */}
      {filteredPatients.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center bg-white/50 dark:bg-slate-900/50 dark:border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-3 dark:bg-sky-950 dark:text-sky-400">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No Patients Found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            {searchQuery
              ? `No patients matching "${searchQuery}". Try a different name or phone number.`
              : "Start by registering your first patient."}
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setEditingPatient(null);
              setIsModalOpen(true);
            }}
            className="gap-1.5 font-semibold"
          >
            <Plus className="w-4 h-4" />
            Register New Patient
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPatients.map((patient) => (
            <Link
              key={patient.id}
              href={`/patients/${patient.id}`}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm hover:shadow-md hover:border-sky-300 transition-all duration-200 group flex flex-col justify-between dark:border-slate-800 dark:bg-slate-900"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-sky-100 to-blue-100 text-sky-700 font-bold text-base flex items-center justify-center dark:from-sky-950 dark:to-blue-950 dark:text-sky-300">
                      {patient.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-600 transition-colors dark:text-white">
                        {patient.name}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {patient.age} yrs • {patient.gender}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleEdit(e, patient)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-slate-100 transition-colors dark:hover:bg-slate-800"
                      title="Edit patient"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDelete(e, patient.id)}
                      disabled={isDeletingId === patient.id}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors dark:hover:bg-rose-950/40"
                      title="Delete patient"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{patient.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Registered: {formatDate(patient.createdAt)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between dark:border-slate-800/80">
                <Badge variant="info" className="text-xs">
                  <FileText className="w-3 h-3 mr-1 text-sky-600" />
                  {patient.prescriptionCount || 0} Prescriptions
                </Badge>

                <span className="text-xs font-semibold text-sky-600 group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                  View Records <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <PatientModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        patient={editingPatient}
        onSuccess={() => {
          router.refresh();
        }}
      />
    </div>
  );
}
