import { getPatients } from "@/actions/patients";
import { getPrescriptions } from "@/actions/prescriptions";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { 
  Users, 
  FileText, 
  UploadCloud, 
  Star, 
  Sparkles, 
  Plus, 
  ArrowUpRight, 
  Clock, 
  Activity, 
  Pill, 
  CheckCircle2, 
  ShieldAlert 
} from "lucide-react";
import { DashboardClientView } from "./dashboard-client";

export default async function DashboardPage() {
  const patients = await getPatients();
  const prescriptions = await getPrescriptions();

  const totalPatients = patients.length;
  const totalPrescriptions = prescriptions.length;
  const importantPrescriptions = prescriptions.filter((p) => p.important).length;
  
  // Digitized in last 24 hours
  const now = Date.now();
  const oneDayAgo = now - 24 * 60 * 60 * 1000;
  const recentPrescriptionsCount = prescriptions.filter(
    (p) => new Date(p.createdAt).getTime() >= oneDayAgo
  ).length;

  return (
    <div>
      <Header
        title="Clinical Overview Dashboard"
        subtitle="Medical records, digitized prescriptions, and active patient registry"
      />

      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        {/* Top Hero / Welcome Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-sky-700 via-blue-600 to-indigo-700 p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-sky-100">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              Tesseract OCR + Google Gemini Flash Intelligence
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Digitize handwritten prescriptions in under 15 seconds.
            </h1>
            
            <p className="text-sm text-sky-100/90 leading-relaxed">
              Upload prescription images, let AI extract medications and dosages, review the structured record, and maintain patient history with complete authority.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <Link href="/upload">
                <Button
                  size="lg"
                  className="bg-white text-slate-900 hover:bg-slate-100 font-bold shadow-lg"
                >
                  <UploadCloud className="w-4 h-4 text-sky-600 mr-2" />
                  Scan New Prescription
                </Button>
              </Link>
              <Link href="/patients">
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-sky-600/30 text-white border-white/30 hover:bg-white/20 font-semibold"
                >
                  <Users className="w-4 h-4 mr-2" />
                  View Patients
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* KPI Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Stat 1: Total Patients */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:bg-slate-900 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Total Patients
              </span>
              <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center dark:bg-sky-950 dark:text-sky-400">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {totalPatients}
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <span className="text-emerald-600 font-semibold">Active Registry</span>
              </p>
            </div>
          </div>

          {/* Stat 2: Total Prescriptions */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:bg-slate-900 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Prescriptions Digitized
              </span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center dark:bg-blue-950 dark:text-blue-400">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {totalPrescriptions}
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <span className="text-sky-600 font-semibold">{recentPrescriptionsCount} in last 24h</span>
              </p>
            </div>
          </div>

          {/* Stat 3: Starred Important */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:bg-slate-900 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Important Records
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center dark:bg-amber-950 dark:text-amber-400">
                <Star className="w-5 h-5 fill-amber-500" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {importantPrescriptions}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Pinned at top for quick access
              </p>
            </div>
          </div>

          {/* Stat 4: OCR Engine Status */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:bg-slate-900 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                AI Accuracy Engine
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center dark:bg-emerald-950 dark:text-emerald-400">
                <Activity className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                Dual-Stage
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Tesseract + Gemini Flash
              </p>
            </div>
          </div>

        </div>

        {/* Client Interactive Table & Recent Uploads */}
        <DashboardClientView
          initialPrescriptions={prescriptions}
          initialPatients={patients}
        />
      </div>
    </div>
  );
}
