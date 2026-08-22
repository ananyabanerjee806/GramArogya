"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  AlertTriangle, 
  ArrowDownRight, 
  ArrowUpRight, 
  BarChart3, 
  Building2, 
  CheckCircle2, 
  Clock, 
  Download, 
  Flame, 
  HeartPulse, 
  Hospital, 
  MapPin, 
  Pill, 
  ShieldCheck, 
  TrendingDown, 
  TrendingUp, 
  Users 
} from "lucide-react";
import { toast } from "sonner";

const VILLAGE_OUTBREAK_SURVEILLANCE = [
  { village: "Khed Shivapur", block: "Haveli", dominantIssue: "Nutritional Anemia (ANC)", cases: 24, trend: "+12%", status: "WATCHLIST", alertColor: "text-amber-600 bg-amber-50 border-amber-200" },
  { village: "Manchar Gram", block: "Ambegaon", dominantIssue: "Hypertension in Elderly (NCD)", cases: 38, trend: "-4%", status: "STABLE", alertColor: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  { village: "Saswad Rural", block: "Purandar", dominantIssue: "Seasonal Dengue / Viral Fevers", cases: 19, trend: "+28%", status: "OUTBREAK_RISK", alertColor: "text-rose-600 bg-rose-50 border-rose-200" },
  { village: "Shirur Kasba", block: "Shirur", dominantIssue: "Type 2 Diabetes Foot Ulcers", cases: 14, trend: "0%", status: "CONTROLLED", alertColor: "text-sky-600 bg-sky-50 border-sky-200" },
];

export function FacilityAnalyticsClientView() {
  const [selectedDistrict, setSelectedDistrict] = useState<string>("Pune District");

  return (
    <div className="space-y-6">
      {/* Top Banner: District Performance Overview */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-extrabold tracking-tight">
              Maharashtra State Health Intelligence Portal
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Real-time public health metrics across 4 tiers of healthcare delivery, ensuring quality, accountability, and zero patient abandonment.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="text-xs font-bold rounded-xl bg-slate-800 border border-slate-700 p-2.5 text-white"
          >
            <option value="Pune District">Pune District (14 Blocks)</option>
            <option value="Satara District">Satara District (11 Blocks)</option>
            <option value="Nashik District">Nashik District (15 Blocks)</option>
          </select>
          <Button
            size="sm"
            onClick={() => toast.success("District Health Quality Report downloaded as PDF!")}
            className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl"
          >
            <Download className="w-4 h-4 mr-1.5" />
            Export Audit
          </Button>
        </div>
      </div>

      {/* 4 Key Public Health Outcome Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Wait Time Reduction */}
        <Card className="p-5 border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Average OPD Wait Time</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">12 Mins</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <TrendingDown className="w-3.5 h-3.5 mr-0.5" /> -68% vs 2024
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Reduced from 42 mins via digital tokens</p>
        </Card>

        {/* Metric 2: Referral Loop Completion */}
        <Card className="p-5 border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Referral Loop Closure</span>
            <Building2 className="w-4 h-4 text-sky-600" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">93.4%</span>
            <span className="text-xs font-bold text-sky-600 flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +24%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Patients reaching destination hospital</p>
        </Card>

        {/* Metric 3: Essential Drug Availability */}
        <Card className="p-5 border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Essential Drug Stock</span>
            <Pill className="w-4 h-4 text-teal-600" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">91.8%</span>
            <span className="text-xs font-bold text-teal-600 flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-0.5" /> High Stock
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">PHC Essential Drugs + Jan Aushadhi</p>
        </Card>

        {/* Metric 4: High-Risk Maternal Follow-up */}
        <Card className="p-5 border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Maternal Anemia Tracking</span>
            <HeartPulse className="w-4 h-4 text-rose-600" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">100%</span>
            <span className="text-xs font-bold text-rose-600 flex items-center">
              Zero Deaths
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Active ASHA weekly home visits</p>
        </Card>

      </div>

      {/* Grid: Disease Outbreak Surveillance & Referral Flow Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Outbreak Heatmap Table (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="p-5 border-slate-200 shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
            <div className="flex items-center justify-between border-b pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-rose-600" />
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Village Epidemic & Outbreak Early-Warning Surveillance
                </h3>
              </div>
              <Badge variant="outline" className="text-[10px] text-rose-700 border-rose-300 font-bold">
                AI Early Alert
              </Badge>
            </div>

            <div className="space-y-3">
              {VILLAGE_OUTBREAK_SURVEILLANCE.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/60 flex flex-wrap items-center justify-between gap-3 dark:bg-slate-800/40 dark:border-slate-800"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {item.village} ({item.block} Block)
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Dominant Pattern: <strong className="text-slate-700 dark:text-slate-200">{item.dominantIssue}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-xs font-black text-slate-900 dark:text-white block">
                        {item.cases} Flagged Cases
                      </span>
                      <span className={`text-[10px] font-bold ${item.trend.startsWith('+') ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {item.trend} this week
                      </span>
                    </div>

                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-xl border ${item.alertColor}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* 4-Tier Patient Journey Flow Stats (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-5 border-slate-200 shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
            <div className="flex items-center gap-2 border-b pb-3 dark:border-slate-800">
              <Hospital className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Continuum Flow by Healthcare Tier
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1 dark:bg-slate-800/40 dark:border-slate-700">
                <div className="flex justify-between font-bold text-slate-800 dark:text-white">
                  <span>Tier 1: Sub-Centres / Arogya Mandir</span>
                  <span className="text-emerald-600">4,812 Consults</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden dark:bg-slate-700">
                  <div className="bg-emerald-500 h-full w-[82%]" />
                </div>
                <span className="text-[10px] text-slate-500">82% resolved at village level without travel</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1 dark:bg-slate-800/40 dark:border-slate-700">
                <div className="flex justify-between font-bold text-slate-800 dark:text-white">
                  <span>Tier 2: Primary Health Centres (PHC)</span>
                  <span className="text-sky-600">1,240 Consults</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden dark:bg-slate-700">
                  <div className="bg-sky-500 h-full w-[65%]" />
                </div>
                <span className="text-[10px] text-slate-500">Diagnostics & Tele-specialist link</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1 dark:bg-slate-800/40 dark:border-slate-700">
                <div className="flex justify-between font-bold text-slate-800 dark:text-white">
                  <span>Tier 3 & 4: Rural & District Hospitals</span>
                  <span className="text-purple-600">318 Emergency Referrals</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden dark:bg-slate-700">
                  <div className="bg-purple-500 h-full w-[94%]" />
                </div>
                <span className="text-[10px] text-slate-500">94% admitted within golden hour via 108</span>
              </div>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
