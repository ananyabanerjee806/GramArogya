"use client";

import { useState } from "react";
import { ReferralSelect } from "@/db/schema";
import { Patient } from "@/types";
import { createReferral, updateReferralStatus } from "@/actions/referrals";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Ambulance, 
  ArrowRight, 
  Building2, 
  CheckCircle2, 
  Clock, 
  Compass, 
  Hospital, 
  MapPin, 
  Navigation, 
  PhoneCall, 
  Plus, 
  Send, 
  ShieldAlert, 
  UserCheck 
} from "lucide-react";
import { toast } from "sonner";

interface ReferralsClientViewProps {
  initialPatients: Patient[];
  initialReferrals: ReferralSelect[];
}

const PUBLIC_HEALTH_FACILITY_TIERS = [
  { tier: "Sub-Centre / Arogya Mandir", example: "Khed Shivapur Sub-Centre", level: "Tier 1 - Primary Care" },
  { tier: "Primary Health Centre (PHC)", example: "Manchar Model PHC", level: "Tier 2 - Medical Officer & Lab" },
  { tier: "Rural Hospital (RH) / CHC", example: "Chakan 30-Bedded Rural Hospital", level: "Tier 3 - Specialists & Surgery" },
  { tier: "Sub-District / District Hospital (DH)", example: "Sassoon General Hospital & Medical College, Pune", level: "Tier 4 - Tertiary & ICU Care" },
];

export function ReferralsClientView({ initialPatients, initialReferrals }: ReferralsClientViewProps) {
  const [patients] = useState<Patient[]>(initialPatients);

  const [referrals, setReferrals] = useState<ReferralSelect[]>(initialReferrals);
  
  // New Referral Form
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [patientId, setPatientId] = useState<string>(patients[0]?.id || "");
  const [fromFacility, setFromFacility] = useState<string>("Khed Shivapur Sub-Centre");
  const [toFacility, setToFacility] = useState<string>("Chakan Rural Hospital (RH)");
  const [urgency, setUrgency] = useState<"EMERGENCY_108" | "URGENT_24H" | "ROUTINE">("URGENT_24H");
  const [reason, setReason] = useState<string>("");
  const [transportAssigned, setTransportAssigned] = useState<string>("108 Ambulance Dispatch");

  const handleCreateReferral = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      toast.error("Please enter a clinical reason for referral.");
      return;
    }

    const res = await createReferral({
      patientId,
      fromFacility,
      toFacility,
      urgency,
      reason,
      transportAssigned,
      escortWorker: "Sunita Tai (ASHA Worker)",
    });

    if (res.success && res.referral) {
      setReferrals([res.referral, ...referrals]);
      setShowCreateModal(false);
      setReason("");
      toast.success("Inter-facility referral initiated with longitudinal data linkage!");
    }
  };

  const handleAdvanceStatus = async (referralId: string, nextStatus: "INITIATED" | "IN_TRANSIT" | "ADMITTED" | "COMPLETED") => {
    await updateReferralStatus(referralId, nextStatus);
    setReferrals(referrals.map((r) => r.id === referralId ? { ...r, status: nextStatus } : r));
    toast.success(`Referral status updated to ${nextStatus}`);
  };

  return (
    <div className="space-y-6">
      {/* Visual Healthcare Hierarchy Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-900 via-emerald-800 to-slate-900 text-white shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-extrabold tracking-tight">
                Maharashtra Public Health Continuum Framework
              </h2>
            </div>
            <p className="text-xs text-emerald-200 mt-1 max-w-2xl">
              Eliminating information fragmentation as rural citizens move between sub-centres, PHCs, rural hospitals, and tertiary district centres.
            </p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-2 rounded-xl shadow-md"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Initiate Assisted Referral
          </Button>
        </div>

        {/* 4-Tier Visual Pathway */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-5 border-t border-emerald-700/60">
          {PUBLIC_HEALTH_FACILITY_TIERS.map((tier, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <div className="flex items-center justify-between text-[11px] font-bold text-emerald-300">
                <span>{tier.level}</span>
                <span>0{idx + 1}</span>
              </div>
              <h4 className="text-xs font-extrabold text-white mt-1">{tier.tier}</h4>
              <p className="text-[10px] text-slate-300 mt-0.5">{tier.example}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Active Referrals Registry */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Active Longitudinal Referrals & Transport Tracking ({referrals.length})
          </h3>
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            Real-time Facility Data Interoperability
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {referrals.map((ref) => {
            const patient = patients.find((p) => p.id === ref.patientId);
            return (
              <Card key={ref.id} className="p-5 border-slate-200 shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                        ref.urgency === "EMERGENCY_108"
                          ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 animate-pulse"
                          : ref.urgency === "URGENT_24H"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                          : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                      }`}>
                        {ref.urgency === "EMERGENCY_108" ? "🚨 108 EMERGENCY DISPATCH" : ref.urgency}
                      </span>
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                        {patient?.name} ({patient?.age}y {patient?.gender})
                      </h4>
                    </div>
                    <p className="text-xs text-slate-500">
                      ABHA ID: <span className="font-semibold text-slate-700 dark:text-slate-300">{patient?.abhaId || "ABHA-IN-4491"}</span> | Village: {patient?.village}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">Status:</span>
                    <span className={`text-xs font-extrabold px-3 py-1 rounded-xl border ${
                      ref.status === "IN_TRANSIT"
                        ? "bg-sky-50 text-sky-700 border-sky-300 dark:bg-sky-950 dark:text-sky-300"
                        : ref.status === "ADMITTED"
                        ? "bg-purple-50 text-purple-700 border-purple-300 dark:bg-purple-950 dark:text-purple-300"
                        : ref.status === "COMPLETED"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300"
                    }`}>
                      {ref.status}
                    </span>
                  </div>
                </div>

                {/* Pathway Visualizer */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 dark:bg-slate-800/50 dark:border-slate-700">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
                    <Hospital className="w-4 h-4 text-emerald-600" />
                    <span>Origin: {ref.fromFacility}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 font-bold text-xs">
                    <span>────────</span>
                    <Ambulance className="w-4 h-4 text-rose-500 animate-bounce" />
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
                    <Building2 className="w-4 h-4 text-sky-600" />
                    <span>Destination: {ref.toFacility}</span>
                  </div>
                </div>

                {/* Reason & Transport Details */}
                <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  <p><span className="font-bold text-slate-800 dark:text-white">Clinical Indication:</span> {ref.reason}</p>
                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-1">
                    <span>🚗 Transport: <strong className="text-slate-700 dark:text-slate-200">{ref.transportAssigned}</strong></span>
                    {ref.ambulanceTrackingId && (
                      <span className="text-rose-600 font-bold flex items-center gap-1">
                        <Navigation className="w-3 h-3" /> Live GPS: {ref.ambulanceTrackingId}
                      </span>
                    )}
                    <span>👩‍⚕️ Escort: {ref.escortWorker || "Sunita Tai (ASHA)"}</span>
                  </div>
                </div>

                {/* Action Stepper for Doctors / ASHA workers */}
                <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t dark:border-slate-800">
                  {ref.status === "INITIATED" && (
                    <Button
                      size="sm"
                      onClick={() => handleAdvanceStatus(ref.id, "IN_TRANSIT")}
                      className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl"
                    >
                      Mark Vehicle Dispatched / In-Transit
                    </Button>
                  )}
                  {ref.status === "IN_TRANSIT" && (
                    <Button
                      size="sm"
                      onClick={() => handleAdvanceStatus(ref.id, "ADMITTED")}
                      className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl"
                    >
                      Confirm Bed Admission at Receiving Hospital
                    </Button>
                  )}
                  {ref.status === "ADMITTED" && (
                    <Button
                      size="sm"
                      onClick={() => handleAdvanceStatus(ref.id, "COMPLETED")}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl"
                    >
                      Discharge & Transmit Follow-up Summary back to PHC
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Modal: Initiate Assisted Referral */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-lg p-6 bg-white dark:bg-slate-900 border-slate-200 shadow-2xl rounded-3xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Ambulance className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Initiate Inter-Facility Assisted Referral
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateReferral} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Citizen / Patient
                </label>
                <select
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.age}y {p.gender}) — {p.village}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Origin Facility
                  </label>
                  <input
                    type="text"
                    value={fromFacility}
                    onChange={(e) => setFromFacility(e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-200 p-2.5 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Destination Facility
                  </label>
                  <input
                    type="text"
                    value={toFacility}
                    onChange={(e) => setToFacility(e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-200 p-2.5 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Urgency Level
                  </label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as any)}
                    className="w-full text-xs rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-bold dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  >
                    <option value="ROUTINE">Routine Specialist Referral</option>
                    <option value="URGENT_24H">Urgent Care (Within 24h)</option>
                    <option value="EMERGENCY_108">🚨 108 Emergency Ambulance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Transport Arrangement
                  </label>
                  <input
                    type="text"
                    value={transportAssigned}
                    onChange={(e) => setTransportAssigned(e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-200 p-2.5 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Clinical Summary & Referral Reason
                </label>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Uncontrolled maternal anemia Hb 7.8, requiring secondary care IV Iron infusion..."
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-xl text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs"
                >
                  Confirm & Dispatch Referral
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
