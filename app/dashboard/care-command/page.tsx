import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { 
  Activity, 
  AlertCircle, 
  Ambulance, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Map, 
  ShieldAlert, 
  Users 
} from "lucide-react";

export default async function CareCommandPage() {
  // Mock data for prototype
  const stats = {
    activeJourneys: 42,
    criticalReferrals: 3,
    acceptancePending: 5,
    inTransit: 8,
    careDebts: 12,
    highRisk: 18,
    facilitiesStressed: 2
  };

  const funnelStages = [
    { name: "TRIAGED", count: 124, color: "bg-slate-100 text-slate-800" },
    { name: "LOCAL CARE", count: 86, color: "bg-emerald-50 text-emerald-800" },
    { name: "TELECONSULT", count: 14, color: "bg-blue-50 text-blue-800" },
    { name: "REFERRAL", count: 24, color: "bg-amber-50 text-amber-800" },
    { name: "ACCEPTED", count: 19, color: "bg-indigo-50 text-indigo-800" },
    { name: "IN TRANSIT", count: 8, color: "bg-orange-50 text-orange-800" },
    { name: "ARRIVED", count: 7, color: "bg-teal-50 text-teal-800" },
    { name: "TREATED", count: 5, color: "bg-emerald-100 text-emerald-900" },
    { name: "FOLLOW-UP", count: 3, color: "bg-purple-50 text-purple-800" },
    { name: "CLOSED", count: 2, color: "bg-slate-200 text-slate-900" },
  ];

  return (
    <div>
      <Header
        title="Care Command Center"
        subtitle="Real-time orchestration of patient care continuity across the district network"
      />

      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        {/* Top Hero / Closed Loop Care */}
        <div className="rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-emerald-100">
              <Activity className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
              Closed Loop Care Mesh
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Right Patient. Right Facility. Ready Facility. Completed Care.
            </h1>
            
            <p className="text-sm text-emerald-100/90 leading-relaxed max-w-2xl">
              We do not measure referrals created. We measure care completed. Monitor active patient journeys, identify dropped care, and orchestrate resources before a patient travels.
            </p>
          </div>
        </div>

        {/* Care Funnel UI */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-600" />
            Live Care Completion Funnel
          </h3>
          <div className="flex flex-wrap gap-2 items-center">
            {funnelStages.map((stage, idx) => (
              <React.Fragment key={stage.name}>
                <div className={`px-4 py-2 rounded-xl border border-white/20 shadow-sm flex flex-col items-center justify-center min-w-[100px] cursor-pointer hover:scale-105 transition-transform ${stage.color}`}>
                  <span className="text-2xl font-black">{stage.count}</span>
                  <span className="text-[10px] font-bold tracking-wider">{stage.name}</span>
                </div>
                {idx < funnelStages.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* KPI Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:bg-slate-900 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Active Care Journeys
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Map className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {stats.activeJourneys}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-rose-200/80 bg-rose-50/30 p-5 shadow-sm dark:bg-rose-950/20 dark:border-rose-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                Critical Care Debts
              </span>
              <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                <AlertCircle className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-rose-700 dark:text-rose-400">
                {stats.careDebts}
              </div>
              <p className="text-xs text-rose-600 mt-1">Requires immediate follow-up</p>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-200/80 bg-amber-50/30 p-5 shadow-sm dark:bg-amber-950/20 dark:border-amber-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Acceptance Pending
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-700 dark:text-amber-400">
                {stats.acceptancePending}
              </div>
              <p className="text-xs text-amber-600 mt-1">Referrals awaiting hospital confirmation</p>
            </div>
          </div>

          <div className="rounded-2xl border border-indigo-200/80 bg-indigo-50/30 p-5 shadow-sm dark:bg-indigo-950/20 dark:border-indigo-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                Patients In Transit
              </span>
              <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Ambulance className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-indigo-700 dark:text-indigo-400">
                {stats.inTransit}
              </div>
              <p className="text-xs text-indigo-600 mt-1">Via 108 or Facility Transport</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
