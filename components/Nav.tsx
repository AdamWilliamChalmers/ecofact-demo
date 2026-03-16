"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, FileText, Database, Activity, ChevronRight } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Documents", icon: FileText, description: "Regulatory intelligence feed" },
  { href: "/sources", label: "Sources", icon: Database, description: "Source registry & coverage" },
  { href: "/pipeline", label: "Pipeline", icon: Activity, description: "Cycle reports & status" },
];

export default function Nav() {
  const path = usePathname();

  return (
    <header className="flex-shrink-0 border-b border-slate-800 bg-navy-900/90 backdrop-blur-xl px-6 py-0 flex items-center justify-between h-14">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Globe size={14} className="text-white" />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-display text-base text-white tracking-tight">Ecofact</span>
          <ChevronRight size={12} className="text-slate-600" />
          <span className="text-xs text-slate-500">Regulatory Intelligence</span>
        </div>
      </div>

      {/* Nav tabs */}
      <nav className="flex items-center gap-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? path === "/" : path.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                active
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <Icon size={14} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Status pill */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Pipeline active · Last run 2026-03-16
        </div>
        <div className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
          UK · Germany · Brazil
        </div>
      </div>
    </header>
  );
}
