import React from 'react';
import { User, AlertCircle, Phone, Stethoscope } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { PatientSelect } from '@/db/schema'; // We'll mock this for now or assume it exists

interface UniversalPatientHeaderProps {
  patient: any; // Using any for simplicity in this prototype, should be PatientSelect
  activeReferral?: any;
  careDebtCount?: number;
}

export function UniversalPatientHeader({ patient, activeReferral, careDebtCount = 0 }: UniversalPatientHeaderProps) {
  if (!patient) return null;

  return (
    <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm dark:bg-slate-900 dark:border-slate-800">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
          <User className="w-6 h-6 text-slate-500" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {patient.name}
            </h2>
            <Badge variant="outline" className="text-xs bg-slate-50">
              {patient.age} • {patient.gender === 'Female' ? 'F' : 'M'}
            </Badge>
            {patient.highRiskCategory && (
              <Badge variant="destructive" className="text-[10px] uppercase font-bold tracking-wider">
                {patient.highRiskCategory}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <span className="font-medium text-slate-700 dark:text-slate-300">ABHA:</span>
              {patient.abhaId || 'Pending Registration'}
            </span>
            <span className="flex items-center gap-1">
              <span className="font-medium text-slate-700 dark:text-slate-300">Village:</span>
              {patient.village}
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <Phone className="w-3 h-3" />
              {patient.phone}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {activeReferral && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-800">
            <Stethoscope className="w-4 h-4 text-amber-600" />
            <div className="text-xs">
              <span className="font-medium text-amber-800 dark:text-amber-300 block">Active Referral</span>
              <span className="text-amber-600 dark:text-amber-400">{activeReferral.status}</span>
            </div>
          </div>
        )}
        
        {careDebtCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-800">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <div className="text-xs">
              <span className="font-medium text-rose-800 dark:text-rose-300 block">Care Debt</span>
              <span className="text-rose-600 dark:text-rose-400">{careDebtCount} Action(s) Due</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
