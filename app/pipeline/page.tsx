"use client";

import { useState } from "react";
import {
  CheckCircle2, AlertCircle, Clock, RefreshCw, ChevronRight,
  Activity, Database, Cpu, Search, Download, FileText,
  Copy, Layers, BarChart3, TrendingUp, ArrowRight, Zap
} from "lucide-react";
import { COUNTRY_META } from "@/lib/data";

// ---- Data ------------------------------------------------------------------

const CYCLE_REPORT = {
  run_id: "cycle-2026-03-16-0200",
  started_at: "2026-03-16 02:00 UTC",
  completed_at: "2026-03-16 03:47 UTC",
  duration_mins: 107,
  status: "completed",
  new_documents: 18,
  updated_documents: 0,
  sources_crawled: 14,
  sources_failed: 0,
  urls_discovered: 312,
  urls_acquired: 61,
  urls_classified: 61,
  documents_relevant: 18,
  documents_excluded: 43,
  qa_queue_items: 0,
  automation_rate: 1.0,
  avg_confidence: 0.934,
};

const JOBS = [
  { id: "source_health_check", label: "Source Health Check", icon: Activity, status: "success", duration: "2m 11s", output: "14 sources checked, 0 failures" },
  { id: "feed_monitor", label: "Feed Monitor", icon: Zap, status: "success", duration: "0m 43s", output: "3 RSS feeds polled, 2 new URLs queued" },
  { id: "search_discovery", label: "Search Discovery", icon: Search, status: "success", duration: "4m 02s", output: "87 candidate URLs discovered via search" },
  { id: "crawler", label: "Crawler", icon: RefreshCw, status: "success", duration: "31m 18s", output: "312 URLs crawled across 14 sources" },
  { id: "document_downloader", label: "Document Downloader", icon: Download, status: "success", duration: "18m 55s", output: "61 documents downloaded (41 HTML, 20 PDF)" },
  { id: "parser", label: "Parser", icon: FileText, status: "success", duration: "6m 44s", output: "61 documents parsed, 0 OCR applied" },
  { id: "classifier", label: "Classifier", icon: Cpu, status: "success", duration: "12m 07s", output: "61 classified: 18 relevant, 43 excluded" },
  { id: "extractor", label: "Extractor", icon: Layers, status: "success", duration: "19m 22s", output: "18 documents fully extracted (avg confidence 0.934)" },
  { id: "dedup_job", label: "Deduplication", icon: Copy, status: "success", duration: "1m 33s", output: "0 duplicates detected, 0 near-duplicates flagged" },
  { id: "dashboard_updater", label: "Dashboard Update", icon: Database, status: "success", duration: "0m 51s", output: "18 records published to dashboard" },
  { id: "qa_queue_builder", label: "QA Queue Builder", icon: AlertCircle, status: "success", duration: "0m 18s", output: "0 items in review queue this cycle" },
  { id: "cycle_report", label: "Cycle Report", icon: BarChart3, status: "success", duration: "0m 09s", output: "Report generated and logged" },
];

const COUNTRY_BREAKDOWN = [
  {
    country: "UK",
    sources: 5,
    urls_crawled: 118,
    documents: 6,
    high_relevance: 4,
    in_force: 3,
    coverage: 1.0,
    freshness_hrs: 8,
  },
  {
    country: "Germany",
    sources: 5,
    urls_crawled: 102,
    documents: 6,
    high_relevance: 5,
    in_force: 3,
    coverage: 1.0,
    freshness_hrs: 11,
  },
  {
    country: "Brazil",
    sources: 4,
    urls_crawled: 92,
    documents: 6,
    high_relevance: 5,
    in_force: 3,
    coverage: 1.0,
    freshness_hrs: 14,
  },
];

const SCHEDULE = [
  { job: "Full pipeline run", frequency: "Twice weekly", next: "2026-03-16 02:00 UTC", tier: "All" },
  { job: "Feed monitor", frequency: "Every 6 hours", next: "2026-03-16 08:00 UTC", tier: "Tier 1" },
  { job: "Tier 1 source crawl", frequency: "Every 48 hours", next: "2026-03-16 02:00 UTC", tier: "Tier 1" },
  { job: "Source health check", frequency: "Daily", next: "2026-03-16 02:00 UTC", tier: "All" },
];

const SUCCESS_METRICS = [
  { label: "Source Coverage", value: "100%", target: ">95%", status: "pass", detail: "14/14 sources crawled successfully" },
  { label: "Automation Rate", value: "100%", target: ">95%", status: "pass", detail: "18/18 documents processed without human review" },
  { label: "Avg Confidence", value: "93.4%", target: ">75%", status: "pass", detail: "All documents above review threshold" },
  { label: "QA Queue Size", value: "0", target: "<50", status: "pass", detail: "No exception cases this cycle" },
  { label: "Mean Freshness", value: "11h", target: "<72h", status: "pass", detail: "Well within 72h target for Tier 1/2" },
  { label: "Source Reliability", value: "93.2%", target: ">90%", status: "pass", detail: "Mean reliability_score across all active sources" },
];

// ---- Components ------------------------------------------------------------

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    success: "bg-emerald-500",
    running: "bg-blue-400 animate-pulse",
    failed: "bg-rose-500",
    pending: "bg-slate-600",
    warning: "bg-amber-400",
  };
  return <span className={`w-2 h-2 rounded-full flex-shrink-0 ${colors[status] || "bg-slate-600"}`} />;
}

function MetricCard({ label, value, target, status, detail }: typeof SUCCESS_METRICS[0]) {
  return (
    <div className="glass-card rounded-xl p-4 animate-fade-in">
      <div className="flex items-start justify-between mb-3">
        <div className="text-xs text-slate-500 uppercase tracking-wider">{label}</div>
        <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${
          status === "pass"
            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
            : "bg-rose-500/10 border-rose-500/30 text-rose-400"
        }`}>
          {status === "pass" ? "✓ PASS" : "✗ FAIL"}
        </span>
      </div>
      <div className="font-display text-2xl text-white mb-1">{value}</div>
      <div className="text-xs text-slate-600 mb-2">Target: {target}</div>
      <div className="text-xs text-slate-500">{detail}</div>
    </div>
  );
}

// ---- Main ------------------------------------------------------------------

export default function PipelinePage() {
  const [activeTab, setActiveTab] = useState<"cycle" | "jobs" | "schedule" | "metrics">("cycle");

  const tabs = [
    { id: "cycle" as const, label: "Cycle Report", icon: BarChart3 },
    { id: "jobs" as const, label: "Job Log", icon: Activity },
    { id: "schedule" as const, label: "Schedule", icon: Clock },
    { id: "metrics" as const, label: "Success Metrics", icon: TrendingUp },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden bg-navy-950">

      {/* Page header */}
      <div className="flex-shrink-0 border-b border-slate-800 bg-navy-900/60 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-xl text-white">Pipeline Status</h1>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <StatusDot status="success" />
                Last run completed · {CYCLE_REPORT.started_at}
              </div>
              <span className="text-slate-700">·</span>
              <div className="text-xs text-slate-500">Run ID: {CYCLE_REPORT.run_id}</div>
              <span className="text-slate-700">·</span>
              <div className="text-xs text-slate-500">Duration: {CYCLE_REPORT.duration_mins} min</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
              <StatusDot status="success" />
              All systems operational
            </div>
          </div>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="flex-shrink-0 grid grid-cols-6 gap-3 p-5 pb-0">
        {[
          { label: "New Docs", value: CYCLE_REPORT.new_documents, color: "#10b981" },
          { label: "Sources Crawled", value: CYCLE_REPORT.sources_crawled, color: "#60a5fa" },
          { label: "URLs Discovered", value: CYCLE_REPORT.urls_discovered, color: "#a78bfa" },
          { label: "Classified", value: CYCLE_REPORT.urls_classified, color: "#fbbf24" },
          { label: "Automation Rate", value: "100%", color: "#4ade80" },
          { label: "QA Queue", value: CYCLE_REPORT.qa_queue_items, color: "#94a3b8" },
        ].map(({ label, value, color }) => (
          <div key={label} className="glass-card rounded-xl p-4">
            <div className="text-xs text-slate-500 uppercase tracking-widest mb-2">{label}</div>
            <div className="font-display text-2xl leading-none" style={{ color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex-shrink-0 flex items-center gap-1 px-5 pt-4">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === id
                ? "bg-slate-800 text-white"
                : "text-slate-500 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto px-5 pb-5 pt-4">

        {/* ---- Cycle Report ---- */}
        {activeTab === "cycle" && (
          <div className="space-y-5 animate-fade-in">
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between">
                <h2 className="font-display text-sm text-white">Country Breakdown</h2>
                <span className="text-xs text-slate-500">Cycle 2026-03-16</span>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800">
                    {["Country", "Sources", "URLs Crawled", "Documents Found", "High Relevance", "In Force", "Coverage", "Freshness"].map((h) => (
                      <th key={h} className="text-left py-3 px-5 text-xs text-slate-500 uppercase tracking-wider font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COUNTRY_BREAKDOWN.map((row) => {
                    const meta = COUNTRY_META[row.country];
                    return (
                      <tr key={row.country} className="border-b border-slate-800/50">
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{meta?.flag}</span>
                            <span className="font-medium text-white">{row.country}</span>
                          </div>
                        </td>
                        <td className="py-4 px-5 text-slate-300">{row.sources}</td>
                        <td className="py-4 px-5 text-slate-300">{row.urls_crawled}</td>
                        <td className="py-4 px-5">
                          <span className="font-medium text-emerald-400">{row.documents}</span>
                        </td>
                        <td className="py-4 px-5 text-slate-300">{row.high_relevance}</td>
                        <td className="py-4 px-5 text-slate-300">{row.in_force}</td>
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                              <div className="h-full rounded-full bg-emerald-500" style={{ width: `${row.coverage * 100}%` }} />
                            </div>
                            <span className="text-xs text-emerald-400">{Math.round(row.coverage * 100)}%</span>
                          </div>
                        </td>
                        <td className="py-4 px-5 text-slate-300 text-sm">{row.freshness_hrs}h</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pipeline flow diagram */}
            <div className="glass-card rounded-xl p-5">
              <h2 className="font-display text-sm text-white mb-4">Pipeline Flow — This Cycle</h2>
              <div className="flex items-center gap-0 flex-wrap">
                {[
                  { label: "Source Registry", value: "14 sources", color: "#60a5fa" },
                  { label: "Discovery", value: "312 URLs", color: "#a78bfa" },
                  { label: "Acquisition", value: "61 docs", color: "#fbbf24" },
                  { label: "Classification", value: "18 relevant", color: "#10b981" },
                  { label: "Extraction", value: "18 extracted", color: "#4ade80" },
                  { label: "Dedup", value: "0 dupes", color: "#4ade80" },
                  { label: "Dashboard", value: "18 published", color: "#4ade80" },
                ].map((step, i, arr) => (
                  <div key={step.label} className="flex items-center">
                    <div className="flex flex-col items-center text-center px-3 py-2">
                      <div className="text-xs text-slate-500 mb-1">{step.label}</div>
                      <div className="text-sm font-medium" style={{ color: step.color }}>{step.value}</div>
                    </div>
                    {i < arr.length - 1 && (
                      <ArrowRight size={14} className="text-slate-700 flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-4 text-xs text-slate-600 border-t border-slate-800 pt-3">
                Precision filter: 312 candidate URLs → 61 acquired → 18 relevant (5.8% conversion, expected for broad crawl)
              </div>
            </div>
          </div>
        )}

        {/* ---- Job Log ---- */}
        {activeTab === "jobs" && (
          <div className="glass-card rounded-xl overflow-hidden animate-fade-in">
            <div className="px-5 py-3 border-b border-slate-800">
              <h2 className="font-display text-sm text-white">Job Execution Log — {CYCLE_REPORT.run_id}</h2>
            </div>
            <div className="divide-y divide-slate-800/50">
              {JOBS.map((job, i) => {
                const Icon = job.icon;
                return (
                  <div key={job.id} className="flex items-center gap-4 px-5 py-3.5">
                    <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] text-slate-500">{i + 1}</span>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-slate-800/80 flex items-center justify-center flex-shrink-0">
                      <Icon size={14} className="text-slate-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-white text-sm">{job.label}</div>
                      <div className="text-xs text-slate-500 mt-0.5 truncate">{job.output}</div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-xs text-slate-500 font-mono">{job.duration}</span>
                      <StatusDot status={job.status} />
                      <span className="text-xs text-emerald-400 capitalize">{job.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="px-5 py-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500">12 jobs completed · 0 failures · Total runtime: {CYCLE_REPORT.duration_mins} min</span>
              <span className="text-xs text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 size={12} /> All jobs successful
              </span>
            </div>
          </div>
        )}

        {/* ---- Schedule ---- */}
        {activeTab === "schedule" && (
          <div className="space-y-4 animate-fade-in">
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-800">
                <h2 className="font-display text-sm text-white">Run Schedule</h2>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800">
                    {["Job", "Frequency", "Applies To", "Next Run"].map((h) => (
                      <th key={h} className="text-left py-3 px-5 text-xs text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SCHEDULE.map((s) => (
                    <tr key={s.job} className="border-b border-slate-800/50">
                      <td className="py-4 px-5 font-medium text-white">{s.job}</td>
                      <td className="py-4 px-5 text-slate-300">{s.frequency}</td>
                      <td className="py-4 px-5">
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">{s.tier}</span>
                      </td>
                      <td className="py-4 px-5 text-xs font-mono text-emerald-400">{s.next}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ---- Success Metrics ---- */}
        {activeTab === "metrics" && (
          <div className="animate-fade-in">
            <div className="grid grid-cols-3 gap-4">
              {SUCCESS_METRICS.map((m) => (
                <MetricCard key={m.label} {...m} />
              ))}
            </div>
            <div className="glass-card rounded-xl p-5 mt-5">
              <h2 className="font-display text-sm text-white mb-4">95%+ Automation Target</h2>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                    <span>Fully automated</span>
                    <span className="text-emerald-400 font-medium">100% this cycle</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400" style={{ width: "100%" }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-600 mt-1">
                    <span>0%</span>
                    <span className="text-amber-500">Target: 95%</span>
                    <span>100%</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-display text-4xl text-emerald-400">100%</div>
                  <div className="text-xs text-slate-500 mt-1">18 of 18 documents</div>
                  <div className="text-xs text-slate-600">no human review needed</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
