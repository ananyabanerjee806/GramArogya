"use client";

import { useState } from "react";
import { TeleconsultationSelect, OpdQueueSelect } from "@/db/schema";
import { Patient } from "@/types";
import { completeTeleconsultation, createTeleconsultationSession } from "@/actions/teleconsult";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff, 
  Stethoscope, 
  User, 
  HeartPulse, 
  FileText, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Download, 
  Share2, 
  Pill, 
  Radio 
} from "lucide-react";
import { toast } from "sonner";

interface TeleconsultClientViewProps {
  initialPatients: Patient[];
  initialSessions: TeleconsultationSelect[];
  initialQueue: OpdQueueSelect[];
}

export function TeleconsultClientView({
  initialPatients,
  initialSessions,
  initialQueue,
}: TeleconsultClientViewProps) {
  const [patients] = useState<Patient[]>(initialPatients);
  const [sessions, setSessions] = useState<TeleconsultationSelect[]>(initialSessions);
  const [queue] = useState<OpdQueueSelect[]>(initialQueue);

  
  const [activeSession, setActiveSession] = useState<TeleconsultationSelect | null>(sessions[0] || null);
  const [isVideoOn, setIsVideoOn] = useState<boolean>(true);
  const [isAudioOn, setIsAudioOn] = useState<boolean>(true);
  const [isLowBandwidthMode, setIsLowBandwidthMode] = useState<boolean>(false);

  // Live Prescription Builder inside Teleconsult
  const [rxNotes, setRxNotes] = useState<string>("Continue oral iron therapy. Add Tab. Paracetamol 500mg SOS. Review in 15 days.");
  const [prescribedMeds, setPrescribedMeds] = useState([
    { name: "Ferrous Ascorbate + Folic Acid", dosage: "100mg", freq: "1 OD", janAushadhi: "Jan Aushadhi Ferrous Sulphate (₹18 vs ₹180)" },
    { name: "Calcium Carbonate 500mg", dosage: "500mg", freq: "1 BD", janAushadhi: "Jan Aushadhi Calcium (₹22 vs ₹140)" }
  ]);

  const selectedPatient = patients.find((p) => p.id === activeSession?.patientId) || patients[0];

  const handleEndCallAndSignRx = async () => {
    if (!activeSession) return;
    const res = await completeTeleconsultation(activeSession.id, rxNotes, true);
    if (res.success) {
      toast.success("Teleconsultation completed & Digital Rx Digitally Signed by Doctor!", {
        duration: 4000,
      });
      setActiveSession({
        ...activeSession,
        status: "COMPLETED",
        clinicalNotes: rxNotes,
        digitalRxGiven: true,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Active Call Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm tracking-wide">
                Live Assisted Teleconsultation Room #104
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Low Latency WebRTC Active
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Doctor: Dr. Anand Joshi (MD ObGyn) ↔ ASHA Facilitator: Sunita Tai ↔ Patient: {selectedPatient?.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsLowBandwidthMode(!isLowBandwidthMode);
              toast.info(isLowBandwidthMode ? "Standard HD Video Mode" : "Adaptive 2G Low-Bandwidth Mode Activated");
            }}
            className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
              isLowBandwidthMode
                ? "bg-amber-500 text-slate-950 border-amber-400 font-bold"
                : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
            }`}
          >
            <Radio className="w-3.5 h-3.5 inline mr-1" />
            {isLowBandwidthMode ? "2G Low-Bandwidth Mode ON" : "Optimize for 2G Village"}
          </button>
        </div>
      </div>

      {/* Main Grid: Left Video / Center Live Rx Pad / Right Patient Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Video Feeds & Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="p-4 bg-slate-950 border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
            
            {/* Split Screen Video Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-h-[340px]">
              
              {/* Doctor Feed */}
              <div className="relative rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700/60 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
                <div className="w-20 h-20 rounded-full bg-slate-700 border-2 border-emerald-500/80 flex items-center justify-center text-emerald-400 shadow-xl mb-3">
                  <Stethoscope className="w-10 h-10" />
                </div>
                <h4 className="text-sm font-bold text-white">Dr. Anand Joshi, MD</h4>
                <p className="text-[11px] text-emerald-400 font-semibold">Specialist Doctor (Remote PHC/DH)</p>
                <span className="absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-md">
                  Audio/Video HD (30fps)
                </span>
              </div>

              {/* Patient + ASHA Worker Feed */}
              <div className="relative rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700/60 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
                <div className="w-20 h-20 rounded-full bg-slate-700 border-2 border-teal-500/80 flex items-center justify-center text-teal-300 shadow-xl mb-3">
                  <User className="w-10 h-10" />
                </div>
                <h4 className="text-sm font-bold text-white">{selectedPatient?.name}</h4>
                <p className="text-[11px] text-teal-300 font-semibold">Assisted by Sunita Tai (ASHA)</p>
                <span className="absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-md">
                  Khed Shivapur Sub-Centre
                </span>
              </div>
            </div>

            {/* Video Controls Toolbar */}
            <div className="mt-4 flex items-center justify-center gap-3 p-2 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAudioOn(!isAudioOn)}
                className={`rounded-xl border-slate-700 ${isAudioOn ? "bg-slate-800 text-white" : "bg-rose-600 text-white border-rose-500"}`}
              >
                {isAudioOn ? <Mic className="w-4 h-4 mr-1.5" /> : <MicOff className="w-4 h-4 mr-1.5" />}
                {isAudioOn ? "Mute" : "Unmute"}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`rounded-xl border-slate-700 ${isVideoOn ? "bg-slate-800 text-white" : "bg-rose-600 text-white border-rose-500"}`}
              >
                {isVideoOn ? <Video className="w-4 h-4 mr-1.5" /> : <VideoOff className="w-4 h-4 mr-1.5" />}
                {isVideoOn ? "Camera On" : "Camera Off"}
              </Button>

              <Button
                size="sm"
                onClick={handleEndCallAndSignRx}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-lg"
              >
                <PhoneOff className="w-4 h-4 mr-1.5" />
                Complete Consultation & Sign Rx
              </Button>
            </div>
          </Card>

          {/* Real-time Telemetry Bar */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Live BP</span>
              <p className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">104 / 66 mmHg</p>
              <span className="text-[10px] text-emerald-600 font-semibold">Normal Gestational</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-500 uppercase">SpO2 / Pulse</span>
              <p className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">98% / 84 bpm</p>
              <span className="text-[10px] text-sky-600 font-semibold">Stable Vitals</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Hemoglobin</span>
              <p className="text-base font-extrabold text-rose-600 mt-0.5">7.8 g/dL</p>
              <span className="text-[10px] text-rose-600 font-bold">Severe Anemia Alert</span>
            </div>
          </div>
        </div>

        {/* Right Column: Live Prescription & Doctor Orders Pad (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-5 border-slate-200 shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
            <div className="flex items-center justify-between border-b pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Live Digital Prescription Pad
                </h3>
              </div>
              <Badge variant="outline" className="text-[10px] text-emerald-700 border-emerald-300 font-bold">
                Doctor e-Sign Ready
              </Badge>
            </div>

            {/* Patient Header Details */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1 dark:bg-slate-800/60 dark:border-slate-700">
              <div className="flex justify-between font-semibold text-slate-800 dark:text-white">
                <span>Patient: {selectedPatient?.name}</span>
                <span>Age/Sex: {selectedPatient?.age}y / {selectedPatient?.gender}</span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400 text-[11px]">
                <span>ABHA: {selectedPatient?.abhaId || "ABHA-IN-9102"}</span>
                <span>Village: {selectedPatient?.village}</span>
              </div>
            </div>

            {/* Prescribed Medicines with Jan Aushadhi generic recommendations */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Prescribed Medicines & Jan Aushadhi Equivalents
              </label>
              <div className="space-y-2">
                {prescribedMeds.map((med, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1 dark:bg-slate-800/40 dark:border-slate-700">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                      <span>{med.name} ({med.dosage})</span>
                      <span className="text-emerald-700 dark:text-emerald-400">{med.freq}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold dark:text-emerald-400">
                      <Pill className="w-3 h-3 text-emerald-600" />
                      <span>{med.janAushadhi}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Doctor Clinical Notes */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Clinical Instructions & Referral Advice
              </label>
              <textarea
                rows={3}
                value={rxNotes}
                onChange={(e) => setRxNotes(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 bg-white p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
            </div>

            {/* Doctor Action Buttons */}
            <div className="space-y-2 pt-2 border-t dark:border-slate-800">
              <Button
                onClick={handleEndCallAndSignRx}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl shadow-md"
              >
                <ShieldCheck className="w-4 h-4 mr-2" />
                Sign with National Medical Commission (NMC) Digital Token
              </Button>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast.success("PDF Prescription generated and queued for printing at Sub-Centre!")}
                  className="rounded-xl text-xs font-semibold"
                >
                  <Download className="w-3.5 h-3.5 mr-1" />
                  Print PDF Rx
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast.success(`Prescription & dosage instructions sent via WhatsApp to ${selectedPatient?.phone}`)}
                  className="rounded-xl text-xs font-semibold text-emerald-700 border-emerald-300"
                >
                  <Share2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  WhatsApp to Patient
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
