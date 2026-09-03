import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, MapPin, Pill, Baby, Stethoscope, AlertTriangle, CheckCircle2 } from "lucide-react";

export default async function AshaActionPage() {
  const actions = [
    {
      id: 1,
      patient: "Sunita Shinde",
      type: "High-risk ANC referral incomplete",
      actionNeeded: "Arrange transport immediately",
      priority: "🔴 URGENT",
      color: "border-rose-300 bg-rose-50",
      icon: Baby
    },
    {
      id: 2,
      patient: "Ramesh Patil",
      type: "BP 190/110 recorded yesterday",
      actionNeeded: "Immediate PHC review required",
      priority: "🔴 URGENT",
      color: "border-rose-300 bg-rose-50",
      icon: Stethoscope
    },
    {
      id: 3,
      patient: "Kamalabai Pawar",
      type: "Diabetes follow-up missed (4 days)",
      actionNeeded: "Home visit for vitals",
      priority: "🟠 MODERATE",
      color: "border-amber-300 bg-amber-50",
      icon: MapPin
    },
    {
      id: 4,
      patient: "Aarav Jadhav",
      type: "Immunisation due tomorrow",
      actionNeeded: "Notify family via WhatsApp",
      priority: "🟡 ROUTINE",
      color: "border-yellow-300 bg-yellow-50",
      icon: Pill
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      <Header
        title="Today's Actions"
        subtitle="Prioritized task list for ASHA Workers"
      />

      <div className="p-4 sm:p-8 max-w-3xl mx-auto space-y-4">
        {/* Mobile First UI Design */}
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <div key={action.id} className={`rounded-2xl border p-4 shadow-sm ${action.color}`}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-slate-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{action.patient}</h3>
                    <div className="text-sm font-semibold text-slate-700">{action.priority}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-1 mb-4">
                <p className="text-sm font-medium text-slate-800">{action.type}</p>
                <p className="text-xs text-slate-600 bg-white/60 px-2 py-1 rounded inline-block">Action: {action.actionNeeded}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-black/10">
                <Button variant="outline" className="w-full bg-white text-xs font-semibold">
                  <Phone className="w-3 h-3 mr-1" /> Call Patient
                </Button>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Mark Done
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
