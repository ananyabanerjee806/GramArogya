"use client";

import { useState } from "react";
import { AbhaProfile, getPatientAbhaProfile, validateAbhaNumber, formatAbhaNumber } from "@/lib/abha/abdm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, QrCode, CheckCircle2, User, Phone, Sparkles, Copy, Check, Download } from "lucide-react";
import { toast } from "sonner";

interface AbhaCardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientName: string;
  patientPhone: string;
  existingAbha?: string;
}

export function AbhaCardModal({
  open,
  onOpenChange,
  patientName,
  patientPhone,
  existingAbha,
}: AbhaCardModalProps) {
  const [profile, setProfile] = useState<AbhaProfile>(() =>
    getPatientAbhaProfile(patientName, patientPhone, existingAbha)
  );
  const [isEditing, setIsEditing] = useState(false);
  const [customAbha, setCustomAbha] = useState(profile.abhaNumber);
  const [copied, setCopied] = useState(false);

  const handleCopyAbha = () => {
    navigator.clipboard.writeText(profile.abhaNumber);
    setCopied(true);
    toast.success("14-Digit ABHA ID copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveAbha = () => {
    if (!validateAbhaNumber(customAbha)) {
      toast.error("Please enter a valid 14-digit ABHA number");
      return;
    }
    setProfile((prev) => ({
      ...prev,
      abhaNumber: formatAbhaNumber(customAbha),
    }));
    setIsEditing(false);
    toast.success("Patient ABHA ID updated successfully!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-6 rounded-3xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
                Ayushman Bharat Digital Health Account (ABHA)
              </DialogTitle>
              <DialogDescription className="text-xs">
                Government of India • ABDM Unified Health Record ID
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Official ABHA Card Replica */}
        <div className="rounded-3xl border border-orange-200 bg-gradient-to-br from-orange-50 via-white to-amber-50 p-6 shadow-md dark:from-slate-900 dark:via-slate-900 dark:to-orange-950/30 dark:border-orange-900 space-y-4">
          {/* Card Top Branding */}
          <div className="flex items-center justify-between border-b border-orange-200/80 pb-3 dark:border-orange-900">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-orange-600 text-white font-bold text-[10px] flex items-center justify-center">
                🇮🇳
              </div>
              <div>
                <span className="text-[11px] font-extrabold text-orange-950 dark:text-orange-200 block uppercase tracking-wider">
                  National Health Authority
                </span>
                <span className="text-[9px] text-slate-500 font-semibold">
                  Ayushman Bharat Digital Mission (ABDM)
                </span>
              </div>
            </div>

            <Badge variant="success" className="text-[9px] font-bold">
              <CheckCircle2 className="w-2.5 h-2.5 mr-1" />
              KYC Verified
            </Badge>
          </div>

          {/* Patient Details & ABHA Number */}
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Patient Name</span>
                <strong className="text-sm text-slate-900 dark:text-white font-bold">{patientName}</strong>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">14-Digit ABHA Number</span>
                <div className="text-base font-mono font-extrabold text-orange-700 dark:text-orange-400 tracking-wider">
                  {profile.abhaNumber}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">ABHA Address (PHR)</span>
                <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                  {profile.abhaAddress}
                </span>
              </div>
            </div>

            {/* QR Code Graphic */}
            <div className="w-24 h-24 rounded-2xl bg-white p-2 border border-orange-200 shadow-sm flex flex-col items-center justify-center dark:bg-slate-950 dark:border-slate-800 shrink-0">
              <QrCode className="w-16 h-16 text-slate-800 dark:text-slate-200" />
              <span className="text-[8px] font-mono font-bold text-orange-600 mt-1">SCAN ABDM</span>
            </div>
          </div>

          {/* Footer of Card */}
          <div className="pt-2 border-t border-orange-200/80 dark:border-orange-900 flex items-center justify-between text-[10px] text-slate-500 font-medium">
            <span>Linked Phone: {patientPhone}</span>
            <span>Issued: {profile.registeredDate}</span>
          </div>
        </div>

        {/* Edit or Link ABHA Section */}
        {isEditing ? (
          <div className="space-y-2 pt-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Enter 14-Digit ABHA Number (XX-XXXX-XXXX-XXXX):
            </label>
            <div className="flex gap-2">
              <Input
                value={customAbha}
                onChange={(e) => setCustomAbha(e.target.value)}
                placeholder="e.g. 91-8472-9182-3841"
                className="text-xs font-mono"
              />
              <Button type="button" size="sm" onClick={handleSaveAbha} className="bg-orange-600 text-white">
                Save
              </Button>
            </div>
          </div>
        ) : null}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopyAbha}
            className="gap-1.5 text-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied" : "Copy ABHA ID"}
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="bg-orange-600 hover:bg-orange-700 text-white gap-1.5 text-xs font-bold"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isEditing ? "Close Editor" : "Link / Update ABHA"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
