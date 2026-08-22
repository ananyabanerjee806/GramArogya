"use client";

import { DrugInteractionWarning } from "@/lib/clinical/safety";
import { Badge } from "@/components/ui/badge";
import { AlertOctagon, AlertTriangle, ShieldCheck, Info } from "lucide-react";

interface DrugInteractionCardProps {
  warnings: DrugInteractionWarning[];
}

export function DrugInteractionCard({ warnings }: DrugInteractionCardProps) {
  if (!warnings || warnings.length === 0) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5 dark:bg-emerald-950/30 dark:border-emerald-900 flex items-center justify-between transition-all">
        <div className="flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>Safety Engine:</strong> No known adverse drug-to-drug interactions detected in this regimen.
          </span>
        </div>
        <Badge variant="success" className="text-[10px] uppercase tracking-wider font-bold">
          Safe Regimen
        </Badge>
      </div>
    );
  }

  const highCount = warnings.filter((w) => w.severity === "high").length;

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {highCount > 0 ? (
            <AlertOctagon className="w-4 h-4 text-rose-600 animate-pulse" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          )}
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Clinical Safety Alert: Drug-to-Drug Interaction ({warnings.length})
          </span>
        </div>
        <Badge
          variant={highCount > 0 ? "destructive" : "warning"}
          className="text-[10px] font-bold"
        >
          {highCount > 0 ? "High Risk Alert" : "Cautionary Precaution"}
        </Badge>
      </div>

      <div className="space-y-2">
        {warnings.map((w, idx) => (
          <div
            key={idx}
            className={`p-3.5 rounded-xl border transition-all ${
              w.severity === "high"
                ? "border-rose-300 bg-rose-50/80 dark:bg-rose-950/40 dark:border-rose-900 text-rose-950 dark:text-rose-100"
                : "border-amber-300 bg-amber-50/80 dark:bg-amber-950/40 dark:border-amber-900 text-amber-950 dark:text-amber-100"
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <h4 className="text-xs font-bold flex items-center gap-1.5">
                <span>{w.title}</span>
                <span className="text-[10px] opacity-75 font-mono">
                  ({w.drugs[0]} ⚡ {w.drugs[1]})
                </span>
              </h4>
              <Badge
                variant={w.severity === "high" ? "destructive" : "warning"}
                className="text-[9px] px-1.5 py-0 uppercase"
              >
                {w.severity}
              </Badge>
            </div>

            <p className="text-[11px] leading-relaxed opacity-90 mb-1.5">
              {w.description}
            </p>

            <div className="pt-1.5 border-t border-black/10 dark:border-white/10 text-[11px] font-semibold flex items-center gap-1">
              <span className="text-sky-700 dark:text-sky-300">💡 Clinical Advice:</span>
              <span>{w.recommendation}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
