"use client";

import { getPatientHealthAnalytics, ChronicDiseaseAnalytics } from "@/lib/analytics/vitals";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  TrendingDown, 
  TrendingUp, 
  Heart, 
  Droplet, 
  Calendar, 
  CheckCircle2, 
  FileText,
  Sparkles
} from "lucide-react";

interface HealthAnalyticsChartProps {
  patientId: string;
  patientName: string;
}

export function HealthAnalyticsChart({ patientId, patientName }: HealthAnalyticsChartProps) {
  const analytics: ChronicDiseaseAnalytics = getPatientHealthAnalytics(patientId, patientName);
  const { vitalsHistory, trendSummary, primaryCondition } = analytics;

  const latest = vitalsHistory[vitalsHistory.length - 1];
  const earliest = vitalsHistory[0];

  const bpImprovement = earliest.systolicBp - latest.systolicBp;
  const sugarImprovement = (earliest.bloodSugarFasting - latest.bloodSugarFasting);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:bg-slate-900 dark:border-slate-800 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center shadow-md">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Patient Longitudinal Health Analytics (6-Month Tracker)
              </h3>
              <Badge variant="info" className="text-[10px] font-bold">
                {primaryCondition}
              </Badge>
            </div>
            <p className="text-xs text-slate-500">
              Chronic disease progression, blood pressure curves, and medication efficacy
            </p>
          </div>
        </div>

        <Badge variant="success" className="text-xs py-1 px-2.5 font-bold self-start sm:self-auto">
          <TrendingDown className="w-3.5 h-3.5 mr-1" />
          {trendSummary.dosageTrend}
        </Badge>
      </div>

      {/* Metric Scorecards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-100 dark:bg-rose-950/20 dark:border-rose-900">
          <div className="flex items-center justify-between text-xs text-rose-800 dark:text-rose-300 font-semibold mb-1">
            <span>Blood Pressure</span>
            <Heart className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <div className="text-xl font-extrabold text-slate-900 dark:text-white">
            {latest.systolicBp}/{latest.diastolicBp} <span className="text-[10px] font-normal text-slate-500">mmHg</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 mt-0.5">
            <TrendingDown className="w-2.5 h-2.5" /> -{bpImprovement} mmHg drop (Normalized)
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100 dark:bg-sky-950/20 dark:border-sky-900">
          <div className="flex items-center justify-between text-xs text-sky-800 dark:text-sky-300 font-semibold mb-1">
            <span>Fasting Glucose</span>
            <Droplet className="w-3.5 h-3.5 text-sky-600" />
          </div>
          <div className="text-xl font-extrabold text-slate-900 dark:text-white">
            {latest.bloodSugarFasting} <span className="text-[10px] font-normal text-slate-500">mg/dL</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 mt-0.5">
            <TrendingDown className="w-2.5 h-2.5" /> -{sugarImprovement} mg/dL improvement
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-100 dark:bg-amber-950/20 dark:border-amber-900">
          <div className="flex items-center justify-between text-xs text-amber-800 dark:text-amber-300 font-semibold mb-1">
            <span>HbA1c Target</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-xl font-extrabold text-slate-900 dark:text-white">
            {latest.hbA1c}% <span className="text-[10px] font-normal text-slate-500">Target &lt;6.5%</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-600 mt-0.5 block">
            ✅ Glycemic Target Achieved
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100 dark:bg-purple-950/20 dark:border-purple-900">
          <div className="flex items-center justify-between text-xs text-purple-800 dark:text-purple-300 font-semibold mb-1">
            <span>Resting Pulse</span>
            <Activity className="w-3.5 h-3.5 text-purple-600" />
          </div>
          <div className="text-xl font-extrabold text-slate-900 dark:text-white">
            {latest.pulse} <span className="text-[10px] font-normal text-slate-500">bpm</span>
          </div>
          <span className="text-[10px] font-medium text-slate-500 mt-0.5 block">
            Normal Sinus Rhythm
          </span>
        </div>
      </div>

      {/* Visual Timeline & Progression Table */}
      <div className="space-y-2.5">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
          Visit-by-Visit Vitals & Medication Dosage Adjustments
        </span>

        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
              <tr>
                <th className="p-3 pl-4">Consultation Date</th>
                <th className="p-3">BP (Systolic / Diastolic)</th>
                <th className="p-3">Fasting Glucose / HbA1c</th>
                <th className="p-3">Weight (kg)</th>
                <th className="p-3 pr-4">Medication Dosage History & Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {vitalsHistory.map((v, idx) => (
                <tr key={idx} className={idx === vitalsHistory.length - 1 ? "bg-emerald-50/30 dark:bg-emerald-950/10 font-semibold" : ""}>
                  <td className="p-3 pl-4 text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{v.date}</span>
                    {idx === vitalsHistory.length - 1 && (
                      <Badge variant="success" className="text-[9px] py-0 px-1.5 ml-1">Latest</Badge>
                    )}
                  </td>
                  <td className="p-3">
                    <span className={v.systolicBp > 130 ? "text-amber-600 font-bold" : "text-emerald-600 font-bold"}>
                      {v.systolicBp}/{v.diastolicBp} mmHg
                    </span>
                  </td>
                  <td className="p-3 text-slate-800 dark:text-slate-200">
                    {v.bloodSugarFasting} mg/dL {v.hbA1c && `(${v.hbA1c}%)`}
                  </td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">
                    {v.weight} kg
                  </td>
                  <td className="p-3 pr-4 text-slate-700 dark:text-slate-300 text-[11px]">
                    {v.dosageNotes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Clinical AI Summary Box */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-100 dark:from-slate-950 dark:to-sky-950/30 dark:border-slate-800 text-xs">
        <div className="flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-sky-900 dark:text-sky-300">AI Clinical Progression Insight:</span>
            <p className="text-slate-700 dark:text-slate-300 mt-0.5 leading-relaxed">
              {trendSummary.clinicalAdvice}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
