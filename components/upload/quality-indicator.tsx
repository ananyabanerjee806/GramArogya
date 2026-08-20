"use client";

import { ImageQualityReport } from "@/types";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2, Info, Eye, Sparkles, Sun, Crop, Activity } from "lucide-react";

interface QualityIndicatorProps {
  report?: ImageQualityReport | null;
  onRetake?: () => void;
}

export function QualityIndicator({ report, onRetake }: QualityIndicatorProps) {
  if (!report) return null;

  const { isAcceptable, score, warnings, brightness, isBlurry, isLowLight, isTiltedOrCropped, dimensions } = report;

  let qualityVariant: "success" | "warning" | "destructive" = "success";
  let qualityText = "Excellent Quality";

  if (score >= 80) {
    qualityVariant = "success";
    qualityText = "Excellent Quality (Clear for OCR)";
  } else if (score >= 50) {
    qualityVariant = "warning";
    qualityText = "Acceptable (Some Handwriting May Vary)";
  } else {
    qualityVariant = "destructive";
    qualityText = "Low Quality (Review Strongly Advised)";
  }

  return (
    <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 dark:bg-slate-900/60 dark:border-slate-800 transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-sky-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Smart Image Quality Check (Phase 2)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            Score: {score}%
          </span>
          <Badge variant={qualityVariant} className="text-xs font-medium">
            {qualityText}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs mb-3">
        <div className="p-2 rounded-lg bg-white border border-slate-200/60 dark:bg-slate-950 dark:border-slate-800 flex items-center justify-between">
          <span className="text-slate-500">Lighting</span>
          <span className={isLowLight ? "text-amber-600 font-semibold" : "text-emerald-600 font-semibold"}>
            {brightness}
          </span>
        </div>
        <div className="p-2 rounded-lg bg-white border border-slate-200/60 dark:bg-slate-950 dark:border-slate-800 flex items-center justify-between">
          <span className="text-slate-500">Sharpness</span>
          <span className={isBlurry ? "text-amber-600 font-semibold" : "text-emerald-600 font-semibold"}>
            {isBlurry ? "Blurry" : "Sharp"}
          </span>
        </div>
        <div className="p-2 rounded-lg bg-white border border-slate-200/60 dark:bg-slate-950 dark:border-slate-800 flex items-center justify-between">
          <span className="text-slate-500">Resolution</span>
          <span className="text-slate-700 font-semibold dark:text-slate-300">
            {dimensions.width}×{dimensions.height}
          </span>
        </div>
        <div className="p-2 rounded-lg bg-white border border-slate-200/60 dark:bg-slate-950 dark:border-slate-800 flex items-center justify-between">
          <span className="text-slate-500">Pre-enhancement</span>
          <span className="text-sky-600 font-semibold">Sharp Ready</span>
        </div>
      </div>

      {warnings && warnings.length > 0 && (
        <div className="rounded-lg bg-amber-50/80 border border-amber-200/80 p-3 text-xs text-amber-800 dark:bg-amber-950/40 dark:border-amber-900 dark:text-amber-200">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">Quality Advisory:</p>
              <ul className="list-disc list-inside space-y-0.5">
                {warnings.map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
              {onRetake && (
                <button
                  type="button"
                  onClick={onRetake}
                  className="mt-2 text-xs font-semibold text-amber-900 underline hover:text-amber-700 cursor-pointer"
                >
                  Upload a clearer prescription image
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
