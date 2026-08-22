"use client";

import { useState } from "react";
import { UserRole, ROLE_PROFILES, CLINIC_BRANCHES, ClinicBranch } from "@/lib/auth/rbac";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  UserCheck, 
  Stethoscope, 
  User, 
  Pill, 
  ChevronDown, 
  Shield, 
  Check 
} from "lucide-react";
import { toast } from "sonner";

export function RoleClinicSwitcher() {
  const [currentRole, setCurrentRole] = useState<UserRole>('doctor');
  const [currentBranch, setCurrentBranch] = useState<ClinicBranch>(CLINIC_BRANCHES[0]);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);

  const activeProfile = ROLE_PROFILES[currentRole];

  const handleSwitchRole = (role: UserRole) => {
    setCurrentRole(role);
    setIsRoleDropdownOpen(false);
    toast.info(`Switched Active Role to: ${ROLE_PROFILES[role].roleTitle} (${ROLE_PROFILES[role].name})`);
  };

  const handleSwitchBranch = (branch: ClinicBranch) => {
    setCurrentBranch(branch);
    setIsBranchDropdownOpen(false);
    toast.success(`Active Clinic Branch: ${branch.name}`);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Clinic Branch Switcher */}
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setIsBranchDropdownOpen(!isBranchDropdownOpen);
            setIsRoleDropdownOpen(false);
          }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
        >
          <Building2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
          <span className="hidden sm:inline truncate max-w-[140px]">{currentBranch.name}</span>
          <span className="sm:hidden">Branch</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>

        {isBranchDropdownOpen && (
          <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 p-2 shadow-xl z-50 dark:bg-slate-900 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1 block">
              Multi-Clinic SaaS Branches
            </span>
            {CLINIC_BRANCHES.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => handleSwitchBranch(b)}
                className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                  currentBranch.id === b.id
                    ? "bg-sky-50 text-sky-900 font-bold dark:bg-sky-950 dark:text-sky-200"
                    : "hover:bg-slate-100 text-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                <div>
                  <div className="font-semibold">{b.name}</div>
                  <div className="text-[10px] text-slate-400">{b.location}</div>
                </div>
                {currentBranch.id === b.id && <Check className="w-3.5 h-3.5 text-sky-600 shrink-0" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Role-Based Access Control Switcher */}
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setIsRoleDropdownOpen(!isRoleDropdownOpen);
            setIsBranchDropdownOpen(false);
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-sm ${
            currentRole === 'doctor'
              ? 'bg-sky-50 border-sky-200 text-sky-900 dark:bg-sky-950 dark:border-sky-800 dark:text-sky-200'
              : currentRole === 'receptionist'
              ? 'bg-purple-50 border-purple-200 text-purple-900 dark:bg-purple-950 dark:border-purple-800 dark:text-purple-200'
              : 'bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-200'
          }`}
        >
          {currentRole === 'doctor' ? (
            <Stethoscope className="w-3.5 h-3.5 text-sky-600" />
          ) : currentRole === 'receptionist' ? (
            <User className="w-3.5 h-3.5 text-purple-600" />
          ) : (
            <Pill className="w-3.5 h-3.5 text-emerald-600" />
          )}

          <span className="hidden md:inline">{activeProfile.roleTitle}</span>
          <span className="md:hidden capitalize">{currentRole}</span>
          <ChevronDown className="w-3 h-3 opacity-60" />
        </button>

        {isRoleDropdownOpen && (
          <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white border border-slate-200 p-2 shadow-xl z-50 dark:bg-slate-900 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1 block">
              Switch Role Permissions
            </span>

            <button
              type="button"
              onClick={() => handleSwitchRole('doctor')}
              className="w-full text-left p-2 rounded-xl text-xs hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
            >
              <div className="w-6 h-6 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                👨‍⚕️
              </div>
              <div className="flex-1">
                <div className="font-bold text-slate-900 dark:text-white">Doctor (Full Access)</div>
                <div className="text-[10px] text-slate-400">Review, verify, edit & sign</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleSwitchRole('receptionist')}
              className="w-full text-left p-2 rounded-xl text-xs hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
            >
              <div className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                👩‍💼
              </div>
              <div className="flex-1">
                <div className="font-bold text-slate-900 dark:text-white">Receptionist</div>
                <div className="text-[10px] text-slate-400">Register & upload scans</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleSwitchRole('pharmacist')}
              className="w-full text-left p-2 rounded-xl text-xs hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
            >
              <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                💊
              </div>
              <div className="flex-1">
                <div className="font-bold text-slate-900 dark:text-white">Pharmacist / Chemist</div>
                <div className="text-[10px] text-slate-400">Dispense & generic verify</div>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
