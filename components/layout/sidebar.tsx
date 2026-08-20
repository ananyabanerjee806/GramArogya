"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  UploadCloud, 
  FileText, 
  Search, 
  Sparkles,
  ShieldCheck,
  Stethoscope,
  HeartPulse
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    name: "Upload Prescription",
    href: "/upload",
    icon: UploadCloud,
    badge: "AI Powered",
  },
  {
    name: "Patients Directory",
    href: "/patients",
    icon: Users,
    badge: null,
  },
  {
    name: "Prescriptions & Search",
    href: "/prescriptions",
    icon: Search,
    badge: null,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-slate-200/80 bg-white/80 backdrop-blur-md flex flex-col justify-between h-screen fixed left-0 top-0 z-30 dark:bg-slate-900/90 dark:border-slate-800">
      {/* Brand Header */}
      <div>
        <div className="h-16 flex items-center px-6 border-b border-slate-100 dark:border-slate-800/60">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent dark:from-white dark:to-slate-300">
                  Clinic<span className="text-sky-600">OCR</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-sky-50 text-sky-600 border border-sky-200/60 dark:bg-sky-950 dark:text-sky-400 dark:border-sky-800">
                  v2.0
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium -mt-0.5">
                Medical Document Intelligence
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5">
          <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Main Menu
          </div>
          {navigationItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group",
                  isActive
                    ? "bg-sky-50 text-sky-700 shadow-sm shadow-sky-500/5 font-semibold dark:bg-sky-950/60 dark:text-sky-300"
                    : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "w-4 h-4 transition-colors",
                      isActive
                        ? "text-sky-600 dark:text-sky-400"
                        : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                    )}
                  />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <Badge variant="info" className="text-[10px] px-1.5 py-0">
                    <Sparkles className="w-2.5 h-2.5 mr-0.5 text-sky-600 animate-pulse" />
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info Card */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800/60">
        <div className="rounded-xl p-3.5 bg-gradient-to-br from-slate-50 to-sky-50/40 border border-slate-200/60 dark:from-slate-900 dark:to-sky-950/20 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Doctor Verification
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed dark:text-slate-400">
            Doctor has 100% final authority. Nothing is stored automatically without review.
          </p>
        </div>
      </div>
    </aside>
  );
}
