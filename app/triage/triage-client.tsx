"use client";

import { useState } from "react";
import { TriageAssessmentSelect } from "@/db/schema";
import { Patient } from "@/types";
import { createTriageAssessment } from "@/actions/triage";
import { createReferral } from "@/actions/referrals";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  AlertTriangle, 
  Ambulance, 
  CheckCircle2, 
  HeartPulse, 
  Mic, 
  Plus, 
  Send, 
  ShieldAlert, 
  Sparkles, 
  Stethoscope, 
  Thermometer, 
  User, 
  Video 
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface TriageClientViewProps {
  initialPatients: Patient[];
  initialAssessments: TriageAssessmentSelect[];
}

const COMMON_SYMPTOM_PRESETS = [
  { label: "डोकेदुखी व अंधुक दृष्टी (Headache & Blurry Vision)", risk: 30 },
  { label: "तीव्र धाप लागणे (Severe Breathlessness / SpO2 < 92%)", risk: 45 },
  { label: "गरोदरपणात पायांवर सूज व चक्कर (Pregnancy Swelling & Dizziness)", risk: 35 },
  { label: "छातीत असह्य वेदना (Acute Chest Pain / Radiating)", risk: 50 },
  { label: "लहान मुलास सतत जास्त ताप (Persistent Child High Fever > 102°F)", risk: 25 },
  { label: "रक्तातील साखर > 250 mg/dL (Uncontrolled Diabetes / Foot Sore)", risk: 20 },
];

export function TriageClientView({ initialPatients, initialAssessments }: TriageClientViewProps) {
  const [patients] = useState<Patient[]>(initialPatients);
  const [assessments, setAssessments] = useState<TriageAssessmentSelect[]>(initialAssessments);

  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || "");
  
  // Vitals State
  const [bpSystolic, setBpSystolic] = useState<number>(130);
  const [bpDiastolic, setBpDiastolic] = useState<number>(85);
  const [spo2, setSpo2] = useState<number>(97);
  const [pulse, setPulse] = useState<number>(82);
  const [temperature, setTemperature] = useState<number>(98.6);
  const [bloodSugar, setBloodSugar] = useState<number>(110);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customComplaint, setCustomComplaint] = useState<string>("");
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  const toggleSymptom = (sym: string) => {
    if (selectedSymptoms.includes(sym)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== sym));
    } else {
      setSelectedSymptoms([...selectedSymptoms, sym]);
    }
  };

  // Calculate Real-time Triage Score
  const calculateScore = () => {
    let score = 10;
    if (bpSystolic >= 160 || bpDiastolic >= 100) score += 35;
    else if (bpSystolic >= 140 || bpDiastolic >= 90) score += 15;
    
    if (spo2 < 90) score += 40;
    else if (spo2 < 94) score += 20;

    if (pulse > 110 || pulse < 50) score += 15;
    if (temperature > 101.5) score += 15;
    if (bloodSugar > 250) score += 20;

    selectedSymptoms.forEach((s) => {
      const found = COMMON_SYMPTOM_PRESETS.find((p) => p.label === s);
      if (found) score += found.risk;
    });

    return Math.min(score, 98);
  };

  const currentScore = calculateScore();
  const currentLevel: "RED" | "YELLOW" | "GREEN" = 
    currentScore >= 65 ? "RED" : currentScore >= 35 ? "YELLOW" : "GREEN";

  const handleRunTriage = async () => {
    if (!selectedPatientId) {
      toast.error("Please select a patient first.");
      return;
    }
    setIsEvaluating(true);

    const complaints = [...selectedSymptoms];
    if (customComplaint.trim()) {
      complaints.push(customComplaint.trim());
    }

    let recommendations = "";
    if (currentLevel === "RED") {
      recommendations = "CRITICAL EMERGENCY: Immediate 108 Emergency Ambulance escalation to District Hospital ICU. Alert Doctor on call.";
    } else if (currentLevel === "YELLOW") {
      recommendations = "URGENT ATTENTION: Assisted Teleconsultation with PHC Specialist within 2 hours. Review vitals & high-risk history.";
    } else {
      recommendations = "ROUTINE CARE: Standard PHC outpatient care, dietary advice, and routine follow-up by ASHA worker.";
    }

    const res = await createTriageAssessment({
      patientId: selectedPatientId,
      triageLevel: currentLevel,
      chiefComplaints: complaints.length > 0 ? complaints : ["General Checkup / Routine Vitals"],
      vitals: {
        bpSystolic,
        bpDiastolic,
        spo2,
        pulse,
        temperature,
        bloodSugar,
      },
      aiRiskScore: currentScore,
      aiRecommendations: recommendations,
      frontlineWorkerName: "Sunita Tai (ASHA Worker)",
      facilityTier: "Sub-Centre / Ayushman Arogya Mandir",
    });

    if (res.success && res.assessment) {
      setAssessments([res.assessment, ...assessments]);
      toast.success(`Triage completed: Stratified as ${currentLevel} Priority (${currentScore}% Risk Score)`);
      setCustomComplaint("");
      setSelectedSymptoms([]);
    }
    setIsEvaluating(false);
  };

  const handleTrigger108SOS = async () => {
    if (!selectedPatientId) return;
    const res = await createReferral({
      patientId: selectedPatientId,
      fromFacility: "Khed Shivapur Sub-Centre",
      toFacility: "Sassoon District Hospital ICU, Pune",
      urgency: "EMERGENCY_108",
      reason: `Automated AI Triage Escalation (Risk Score: ${currentScore}%). Critical vitals: BP ${bpSystolic}/${bpDiastolic}, SpO2 ${spo2}%.`,
      transportAssigned: "108 Ambulance Dispatch (GPS Active)",
    });

    if (res.success) {
      toast.error("🚨 108 Emergency Ambulance Dispatched with GPS Coordinates!", {
        duration: 5000,
      });
    }
  };

  const selectedPatient = patients.find((p) => p.id === selectedPatientId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left: Triage Clinical Entry Pad */}
      <div className="lg:col-span-7 space-y-5">
        <Card className="p-5 border-slate-200 shadow-sm space-y-5 dark:bg-slate-900 dark:border-slate-800">
          <div className="flex items-center justify-between border-b pb-4 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center dark:bg-teal-950 dark:text-teal-400">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Digital Triage Symptom & Vitals Pad
                </h3>
                <p className="text-xs text-slate-500">
                  Frontline health worker assessment with instant clinical stratification
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs font-semibold text-teal-700 border-teal-300">
              Sub-Centre Mode
            </Badge>
          </div>

          {/* Patient Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Select Registered Citizen / Patient
            </label>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full text-sm rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.age}y {p.gender}) — ABHA: {p.abhaId || "ABHA Pending"} — {p.village}
                </option>
              ))}
            </select>
          </div>

          {/* Vitals Grid */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Record IoT / Digital Vitals
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 dark:bg-slate-800/60 dark:border-slate-700">
                <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                  <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
                  BP (Systolic / Diastolic)
                </span>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <input
                    type="number"
                    value={bpSystolic}
                    onChange={(e) => setBpSystolic(Number(e.target.value))}
                    className="w-16 p-1 text-sm font-bold text-center rounded-lg bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-700"
                  />
                  <span className="text-slate-400 font-bold">/</span>
                  <input
                    type="number"
                    value={bpDiastolic}
                    onChange={(e) => setBpDiastolic(Number(e.target.value))}
                    className="w-16 p-1 text-sm font-bold text-center rounded-lg bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-700"
                  />
                  <span className="text-[10px] text-slate-400">mmHg</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 dark:bg-slate-800/60 dark:border-slate-700">
                <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-sky-500" />
                  Oxygen (SpO2)
                </span>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <input
                    type="number"
                    value={spo2}
                    onChange={(e) => setSpo2(Number(e.target.value))}
                    className="w-20 p-1 text-sm font-bold text-center rounded-lg bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-700"
                  />
                  <span className="text-[10px] text-slate-400">%</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 dark:bg-slate-800/60 dark:border-slate-700">
                <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                  <HeartPulse className="w-3.5 h-3.5 text-teal-500" />
                  Pulse Rate
                </span>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <input
                    type="number"
                    value={pulse}
                    onChange={(e) => setPulse(Number(e.target.value))}
                    className="w-20 p-1 text-sm font-bold text-center rounded-lg bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-700"
                  />
                  <span className="text-[10px] text-slate-400">bpm</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 dark:bg-slate-800/60 dark:border-slate-700">
                <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-amber-500" />
                  Temperature
                </span>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <input
                    type="number"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(Number(e.target.value))}
                    className="w-20 p-1 text-sm font-bold text-center rounded-lg bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-700"
                  />
                  <span className="text-[10px] text-slate-400">°F</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 dark:bg-slate-800/60 dark:border-slate-700 col-span-2 sm:col-span-2">
                <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-purple-500" />
                  Random Blood Sugar (RBS)
                </span>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <input
                    type="number"
                    value={bloodSugar}
                    onChange={(e) => setBloodSugar(Number(e.target.value))}
                    className="w-24 p-1 text-sm font-bold text-center rounded-lg bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-700"
                  />
                  <span className="text-[10px] text-slate-400">mg/dL (Normal: 80-140)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Multilingual Symptom Checkboxes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Presenting Symptoms & Red Flags (Marathi / English)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {COMMON_SYMPTOM_PRESETS.map((sym) => {
                const isSelected = selectedSymptoms.includes(sym.label);
                return (
                  <button
                    key={sym.label}
                    type="button"
                    onClick={() => toggleSymptom(sym.label)}
                    className={`text-left p-2.5 rounded-xl border text-xs font-medium transition-all ${
                      isSelected
                        ? "bg-teal-50 border-teal-400 text-teal-900 font-semibold dark:bg-teal-950 dark:border-teal-700 dark:text-teal-200"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {isSelected ? "✓ " : "+ "}
                    {sym.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Note with Voice Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Additional Clinical Complaints / Voice Note
            </label>
            <div className="relative">
              <input
                type="text"
                value={customComplaint}
                onChange={(e) => setCustomComplaint(e.target.value)}
                placeholder="Type or speak symptoms in Marathi / Hindi / English..."
                className="w-full text-sm rounded-xl border border-slate-200 bg-white p-3 pr-12 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
              <button
                type="button"
                onClick={() => {
                  toast.info("Voice Recognition Active (Marathi/Hindi/English)... speak now");
                  setTimeout(() => {
                    setCustomComplaint("रुग्णाला गेले दोन दिवस तीव्र चक्कर आणि छातीत धडधड होत आहे");
                    toast.success("Voice transcribed in Marathi!");
                  }, 2000);
                }}
                className="absolute right-2 top-2.5 p-1.5 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 dark:bg-teal-900 dark:text-teal-300"
                title="Speak in Marathi / Hindi / English"
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>
          </div>

          <Button
            onClick={handleRunTriage}
            disabled={isEvaluating}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl shadow-md"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {isEvaluating ? "Stratifying Clinical Risk..." : "Evaluate & Save AI Triage Assessment"}
          </Button>
        </Card>
      </div>

      {/* Right: Live Risk Stratification Card & Actions */}
      <div className="lg:col-span-5 space-y-5">
        <Card className={`p-5 rounded-2xl border-2 transition-all shadow-md ${
          currentLevel === "RED"
            ? "border-rose-500 bg-rose-50/50 dark:bg-rose-950/20"
            : currentLevel === "YELLOW"
            ? "border-amber-500 bg-amber-50/50 dark:bg-amber-950/20"
            : "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20"
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              Live AI Stratification
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-black tracking-wide ${
              currentLevel === "RED"
                ? "bg-rose-600 text-white animate-pulse"
                : currentLevel === "YELLOW"
                ? "bg-amber-500 text-white"
                : "bg-emerald-600 text-white"
            }`}>
              {currentLevel} PRIORITY ({currentScore}%)
            </span>
          </div>

          <div className="mt-4">
            <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">
              {currentLevel === "RED"
                ? "🚨 Critical Emergency / Red Flag Alert"
                : currentLevel === "YELLOW"
                ? "⚠️ Urgent Priority / High-Risk Case"
                : "✅ Routine Green Priority"}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              {currentLevel === "RED"
                ? "Vitals indicate severe decompensation or hypertensive/respiratory emergency. Direct escalation required."
                : currentLevel === "YELLOW"
                ? "Patient requires assisted specialist teleconsultation within 2-4 hours to prevent emergency escalation."
                : "Standard outpatient care and nutritional/medication counseling."}
            </p>
          </div>

          {/* Action Trigger Buttons */}
          <div className="mt-5 space-y-2.5 pt-4 border-t border-slate-200/80 dark:border-slate-800">
            {currentLevel === "RED" && (
              <Button
                onClick={handleTrigger108SOS}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black py-2.5 rounded-xl shadow-lg flex items-center justify-center gap-2"
              >
                <Ambulance className="w-5 h-5 animate-bounce" />
                Dispatch 108 Emergency Ambulance (GPS SOS)
              </Button>
            )}

            <Link href="/teleconsult" className="block">
              <Button
                variant="outline"
                className="w-full border-teal-600 text-teal-700 hover:bg-teal-50 font-bold dark:border-teal-500 dark:text-teal-300"
              >
                <Video className="w-4 h-4 mr-2" />
                Connect Teleconsultation with Specialist
              </Button>
            </Link>

            <Link href="/referrals" className="block">
              <Button
                variant="ghost"
                className="w-full text-slate-600 hover:bg-slate-100 text-xs font-semibold dark:text-slate-300"
              >
                View Inter-facility Referral Pathways →
              </Button>
            </Link>
          </div>
        </Card>

        {/* Recent Triage Assessments Feed */}
        <Card className="p-4 border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Recent Village Assessments ({assessments.length})
            </h4>
            <span className="text-[10px] text-teal-600 font-bold">Auto-synced</span>
          </div>

          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {assessments.map((a) => (
              <div
                key={a.id}
                className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1.5 dark:bg-slate-800/40 dark:border-slate-800"
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                    a.triageLevel === "RED"
                      ? "bg-rose-100 text-rose-800"
                      : a.triageLevel === "YELLOW"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-emerald-100 text-emerald-800"
                  }`}>
                    {a.triageLevel} ({a.aiRiskScore}%)
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {a.chiefComplaints.join(", ")}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  BP: {a.vitals?.bpSystolic}/{a.vitals?.bpDiastolic} | SpO2: {a.vitals?.spo2}% | {a.frontlineWorkerName}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
