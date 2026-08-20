import { Sidebar } from "./sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950 flex font-sans antialiased text-slate-900 dark:text-slate-100">
      <Sidebar />
      <div className="pl-64 flex-1 flex flex-col min-h-screen">
        <main className="flex-1 pb-16">
          {children}
        </main>
      </div>
    </div>
  );
}
