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
  KeyRound
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const coreNavigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    name: "Scan & OCR Rx",
    href: "/upload",
    icon: UploadCloud,
    badge: "AI Vision",
  },
  {
    name: "Patients & ABHA",
    href: "/patients",
    icon: Users,
    badge: null,
  },
  {
    name: "Prescription Archive",
    href: "/prescriptions",
    icon: Search,
    badge: null,
  },
];

const ruralHealthEcosystem = [
  {
    name: "Assisted Teleconsult",
    href: "/teleconsult",
    icon: Video,
    badge: "Live Video",
    badgeVariant: "default" as const,
  },
  {
    name: "AI Digital Triage",
    href: "/triage",
    icon: Activity,
    badge: "Risk AI",
    badgeVariant: "destructive" as const,
  },
  {
    name: "Referrals & 108 SOS",
    href: "/referrals",
    icon: Ambulance,
    badge: "Emergency",
    badgeVariant: "destructive" as const,
  },
  {
    name: "OPD Token Queue",
    href: "/queue",
    icon: Clock,
    badge: null,
  },
  {
    name: "Jan Aushadhi & Drugs",
    href: "/pharmacy",
    icon: Pill,
    badge: "80% Off",
  },
  {
    name: "Maternal & NCD Care",
    href: "/maternal-ncd",
    icon: Baby,
    badge: "High Risk",
  },
  {
    name: "District Health Map",
    href: "/facility-analytics",
    icon: BarChart3,
    badge: "Analytics",
  },
  {
    name: "Portal Login / Switch",
    href: "/login",
    icon: LogIn,
    badge: "3 Roles",
    badgeVariant: "default" as const,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-slate-200/80 bg-white/95 backdrop-blur-md flex flex-col justify-between h-screen fixed left-0 top-0 z-30 overflow-y-auto dark:bg-slate-900/95 dark:border-slate-800">
      {/* Brand Header */}
      <div>
        <div className="h-20 flex items-center px-4 border-b border-slate-100 dark:border-slate-800/60">
          <Link href="/dashboard" className="flex items-center gap-2.5 group w-full">
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
                <span className="text-[8.5px] uppercase font-extrabold px-1 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                  PS 26133
                </span>
              </div>
              <p className="text-[9.5px] text-slate-400 font-bold truncate">
                सार्वजनिक आरोग्य विभाग महाराष्ट्र
              </p>
            </div>
          </Link>
        </div>


        {/* Navigation Links */}
        <nav className="p-3 space-y-4">
          <div>
            <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Clinical Core
            </div>
            <div className="space-y-1 mt-1">
              {coreNavigation.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 group",
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
                      <Badge variant="secondary" className="text-[9px] px-1.5 py-0 bg-emerald-100/80 text-emerald-800 border-none">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          <div>
            <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Rural Care Continuum</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="space-y-1 mt-1">
              {ruralHealthEcosystem.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 group",
                      isActive
                        ? "bg-teal-50 text-teal-800 shadow-sm font-semibold dark:bg-teal-950/60 dark:text-teal-300"
                        : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={cn(
                          "w-4 h-4 transition-colors",
                          isActive
                            ? "text-teal-600 dark:text-teal-400"
                            : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                        )}
                      />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className={cn(
                        "text-[9px] font-bold px-1.5 py-0.2 rounded-full border",
                        item.badge === "Emergency" || item.badge === "Risk AI"
                          ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300"
                          : item.badge === "Live Video"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1"
                          : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300"
                      )}>
                        {item.badge === "Live Video" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />}
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      </div>

      {/* Footer Info Card */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/60">
        <div className="rounded-xl p-3 bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-200/60 dark:from-slate-900 dark:to-emerald-950/20 dark:border-slate-800">
          <div className="flex items-center gap-1.5 mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
              ABHA & ABDM Interoperable
            </span>
          </div>
          <p className="text-[10px] text-slate-500 leading-snug dark:text-slate-400">
            Strengthening Maharashtra Public Health with Sub-Centre to DH referral continuity.
          </p>
        </div>
      </div>
    </aside>
  );
}

