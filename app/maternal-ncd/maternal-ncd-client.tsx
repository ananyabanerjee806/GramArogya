"use client";

import { useState } from "react";
import { MaternalNcdRecordSelect } from "@/db/schema";
import { Patient } from "@/types";
import { createMaternalNcdRecord } from "@/actions/maternal-ncd";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  AlertCircle, 
  Baby, 
  Calendar, 
  CheckCircle2, 
  HeartHandshake, 
  HeartPulse, 
  Plus, 
  ShieldAlert, 
  Stethoscope, 
  UserCheck 
} from "lucide-react";
import { toast } from "sonner";

interface MaternalNcdClientViewProps {
  initialPatients: Patient[];
  initialRecords: MaternalNcdRecordSelect[];
}


export function MaternalNcdClientView({ initialPatients, initialRecords }: MaternalNcdClientViewProps) {
  const [patients] = useState<Patient[]>(initialPatients);
  const [records, setRecords] = useState<MaternalNcdRecordSelect[]>(initialRecords);

  const [activeTab, setActiveTab] = useState<"ALL" | "ANC_MATERNAL" | "CHRONIC_NCD">("ALL");

  // Form State
  const [showModal, setShowModal] = useState<boolean>(false);
  const [patientId, setPatientId] = useState<string>(patients[0]?.id || "");
  const [recordType, setRecordType] = useState<"ANC_MATERNAL" | "PNC_INFANT" | "CHRONIC_NCD">("ANC_MATERNAL");
  const [stage, setStage] = useState<string>("3rd Trimester (32 Wks)");
  const [hb, setHb] = useState<string>("8.2 g/dL");
  const [bp, setBp] = useState<string>("118/76 mmHg");
  const [sugar, setSugar] = useState<string>("92 mg/dL");
  const [riskFactorInput, setRiskFactorInput] = useState<string>("Moderate Nutritional Anemia");

  const filteredRecords = records.filter((r) => activeTab === "ALL" || r.recordType === activeTab);

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await createMaternalNcdRecord({
      patientId,
      recordType,
      trimesterOrStage: stage,
      hemoglobin: hb,
      bloodPressure: bp,
      bloodSugar: sugar,
      highRiskAlert: true,
      riskFactors: [riskFactorInput],
      nextFollowUpDays: 7,
      ashaAssigned: "Sunita Tai (ASHA Worker)",
    });

    if (res.success && res.record) {
      setRecords([res.record, ...records]);
      setShowModal(false);
      toast.success("High-risk patient follow-up encounter recorded!");
    }
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200 dark:bg-slate-900 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-rose-700">
              High-Risk ANC Mothers
            </span>
            <Baby className="w-5 h-5 text-rose-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
            {records.filter(r => r.recordType === "ANC_MATERNAL").length}
          </div>
          <p className="text-[11px] text-rose-600 mt-1 font-semibold">
            100% Assigned to ASHA Weekly Home Visits
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200 dark:bg-slate-900 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-teal-700">
              Chronic NCD Patients
            </span>
            <HeartPulse className="w-5 h-5 text-teal-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
            {records.filter(r => r.recordType === "CHRONIC_NCD").length}
          </div>
          <p className="text-[11px] text-teal-600 mt-1 font-semibold">
            Hypertension & Diabetes Longitudinal Cohort
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 dark:bg-slate-900 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-purple-700">
              Referral & Adherence Rate
            </span>
            <UserCheck className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
            94.2%
          </div>
          <p className="text-[11px] text-purple-600 mt-1 font-semibold">
            Zero Maternal Deaths in Covered Ward
          </p>
        </div>
      </div>

      {/* Main List */}
      <Card className="p-5 border-slate-200 shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b pb-3 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("ALL")}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
                activeTab === "ALL"
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              All Cohorts
            </button>
            <button
              onClick={() => setActiveTab("ANC_MATERNAL")}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
                activeTab === "ANC_MATERNAL"
                  ? "bg-rose-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              Maternal ANC/PNC
            </button>
            <button
              onClick={() => setActiveTab("CHRONIC_NCD")}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
                activeTab === "CHRONIC_NCD"
                  ? "bg-teal-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              Chronic NCD Care
            </button>
          </div>

          <Button
            onClick={() => setShowModal(true)}
            size="sm"
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Patient Encounter
          </Button>
        </div>

        {/* Record Cards */}
        <div className="grid grid-cols-1 gap-3">
          {filteredRecords.map((rec) => {
            const pt = patients.find((p) => p.id === rec.patientId);
            return (
              <div
                key={rec.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2.5 dark:bg-slate-800/40 dark:border-slate-700"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                      rec.recordType === "ANC_MATERNAL"
                        ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                        : "bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300"
                    }`}>
                      {rec.recordType === "ANC_MATERNAL" ? "🤰 MATERNAL ANC" : "🩺 CHRONIC NCD"}
                    </span>
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {pt?.name} ({pt?.age}y {pt?.gender})
                    </h4>
                  </div>
                  <span className="text-[11px] text-slate-500 font-semibold">
                    Village: {pt?.village}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-white border border-slate-200/80 dark:bg-slate-900 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 block font-bold">Stage</span>
                    <span className="font-semibold">{rec.trimesterOrStage}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200/80 dark:bg-slate-900 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 block font-bold">Hemoglobin (Hb)</span>
                    <span className="font-semibold text-rose-600">{rec.hemoglobin || "--"}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200/80 dark:bg-slate-900 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 block font-bold">Blood Pressure</span>
                    <span className="font-semibold">{rec.bloodPressure || "--"}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200/80 dark:bg-slate-900 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 block font-bold">Assigned ASHA</span>
                    <span className="font-semibold text-teal-700 dark:text-teal-400">{rec.ashaAssigned}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1 border-t dark:border-slate-700">
                  <div className="text-slate-600 dark:text-slate-300">
                    <strong className="text-slate-800 dark:text-white">Flagged Risks:</strong> {rec.riskFactors?.join(", ")}
                  </div>
                  <div className="text-teal-700 dark:text-teal-400 font-bold flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Next Follow-up: {rec.nextFollowUpDate ? new Date(rec.nextFollowUpDate).toLocaleDateString() : "Next Week"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Modal: Add Patient Encounter */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md p-6 bg-white dark:bg-slate-900 border-slate-200 shadow-2xl rounded-3xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3 dark:border-slate-800">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Record High-Risk Patient Encounter
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleAddRecord} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Citizen / Patient</label>
                <select
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full text-xs rounded-xl border p-2 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} ({p.village})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Cohort Type</label>
                <select
                  value={recordType}
                  onChange={(e) => setRecordType(e.target.value as any)}
                  className="w-full text-xs rounded-xl border p-2 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white font-bold"
                >
                  <option value="ANC_MATERNAL">Maternal ANC (Pregnancy)</option>
                  <option value="CHRONIC_NCD">Chronic NCD (Hypertension/Diabetes)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Stage / Weeks</label>
                  <input
                    type="text"
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                    className="w-full text-xs rounded-xl border p-2 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Hemoglobin</label>
                  <input
                    type="text"
                    value={hb}
                    onChange={(e) => setHb(e.target.value)}
                    className="w-full text-xs rounded-xl border p-2 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Blood Pressure</label>
                  <input
                    type="text"
                    value={bp}
                    onChange={(e) => setBp(e.target.value)}
                    className="w-full text-xs rounded-xl border p-2 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Risk Factors</label>
                  <input
                    type="text"
                    value={riskFactorInput}
                    onChange={(e) => setRiskFactorInput(e.target.value)}
                    className="w-full text-xs rounded-xl border p-2 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="rounded-xl text-xs">
                  Cancel
                </Button>
                <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs">
                  Save Encounter
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
