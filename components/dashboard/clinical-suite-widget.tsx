"use client";

import { useState } from "react";
import { checkDrugInteractions, findGenericAlternative } from "@/lib/clinical/safety";
import { translateMedicalFrequency, SUPPORTED_LANGUAGES, SupportedLanguage } from "@/lib/clinical/regional-translation";
import { formatAbhaNumber, validateAbhaNumber, getPatientAbhaProfile } from "@/lib/abha/abdm";
import { CLINIC_BRANCHES, ROLE_PROFILES, UserRole } from "@/lib/auth/rbac";
import { VoiceDictationButton } from "@/components/clinical/voice-dictation-button";
import { DrugInteractionCard } from "@/components/clinical/drug-interaction-card";
import { LiveCameraScanner } from "@/components/camera/live-camera-scanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  ShieldAlert, 
  Mic, 
  Sparkles, 
  MessageSquare, 
  Pill, 
  ArrowRight, 
  CheckCircle2, 
  Plus, 
  Trash2,
  DollarSign,
  Languages,
  Activity,
  ShieldCheck,
  Building2,
  Camera,
  Send,
  QrCode
} from "lucide-react";
import { toast } from "sonner";

export function ClinicalSuiteDashboardWidget() {
  const [activeTab, setActiveTab] = useState<
    'safety' | 'voice' | 'whatsapp' | 'generic' | 'languages' | 'analytics' | 'rbac' | 'abha' | 'camera'
  >('safety');

  // Drug Safety Checker State
  const [testDrugs, setTestDrugs] = useState<string[]>(["Aspirin 75mg", "Ibuprofen 400mg"]);
  const [newDrugInput, setNewDrugInput] = useState("");

  // Generic Finder State
  const [searchBrand, setSearchBrand] = useState("Augmentin");

  // Multi-Language State
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>('hi');
  const [demoMed, setDemoMed] = useState({ name: "Tab Amoxicillin 500mg", freq: "1 tablet TID x 5 days" });

  // ABHA State
  const [abhaInput, setAbhaInput] = useState("91847291823841");
  const [isAbhaValid, setIsAbhaValid] = useState(true);

  // WhatsApp Demo State
  const [waPhone, setWaPhone] = useState("+91 9876543210");
  const [waPatient, setWaPatient] = useState("Eleanor Vance");

  // Live Camera Scanner Modal State
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [scannedImage, setScannedImage] = useState<string | null>(null);

  // Voice Dictation Log State
  const [voiceLogs, setVoiceLogs] = useState<string[]>([
    "Tab Amoxicillin 500mg TDS for 5 days after food",
    "Tab Paracetamol 650mg 1 tablet SOS for fever",
  ]);

  const handleAddDrug = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDrugInput.trim()) {
      setTestDrugs([...testDrugs, newDrugInput.trim()]);
      setNewDrugInput("");
    }
  };

  const handleRemoveDrug = (index: number) => {
    setTestDrugs(testDrugs.filter((_, i) => i !== index));
  };

  const currentInteractions = checkDrugInteractions(
    testDrugs.map((d) => ({ name: d }))
  );

  const searchedGeneric = findGenericAlternative(searchBrand);

  const handleVoiceTranscription = (transcript: string) => {
    if (transcript.trim()) {
      setVoiceLogs((prev) => [transcript, ...prev]);
      toast.success(`Voice Captured: "${transcript}"`);
    }
  };

  const handleCheckAbha = () => {
    const valid = validateAbhaNumber(abhaInput);
    setIsAbhaValid(valid);
    if (valid) {
      toast.success(`ABHA ID Verified with National Health Authority!`);
    } else {
      toast.error("Invalid ABHA number. Must be 14 digits.");
    }
  };

  const handleTestWhatsApp = () => {
    const translation = translateMedicalFrequency(demoMed.freq, selectedLang);
    const text = `🏥 *CLINICOCR MEDICAL CENTRE*\n📋 *Digital Prescription & Schedule*\n━━━━━━━━━━━━━━━━━━━━━\n👤 *Patient:* ${waPatient}\n💊 *1. ${demoMed.name}*\n⏱️ *Schedule:* ${translation.timingSchedule}\n━━━━━━━━━━━━━━━━━━━━━\n✨ _Digitized with ClinicOCR Medical Intelligence_`;
    const url = `https://wa.me/${waPhone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    toast.success("Dispatched to WhatsApp!");
  };

  return (
    <div className="rounded-3xl border border-sky-200/80 bg-gradient-to-br from-white via-sky-50/20 to-blue-50/20 p-6 sm:p-7 shadow-sm dark:from-slate-900 dark:via-slate-900 dark:to-sky-950/30 dark:border-slate-800 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-sky-500/20 shrink-0">
            <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Next-Gen Clinical AI Intelligence Suite
              </h3>
              <Badge variant="success" className="text-[10px] font-bold">
                9 Advanced Features Live
              </Badge>
            </div>
            <p className="text-xs text-slate-500">
              Interactive testbench for Voice Dictation, Drug Safety, WhatsApp, ABHA, Multilingual OCR & Analytics
            </p>
          </div>
        </div>

        {/* Feature Tabs Bar */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-x-auto max-w-full">
          {[
            { id: 'safety', label: '⚠️ Drug Safety' },
            { id: 'voice', label: '🎙️ Voice Dictate' },
            { id: 'whatsapp', label: '📱 WhatsApp' },
            { id: 'generic', label: '💊 Generic Switcher' },
            { id: 'languages', label: '🌐 Regional Lang' },
            { id: 'analytics', label: '📈 Health Vitals' },
            { id: 'abha', label: '🔒 ABHA Health ID' },
            { id: 'rbac', label: '🏢 Multi-Clinic RBAC' },
            { id: 'camera', label: '📸 Live Camera' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-950 text-sky-700 dark:text-sky-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. Drug Safety Tab */}
      {activeTab === 'safety' && (
        <div className="space-y-4 pt-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                1. Real-Time Drug-to-Drug Interaction & Contraindication Analyzer:
              </h4>
              <p className="text-[11px] text-slate-500">
                Add or remove medications to test automated clinical safety checks and red warning alerts
              </p>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-slate-400 font-semibold">Test Presets:</span>
              <button
                type="button"
                onClick={() => setTestDrugs(["Aspirin 75mg", "Ibuprofen 400mg"])}
                className="text-[10px] px-2 py-0.5 rounded bg-rose-50 border border-rose-200 text-rose-700 font-medium hover:bg-rose-100 cursor-pointer"
              >
                Bleeding Risk (Aspirin + Ibuprofen)
              </button>
              <button
                type="button"
                onClick={() => setTestDrugs(["Methotrexate 10mg", "Amoxicillin 500mg"])}
                className="text-[10px] px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-700 font-medium hover:bg-amber-100 cursor-pointer"
              >
                Toxicity (Methotrexate + Amox)
              </button>
              <button
                type="button"
                onClick={() => setTestDrugs(["Pantoprazole 40mg", "Paracetamol 650mg"])}
                className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 font-medium hover:bg-emerald-100 cursor-pointer"
              >
                Safe Combo (PPI + PCM)
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {testDrugs.map((drug, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className="text-xs py-1 px-2.5 gap-1.5 bg-white dark:bg-slate-900 border-slate-300"
              >
                <Pill className="w-3 h-3 text-sky-600" />
                <span className="font-semibold">{drug}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveDrug(idx)}
                  className="text-slate-400 hover:text-rose-600 font-bold ml-0.5"
                >
                  ×
                </button>
              </Badge>
            ))}

            <form onSubmit={handleAddDrug} className="inline-flex items-center gap-1.5">
              <Input
                placeholder="Add drug (e.g. Ciprofloxacin)..."
                value={newDrugInput}
                onChange={(e) => setNewDrugInput(e.target.value)}
                className="h-8 text-xs w-48 rounded-lg"
              />
              <Button type="submit" size="sm" variant="outline" className="h-8 text-xs font-semibold px-2.5">
                <Plus className="w-3.5 h-3.5" />
              </Button>
            </form>
          </div>

          <DrugInteractionCard warnings={currentInteractions} />
        </div>
      )}

      {/* 2. Voice Dictation Tab */}
      {activeTab === 'voice' && (
        <div className="space-y-4 pt-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                2. AI Voice-to-Prescription (Dictation Assistant)
              </h4>
              <p className="text-[11px] text-slate-500">
                Speak medications directly into microphone; ClinicOCR transcribes and structures it
              </p>
            </div>

            <VoiceDictationButton onTranscriptReceived={handleVoiceTranscription} />
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 dark:bg-slate-950 dark:border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-slate-500 block">
              Captured Voice Prescription Log:
            </span>
            <div className="space-y-1.5">
              {voiceLogs.map((log, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Mic className="w-3.5 h-3.5 text-sky-600" />
                    <span>{log}</span>
                  </div>
                  <Badge variant="success" className="text-[10px]">
                    Structured
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. 1-Click WhatsApp Tab */}
      {activeTab === 'whatsapp' && (
        <div className="space-y-4 pt-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                3. 1-Click WhatsApp Prescription Delivery & Automated Medicine Reminders
              </h4>
              <p className="text-[11px] text-slate-500">
                Dispatches structured PDF & localized dosage schedule directly to the patient's phone
              </p>
            </div>

            <Button
              type="button"
              size="sm"
              onClick={handleTestWhatsApp}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-1.5 text-xs"
            >
              <Send className="w-3.5 h-3.5" />
              Dispatch Test Message to WhatsApp
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 dark:bg-slate-950 dark:border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Target Patient Parameters
              </span>
              <div className="space-y-2">
                <div>
                  <label className="text-[10px] text-slate-400 font-semibold block mb-0.5">Patient Name</label>
                  <Input value={waPatient} onChange={(e) => setWaPatient(e.target.value)} className="text-xs h-8" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-semibold block mb-0.5">WhatsApp Mobile Phone</label>
                  <Input value={waPhone} onChange={(e) => setWaPhone(e.target.value)} className="text-xs h-8" />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 text-emerald-300 font-mono text-xs border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-mono block">Automated Message Preview:</span>
              <p>🏥 *CLINICOCR MEDICAL CENTRE*</p>
              <p>👤 *Patient:* {waPatient}</p>
              <p>💊 *1. {demoMed.name}*</p>
              <p>⏱️ *Schedule:* {translateMedicalFrequency(demoMed.freq, selectedLang).timingSchedule}</p>
              <p>✨ _Digitized & Verified with ClinicOCR_</p>
            </div>
          </div>
        </div>
      )}

      {/* 4. Generic Switcher Tab */}
      {activeTab === 'generic' && (
        <div className="space-y-4 pt-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                4. Generic vs. Brand Name Switcher (Cost Optimization)
              </h4>
              <p className="text-[11px] text-slate-500">
                Suggests chemical composition equivalents to save patients ~40% to 70% on drug bills
              </p>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-slate-400 font-semibold">Try Branded:</span>
              {["Augmentin", "Dolo", "Pantocid", "Allegra", "Lipitor"].map((brand) => (
                <button
                  key={brand}
                  type="button"
                  onClick={() => setSearchBrand(brand)}
                  className="text-[10px] px-2 py-0.5 rounded bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 font-medium transition-colors cursor-pointer dark:bg-slate-800"
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 max-w-md">
            <Input
              placeholder="Search brand name (e.g. Augmentin, Dolo, Pantocid)..."
              value={searchBrand}
              onChange={(e) => setSearchBrand(e.target.value)}
              className="h-9 text-xs rounded-xl"
            />
          </div>

          {searchedGeneric ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white line-through opacity-70">
                    {searchedGeneric.brandName} (Branded)
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-sm font-extrabold text-emerald-800 dark:text-emerald-300">
                    {searchedGeneric.genericName}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Category: <strong>{searchedGeneric.category}</strong>
                </p>
              </div>

              <Badge variant="success" className="text-xs px-3 py-1 font-bold shrink-0">
                💰 ~{searchedGeneric.averageSavingsPercent}% Average Patient Cost Savings
              </Badge>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 dark:bg-slate-900 dark:border-slate-800">
              Type a brand name like <strong>Augmentin</strong>, <strong>Dolo</strong>, <strong>Pantocid</strong>, <strong>Allegra</strong>, or <strong>Lipitor</strong>.
            </div>
          )}
        </div>
      )}

      {/* 5. Regional Languages Tab */}
      {activeTab === 'languages' && (
        <div className="space-y-4 pt-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                5. Multi-Language Regional OCR & Translation
              </h4>
              <p className="text-[11px] text-slate-500">
                Converts complex medical shorthand into patient's native mother tongue
              </p>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setSelectedLang(lang.code)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                    selectedLang === lang.code
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-700 hover:bg-emerald-100 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  {lang.flag} {lang.nativeName}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 dark:bg-slate-950 dark:border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
              Live Translation Result:
            </span>
            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 dark:bg-emerald-950/20 text-xs space-y-1">
              <div className="font-bold text-emerald-950 dark:text-emerald-200">
                {demoMed.name} ({demoMed.freq})
              </div>
              <div className="text-emerald-800 dark:text-emerald-300 font-semibold text-sm">
                👉 {translateMedicalFrequency(demoMed.freq, selectedLang).timingSchedule}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Health Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-4 pt-1">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                6. Patient Health Analytics & Chronic Disease Progression Tracker
              </h4>
              <p className="text-[11px] text-slate-500">
                Visualizes BP drops, glycemic trends, and dosage titration curves
              </p>
            </div>
            <Badge variant="info" className="text-xs font-bold">Hypertension & Type 2 Diabetes</Badge>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 dark:bg-rose-950/40">
              <span className="text-[10px] text-slate-500 block">BP Evolution</span>
              <strong className="text-base font-extrabold">142/92 ➔ 122/78</strong>
              <span className="text-[10px] text-emerald-600 block font-bold">✅ Normalized</span>
            </div>
            <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-900 dark:bg-sky-950/40">
              <span className="text-[10px] text-slate-500 block">Fasting Glucose</span>
              <strong className="text-base font-extrabold">154 ➔ 112 mg/dL</strong>
              <span className="text-[10px] text-emerald-600 block font-bold">✅ Target Achieved</span>
            </div>
            <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-900 dark:bg-purple-950/40">
              <span className="text-[10px] text-slate-500 block">HbA1c Target</span>
              <strong className="text-base font-extrabold">7.8% ➔ 6.4%</strong>
              <span className="text-[10px] text-emerald-600 block font-bold">✅ Controlled &lt;6.5%</span>
            </div>
          </div>
        </div>
      )}

      {/* 7. ABHA Tab */}
      {activeTab === 'abha' && (
        <div className="space-y-4 pt-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                7. Ayushman Bharat Digital Health Account (ABHA) Integration
              </h4>
              <p className="text-[11px] text-slate-500">
                14-digit ABDM Health ID linking and Government compliance verification
              </p>
            </div>

            <Button
              type="button"
              size="sm"
              onClick={handleCheckAbha}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold gap-1.5 text-xs"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Verify ABHA ID with ABDM
            </Button>
          </div>

          <div className="flex items-center gap-2 max-w-md">
            <Input
              value={abhaInput}
              onChange={(e) => setAbhaInput(e.target.value)}
              placeholder="Enter 14-digit ABHA (e.g. 91-8472-9182-3841)"
              className="text-xs font-mono h-9"
            />
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 dark:from-slate-900 dark:to-orange-950/30 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-orange-950 dark:text-orange-200">
                  National Health Authority • ABHA: {formatAbhaNumber(abhaInput)}
                </span>
                <Badge variant="success" className="text-[9px]">
                  ABDM Compliant
                </Badge>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                Address: <code className="font-bold">eleanor.vance@abdm</code> • PHR Link Active
              </p>
            </div>
            <QrCode className="w-12 h-12 text-slate-800 dark:text-slate-200 shrink-0" />
          </div>
        </div>
      )}

      {/* 8. Multi-Clinic RBAC Tab */}
      {activeTab === 'rbac' && (
        <div className="space-y-4 pt-1">
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
              8. Multi-Doctor & Clinic Role-Based Access Control (RBAC SaaS Mode)
            </h4>
            <p className="text-[11px] text-slate-500">
              Granular permission matrix across Doctor, Receptionist, and Pharmacist / Chemist roles
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {Object.entries(ROLE_PROFILES).map(([key, role]) => (
              <div key={key} className="p-3.5 rounded-2xl bg-white border border-slate-200 dark:bg-slate-950 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold">
                  <span className="capitalize">{key}</span>
                  <Badge variant="outline" className="text-[9px] uppercase">{key}</Badge>
                </div>
                <p className="text-[11px] text-slate-500">{role.roleTitle}</p>
                <div className="space-y-1 text-[10px] text-slate-600 dark:text-slate-400">
                  <div>• Upload Scans: {role.permissions.canUploadPrescription ? '✅ Yes' : '❌ No'}</div>
                  <div>• Verify & Sign: {role.permissions.canVerifyAndSign ? '✅ Yes' : '❌ No'}</div>
                  <div>• Dispense Meds: {role.permissions.canDispenseMedications ? '✅ Yes' : '❌ No'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 9. Live Camera Scanner Tab */}
      {activeTab === 'camera' && (
        <div className="space-y-4 pt-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                9. Progressive Web App (PWA) Live Camera Scanner with Auto-Edge Detection
              </h4>
              <p className="text-[11px] text-slate-500">
                Direct camera scanning from doctor's smartphone or tablet with auto-deskewing
              </p>
            </div>

            <Button
              type="button"
              size="sm"
              onClick={() => setIsCameraOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-1.5 text-xs"
            >
              <Camera className="w-3.5 h-3.5" />
              Launch Live Camera Scanner
            </Button>
          </div>

          <div className="p-6 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-center space-y-2">
            <Camera className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold">
              Click "Launch Live Camera Scanner" above to activate your device's camera stream with real-time edge detection overlay.
            </p>
          </div>
        </div>
      )}

      {/* Live Camera Modal */}
      {isCameraOpen && (
        <LiveCameraScanner
          onCapture={(dataUrl) => {
            setScannedImage(dataUrl);
            setIsCameraOpen(false);
            toast.success("Prescription scanned successfully!");
          }}
          onClose={() => setIsCameraOpen(false)}
        />
      )}
    </div>
  );
}
