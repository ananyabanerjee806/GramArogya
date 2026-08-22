"use client";

import { useState } from "react";
import { 
  SupportedLanguage, 
  SUPPORTED_LANGUAGES, 
  translateMedicalFrequency 
} from "@/lib/clinical/regional-translation";
import { Badge } from "@/components/ui/badge";
import { Globe, Languages, Sparkles, Check } from "lucide-react";

interface RegionalTranslationSelectorProps {
  frequencies: { name: string; frequency?: string }[];
  onLanguageChange?: (lang: SupportedLanguage) => void;
}

export function RegionalTranslationSelector({
  frequencies,
  onLanguageChange,
}: RegionalTranslationSelectorProps) {
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>('hi');

  const handleSelect = (lang: SupportedLanguage) => {
    setSelectedLang(lang);
    if (onLanguageChange) onLanguageChange(lang);
  };

  const activeLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === selectedLang) || SUPPORTED_LANGUAGES[1];

  return (
    <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-teal-50 border border-emerald-200 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/20 dark:border-emerald-900 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Languages className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Multi-Language Regional Translation Engine
          </span>
        </div>

        {/* Language Tabs */}
        <div className="flex items-center gap-1 flex-wrap">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => handleSelect(lang.code)}
              className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                selectedLang === lang.code
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-emerald-100 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              {lang.flag} {lang.nativeName}
            </button>
          ))}
        </div>
      </div>

      {/* Translations Preview Box */}
      <div className="space-y-1.5 pt-1">
        <span className="text-[10px] font-semibold text-slate-500 block uppercase">
          Patient Dosage Instructions in {activeLangObj.name} ({activeLangObj.nativeName}):
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {frequencies.slice(0, 4).map((item, idx) => {
            const translation = translateMedicalFrequency(item.frequency || '', selectedLang);
            return (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-white border border-emerald-100 dark:bg-slate-950 dark:border-slate-800 flex flex-col justify-between text-xs"
              >
                <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white mb-0.5">
                  <span>{item.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono font-normal">({item.frequency || 'Rx'})</span>
                </div>
                <div className="text-emerald-700 dark:text-emerald-300 font-semibold text-[11px]">
                  👉 {translation.timingSchedule}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
