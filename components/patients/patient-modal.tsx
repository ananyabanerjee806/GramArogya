"use client";

import { useState } from "react";
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
import { Patient, Gender } from "@/types";
import { createPatient, updatePatient } from "@/actions/patients";
import { toast } from "sonner";
import { User, Phone, Calendar, Heart } from "lucide-react";

interface PatientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient?: Patient | null;
  onSuccess?: (patient: Patient) => void;
}

export function PatientModal({
  open,
  onOpenChange,
  patient,
  onSuccess,
}: PatientModalProps) {
  const isEditing = !!patient;
  const [name, setName] = useState(patient?.name || "");
  const [age, setAge] = useState(patient?.age ? String(patient.age) : "");
  const [gender, setGender] = useState<Gender>((patient?.gender as Gender) || "Female");
  const [phone, setPhone] = useState(patient?.phone || "");
  const [loading, setLoading] = useState(false);

  // Sync state when patient changes
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen && patient) {
      setName(patient.name);
      setAge(String(patient.age));
      setGender(patient.gender as Gender);
      setPhone(patient.phone);
    } else if (newOpen && !patient) {
      setName("");
      setAge("");
      setGender("Female");
      setPhone("");
    }
    onOpenChange(newOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter patient name");
      return;
    }
    if (!age || isNaN(Number(age)) || Number(age) < 0 || Number(age) > 130) {
      toast.error("Please enter a valid age");
      return;
    }
    if (!phone.trim()) {
      toast.error("Please enter patient contact number");
      return;
    }

    setLoading(true);

    try {
      if (isEditing && patient) {
        const res = await updatePatient(patient.id, {
          name: name.trim(),
          age: Number(age),
          gender,
          phone: phone.trim(),
        });
        if (res.success) {
          toast.success("Patient updated successfully");
          onOpenChange(false);
          if (onSuccess) {
            onSuccess({
              ...patient,
              name: name.trim(),
              age: Number(age),
              gender,
              phone: phone.trim(),
            });
          }
        } else {
          toast.error(res.error || "Failed to update patient");
        }
      } else {
        const res = await createPatient({
          name: name.trim(),
          age: Number(age),
          gender,
          phone: phone.trim(),
        });
        if (res.success && res.patient) {
          toast.success(`Patient ${res.patient.name} registered`);
          onOpenChange(false);
          setName("");
          setAge("");
          setPhone("");
          if (onSuccess) onSuccess(res.patient);
        } else {
          toast.error(res.error || "Failed to register patient");
        }
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-5 h-5 text-sky-600" />
            {isEditing ? "Edit Patient Details" : "Register New Patient"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the patient's demographic and contact information."
              : "Enter patient details to link and store prescription history."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <Input
                placeholder="e.g. Eleanor Vance"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-9"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Age (Years) *
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <Input
                  type="number"
                  placeholder="e.g. 42"
                  min="0"
                  max="125"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Gender *
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-slate-800 dark:bg-slate-950"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
              Phone Number *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <Input
                placeholder="e.g. +1 (555) 234-5678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-9"
                required
              />
            </div>
          </div>

          <DialogFooter className="pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="min-w-[100px]"
            >
              {loading ? "Saving..." : isEditing ? "Update Patient" : "Save Patient"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
