"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UploadCloud, Plus, Stethoscope, Search, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { PatientModal } from "@/components/patients/patient-modal";
import { RoleClinicSwitcher } from "@/components/layout/role-clinic-switcher";
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
      <header className="h-16 border-b border-slate-200/80 bg-white/70 backdrop-blur-md sticky top-0 z-20 px-4 sm:px-8 flex items-center justify-between dark:bg-slate-900/70 dark:border-slate-800">
        <div>
          {title ? (
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight dark:text-white">
                {title}
              </h1>
              {subtitle && (
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                  {subtitle}
                </p>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 hidden sm:inline">
                ClinicOCR Intelligence Active
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {children}

          {/* Role & Multi-Clinic Branch Switcher */}
          <RoleClinicSwitcher />

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPatientModalOpen(true)}
            className="gap-1 text-xs font-semibold hidden md:inline-flex"
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
              <span className="hidden sm:inline">Scan Prescription</span>
              <span className="sm:hidden">Scan</span>
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
