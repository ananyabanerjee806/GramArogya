"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UploadCloud, Plus, Stethoscope, Search } from "lucide-react";
import { useState } from "react";
import { PatientModal } from "@/components/patients/patient-modal";
import { useRouter } from "next/navigation";

export function Header({
  title,
  subtitle,
  children,
}: {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <header className="h-16 border-b border-slate-200/80 bg-white/70 backdrop-blur-md sticky top-0 z-20 px-8 flex items-center justify-between dark:bg-slate-900/70 dark:border-slate-800">
        <div>
          {title ? (
            <div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight dark:text-white">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {subtitle}
                </p>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                Clinic OCR Intelligent Engine Active
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {children}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPatientModalOpen(true)}
            className="gap-1.5 text-xs font-semibold"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Patient
          </Button>

          <Link href="/upload">
            <Button
              variant="primary"
              size="sm"
              className="gap-1.5 text-xs font-semibold shadow-sm"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              Scan Prescription
            </Button>
          </Link>
        </div>
      </header>

      <PatientModal
        open={isPatientModalOpen}
        onOpenChange={setIsPatientModalOpen}
        onSuccess={(patient) => {
          router.refresh();
        }}
      />
    </>
  );
}
