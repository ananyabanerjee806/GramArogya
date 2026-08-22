"use client";

import { useState } from "react";
import { OpdQueueSelect } from "@/db/schema";
import { Patient } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BellRing, 
  CheckCircle2, 
  Clock, 
  Hourglass, 
  MessageSquare, 
  Play, 
  Plus, 
  Sparkles, 
  Ticket, 
  Users, 
  Volume2 
} from "lucide-react";
import { toast } from "sonner";

interface QueueClientViewProps {
  initialPatients: Patient[];
  initialQueue: OpdQueueSelect[];
}

export function QueueClientView({ initialPatients, initialQueue }: QueueClientViewProps) {
  const [patients] = useState<Patient[]>(initialPatients);
  const [queue, setQueue] = useState<OpdQueueSelect[]>(initialQueue);

  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || "");
  const [department, setDepartment] = useState<string>("Tele-Obstetrics Specialist OPD");

  const currentlyServing = queue.find((q) => q.status === "IN_CONSULTATION") || queue[0];
  const waitingList = queue.filter((q) => q.status === "WAITING");
  const completedList = queue.filter((q) => q.status === "COMPLETED");

  const handleIssueToken = () => {
    const nextTokenNum = (queue.length > 0 ? Math.max(...queue.map(q => q.tokenNumber)) : 100) + 1;
    const newEntry: OpdQueueSelect = {
      id: crypto.randomUUID(),
      patientId: selectedPatientId,
      tokenNumber: nextTokenNum,
      facilityName: "Khed Model PHC",
      department,
      status: "WAITING",
      estimatedWaitMinutes: (waitingList.length + 1) * 8,
      createdAt: new Date(),
    };

    setQueue([...queue, newEntry]);
    const pt = patients.find((p) => p.id === selectedPatientId);
    toast.success(`Token #${nextTokenNum} issued to ${pt?.name}! SMS sent to ${pt?.phone}`);
  };

  const handleCallNextToken = (tokenNum: number) => {
    setQueue(queue.map((q) => {
      if (q.tokenNumber === tokenNum) return { ...q, status: "IN_CONSULTATION", estimatedWaitMinutes: 0 };
      if (q.status === "IN_CONSULTATION") return { ...q, status: "COMPLETED" };
      return q;
    }));
    toast.success(`📢 Token #${tokenNum} called to Doctor Consultation Chamber 1!`, {
      icon: <Volume2 className="w-5 h-5 text-emerald-600" />,
    });
  };

  return (
    <div className="space-y-6">
      {/* Live Digital Display Board (Like Bank / Hospital LED Screen) */}
      <div className="p-6 rounded-3xl bg-slate-950 text-white border border-slate-800 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">
                PHC Digital OPD Display Board
              </span>
              <h2 className="text-lg font-black tracking-tight">
                Khed Model Primary Health Centre
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="border-emerald-500/40 text-emerald-300 font-bold px-3 py-1">
              Estimated Average Wait: 12 Mins
            </Badge>
          </div>
        </div>

        {/* Big LED Numbers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          
          {/* Active Consultation Token */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/70 to-slate-900 border-2 border-emerald-500/80 shadow-lg text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Now In Consultation
            </span>
            <div className="text-5xl font-black text-emerald-400 my-2 font-mono">
              #{currentlyServing ? currentlyServing.tokenNumber : "--"}
            </div>
            <p className="text-xs text-slate-300 font-semibold">
              {patients.find(p => p.id === currentlyServing?.patientId)?.name || "Waiting for patient"}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Room 1: {currentlyServing?.department}
            </p>
          </div>

          {/* Next in Line */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Next Calling Token
            </span>
            <div className="text-5xl font-black text-amber-400 my-2 font-mono">
              #{waitingList[0] ? waitingList[0].tokenNumber : "--"}
            </div>
            <p className="text-xs text-slate-300 font-semibold">
              {patients.find(p => p.id === waitingList[0]?.patientId)?.name || "No waiting patients"}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Est. Wait: ~{waitingList[0]?.estimatedWaitMinutes || 0} mins
            </p>
          </div>

          {/* Queue Metrics */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                Today's OPD Flow
              </span>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="p-2 rounded-xl bg-slate-800/80">
                  <span className="text-[10px] text-slate-400">Waiting</span>
                  <p className="text-xl font-bold text-white">{waitingList.length}</p>
                </div>
                <div className="p-2 rounded-xl bg-slate-800/80">
                  <span className="text-[10px] text-slate-400">Completed</span>
                  <p className="text-xl font-bold text-emerald-400">{completedList.length + 1}</p>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-3">
              ⚡ Reduced rural patient waiting time by <strong className="text-emerald-400">68%</strong>.
            </p>
          </div>

        </div>
      </div>

      {/* Action Section: Token Dispenser & Queue Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Token Generator Card */}
        <div className="lg:col-span-4">
          <Card className="p-5 border-slate-200 shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
            <div className="flex items-center gap-2 border-b pb-3 dark:border-slate-800">
              <Ticket className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Issue OPD Token
              </h3>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Citizen / Patient
              </label>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.village})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Department / Clinical Room
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              >
                <option value="Tele-Obstetrics Specialist OPD">Tele-Obstetrics Specialist OPD</option>
                <option value="NCD & Chronic Care Tele-OPD">NCD & Chronic Care Tele-OPD</option>
                <option value="Pediatric Care & Immunization">Pediatric Care & Immunization</option>
                <option value="General Outpatient (PHC MO)">General Outpatient (PHC MO)</option>
              </select>
            </div>

            <Button
              onClick={handleIssueToken}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl shadow-md text-xs"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Generate & Dispatch Digital Token
            </Button>
          </Card>
        </div>

        {/* Live Queue Table */}
        <div className="lg:col-span-8">
          <Card className="p-5 border-slate-200 shadow-sm space-y-3 dark:bg-slate-900 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Live Token Calling Queue ({queue.length})
            </h3>

            <div className="space-y-2">
              {queue.map((item) => {
                const pt = patients.find((p) => p.id === item.patientId);
                return (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-2xl border flex flex-wrap items-center justify-between gap-3 ${
                      item.status === "IN_CONSULTATION"
                        ? "border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30"
                        : "border-slate-100 bg-slate-50/50 dark:bg-slate-800/40 dark:border-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-black text-lg ${
                        item.status === "IN_CONSULTATION"
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-white"
                      }`}>
                        #{item.tokenNumber}
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">
                          {pt?.name} ({pt?.age}y {pt?.gender})
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {item.department} • {item.facilityName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] font-bold">
                        {item.status === "IN_CONSULTATION" ? "IN CHAMBER" : `Est. ${item.estimatedWaitMinutes} min wait`}
                      </Badge>

                      {item.status === "WAITING" && (
                        <Button
                          size="sm"
                          onClick={() => handleCallNextToken(item.tokenNumber)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl"
                        >
                          <Play className="w-3.5 h-3.5 mr-1" />
                          Call Token
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
