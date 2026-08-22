"use client";

import { useState } from "react";
import { Prescription, Patient } from "@/types";
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
import { 
  formatPrescriptionWhatsAppMessage, 
  generateWhatsAppLink,
  translateFrequencyToRegional
} from "@/lib/whatsapp/share";
import { toast } from "sonner";
import { 
  MessageSquare, 
  Send, 
  Copy, 
  Check, 
  Phone, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink 
} from "lucide-react";

interface WhatsAppShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prescription: Prescription;
  patient?: Patient | null;
}

export function WhatsAppShareModal({
  open,
  onOpenChange,
  prescription,
  patient,
}: WhatsAppShareModalProps) {
  const [phoneNumber, setPhoneNumber] = useState(patient?.phone || prescription.patientPhone || "");
  const [copied, setCopied] = useState(false);

  const formattedMessage = formatPrescriptionWhatsAppMessage(prescription, patient);

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedMessage);
    setCopied(true);
    toast.success("WhatsApp prescription message copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendWhatsApp = () => {
    if (!phoneNumber.trim()) {
      toast.error("Please enter patient's phone number");
      return;
    }
    const link = generateWhatsAppLink(phoneNumber, prescription, patient);
    window.open(link, "_blank");
    toast.success("Opening WhatsApp to dispatch prescription!");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold dark:bg-emerald-950">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
                1-Click WhatsApp Prescription Delivery
              </DialogTitle>
              <DialogDescription className="text-xs">
                Send structured prescription & regional dosage schedule directly to patient
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Patient Phone Number Input */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Patient WhatsApp Number *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <Input
                placeholder="e.g. +91 9876543210 or 9876543210"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="pl-9 text-xs"
              />
            </div>
          </div>

          {/* Regional Hindi Instructions Highlight */}
          <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/80 dark:bg-emerald-950/30 dark:border-emerald-900 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Auto-Generated Regional Dosage Schedule (दवाइयों का समय):
              </span>
            </div>
            
            <div className="space-y-1 text-xs">
              {(prescription.medicinesJson || []).slice(0, 3).map((med, idx) => {
                const { hindi, timing } = translateFrequencyToRegional(med.frequency || "");
                return (
                  <div key={idx} className="p-1.5 rounded bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 flex justify-between items-center text-[11px]">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {idx + 1}. {med.name} ({med.dosage})
                    </span>
                    <span className="text-emerald-700 dark:text-emerald-300 font-medium">
                      {hindi}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Message Preview */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Formatted WhatsApp Message Preview
            </label>
            <pre className="p-3 rounded-xl bg-slate-900 text-emerald-300 font-mono text-[11px] max-h-48 overflow-y-auto whitespace-pre-wrap border border-slate-800 leading-relaxed">
              {formattedMessage}
            </pre>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="gap-1.5 text-xs font-semibold"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy Message
              </>
            )}
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleSendWhatsApp}
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs font-bold shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
            Send via WhatsApp
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
