"use client";

import { useState } from "react";
import { 
  Patient, 
  AnalysisPipelineResponse, 
  MedicineItem, 
  GeminiAnalysisResult,
  OCRResult,
  ImageQualityReport 
} from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { savePrescription } from "@/actions/prescriptions";
import { checkDrugInteractions } from "@/lib/clinical/safety";
import { DrugInteractionCard } from "@/components/clinical/drug-interaction-card";
import { GenericSubstitutePill } from "@/components/clinical/generic-substitute-pill";
import { VoiceDictationButton } from "@/components/clinical/voice-dictation-button";
import { WhatsAppShareModal } from "@/components/prescriptions/whatsapp-share-modal";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { 
  CheckCircle2, 
  Sparkles, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  Star, 
  FileText, 
  Eye, 
  Layers, 
  Tag, 
  Stethoscope, 
  User, 
  Calendar, 
  Save, 
  RotateCcw,
  ShieldCheck,
  HelpCircle,
  Pill,
  MessageSquare
} from "lucide-react";
import { QualityIndicator } from "./quality-indicator";

interface DoctorReviewStudioProps {
  initialResult: {
    analysis: AnalysisPipelineResponse;
    selectedPatient: Patient;
    imageUrl: string;
  };
  onReset: () => void;
}

export function DoctorReviewStudio({
  initialResult,
  onReset,
}: DoctorReviewStudioProps) {
  const router = useRouter();
  const { analysis, selectedPatient, imageUrl } = initialResult;

  const [rawOcr] = useState<string>(analysis.ocrResult?.rawText || "");
  const [showRawOcr, setShowRawOcr] = useState<boolean>(false);
  const [correctedText, setCorrectedText] = useState<string>(
    analysis.aiAnalysis?.corrected_text || ""
  );
  const [summary, setSummary] = useState<string>(
    analysis.aiAnalysis?.summary || ""
  );
  const [medicines, setMedicines] = useState<MedicineItem[]>(() => {
    return (analysis.aiAnalysis?.medicines || []).map((m) => ({
      name: m.name || "",
      dosage: m.dosage || "",
      frequency: m.frequency || "",
      isUncertain: m.name.toLowerCase().startsWith("possibly"),
    }));
  });
  const [doctorNotes, setDoctorNotes] = useState<string>("");
  const [tags, setTags] = useState<string[]>(
    analysis.aiAnalysis?.tags || ["Medical Record"]
  );
  const [newTagInput, setNewTagInput] = useState<string>("");
  const [important, setImportant] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);

  // Real-time Drug-to-Drug Interaction Analysis
  const drugInteractions = checkDrugInteractions(medicines);

  // Helper for medicine rows
  const handleAddMedicine = () => {
    setMedicines([
      ...medicines,
      { name: "", dosage: "", frequency: "", isUncertain: false },
    ]);
  };

  const handleUpdateMedicine = (
    index: number,
    field: keyof MedicineItem,
    value: any
  ) => {
    const updated = [...medicines];
    updated[index] = { ...updated[index], [field]: value };

    // Auto update uncertainty if name starts with "Possibly"
    if (field === "name") {
      updated[index].isUncertain = (value as string).toLowerCase().startsWith("possibly");
    }

    setMedicines(updated);
  };

  const handleApplyGeneric = (index: number, genericName: string) => {
    const updated = [...medicines];
    updated[index] = { ...updated[index], name: genericName };
    setMedicines(updated);
    toast.success(`Switched to generic: ${genericName}`);
  };

  const handleRemoveMedicine = (index: number) => {
    setMedicines(medicines.filter((_, idx) => idx !== index));
  };

  const handleVoiceDictation = (spokenText: string) => {
    if (!spokenText.trim()) return;

    // Check if spoken text sounds like a medicine or note
    if (
      spokenText.toLowerCase().includes("tab") ||
      spokenText.toLowerCase().includes("cap") ||
      spokenText.toLowerCase().includes("syp") ||
      spokenText.toLowerCase().includes("mg")
    ) {
      setMedicines([
        ...medicines,
        {
          name: spokenText.split("-")[0]?.replace(/tab|cap|syp/gi, "").trim() || spokenText,
          dosage: spokenText.match(/\d+\s*(mg|ml|g|mcg)/i)?.[0] || "As directed",
          frequency: spokenText.includes("day") || spokenText.includes("tds") || spokenText.includes("sos") || spokenText.includes("times")
            ? spokenText
            : "1 tablet once daily",
          isUncertain: false,
        },
      ]);
      toast.success(`Added voice dictated medicine: ${spokenText}`);
    } else {
      setDoctorNotes((prev) => (prev ? `${prev}. ${spokenText}` : spokenText));
      toast.success(`Added voice dictation to doctor notes`);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent | React.MouseEvent) => {
    if (("key" in e && e.key === "Enter") || e.type === "click") {
      e.preventDefault();
      const val = newTagInput.trim();
      if (val && !tags.includes(val)) {
        setTags([...tags, val]);
        setNewTagInput("");
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSave = async () => {
    if (!selectedPatient?.id) {
      toast.error("Invalid patient selected");
      return;
    }

    setIsSaving(true);
    try {
      const res = await savePrescription({
        patientId: selectedPatient.id,
        imageUrl,
        rawOcr,
        correctedText: correctedText.trim(),
        aiSummary: summary.trim(),
        medicinesJson: medicines.filter((m) => m.name.trim().length > 0),
        doctorNotes: doctorNotes.trim(),
        tags,
        important,
        ocrConfidence: analysis.ocrResult ? {
          score: analysis.ocrResult.confidenceScore,
          level: analysis.ocrResult.confidenceLevel,
          uncertainWords: analysis.ocrResult.uncertainWords,
        } : undefined,
      });

      if (res.success) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
        toast.success("Prescription verified and saved to patient record!");
        router.push(`/patients/${selectedPatient.id}`);
      } else {
        toast.error(res.error || "Failed to save prescription record");
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred while saving");
    } finally {
      setIsSaving(false);
    }
  };

  const ocrConfidence = analysis.ocrResult;

  const previewPrescriptionObject = {
    id: "preview-id",
    patientId: selectedPatient.id,
    imageUrl,
    rawOcr,
    correctedText,
    aiSummary: summary,
    medicinesJson: medicines,
    doctorNotes,
    tags,
    important,
    createdAt: new Date().toISOString(),
    patientName: selectedPatient.name,
    patientPhone: selectedPatient.phone,
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Patient Header Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:bg-slate-900 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-lg dark:bg-sky-950 dark:text-sky-300">
            {selectedPatient.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {selectedPatient.name}
              </h2>
              <Badge variant="outline" className="text-xs">
                {selectedPatient.age} yrs • {selectedPatient.gender}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Contact: {selectedPatient.phone}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsWhatsAppModalOpen(true)}
            className="gap-1.5 text-xs text-emerald-700 border-emerald-300 hover:bg-emerald-50 dark:text-emerald-300 dark:border-emerald-800 font-semibold"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            WhatsApp Preview
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onReset}
            className="gap-1.5 text-xs text-slate-600"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Re-scan
          </Button>

          <Button
            type="button"
            variant="primary"
            size="default"
            onClick={handleSave}
            disabled={isSaving}
            className="gap-2 font-bold shadow-md min-w-[150px]"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Saving Record..." : "Confirm & Save"}
          </Button>
        </div>
      </div>

      {/* Main Dual-Pane Review Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Pane: Original Image & Raw OCR Diagnostics (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Quality Indicator Banner */}
          {analysis.qualityReport && (
            <QualityIndicator report={analysis.qualityReport} />
          )}

          {/* Original Prescription Image Viewer */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:bg-slate-900 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-sky-600" />
                Original Prescription Image
              </span>
              <span className="text-[11px] text-slate-400">Doctor Reference</span>
            </div>

            <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-950/5 dark:border-slate-800 flex items-center justify-center min-h-[280px] max-h-[480px]">
              <img
                src={imageUrl}
                alt="Prescription"
                className="w-full h-full object-contain max-h-[460px] hover:scale-105 transition-transform duration-200"
              />
            </div>
          </div>

          {/* Raw Tesseract OCR & Confidence Indicator */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:bg-slate-900 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Tesseract OCR Engine
                </span>
                {ocrConfidence && (
                  <Badge
                    variant={
                      ocrConfidence.confidenceLevel === "Excellent"
                        ? "success"
                        : ocrConfidence.confidenceLevel === "Good"
                        ? "info"
                        : "warning"
                    }
                    className="text-[10px]"
                  >
                    {ocrConfidence.confidenceLevel} ({ocrConfidence.confidenceScore}%)
                  </Badge>
                )}
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowRawOcr(!showRawOcr)}
                className="text-xs text-sky-600 hover:text-sky-700 font-semibold h-7 px-2"
              >
                {showRawOcr ? "Hide Raw OCR" : "View Raw OCR"}
              </Button>
            </div>

            {/* Uncertain Words Badges */}
            {ocrConfidence?.uncertainWords && ocrConfidence.uncertainWords.length > 0 && (
              <div className="mb-3 p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/70 dark:bg-amber-950/30 dark:border-amber-900">
                <p className="text-[11px] font-semibold text-amber-800 dark:text-amber-200 mb-1.5 flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                  Uncertain Words Detected in OCR:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {ocrConfidence.uncertainWords.map((word, idx) => (
                    <Badge key={idx} variant="uncertain" className="text-[11px]">
                      {word}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Raw OCR Text Box */}
            {showRawOcr && (
              <div className="mt-2">
                <p className="text-[11px] text-slate-400 mb-1 font-mono">
                  Unmodified Tesseract OCR Output:
                </p>
                <pre className="p-3 rounded-lg bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto whitespace-pre-wrap max-h-48 border border-slate-800 leading-relaxed">
                  {rawOcr || "No raw text detected."}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Right Pane: Structured Medical Data & Interactive Verification (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Authority Banner + Voice Dictate */}
          <div className="rounded-xl bg-sky-50/80 border border-sky-200/80 p-3.5 dark:bg-sky-950/40 dark:border-sky-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-sky-800 dark:text-sky-300 font-medium">
              <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
              <span>
                <strong>Doctor Authority:</strong> Verified medications and dosage.
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* AI Voice-to-Prescription Dictation Assistant */}
              <VoiceDictationButton onTranscriptReceived={handleVoiceDictation} />

              {/* Star as Important Toggle */}
              <Button
                type="button"
                variant={important ? "default" : "outline"}
                size="sm"
                onClick={() => setImportant(!important)}
                className={`gap-1 text-xs font-semibold shrink-0 ${
                  important ? "bg-amber-500 hover:bg-amber-600 text-white border-amber-500" : "text-slate-600"
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${important ? "fill-white text-white" : "text-amber-500"}`} />
                {important ? "⭐ Important" : "Star"}
              </Button>
            </div>
          </div>

          {/* Clinical Safety Alert: Real-time Drug-to-Drug Interaction Engine */}
          <DrugInteractionCard warnings={drugInteractions} />

          {/* Clinical Summary */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:bg-slate-900 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                AI Clinical Summary & Diagnosis
              </label>
              <span className="text-[11px] text-slate-400">Editable</span>
            </div>
            <Textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Summary of diagnosis and treatment..."
              rows={2}
              className="font-medium text-slate-800 text-sm leading-relaxed"
            />
          </div>

          {/* Structured Medicines Table */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:bg-slate-900 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pill className="w-4 h-4 text-sky-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Prescribed Medicines (Rx)
                </span>
                <Badge variant="info" className="text-[10px]">
                  {medicines.length} Items
                </Badge>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddMedicine}
                className="text-xs font-semibold gap-1 text-sky-600 border-sky-200 hover:bg-sky-50"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Medicine
              </Button>
            </div>

            <div className="space-y-3">
              {medicines.map((med, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border transition-all ${
                    med.isUncertain
                      ? "border-amber-300 bg-amber-50/40 dark:bg-amber-950/20 dark:border-amber-900"
                      : "border-slate-200 bg-slate-50/40 dark:border-slate-800 dark:bg-slate-900/40"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center dark:bg-slate-800 dark:text-slate-300">
                        {idx + 1}
                      </span>
                      {med.isUncertain ? (
                        <Badge variant="uncertain" className="text-[10px]">
                          Uncertain Reading (Review Dosage)
                        </Badge>
                      ) : (
                        <Badge variant="success" className="text-[10px]">
                          Verified Medicine
                        </Badge>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveMedicine(idx)}
                      className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                      title="Remove medicine"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                    <div className="sm:col-span-5">
                      <label className="text-[10px] font-semibold text-slate-500 block mb-1">
                        Drug / Medicine Name
                      </label>
                      <Input
                        value={med.name}
                        onChange={(e) =>
                          handleUpdateMedicine(idx, "name", e.target.value)
                        }
                        placeholder="e.g. Amoxicillin or Possibly Levolin"
                        className="text-xs font-semibold"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="text-[10px] font-semibold text-slate-500 block mb-1">
                        Dosage / Strength
                      </label>
                      <Input
                        value={med.dosage}
                        onChange={(e) =>
                          handleUpdateMedicine(idx, "dosage", e.target.value)
                        }
                        placeholder="e.g. 500mg"
                        className="text-xs"
                      />
                    </div>

                    <div className="sm:col-span-4">
                      <label className="text-[10px] font-semibold text-slate-500 block mb-1">
                        Frequency & Duration
                      </label>
                      <Input
                        value={med.frequency}
                        onChange={(e) =>
                          handleUpdateMedicine(idx, "frequency", e.target.value)
                        }
                        placeholder="e.g. 1 tab TDS x 5 days"
                        className="text-xs"
                      />
                    </div>
                  </div>

                  {/* Generic Substitute Pill (1-Click Switcher) */}
                  <GenericSubstitutePill
                    medicineName={med.name}
                    onApplyGeneric={(generic) => handleApplyGeneric(idx, generic)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Corrected Text Transcript */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:bg-slate-900 dark:border-slate-800 space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
              Full Structured Prescription Text
            </label>
            <Textarea
              value={correctedText}
              onChange={(e) => setCorrectedText(e.target.value)}
              placeholder="Full digitized prescription text..."
              rows={3}
              className="font-mono text-xs leading-relaxed"
            />
          </div>

          {/* Tags & Doctor Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Tags Section */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:bg-slate-900 dark:border-slate-800 space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-sky-600" />
                Prescription Tags
              </label>

              <div className="flex flex-wrap gap-1.5 min-h-[36px]">
                {tags.map((t, idx) => (
                  <Badge
                    key={idx}
                    variant="info"
                    className="gap-1 text-xs py-1 px-2.5 font-medium"
                  >
                    <span>{t}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="hover:text-rose-600 font-bold ml-1"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Add tag (e.g. Pediatric, Antibiotic)..."
                  className="text-xs h-8"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleAddTag}
                  className="h-8 text-xs font-semibold px-2.5"
                >
                  Add
                </Button>
              </div>
            </div>

            {/* Doctor's Personal Notes Section */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:bg-slate-900 dark:border-slate-800 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                Doctor's Personal Notes & Advice
              </label>
              <Textarea
                value={doctorNotes}
                onChange={(e) => setDoctorNotes(e.target.value)}
                placeholder="e.g. Follow-up after 5 days, encourage fluid intake..."
                rows={3}
                className="text-xs"
              />
            </div>
          </div>

          {/* Final Save Action Bar */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onReset}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={handleSave}
              disabled={isSaving}
              className="gap-2 font-bold px-8 shadow-md"
            >
              <Save className="w-4 h-4" />
              {isSaving ? "Saving to Database..." : "Save to Patient Record"}
            </Button>
          </div>

        </div>
      </div>

      {/* WhatsApp Share Modal */}
      <WhatsAppShareModal
        open={isWhatsAppModalOpen}
        onOpenChange={setIsWhatsAppModalOpen}
        prescription={previewPrescriptionObject as any}
        patient={selectedPatient}
      />
    </div>
  );
}
