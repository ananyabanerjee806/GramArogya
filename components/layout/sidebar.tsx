"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { 
  LayoutDashboard, 
  Users, 
  UploadCloud, 
  Search, 
  Sparkles,
  ShieldCheck,
  Stethoscope,
  Video,
  Activity,
  Ambulance,
  Clock,
  Pill,
  Baby,
  BarChart3,
  Flame,
  Radio,
  LogIn,
  KeyRound,
  ListTodo,
  Map,
  Link as LinkIcon,
  WifiOff,
  ClipboardList,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const careCommandNavigation = [
  { name: "Dashboard", href: "/dashboard/care-command", icon: LayoutDashboard, badge: null },
  { name: "Today's Actions", href: "/dashboard/asha-action", icon: ListTodo, badge: "ASHA" },
  { name: "Care Journeys", href: "/care-journeys", icon: Map, badge: null },
  { name: "Care Debt", href: "/care-debts", icon: AlertCircle, badge: "Important", badgeVariant: "destructive" },
];

const clinicalNavigation = [
  { name: "Scan & OCR Rx", href: "/upload", icon: UploadCloud, badge: "AI Vision" },
  { name: "AI Triage", href: "/triage", icon: Activity, badge: "Risk AI" },
  { name: "Patients & ABHA", href: "/patients", icon: Users, badge: null },
  { name: "Prescriptions", href: "/prescriptions", icon: Search, badge: null },
  { name: "Teleconsultation", href: "/teleconsult", icon: Video, badge: "Live" },
  { name: "Drug Safety", href: "/drug-safety", icon: ShieldCheck, badge: null },
];

const careNetworkNavigation = [
  { name: "CareRoute", href: "/care-route", icon: Map, badge: "New" },
  { name: "Referrals", href: "/referrals", icon: Ambulance, badge: "Handshake" },
  { name: "Facility Readiness", href: "/facility-readiness", icon: Activity, badge: null },
  { name: "Ambulance / 108", href: "/ambulance", icon: Ambulance, badge: "Emergency", badgeVariant: "destructive" },
  { name: "OPD Queue", href: "/queue", icon: Clock, badge: null },
];

const continuityNavigation = [
  { name: "Maternal & Child", href: "/maternal-ncd", icon: Baby, badge: null },
  { name: "Diagnostics", href: "/diagnostics", icon: Activity, badge: null },
  { name: "Medicines", href: "/pharmacy", icon: Pill, badge: null },
  { name: "Family Care", href: "/family-care", icon: Users, badge: null },
];

const publicHealthNavigation = [
  { name: "District Command", href: "/facility-analytics", icon: BarChart3, badge: "Analytics" },
  { name: "Health Map", href: "/health-map", icon: Map, badge: null },
];

const systemNavigation = [
  { name: "Integrations", href: "/integrations", icon: LinkIcon, badge: null },
  { name: "Offline Sync", href: "/offline", icon: WifiOff, badge: "Pending" },
  { name: "Portal Switch", href: "/login", icon: LogIn, badge: "Roles" },
  { name: "Why GramArogya", href: "/why-gramarogya", icon: Sparkles, badge: "Demo" },
];

export function Sidebar() {
  const pathname = usePathname();

  const renderNavGroup = (title: string, items: any[]) => (
    <div className="mb-4">
      <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {title}
      </div>
      <div className="space-y-1 mt-1">
        {items.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-150 group",
                isActive
                  ? "bg-emerald-50 text-emerald-800 shadow-sm font-semibold dark:bg-emerald-950/60 dark:text-emerald-300"
                  : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200"
              )}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={cn(
                    "w-4 h-4 transition-colors",
                    isActive
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                  )}
                />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className={cn(
                  "text-[9px] font-bold px-1.5 py-0.2 rounded-full border",
                  item.badgeVariant === "destructive"
                    ? "bg-rose-50 text-rose-700 border-rose-200"
                    : "bg-emerald-100/80 text-emerald-800 border-emerald-200"
                )}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );

  return (
    <aside className="w-64 border-r border-slate-200/80 bg-white/95 backdrop-blur-md flex flex-col justify-between h-screen fixed left-0 top-0 z-30 overflow-y-auto dark:bg-slate-900/95 dark:border-slate-800">
      {/* Brand Header */}
      <div>
        <div className="h-20 flex items-center px-4 border-b border-slate-100 dark:border-slate-800/60">
          <Link href="/dashboard/care-command" className="flex items-center gap-2.5 group w-full">
            <div className="w-11 h-11 rounded-xl bg-white p-0.5 border border-slate-200 shadow-sm flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform dark:bg-slate-800 dark:border-slate-700">
              <Image
                src="/maharashtra_arogya_logo.png"
                alt="Maharashtra Arogya Logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white truncate">
                  Gram<span className="text-emerald-600">Arogya</span>
                </span>
              </div>
              <p className="text-[9.5px] text-slate-400 font-bold truncate">
                CareMesh Orchestration
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="p-3">
          {renderNavGroup("Care Command", careCommandNavigation)}
          {renderNavGroup("Clinical", clinicalNavigation)}
          {renderNavGroup("Care Network", careNetworkNavigation)}
          {renderNavGroup("Continuity", continuityNavigation)}
          {renderNavGroup("Public Health", publicHealthNavigation)}
          {renderNavGroup("System", systemNavigation)}
        </nav>
      </div>

      {/* Footer Info Card */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/60">
        <div className="rounded-xl p-3 bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-200/60 dark:from-slate-900 dark:to-emerald-950/20 dark:border-slate-800">
          <div className="flex items-center gap-1.5 mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
              Closed Loop Care
            </span>
          </div>
          <p className="text-[10px] text-slate-500 leading-snug dark:text-slate-400">
            Right Patient. Right Facility. Ready Facility. Completed Care.
          </p>
        </div>
      </div>
    </aside>
  );
}
