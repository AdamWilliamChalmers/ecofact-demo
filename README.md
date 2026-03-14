# Ecofact Regulatory Intelligence — Demo

> Semi-autonomous pipeline that monitors official regulatory sources globally for
> sustainability and ESG policy developments, classifies relevance with AI, and
> surfaces results in a searchable dashboard.

## Demo architecture

```
sources_registry.csv
        │
        ▼
   pipeline.py          ← Python pipeline (crawl → classify → extract)
        │
        ▼
  documents.csv         ← Structured document records (pre-seeded for demo)
        │
        ▼
ecofact-dashboard/      ← Next.js dashboard
```

---

## Quick start (demo mode — no API keys needed)

The `documents.csv` is already pre-seeded with 18 realistic regulatory
documents across UK, Germany, and Brazil. The dashboard reads this data directly.

### 1. Run the dashboard

```bash
cd ecofact-dashboard
npm install
npm run dev
```

Open http://localhost:3000

That's it. The full dashboard works with zero configuration.

---

## Pipeline setup (live mode)

The live pipeline crawls official government sources and uses OpenAI to
classify and extract structured metadata.

### Prerequisites

```bash
pip install requests beautifulsoup4 openai feedparser
```

### Environment variables

```bash
export OPENAI_API_KEY=sk-...
```

### Run the pipeline

```bash
# Full live run (all countries)
python pipeline.py

# Single country
python pipeline.py --country UK
python pipeline.py --country Germany
python pipeline.py --country Brazil

# Crawl only — discover links without classification
python pipeline.py --dry-run

# Demo mode — no HTTP calls, uses existing documents.csv
python pipeline.py --demo
```

### Pipeline output

The pipeline appends new documents to `documents.csv`. Re-run the
dashboard to pick up new documents (hot-reload in dev mode).

---

## File reference

| File | Description |
|------|-------------|
| `sources_registry.csv` | Source registry: 14 official sources across UK, Germany, Brazil |
| `pipeline.py` | Full pipeline: discovery → acquisition → classification → extraction |
| `documents.csv` | Pre-seeded regulatory documents (18 instruments for demo) |
| `ecofact-dashboard/` | Next.js dashboard application |

---

## Dashboard features

- **Full-text search** across titles, summaries, institutions, tags
- **Filter by**: country, relevance class, legal status, document type, mandatory/voluntary, thematic area
- **Document detail panel**: full metadata, confidence score, source link
- **KPI cards**: total documents, high relevance, in force, pending QA review
- **Status badges**: in force, under consultation, proposed, adopted, amended

---

## Extending the demo

### Add more sources

Edit `sources_registry.csv` — add rows following the existing schema.

### Add more documents

Either run `python pipeline.py --country <country>` to crawl live,
or add rows directly to `documents.csv` following the existing schema.

### Add more countries

1. Add sources to `sources_registry.csv`
2. Add country metadata to `ecofact-dashboard/lib/data.ts` in `COUNTRY_META`
3. Add documents to `documents.csv` or run the pipeline

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Crawling | Python + requests + BeautifulSoup |
| Classification | OpenAI GPT-4o-mini (binary relevance) |
| Extraction | OpenAI GPT-4o (structured metadata) |
| Dashboard | Next.js 14 + Tailwind CSS |
| Data | CSV files (demo) → PostgreSQL + pgvector (production) |

---

## Production roadmap

See `Ecofact_Regulatory_Intelligence_Pipeline_TechSpec.docx` for the
full architecture covering:

- Dagster orchestration
- PostgreSQL + pgvector (Supabase)
- Playwright for JS-heavy sources
- Embedding-based deduplication
- Human QA review queue
- Alert subscriptions
- Full multi-jurisdiction expansion
