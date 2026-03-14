"use client";

import { useState, useMemo } from "react";
import {
  Search, Filter, FileText, AlertCircle, TrendingUp,
  ChevronRight, X, ExternalLink, Calendar, Building2,
  Tag, Shield, BarChart3, RefreshCw, ChevronDown
} from "lucide-react";
import { DEMO_DOCUMENTS, COUNTRY_META, getFilteredDocuments } from "@/lib/data";
import type { Document } from "@/lib/types";

// ---- Utility helpers -------------------------------------------------------

function Badge({ value, type }: { value: string; type: string }) {
  const cls = `badge-${value?.replace(/ /g, "_")}`;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border ${cls}`}>
      {value?.replace(/_/g, " ")}
    </span>
  );
}

function formatDate(d: string) {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return d;
  }
}

function ConfidenceBar({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  const color = pct >= 90 ? "#4ade80" : pct >= 75 ? "#fbbf24" : "#fb7185";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
        <div style={{ width: `${pct}%`, backgroundColor: color }} className="h-full rounded-full transition-all" />
      </div>
      <span className="text-xs text-slate-400 w-8 text-right">{pct}%</span>
    </div>
  );
}

// ---- KPI Cards -------------------------------------------------------------

function KpiCard({ label, value, sub, icon: Icon, accent }: {
  label: string; value: string | number; sub?: string;
  icon: React.ElementType; accent: string;
}) {
  return (
    <div className="glass-card rounded-xl p-5 flex flex-col gap-3 animate-fade-in">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400 uppercase tracking-widest">{label}</span>
        <div style={{ backgroundColor: `${accent}18`, color: accent }}
          className="w-8 h-8 rounded-lg flex items-center justify-center">
          <Icon size={15} />
        </div>
      </div>
      <div className="font-display text-3xl leading-none" style={{ color: accent }}>{value}</div>
      {sub && <div className="text-xs text-slate-500">{sub}</div>}
    </div>
  );
}

// ---- Country Tab -----------------------------------------------------------

function CountryTab({ country, count, selected, onClick }: {
  country: string; count: number; selected: boolean; onClick: () => void;
}) {
  const meta = COUNTRY_META[country];
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all border ${
        selected
          ? "glass-card border-emerald-500/40 text-white"
          : "border-transparent text-slate-400 hover:text-white hover:border-slate-700"
      }`}
    >
      <span className="text-lg">{meta?.flag}</span>
      <span>{country}</span>
      <span className={`text-xs px-1.5 py-0.5 rounded-full ${
        selected ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-500"
      }`}>{count}</span>
    </button>
  );
}

// ---- Filters Panel ---------------------------------------------------------

const ALL_THEMES = [
  "ESG reporting", "Climate disclosure", "Sustainability reporting",
  "Emissions reporting", "Green finance", "Taxonomy", "Transition planning",
  "Supply chain due diligence", "Human rights disclosure", "Corporate governance",
];

function FilterSelect({ label, value, options, onChange }: {
  label: string; value: string; options: string[]; onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs text-slate-500 uppercase tracking-wider">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="filter-input w-full rounded-lg px-3 py-2 text-sm appearance-none pr-8"
        >
          <option value="all">All</option>
          {options.map((o) => (
            <option key={o} value={o}>{o.replace(/_/g, " ")}</option>
          ))}
        </select>
        <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
      </div>
    </div>
  );
}

// ---- Document Table --------------------------------------------------------

function DocumentTable({ docs, selected, onSelect }: {
  docs: Document[]; selected: Document | null; onSelect: (d: Document) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-800">
            {["Title", "Country", "Type", "Status", "Relevance", "Published", "Mandatory"].map((h) => (
              <th key={h} className="text-left py-3 px-4 text-xs text-slate-500 uppercase tracking-wider font-medium whitespace-nowrap">
                {h}
              </th>
            ))}
            <th className="w-8" />
          </tr>
        </thead>
        <tbody>
          {docs.map((doc) => {
            const meta = COUNTRY_META[doc.country];
            const isSelected = selected?.doc_id === doc.doc_id;
            return (
              <tr
                key={doc.doc_id}
                className={`doc-row border-b border-slate-800/50 ${isSelected ? "selected" : ""}`}
                onClick={() => onSelect(doc)}
              >
                <td className="py-3 px-4 max-w-xs">
                  <div className="font-medium text-white leading-tight line-clamp-2 text-[13px]">{doc.title}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{doc.institution_name}</div>
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span className="text-base">{meta?.flag}</span>
                    <span className="text-xs text-slate-400">{doc.country}</span>
                  </span>
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 capitalize">
                    {doc.document_type}
                  </span>
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <Badge value={doc.legal_status} type="status" />
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <Badge value={doc.relevance_class} type="relevance" />
                </td>
                <td className="py-3 px-4 whitespace-nowrap text-xs text-slate-400">
                  {formatDate(doc.publication_date)}
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <Badge value={doc.mandatory_or_voluntary} type="mandatory" />
                </td>
                <td className="py-3 px-4">
                  <ChevronRight size={14} className={`transition-colors ${isSelected ? "text-emerald-400" : "text-slate-600"}`} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {docs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-slate-500">
          <Filter size={32} className="mb-3 opacity-40" />
          <p className="font-medium">No documents match your filters</p>
          <p className="text-sm mt-1">Try adjusting the filters or search query</p>
        </div>
      )}
    </div>
  );
}

// ---- Document Detail Panel -------------------------------------------------

function DetailPanel({ doc, onClose }: { doc: Document; onClose: () => void }) {
  const meta = COUNTRY_META[doc.country];
  return (
    <div className="animate-slide-in h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between p-5 border-b border-slate-800 gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{meta?.flag}</span>
            <span className="text-xs text-slate-500 uppercase tracking-wider">{doc.country} · {doc.source_type.replace(/_/g, " ")}</span>
          </div>
          <h2 className="font-display text-base leading-snug text-white">{doc.title}</h2>
        </div>
        <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-1 mt-0.5 flex-shrink-0">
          <X size={16} />
        </button>
      </div>

      {/* Status row */}
      <div className="flex flex-wrap gap-2 px-5 py-3 border-b border-slate-800">
        <Badge value={doc.legal_status} type="status" />
        <Badge value={doc.relevance_class} type="relevance" />
        <Badge value={doc.mandatory_or_voluntary} type="mandatory" />
        <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 capitalize">
          {doc.document_type}
        </span>
      </div>

      {/* Body — scrollable */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Summary */}
        <div>
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Summary</div>
          <p className="text-sm text-slate-300 leading-relaxed">{doc.summary}</p>
        </div>

        {/* Key dates */}
        <div className="grid grid-cols-2 gap-3">
          <div className="glass-card rounded-lg p-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <Calendar size={11} /> Published
            </div>
            <div className="text-sm font-medium text-white">{formatDate(doc.publication_date)}</div>
          </div>
          <div className="glass-card rounded-lg p-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <Calendar size={11} /> Effective
            </div>
            <div className="text-sm font-medium text-white">{formatDate(doc.effective_date) || "—"}</div>
          </div>
        </div>

        {/* Institution */}
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 uppercase tracking-wider mb-2">
            <Building2 size={11} /> Issuing Body
          </div>
          <div className="text-sm text-slate-300">{doc.institution_name}</div>
        </div>

        {/* Thematic tags */}
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 uppercase tracking-wider mb-2">
            <Tag size={11} /> Thematic Tags
          </div>
          <div className="flex flex-wrap gap-1.5">
            {doc.thematic_tags.map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Sectors */}
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 uppercase tracking-wider mb-2">
            <BarChart3 size={11} /> Sectors Affected
          </div>
          <div className="flex flex-wrap gap-1.5">
            {doc.sectors_affected.map((s) => (
              <span key={s} className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">{s}</span>
            ))}
          </div>
        </div>

        {/* Reporting scope */}
        {doc.reporting_entities && (
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 uppercase tracking-wider mb-2">
              <Shield size={11} /> Reporting Entities
            </div>
            <p className="text-sm text-slate-300">{doc.reporting_entities}</p>
          </div>
        )}

        {doc.reporting_threshold && (
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Threshold</div>
            <p className="text-sm text-slate-300">{doc.reporting_threshold}</p>
          </div>
        )}

        {/* Confidence */}
        <div>
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">AI Confidence Score</div>
          <ConfidenceBar score={doc.confidence_score} />
        </div>

        {/* Metadata row */}
        <div className="glass-card rounded-lg p-3 text-xs text-slate-500 space-y-1">
          <div className="flex justify-between">
            <span>Acquisition method</span>
            <span className="text-slate-400 capitalize">{doc.acquisition_method}</span>
          </div>
          <div className="flex justify-between">
            <span>Language</span>
            <span className="text-slate-400">{doc.language_detected}</span>
          </div>
          <div className="flex justify-between">
            <span>Pipeline run</span>
            <span className="text-slate-400">{formatDate(doc.pipeline_run_date)}</span>
          </div>
          <div className="flex justify-between">
            <span>Requires review</span>
            <span className={doc.requires_human_review ? "text-amber-400" : "text-emerald-400"}>
              {doc.requires_human_review ? "Yes" : "No"}
            </span>
          </div>
        </div>
      </div>

      {/* Source link */}
      <div className="p-4 border-t border-slate-800">
        <a
          href={doc.document_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-emerald-500/30 text-emerald-400 text-sm font-medium hover:bg-emerald-500/10 transition-colors"
        >
          <ExternalLink size={14} />
          Open source document
        </a>
      </div>
    </div>
  );
}

// ---- Main Page -------------------------------------------------------------

export default function Home() {
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [filters, setFilters] = useState({
    country: "all",
    relevance_class: "all",
    legal_status: "all",
    document_type: "all",
    mandatory_or_voluntary: "all",
    thematic_tag: "all",
    search: "",
  });

  const docs = DEMO_DOCUMENTS;

  const filtered = useMemo(() => getFilteredDocuments(docs, filters), [docs, filters]);

  const stats = useMemo(() => ({
    total: docs.length,
    high: docs.filter((d) => d.relevance_class === "high").length,
    inForce: docs.filter((d) => d.legal_status === "in_force").length,
    pendingReview: docs.filter((d) => d.requires_human_review).length,
    countries: [...new Set(docs.map((d) => d.country))].length,
  }), [docs]);

  const countryDocs = useMemo(() =>
    Object.keys(COUNTRY_META).reduce((acc, c) => {
      acc[c] = docs.filter((d) => d.country === c).length;
      return acc;
    }, {} as Record<string, number>),
    [docs]
  );

  const setFilter = (key: string, val: string) => {
    setFilters((f) => ({ ...f, [key]: val }));
    setSelectedDoc(null);
  };

  const clearFilters = () => {
    setFilters({
      country: "all", relevance_class: "all", legal_status: "all",
      document_type: "all", mandatory_or_voluntary: "all", thematic_tag: "all", search: "",
    });
  };

  const activeFilterCount = Object.entries(filters).filter(
    ([k, v]) => k !== "search" && v !== "all"
  ).length + (filters.search ? 1 : 0);

  return (
    <div className="flex h-full overflow-hidden bg-navy-950">
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left sidebar: filters ── */}
        <aside className="w-56 flex-shrink-0 border-r border-slate-800 bg-navy-900/60 overflow-y-auto p-4 space-y-5">
          {/* Search */}
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search documents…"
              value={filters.search}
              onChange={(e) => setFilter("search", e.target.value)}
              className="filter-input w-full rounded-lg pl-8 pr-3 py-2 text-sm"
            />
          </div>

          {/* Country tabs */}
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-2.5">Country</div>
            <div className="space-y-1">
              <button
                onClick={() => setFilter("country", "all")}
                className={`filter-pill w-full text-left px-3 py-1.5 rounded-lg text-sm border transition-all ${
                  filters.country === "all"
                    ? "active"
                    : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                All countries
              </button>
              {Object.keys(COUNTRY_META).map((c) => {
                const meta = COUNTRY_META[c];
                return (
                  <button
                    key={c}
                    onClick={() => setFilter("country", c)}
                    className={`filter-pill w-full text-left px-3 py-1.5 rounded-lg text-sm border flex items-center gap-2 ${
                      filters.country === c
                        ? "active"
                        : "border-transparent text-slate-400 hover:text-white"
                    }`}
                  >
                    <span>{meta.flag}</span>
                    <span>{c}</span>
                    <span className="ml-auto text-xs text-slate-600">{countryDocs[c]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filters */}
          <FilterSelect
            label="Relevance"
            value={filters.relevance_class}
            options={["high", "medium", "low"]}
            onChange={(v) => setFilter("relevance_class", v)}
          />
          <FilterSelect
            label="Legal Status"
            value={filters.legal_status}
            options={["in_force", "adopted", "proposed", "under_consultation", "amended", "repealed"]}
            onChange={(v) => setFilter("legal_status", v)}
          />
          <FilterSelect
            label="Document Type"
            value={filters.document_type}
            options={["law", "regulation", "guidance", "consultation", "standard"]}
            onChange={(v) => setFilter("document_type", v)}
          />
          <FilterSelect
            label="Mandatory / Voluntary"
            value={filters.mandatory_or_voluntary}
            options={["mandatory", "voluntary", "mixed"]}
            onChange={(v) => setFilter("mandatory_or_voluntary", v)}
          />
          <FilterSelect
            label="Thematic Area"
            value={filters.thematic_tag}
            options={ALL_THEMES}
            onChange={(v) => setFilter("thematic_tag", v)}
          />

          {/* Clear filters */}
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 transition-colors"
            >
              <X size={11} /> Clear {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""}
            </button>
          )}
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 flex flex-col overflow-hidden">

          {/* KPI row */}
          <div className="flex-shrink-0 grid grid-cols-4 gap-4 p-5 pb-0">
            <KpiCard label="Total Documents" value={stats.total} icon={FileText} accent="#10b981" sub="Across 3 jurisdictions" />
            <KpiCard label="High Relevance" value={stats.high} icon={TrendingUp} accent="#34d399" sub="Laws, regulations, mandatory standards" />
            <KpiCard label="Currently In Force" value={stats.inForce} icon={Shield} accent="#60a5fa" sub="Legally effective instruments" />
            <KpiCard label="Pending QA Review" value={stats.pendingReview} icon={AlertCircle} accent="#fbbf24" sub="Confidence score < 0.75" />
          </div>

          {/* Table header */}
          <div className="flex-shrink-0 flex items-center justify-between px-5 pt-4 pb-2">
            <div className="flex items-center gap-3">
              <h1 className="font-display text-lg text-white">
                {filters.country !== "all" ? (
                  <>{COUNTRY_META[filters.country]?.flag} {filters.country}</>
                ) : "All Jurisdictions"}
              </h1>
              <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                {filtered.length} document{filtered.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <RefreshCw size={11} />
              Pipeline runs twice weekly
            </div>
          </div>

          {/* Table + detail split */}
          <div className="flex-1 flex overflow-hidden mx-5 mb-5 rounded-xl glass-card">
            {/* Table */}
            <div className={`overflow-y-auto transition-all duration-300 ${selectedDoc ? "w-[55%]" : "w-full"}`}>
              <DocumentTable docs={filtered} selected={selectedDoc} onSelect={setSelectedDoc} />
            </div>

            {/* Detail panel */}
            {selectedDoc && (
              <div className="w-[45%] border-l border-slate-800 overflow-hidden">
                <DetailPanel doc={selectedDoc} onClose={() => setSelectedDoc(null)} />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
