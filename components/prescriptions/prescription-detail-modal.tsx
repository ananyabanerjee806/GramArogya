"use client";

import { useState } from "react";
import { Prescription, Patient } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { toggleImportantPrescription } from "@/actions/prescriptions";
import { generatePrescriptionPDF } from "@/lib/pdf/export";
import { checkDrugInteractions, findGenericAlternative } from "@/lib/clinical/safety";
import { DrugInteractionCard } from "@/components/clinical/drug-interaction-card";
import { WhatsAppShareModal } from "@/components/prescriptions/whatsapp-share-modal";
import { toast } from "sonner";
import { 
  FileText, 
  Download, 
  Star, 
  Trash2, 
  Pill, 
  Calendar, 
  User, 
  Sparkles, 
  HelpCircle, 
  FileCheck,
  Tag,
  Stethoscope,
  MessageSquare
} from "lucide-react";

interface PrescriptionDetailModalProps {
  prescription: Prescription | null;
  patient?: Patient | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated?: () => void;
}

export function PrescriptionDetailModal({
  prescription,
  patient,
  open,
  onOpenChange,
  onUpdated,
}: PrescriptionDetailModalProps) {
  if (!prescription) return null;

  const [isImportant, setIsImportant] = useState<boolean>(prescription.important);
  const [isTogglingStar, setIsTogglingStar] = useState(false);
  const [showRaw, setShowRaw] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);

  const drugInteractions = checkDrugInteractions(prescription.medicinesJson || []);

  const handleToggleImportant = async () => {
    setIsTogglingStar(true);
    try {
      const newVal = !isImportant;
      const res = await toggleImportantPrescription(prescription.id, newVal);
      if (res.success) {
        setIsImportant(newVal);
        toast.success(newVal ? "Marked as ⭐ Important" : "Removed from Important");
        if (onUpdated) onUpdated();
      } else {
        toast.error("Failed to update status");
      }
    } finally {
      setIsTogglingStar(false);
    }
  };

  const handleDownloadPDF = () => {
    try {
      const doc = generatePrescriptionPDF(
        { ...prescription, important: isImportant },
        patient
      );
      const safePatientName = (patient?.name || prescription.patientName || "Prescription")
        .replace(/[^a-zA-Z0-9]/g, "_");
      doc.save(`Prescription_${safePatientName}_${formatDate(prescription.createdAt).replace(/[^a-zA-Z0-9]/g, "_")}.pdf`);
      toast.success("PDF Prescription Report downloaded successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to generate PDF");
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 rounded-2xl">
          {/* Header */}
          <div className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50 dark:bg-slate-900/50 dark:border-slate-800 flex items-start justify-between flex-wrap gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
                  Prescription Record Details
                </DialogTitle>
                {isImportant && (
                  <Badge variant="warning" className="text-xs font-semibold bg-amber-100 text-amber-900 border-amber-300">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500 mr-1" />
                    Important Record
                  </Badge>
                )}
                {prescription.ocrConfidence && (
                  <Badge variant="success" className="text-xs">
                    OCR: {prescription.ocrConfidence.level} ({prescription.ocrConfidence.score}%)
                  </Badge>
                )}
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-3 flex-wrap">
                <span>Patient: <strong className="text-slate-800 dark:text-slate-200">{patient?.name || prescription.patientName || "Assigned Patient"}</strong></span>
                <span>•</span>
                <span>Date: {formatDate(prescription.createdAt)}</span>
              </p>
            </div>

            <div className="flex items-center gap-2 pr-6 flex-wrap">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsWhatsAppModalOpen(true)}
                className="gap-1.5 text-xs font-semibold text-emerald-700 border-emerald-300 hover:bg-emerald-50 dark:text-emerald-300 dark:border-emerald-800"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                WhatsApp PDF & Schedule
              </Button>

              <Button
                type="button"
                variant={isImportant ? "default" : "outline"}
                size="sm"
                onClick={handleToggleImportant}
                disabled={isTogglingStar}
                className={`gap-1.5 text-xs font-semibold ${
                  isImportant ? "bg-amber-500 hover:bg-amber-600 text-white" : ""
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${isImportant ? "fill-white" : "text-amber-500"}`} />
                {isImportant ? "Starred" : "Star"}
              </Button>

              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleDownloadPDF}
                className="gap-1.5 text-xs font-semibold shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                Download PDF
              </Button>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-6 space-y-6">
            
            {/* Clinical Safety Check */}
            <DrugInteractionCard warnings={drugInteractions} />

            {/* Top Row: Original Image Preview & Summary */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Image Box */}
              <div className="md:col-span-5 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Original Uploaded Prescription
                </span>
                <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-950/5 flex items-center justify-center min-h-[220px] max-h-[300px] dark:border-slate-800">
                  <img
                    src={prescription.imageUrl}
                    alt="Original Prescription"
                    className="w-full h-full object-contain max-h-[290px]"
                  />
                </div>
              </div>

              {/* AI Clinical Summary & Notes */}
              <div className="md:col-span-7 space-y-4">
                {prescription.aiSummary && (
                  <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-200/80 dark:bg-sky-950/30 dark:border-sky-800">
                    <span className="text-xs font-bold uppercase tracking-wider text-sky-800 dark:text-sky-300 flex items-center gap-1.5 mb-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      AI Clinical Summary & Diagnosis
                    </span>
                    <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                      {prescription.aiSummary}
                    </p>
                  </div>
                )}

                {prescription.doctorNotes && (
                  <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 dark:bg-amber-950/30 dark:border-amber-900">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-200 block mb-1">
                      Doctor's Personal Notes & Advice
                    </span>
                    <p className="text-xs sm:text-sm text-amber-900 dark:text-amber-100 font-medium">
                      {prescription.doctorNotes}
                    </p>
                  </div>
                )}

                {prescription.tags && prescription.tags.length > 0 && (
                  <div>
                    <span className="text-xs font-semibold text-slate-500 block mb-1.5">
                      Categorization Tags
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {prescription.tags.map((t, idx) => (
                        <Badge key={idx} variant="info" className="text-xs py-0.5 px-2">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Structured Medicines Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Pill className="w-4 h-4 text-sky-600" />
                  Prescribed Medications & Regimen (Rx)
                </span>
                <Badge variant="outline" className="text-xs">
                  {prescription.medicinesJson?.length || 0} Prescribed Items
                </Badge>
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-100/80 text-slate-600 font-semibold dark:bg-slate-800 dark:text-slate-300">
                    <tr>
                      <th className="p-3 pl-4">#</th>
                      <th className="p-3">Medicine / Drug Name</th>
                      <th className="p-3">Generic Alternative</th>
                      <th className="p-3">Dosage / Strength</th>
                      <th className="p-3 pr-4">Frequency & Instructions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {prescription.medicinesJson && prescription.medicinesJson.length > 0 ? (
                      prescription.medicinesJson.map((med, idx) => {
                        const genericAlt = findGenericAlternative(med.name);
                        return (
                          <tr
                            key={idx}
                            className={
                              med.isUncertain || med.name.toLowerCase().startsWith("possibly")
                                ? "bg-amber-50/40 dark:bg-amber-950/20"
                                : "bg-white dark:bg-slate-900"
                            }
                          >
                            <td className="p-3 pl-4 font-mono text-slate-400">{idx + 1}</td>
                            <td className="p-3 font-semibold text-slate-900 dark:text-white">
                              <div className="flex items-center gap-2">
                                <span>{med.name}</span>
                                {(med.isUncertain || med.name.toLowerCase().startsWith("possibly")) && (
                                  <Badge variant="uncertain" className="text-[10px]">
                                    Possibly
                                  </Badge>
                                )}
                              </div>
                            </td>
                            <td className="p-3 text-xs text-slate-600 dark:text-slate-400">
                              {genericAlt ? (
                                <span className="font-medium text-emerald-700 dark:text-emerald-300">
                                  {genericAlt.genericName}
                                </span>
                              ) : (
                                <span className="text-slate-400 italic">Standard</span>
                              )}
                            </td>
                            <td className="p-3 font-medium text-slate-700 dark:text-slate-300">
                              {med.dosage || "-"}
                            </td>
                            <td className="p-3 pr-4 text-slate-600 dark:text-slate-400">
                              {med.frequency || "-"}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-4 text-center text-slate-400 italic">
                          No specific medicines listed.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Transcript & Raw OCR Accordion */}
            <div className="rounded-xl border border-slate-200 p-4 space-y-3 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Full Digitized Prescription Transcript
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowRaw(!showRaw)}
                  className="text-xs text-sky-600 h-7"
                >
                  {showRaw ? "Hide Raw OCR" : "Compare with Raw OCR"}
                </Button>
              </div>

              <pre className="p-3 rounded-lg bg-white font-mono text-xs text-slate-800 whitespace-pre-wrap border border-slate-200 dark:bg-slate-950 dark:text-slate-200 dark:border-slate-800 leading-relaxed">
                {prescription.correctedText || "No text available."}
              </pre>

              {showRaw && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] font-mono text-slate-400 block mb-1">
                    Original Unmodified Tesseract OCR:
                  </span>
                  <pre className="p-3 rounded-lg bg-slate-900 font-mono text-xs text-emerald-400 whitespace-pre-wrap max-h-40 overflow-y-auto">
                    {prescription.rawOcr}
                  </pre>
                </div>
              )}
            </div>

          </div>
        </DialogContent>
      </Dialog>

      {/* 1-Click WhatsApp Share Modal */}
      <WhatsAppShareModal
        open={isWhatsAppModalOpen}
        onOpenChange={setIsWhatsAppModalOpen}
        prescription={prescription}
        patient={patient}
      />
    </>
  );
}
