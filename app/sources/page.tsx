"use client";

import { useState, useMemo } from "react";
import {
  ExternalLink, ChevronDown, Search, CheckCircle2,
  Rss, Globe2, FileSearch, SlidersHorizontal, X
} from "lucide-react";
import { COUNTRY_META } from "@/lib/data";

// ---- Source data -----------------------------------------------------------

const SOURCES = [
  {
    id: "uk-01",
    country: "UK",
    institution_name: "HM Treasury Legislation Portal",
    source_type: "legislation_portal",
    base_url: "https://www.legislation.gov.uk",
    seed_url: "https://www.legislation.gov.uk/new",
    language: "EN",
    relevance_priority: 1,
    crawl_tier: "tier_1_api_feed",
    crawl_method: "search_page",
    has_rss: false,
    has_sitemap: true,
    has_search: false,
    expected_doc_types: ["pdf", "html"],
    keywords: ["climate", "sustainability", "environment", "reporting", "emissions", "disclosure"],
    update_frequency: "weekly",
    reliability_score: 0.98,
    last_crawl: "2026-03-16",
    docs_found: 1,
    notes: "Primary source for all UK statutory instruments and acts. Very stable structure.",
  },
  {
    id: "uk-02",
    country: "UK",
    institution_name: "Financial Conduct Authority",
    source_type: "regulator",
    base_url: "https://www.fca.org.uk",
    seed_url: "https://www.fca.org.uk/publications",
    language: "EN",
    relevance_priority: 1,
    crawl_tier: "tier_2_structured",
    crawl_method: "document_repo",
    has_rss: true,
    has_sitemap: false,
    has_search: false,
    expected_doc_types: ["pdf", "html"],
    keywords: ["sustainability", "climate disclosure", "ESG", "SDR", "TCFD", "greenwashing"],
    update_frequency: "weekly",
    reliability_score: 0.96,
    last_crawl: "2026-03-16",
    docs_found: 2,
    notes: "Key regulator for SDR and ESG fund labelling rules. Well-structured publications index.",
  },
  {
    id: "uk-03",
    country: "UK",
    institution_name: "HM Government Policy Portal",
    source_type: "government_portal",
    base_url: "https://www.gov.uk",
    seed_url: "https://www.gov.uk/search/policy-papers-and-consultations",
    language: "EN",
    relevance_priority: 1,
    crawl_tier: "tier_2_structured",
    crawl_method: "search_page",
    has_rss: false,
    has_sitemap: false,
    has_search: true,
    expected_doc_types: ["pdf", "html"],
    keywords: ["climate", "sustainability", "net zero", "ESG", "CSRD", "ISSB"],
    update_frequency: "weekly",
    reliability_score: 0.94,
    last_crawl: "2026-03-16",
    docs_found: 3,
    notes: "Broad government policy and consultation source. Use keyword search endpoint.",
  },
  {
    id: "uk-04",
    country: "UK",
    institution_name: "UK Sustainability Reporting Standards",
    source_type: "government_guidance",
    base_url: "https://www.gov.uk",
    seed_url: "https://www.gov.uk/guidance/uk-sustainability-reporting-standards",
    language: "EN",
    relevance_priority: 1,
    crawl_tier: "tier_1_api_feed",
    crawl_method: "static_html",
    has_rss: false,
    has_sitemap: false,
    has_search: false,
    expected_doc_types: ["pdf", "html"],
    keywords: ["sustainability reporting", "disclosure", "ESG", "ISSB", "IFRS S1", "IFRS S2"],
    update_frequency: "weekly",
    reliability_score: 0.99,
    last_crawl: "2026-03-16",
    docs_found: 1,
    notes: "Dedicated landing page for UK SRS adoption process. Monitor for new consultations.",
  },
  {
    id: "uk-05",
    country: "UK",
    institution_name: "Companies House",
    source_type: "corporate_regulator",
    base_url: "https://www.gov.uk",
    seed_url: "https://www.gov.uk/government/organisations/companies-house",
    language: "EN",
    relevance_priority: 2,
    crawl_tier: "tier_2_structured",
    crawl_method: "document_repo",
    has_rss: false,
    has_sitemap: false,
    has_search: false,
    expected_doc_types: ["pdf", "html"],
    keywords: ["corporate reporting", "climate", "TCFD", "mandatory disclosure"],
    update_frequency: "monthly",
    reliability_score: 0.91,
    last_crawl: "2026-03-16",
    docs_found: 0,
    notes: "Mandatory reporting requirements for large UK companies.",
  },
  {
    id: "de-01",
    country: "Germany",
    institution_name: "Federal Environment Ministry (BMUV)",
    source_type: "ministry",
    base_url: "https://www.bmuv.de",
    seed_url: "https://www.bmuv.de/ministerium/gesetze",
    language: "DE",
    relevance_priority: 1,
    crawl_tier: "tier_2_structured",
    crawl_method: "document_repo",
    has_rss: false,
    has_sitemap: false,
    has_search: false,
    expected_doc_types: ["pdf", "html"],
    keywords: ["klima", "nachhaltigkeit", "umwelt", "klimaschutz", "berichterstattung"],
    update_frequency: "weekly",
    reliability_score: 0.92,
    last_crawl: "2026-03-16",
    docs_found: 2,
    notes: "Primary source for German environmental and climate legislation.",
  },
  {
    id: "de-02",
    country: "Germany",
    institution_name: "Bundestag Legislative Database (DIP)",
    source_type: "parliament",
    base_url: "https://dip.bundestag.de",
    seed_url: "https://dip.bundestag.de",
    language: "DE",
    relevance_priority: 1,
    crawl_tier: "tier_1_api_feed",
    crawl_method: "search_page",
    has_rss: false,
    has_sitemap: false,
    has_search: true,
    expected_doc_types: ["pdf", "html"],
    keywords: ["klima", "nachhaltigkeit", "umwelt", "CSRD", "lieferkette", "sorgfaltspflicht"],
    update_frequency: "weekly",
    reliability_score: 0.97,
    last_crawl: "2026-03-16",
    docs_found: 1,
    notes: "Official parliamentary database with structured API. Tier 1 source.",
  },
  {
    id: "de-03",
    country: "Germany",
    institution_name: "Federal Law Gazette (Bundesgesetzblatt)",
    source_type: "official_gazette",
    base_url: "https://www.bgbl.de",
    seed_url: "https://www.bgbl.de",
    language: "DE",
    relevance_priority: 1,
    crawl_tier: "tier_1_api_feed",
    crawl_method: "gazette_search",
    has_rss: true,
    has_sitemap: false,
    has_search: false,
    expected_doc_types: ["pdf"],
    keywords: ["klima", "emission", "nachhaltigkeit", "umwelt"],
    update_frequency: "weekly",
    reliability_score: 0.95,
    last_crawl: "2026-03-16",
    docs_found: 1,
    notes: "Official gazette for enacted German law. RSS feed available.",
  },
  {
    id: "de-04",
    country: "Germany",
    institution_name: "BaFin Financial Regulator",
    source_type: "regulator",
    base_url: "https://www.bafin.de",
    seed_url: "https://www.bafin.de/EN/PublikationenDaten/publikationen_node_en.html",
    language: "DE/EN",
    relevance_priority: 1,
    crawl_tier: "tier_2_structured",
    crawl_method: "document_repo",
    has_rss: false,
    has_sitemap: false,
    has_search: true,
    expected_doc_types: ["pdf", "html"],
    keywords: ["sustainable finance", "climate risk", "ESG", "taxonomy", "SFDR", "greenwashing"],
    update_frequency: "weekly",
    reliability_score: 0.93,
    last_crawl: "2026-03-16",
    docs_found: 1,
    notes: "German financial regulator. Dual-language English/German. Key for sustainable finance rules.",
  },
  {
    id: "de-05",
    country: "Germany",
    institution_name: "Federal Office for Economic Affairs (BAFA)",
    source_type: "regulator",
    base_url: "https://www.bafa.de",
    seed_url: "https://www.bafa.de/DE/Lieferketten/lieferketten_node.html",
    language: "DE",
    relevance_priority: 2,
    crawl_tier: "tier_2_structured",
    crawl_method: "document_repo",
    has_rss: false,
    has_sitemap: false,
    has_search: false,
    expected_doc_types: ["pdf", "html"],
    keywords: ["lieferkettensorgfaltspflichtengesetz", "LkSG", "due diligence", "supply chain"],
    update_frequency: "monthly",
    reliability_score: 0.89,
    last_crawl: "2026-03-16",
    docs_found: 1,
    notes: "Enforces LkSG. Guidance documents and enforcement updates.",
  },
  {
    id: "br-01",
    country: "Brazil",
    institution_name: "Comissão de Valores Mobiliários (CVM)",
    source_type: "regulator",
    base_url: "https://www.gov.br/cvm",
    seed_url: "https://www.gov.br/cvm/pt-br/assuntos/noticias",
    language: "PT",
    relevance_priority: 1,
    crawl_tier: "tier_2_structured",
    crawl_method: "document_repo",
    has_rss: false,
    has_sitemap: false,
    has_search: false,
    expected_doc_types: ["pdf", "html"],
    keywords: ["sustentabilidade", "ESG", "divulgação climática", "resolução", "instrução"],
    update_frequency: "weekly",
    reliability_score: 0.88,
    last_crawl: "2026-03-16",
    docs_found: 2,
    notes: "Brazilian securities regulator. Issued Resolution 59 on ESG disclosure. Key source.",
  },
  {
    id: "br-02",
    country: "Brazil",
    institution_name: "Banco Central do Brasil (BCB)",
    source_type: "central_bank",
    base_url: "https://www.bcb.gov.br",
    seed_url: "https://www.bcb.gov.br/estabilidadefinanceira/sustentabilidade",
    language: "PT",
    relevance_priority: 1,
    crawl_tier: "tier_2_structured",
    crawl_method: "static_html",
    has_rss: false,
    has_sitemap: false,
    has_search: true,
    expected_doc_types: ["pdf", "html"],
    keywords: ["risco climático", "sustentabilidade", "PRSAC", "política", "resolução"],
    update_frequency: "weekly",
    reliability_score: 0.91,
    last_crawl: "2026-03-16",
    docs_found: 2,
    notes: "Central bank sustainability policy. Issued key climate risk regulations.",
  },
  {
    id: "br-03",
    country: "Brazil",
    institution_name: "Ministério do Meio Ambiente (MMA)",
    source_type: "ministry",
    base_url: "https://www.gov.br/mma",
    seed_url: "https://www.gov.br/mma/pt-br/assuntos",
    language: "PT",
    relevance_priority: 1,
    crawl_tier: "tier_2_structured",
    crawl_method: "document_repo",
    has_rss: false,
    has_sitemap: false,
    has_search: false,
    expected_doc_types: ["pdf", "html"],
    keywords: ["clima", "biodiversidade", "sustentabilidade", "desmatamento", "carbono"],
    update_frequency: "weekly",
    reliability_score: 0.85,
    last_crawl: "2026-03-16",
    docs_found: 1,
    notes: "Brazilian environment ministry. Key for national climate policy.",
  },
  {
    id: "br-04",
    country: "Brazil",
    institution_name: "Imprensa Nacional (Diário Oficial da União)",
    source_type: "official_gazette",
    base_url: "https://www.in.gov.br",
    seed_url: "https://www.in.gov.br/leiturajornal",
    language: "PT",
    relevance_priority: 1,
    crawl_tier: "tier_1_api_feed",
    crawl_method: "gazette_search",
    has_rss: false,
    has_sitemap: false,
    has_search: true,
    expected_doc_types: ["pdf"],
    keywords: ["clima", "meio ambiente", "energia", "sustentabilidade", "emissões"],
    update_frequency: "daily",
    reliability_score: 0.93,
    last_crawl: "2026-03-16",
    docs_found: 1,
    notes: "Official federal gazette. Daily publication. API-accessible. Tier 1 source.",
  },
];

// ---- Helpers ---------------------------------------------------------------

const TIER_META: Record<string, { label: string; color: string; bg: string; border: string }> = {
  tier_1_api_feed: { label: "Tier 1 — API / Feed", color: "#4ade80", bg: "#052e16", border: "#166534" },
  tier_2_structured: { label: "Tier 2 — Structured", color: "#60a5fa", bg: "#0c1a2e", border: "#1e40af" },
  tier_3_messy: { label: "Tier 3 — Complex", color: "#fbbf24", bg: "#1c1917", border: "#78350f" },
};

const SOURCE_TYPE_LABELS: Record<string, string> = {
  regulator: "Regulator",
  ministry: "Ministry",
  parliament: "Parliament",
  official_gazette: "Official Gazette",
  legislation_portal: "Legislation Portal",
  government_portal: "Government Portal",
  government_guidance: "Gov Guidance",
  central_bank: "Central Bank",
  corporate_regulator: "Corporate Regulator",
};

function ReliabilityBar({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  const color = pct >= 95 ? "#4ade80" : pct >= 85 ? "#60a5fa" : "#fbbf24";
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden">
        <div style={{ width: `${pct}%`, backgroundColor: color }} className="h-full rounded-full" />
      </div>
      <span className="text-xs text-slate-400">{pct}%</span>
    </div>
  );
}

function CapabilityPill({ active, label, icon: Icon }: {
  active: boolean; label: string; icon: React.ElementType;
}) {
  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] border ${
      active
        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
        : "bg-slate-800/50 border-slate-700 text-slate-600"
    }`}>
      <Icon size={9} />
      {label}
    </span>
  );
}

// ---- Main Page -------------------------------------------------------------

export default function SourcesPage() {
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");
  const [tierFilter, setTierFilter] = useState("all");
  const [selectedSource, setSelectedSource] = useState<typeof SOURCES[0] | null>(null);

  const filtered = useMemo(() => {
    return SOURCES.filter((s) => {
      if (countryFilter !== "all" && s.country !== countryFilter) return false;
      if (tierFilter !== "all" && s.crawl_tier !== tierFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!s.institution_name.toLowerCase().includes(q) &&
            !s.source_type.toLowerCase().includes(q) &&
            !s.base_url.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [search, countryFilter, tierFilter]);

  const stats = useMemo(() => ({
    total: SOURCES.length,
    tier1: SOURCES.filter((s) => s.crawl_tier === "tier_1_api_feed").length,
    tier2: SOURCES.filter((s) => s.crawl_tier === "tier_2_structured").length,
    avgReliability: Math.round(SOURCES.reduce((sum, s) => sum + s.reliability_score, 0) / SOURCES.length * 100),
    totalDocs: SOURCES.reduce((sum, s) => sum + s.docs_found, 0),
  }), []);

  return (
    <div className="flex h-full overflow-hidden bg-navy-950">

      {/* Left sidebar */}
      <aside className="w-56 flex-shrink-0 border-r border-slate-800 bg-navy-900/60 overflow-y-auto p-4 space-y-5">
        {/* Search */}
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search sources…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="filter-input w-full rounded-lg pl-8 pr-3 py-2 text-sm"
          />
        </div>

        {/* Country */}
        <div>
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-2.5">Country</div>
          <div className="space-y-1">
            {["all", "UK", "Germany", "Brazil"].map((c) => {
              const meta = c !== "all" ? COUNTRY_META[c] : null;
              return (
                <button
                  key={c}
                  onClick={() => setCountryFilter(c)}
                  className={`filter-pill w-full text-left px-3 py-1.5 rounded-lg text-sm border flex items-center gap-2 ${
                    countryFilter === c ? "active" : "border-transparent text-slate-400 hover:text-white"
                  }`}
                >
                  {meta ? <span>{meta.flag}</span> : <Globe2 size={13} />}
                  <span>{c === "all" ? "All countries" : c}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tier */}
        <div>
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-2.5">Crawl Tier</div>
          <div className="space-y-1">
            {[
              { val: "all", label: "All tiers" },
              { val: "tier_1_api_feed", label: "Tier 1 — API/Feed" },
              { val: "tier_2_structured", label: "Tier 2 — Structured" },
              { val: "tier_3_messy", label: "Tier 3 — Complex" },
            ].map(({ val, label }) => (
              <button
                key={val}
                onClick={() => setTierFilter(val)}
                className={`filter-pill w-full text-left px-3 py-1.5 rounded-lg text-sm border ${
                  tierFilter === val ? "active" : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Clear */}
        {(search || countryFilter !== "all" || tierFilter !== "all") && (
          <button
            onClick={() => { setSearch(""); setCountryFilter("all"); setTierFilter("all"); }}
            className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300"
          >
            <X size={11} /> Clear filters
          </button>
        )}
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* KPI row */}
        <div className="flex-shrink-0 grid grid-cols-4 gap-4 p-5 pb-4">
          {[
            { label: "Total Sources", value: stats.total, sub: "Across 3 jurisdictions", color: "#10b981" },
            { label: "Tier 1 — Automated", value: stats.tier1, sub: "API/RSS/sitemap feeds", color: "#4ade80" },
            { label: "Tier 2 — Structured", value: stats.tier2, sub: "Ministry & regulator sites", color: "#60a5fa" },
            { label: "Mean Reliability", value: `${stats.avgReliability}%`, sub: "Across all active sources", color: "#fbbf24" },
          ].map(({ label, value, sub, color }) => (
            <div key={label} className="glass-card rounded-xl p-5 animate-fade-in">
              <div className="text-xs text-slate-500 uppercase tracking-widest mb-3">{label}</div>
              <div className="font-display text-3xl leading-none mb-2" style={{ color }}>{value}</div>
              <div className="text-xs text-slate-500">{sub}</div>
            </div>
          ))}
        </div>

        {/* Split: table + detail */}
        <div className="flex-1 flex overflow-hidden mx-5 mb-5 rounded-xl glass-card">

          {/* Table */}
          <div className={`overflow-y-auto transition-all duration-300 ${selectedSource ? "w-[55%]" : "w-full"}`}>
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <h1 className="font-display text-base text-white">Source Registry</h1>
                <span className="text-xs bg-slate-800 px-2 py-0.5 rounded-full text-slate-400">
                  {filtered.length} sources
                </span>
              </div>
              <div className="flex items-center gap-2">
                {Object.entries(TIER_META).map(([tier, meta]) => (
                  <span key={tier} className="flex items-center gap-1.5 text-xs px-2 py-0.5 rounded border"
                    style={{ color: meta.color, backgroundColor: meta.bg, borderColor: meta.border }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: meta.color }} />
                    {meta.label}
                  </span>
                ))}
              </div>
            </div>

            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  {["Institution", "Country", "Type", "Tier", "Capabilities", "Reliability", "Docs"].map((h) => (
                    <th key={h} className="text-left py-3 px-4 text-xs text-slate-500 uppercase tracking-wider font-medium whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((src) => {
                  const meta = COUNTRY_META[src.country];
                  const tier = TIER_META[src.crawl_tier];
                  const isSelected = selectedSource?.id === src.id;
                  return (
                    <tr
                      key={src.id}
                      className={`doc-row border-b border-slate-800/50 ${isSelected ? "selected" : ""}`}
                      onClick={() => setSelectedSource(isSelected ? null : src)}
                    >
                      <td className="py-3 px-4">
                        <div className="font-medium text-white text-[13px] leading-tight">{src.institution_name}</div>
                        <div className="text-xs text-slate-500 mt-0.5 truncate max-w-[200px]">{src.base_url}</div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="flex items-center gap-1.5">
                          <span className="text-base">{meta?.flag}</span>
                          <span className="text-xs text-slate-400">{src.country}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {SOURCE_TYPE_LABELS[src.source_type] || src.source_type}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className="text-[11px] px-2 py-0.5 rounded border font-medium"
                          style={{ color: tier?.color, backgroundColor: tier?.bg, borderColor: tier?.border }}
                        >
                          {src.crawl_tier === "tier_1_api_feed" ? "Tier 1" :
                           src.crawl_tier === "tier_2_structured" ? "Tier 2" : "Tier 3"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <CapabilityPill active={src.has_rss} label="RSS" icon={Rss} />
                          <CapabilityPill active={src.has_sitemap} label="Sitemap" icon={Globe2} />
                          <CapabilityPill active={src.has_search} label="Search" icon={FileSearch} />
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <ReliabilityBar score={src.reliability_score} />
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-sm font-medium ${src.docs_found > 0 ? "text-emerald-400" : "text-slate-600"}`}>
                          {src.docs_found}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Detail panel */}
          {selectedSource && (
            <div className="w-[45%] border-l border-slate-800 overflow-y-auto animate-slide-in">
              <div className="p-5 border-b border-slate-800 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{COUNTRY_META[selectedSource.country]?.flag}</span>
                    <span className="text-xs text-slate-500 uppercase tracking-wider">
                      {selectedSource.country} · {SOURCE_TYPE_LABELS[selectedSource.source_type]}
                    </span>
                  </div>
                  <h2 className="font-display text-base text-white leading-snug">{selectedSource.institution_name}</h2>
                </div>
                <button onClick={() => setSelectedSource(null)} className="text-slate-500 hover:text-white p-1">
                  <X size={16} />
                </button>
              </div>

              <div className="p-5 space-y-5">
                {/* Tier badge */}
                <div className="flex items-center gap-2">
                  {(() => {
                    const t = TIER_META[selectedSource.crawl_tier];
                    return (
                      <span className="text-xs px-2.5 py-1 rounded border font-medium"
                        style={{ color: t?.color, backgroundColor: t?.bg, borderColor: t?.border }}>
                        {t?.label}
                      </span>
                    );
                  })()}
                  <span className="text-xs px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300">
                    {selectedSource.crawl_method.replace(/_/g, " ")}
                  </span>
                </div>

                {/* URLs */}
                <div className="space-y-2">
                  <div>
                    <div className="text-xs text-slate-500 mb-1 uppercase tracking-wider">Base URL</div>
                    <a href={selectedSource.base_url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300">
                      <ExternalLink size={11} />
                      {selectedSource.base_url}
                    </a>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1 uppercase tracking-wider">Seed URL</div>
                    <a href={selectedSource.seed_url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 break-all">
                      <ExternalLink size={11} className="flex-shrink-0" />
                      {selectedSource.seed_url}
                    </a>
                  </div>
                </div>

                {/* Capabilities */}
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Capabilities</div>
                  <div className="flex flex-wrap gap-2">
                    <CapabilityPill active={selectedSource.has_rss} label="RSS/Atom Feed" icon={Rss} />
                    <CapabilityPill active={selectedSource.has_sitemap} label="sitemap.xml" icon={Globe2} />
                    <CapabilityPill active={selectedSource.has_search} label="Search API" icon={FileSearch} />
                  </div>
                </div>

                {/* Doc types */}
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Expected Document Types</div>
                  <div className="flex gap-1.5">
                    {selectedSource.expected_doc_types.map((t) => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 uppercase">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Keywords */}
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Keywords</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedSource.keywords.map((k) => (
                      <span key={k} className="text-xs px-2 py-0.5 rounded-full bg-navy-800 text-slate-400 border border-slate-700">
                        {k}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="glass-card rounded-lg p-3 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Language</span>
                    <span className="text-slate-300">{selectedSource.language}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Update frequency</span>
                    <span className="text-slate-300 capitalize">{selectedSource.update_frequency}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Relevance priority</span>
                    <span className="text-slate-300">P{selectedSource.relevance_priority}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Last crawl</span>
                    <span className="text-slate-300">{selectedSource.last_crawl}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Reliability score</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div style={{
                          width: `${Math.round(selectedSource.reliability_score * 100)}%`,
                          backgroundColor: selectedSource.reliability_score >= 0.95 ? "#4ade80" :
                                           selectedSource.reliability_score >= 0.85 ? "#60a5fa" : "#fbbf24"
                        }} className="h-full rounded-full" />
                      </div>
                      <span className="text-slate-300">{Math.round(selectedSource.reliability_score * 100)}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Documents found</span>
                    <span className={selectedSource.docs_found > 0 ? "text-emerald-400" : "text-slate-600"}>
                      {selectedSource.docs_found}
                    </span>
                  </div>
                </div>

                {/* Notes */}
                {selectedSource.notes && (
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Notes</div>
                    <p className="text-xs text-slate-400 leading-relaxed">{selectedSource.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
