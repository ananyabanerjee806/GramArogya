"use client";

import { useState } from "react";
import { Prescription, Patient } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PrescriptionCard } from "@/components/prescriptions/prescription-card";
import { PrescriptionDetailModal } from "@/components/prescriptions/prescription-detail-modal";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Filter, 
  Pill, 
  Calendar, 
  User, 
  Star, 
  UploadCloud, 
  RotateCcw, 
  Tag,
  FileText
} from "lucide-react";

interface PrescriptionsSearchClientProps {
  initialPrescriptions: Prescription[];
  patients: Patient[];
}

export function PrescriptionsSearchClient({
  initialPrescriptions,
  patients,
}: PrescriptionsSearchClientProps) {
  const router = useRouter();
  const [patientQuery, setPatientQuery] = useState("");
  const [medicineQuery, setMedicineQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [importantOnly, setImportantOnly] = useState(false);

  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Extract all unique tags
  const allTags = Array.from(
    new Set(initialPrescriptions.flatMap((p) => p.tags || []))
  ).filter(Boolean);

  // Client Filter Logic
  const filtered = initialPrescriptions.filter((p) => {
    // 1. Patient Name / Phone
    if (patientQuery.trim()) {
      const q = patientQuery.toLowerCase().trim();
      const matchPatient = (p.patientName || "").toLowerCase().includes(q);
      const matchPhone = (p.patientPhone || "").toLowerCase().includes(q);
      const matchSummary = (p.aiSummary || "").toLowerCase().includes(q);
      if (!matchPatient && !matchPhone && !matchSummary) return false;
    }

    // 2. Medicine Name
    if (medicineQuery.trim()) {
      const medQ = medicineQuery.toLowerCase().trim();
      const matchMed = (p.medicinesJson || []).some((m) =>
        m.name.toLowerCase().includes(medQ)
      );
      if (!matchMed) return false;
    }

    // 3. Date Filter
    if (dateFilter) {
      const pDate = new Date(p.createdAt).toISOString().split("T")[0];
      if (pDate !== dateFilter) return false;
    }

    // 4. Important Only
    if (importantOnly && !p.important) return false;

    // 5. Selected Tag
    if (selectedTag && !(p.tags || []).includes(selectedTag)) return false;

    return true;
  });

  const handleResetFilters = () => {
    setPatientQuery("");
    setMedicineQuery("");
    setDateFilter("");
    setSelectedTag(null);
    setImportantOnly(false);
  };

  const getPatientForPrescription = (patientId: string) => {
    return patients.find((p) => p.id === patientId) || null;
  };

  const isAnyFilterActive =
    patientQuery || medicineQuery || dateFilter || selectedTag || importantOnly;

  return (
    <div className="space-y-6">
      {/* Multi-Filter Search Card (Phase 2 Requirement) */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:bg-slate-900 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-sky-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Multi-Parameter Prescription Search (Phase 2)
            </h2>
          </div>

          {isAnyFilterActive && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="text-xs text-rose-600 hover:bg-rose-50 h-7"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Reset Filters
            </Button>
          )}
        </div>

        {/* Filter Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* 1. Patient Name / Phone */}
          <div>
            <label className="text-[11px] font-semibold text-slate-500 block mb-1">
              Patient Name or Phone
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <Input
                placeholder="e.g. Eleanor or +1 (555)..."
                value={patientQuery}
                onChange={(e) => setPatientQuery(e.target.value)}
                className="pl-9 h-10 text-xs rounded-xl"
              />
            </div>
          </div>

          {/* 2. Medicine Name */}
          <div>
            <label className="text-[11px] font-semibold text-slate-500 block mb-1">
              Medicine / Drug Name
            </label>
            <div className="relative">
              <Pill className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <Input
                placeholder="e.g. Amoxicillin, Pantoprazole..."
                value={medicineQuery}
                onChange={(e) => setMedicineQuery(e.target.value)}
                className="pl-9 h-10 text-xs rounded-xl"
              />
            </div>
          </div>

          {/* 3. Prescription Date */}
          <div>
            <label className="text-[11px] font-semibold text-slate-500 block mb-1">
              Prescription Date
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="pl-9 h-10 text-xs rounded-xl"
              />
            </div>
          </div>

          {/* 4. Starred Quick Toggle */}
          <div className="flex items-end">
            <Button
              type="button"
              variant={importantOnly ? "default" : "outline"}
              onClick={() => setImportantOnly(!importantOnly)}
              className={`w-full h-10 rounded-xl text-xs font-semibold gap-2 ${
                importantOnly
                  ? "bg-amber-500 hover:bg-amber-600 text-white border-amber-500"
                  : "text-slate-700"
              }`}
            >
              <Star
                className={`w-4 h-4 ${
                  importantOnly ? "fill-white text-white" : "text-amber-500"
                }`}
              />
              {importantOnly ? "⭐ Filtered: Important Only" : "Show ⭐ Important Only"}
            </Button>
          </div>
        </div>

        {/* Tags Row */}
        {allTags.length > 0 && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
              <Tag className="w-3 h-3" />
              Tags:
            </span>
            {allTags.map((tag, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() =>
                  setSelectedTag(selectedTag === tag ? null : tag)
                }
                className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                  selectedTag === tag
                    ? "border-sky-500 bg-sky-600 text-white font-semibold shadow-sm"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-slate-500">
          Showing <span className="text-slate-900 font-bold dark:text-white">{filtered.length}</span> matching prescriptions
        </p>

        <Link href="/upload">
          <Button variant="primary" size="sm" className="gap-1.5 text-xs font-semibold shadow-sm">
            <UploadCloud className="w-3.5 h-3.5" />
            Upload New Prescription
          </Button>
        </Link>
      </div>

      {/* Results Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-3 dark:bg-sky-950">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No Matching Prescriptions
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            No records matched your search parameters. Try adjusting the medicine name, patient name, or clearing filters.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetFilters}
            className="text-xs font-semibold"
          >
            Clear All Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((prescription) => (
            <PrescriptionCard
              key={prescription.id}
              prescription={prescription}
              patient={getPatientForPrescription(prescription.patientId)}
              onViewDetails={(p) => {
                setSelectedPrescription(p);
                setIsDetailModalOpen(true);
              }}
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
          onUpdated={() => router.refresh()}
        />
      )}
    </div>
  );
}
