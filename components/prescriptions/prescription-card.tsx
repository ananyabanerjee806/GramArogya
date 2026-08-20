"use client";

import { Prescription, Patient } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { Star, Download, Pill, ChevronRight, Eye, Sparkles } from "lucide-react";
import { generatePrescriptionPDF } from "@/lib/pdf/export";
import { toast } from "sonner";

interface PrescriptionCardProps {
  prescription: Prescription;
  patient?: Patient | null;
  onViewDetails: (prescription: Prescription) => void;
  onToggleStar?: (id: string, current: boolean) => void;
}

export function PrescriptionCard({
  prescription,
  patient,
  onViewDetails,
  onToggleStar,
}: PrescriptionCardProps) {
  const isImportant = prescription.important;

  const handleDownloadPDF = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const doc = generatePrescriptionPDF(prescription, patient);
      const safePatientName = (patient?.name || prescription.patientName || "Prescription")
        .replace(/[^a-zA-Z0-9]/g, "_");
      doc.save(`Prescription_${safePatientName}_${formatDate(prescription.createdAt).replace(/[^a-zA-Z0-9]/g, "_")}.pdf`);
      toast.success("PDF Downloaded successfully");
    } catch (err) {
      toast.error("Failed to generate PDF");
    }
  };

  return (
    <div
      onClick={() => onViewDetails(prescription)}
      className={`rounded-2xl border p-5 transition-all duration-200 cursor-pointer group hover:shadow-md ${
        isImportant
          ? "border-amber-300/80 bg-gradient-to-br from-amber-50/30 via-white to-amber-50/10 shadow-sm dark:from-amber-950/20 dark:to-slate-900 dark:border-amber-900"
          : "border-slate-200/80 bg-white hover:border-sky-300 dark:border-slate-800 dark:bg-slate-900"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          {isImportant && (
            <Badge variant="warning" className="text-[11px] font-bold gap-1 bg-amber-100 text-amber-900 border-amber-300">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              ⭐ Important
            </Badge>
          )}

          <span className="text-xs font-semibold text-slate-500">
            {formatDate(prescription.createdAt)}
          </span>

          {prescription.ocrConfidence && (
            <Badge variant="outline" className="text-[10px]">
              OCR: {prescription.ocrConfidence.score}%
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-1">
          {onToggleStar && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleStar(prescription.id, isImportant);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 transition-colors"
              title={isImportant ? "Unmark star" : "Mark as Important"}
            >
              <Star className={`w-4 h-4 ${isImportant ? "fill-amber-500 text-amber-500" : ""}`} />
            </button>
          )}

          <button
            type="button"
            onClick={handleDownloadPDF}
            className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 transition-colors"
            title="Download PDF"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Patient Name if shown globally */}
      {(prescription.patientName || patient?.name) && (
        <div className="mb-2">
          <span className="text-xs text-slate-400 font-medium">Patient:</span>{" "}
          <strong className="text-sm text-slate-900 dark:text-slate-100 font-bold">
            {prescription.patientName || patient?.name}
          </strong>
        </div>
      )}

      {/* AI Summary */}
      {prescription.aiSummary && (
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 line-clamp-2 mb-3 leading-relaxed">
          {prescription.aiSummary}
        </p>
      )}

      {/* Medicines Badges (Smart Medicine Recognition) */}
      {prescription.medicinesJson && prescription.medicinesJson.length > 0 && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-1.5">
            {prescription.medicinesJson.slice(0, 4).map((med, idx) => (
              <Badge
                key={idx}
                variant={med.isUncertain || med.name.toLowerCase().startsWith("possibly") ? "uncertain" : "secondary"}
                className="text-[11px] font-medium"
              >
                <Pill className="w-2.5 h-2.5 mr-1 opacity-70" />
                {med.name}
              </Badge>
            ))}
            {prescription.medicinesJson.length > 4 && (
              <Badge variant="outline" className="text-[10px]">
                +{prescription.medicinesJson.length - 4} more
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Tags */}
      {prescription.tags && prescription.tags.length > 0 && (
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex flex-wrap gap-1">
            {prescription.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium dark:bg-slate-800 dark:text-slate-300"
              >
                #{tag}
              </span>
            ))}
          </div>

          <span className="text-xs font-semibold text-sky-600 group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
            View Details <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      )}
    </div>
  );
}
