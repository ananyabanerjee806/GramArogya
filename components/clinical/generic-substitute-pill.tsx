"use client";

import { findGenericAlternative } from "@/lib/clinical/safety";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, DollarSign } from "lucide-react";

interface GenericSubstitutePillProps {
  medicineName: string;
  onApplyGeneric: (genericName: string) => void;
}

export function GenericSubstitutePill({
  medicineName,
  onApplyGeneric,
}: GenericSubstitutePillProps) {
  const genericInfo = findGenericAlternative(medicineName);

  if (!genericInfo) return null;

  // Don't show if the medicine is already generic
  if (medicineName.toLowerCase().includes(genericInfo.genericName.toLowerCase().slice(0, 8))) {
    return null;
  }

  return (
    <div className="mt-1.5 p-2 rounded-lg bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-900 text-xs flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-1.5 text-emerald-900 dark:text-emerald-200">
        <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span>
          <strong>Generic Equivalent:</strong> {genericInfo.genericName}
        </span>
        <Badge variant="success" className="text-[10px] px-1.5 py-0">
          ~{genericInfo.averageSavingsPercent}% Cost Saver
        </Badge>
      </div>

      <button
        type="button"
        onClick={() => onApplyGeneric(genericInfo.genericName)}
        className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-900 underline hover:no-underline bg-emerald-100 hover:bg-emerald-200 px-2 py-0.5 rounded transition-colors cursor-pointer dark:bg-emerald-900 dark:text-emerald-100"
      >
        Switch to Generic <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  );
}
