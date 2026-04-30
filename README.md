# State of Shutoffs

A public-facing data debrief that presents 2024 EIA Form 112 residential utility shutoff data for a non-technical audience, combined with an interactive state-by-state explorer.

Production: [`https://tsunami-of-shutoffs.org/`](https://https://tsunami-of-shutoffs.org/)

## Goals

- Make energy insecurity and utility shutoff patterns legible to people unfamiliar with utility regulation
- Combine a guided editorial narrative with interactive state-by-state data exploration
- Surface disparities in electric and gas shutoff rates across the US for 2024

## Tech stack

- [Astro](https://astro.build) (v6) — static site framework; island architecture, fully static build
- [React](https://react.dev) (v19) via [`@astrojs/react`](https://docs.astro.build/en/guides/integrations-guide/react/) — interactive islands (national explorer, scroll-progress nav, mobile menu, state-comparison widget)
- [TypeScript](https://www.typescriptlang.org) (v5, strict mode)
- [Tailwind CSS v4](https://tailwindcss.com) via [`@tailwindcss/vite`](https://tailwindcss.com/docs/installation/using-vite) — design tokens defined in `src/styles/global.css` via `@theme`
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/) (v4) — Cloudflare Pages deployment tooling
- [Prettier](https://prettier.io) with `prettier-plugin-astro` and `prettier-plugin-tailwindcss`
- Node **v22** (pinned via `.nvmrc`)
- Fonts: **Fraunces** (serif, headlines) and **Inter** (sans-serif, body) via Google Fonts

**Visualizations are hand-rolled SVG** — there is no D3, Recharts, or Plotly dependency. See `src/components/HexMap.tsx` (hex-tile map), `MonthlyChart.tsx` (12-month line/area chart), and `ShutoffPipeline.tsx` (Sankey-style pipeline).

## Data sources

| Source | Purpose | Location in payload |
|---|---|---|
| **EIA Form 112** — 2024 Residential Utility Disconnections Report (published April 14, 2026) | Primary data on shutoffs, final notices, reconnections, customer counts (electric + gas), reported by state × month | `records[]`, `aggregates.*` |
| **EIA-861** (electric) and **EIA-176** (gas) | Average monthly residential utility bills per state, 2020–2024, and 5-year percent/dollar change | `cost_metrics.*` |
| **ACS 1-Year** (variable `B25001_001E`) | Occupied housing unit counts per state; denominator in the shutoff pipeline visualization | `household_metrics.*` |

The app consumes a single pre-processed JSON file. **Shape is documented in [`shutoffs-json-schema.md`](./shutoffs-json-schema.md)** and typed in `src/data/shutoffs-types.ts`. Builds fetch from S3 via the content collection defined in `src/content.config.ts`:

```
https://eep-state-of-shutoffs-s3.s3.us-east-2.amazonaws.com/2024/shutoffs.json
```

Local development falls back to the checked-in `src/data/shutoffs.json`. The processing pipeline lives in a separate (TBD) repo — this repo does not clean or transform source data.

## Site architecture

The site has three pages, grouped under two entries in the top-right masthead nav (**01 The Story**, **02 Explore the data**). The "Explore the data" entry surfaces two tabs — **National trends** and **State profiles** — via `src/components/ExploreTabNav.astro`.

### `/` — The Story (`src/pages/index.astro`)

A vertical, scroll-snapped narrative for a non-technical reader. Section order:

1. Masthead
2. Introduction (`src/components/Introduction.astro`)
3. Insights 01–10 (rendered from `src/data/insights.ts` via `src/components/Insight.astro`)
4. Conclusion (`src/components/Conclusion.astro`)
5. Resources (`src/components/Resources.astro`)
6. Acknowledgements (`src/components/Acknowledgments.astro`)
7. References and Notes — the endnotes list (`src/components/Endnotes.astro`)

Scroll-progress dots on the right edge (`src/components/ScrollProgress.tsx`, React, `client:load`) track the active section using an `IntersectionObserver`. The scroll container is `<main data-scroll-container>`, not the document root, so hash links (`#insight-3`, `#endnote-5`, `#endnote-ref-5`) are handled by a small script at the bottom of `index.astro` that scrolls the nearest snap-valid `<section>` ancestor into view.

### `/explore/` — Explore the data → National trends

`src/pages/explore/index.astro` renders `src/components/NationalTrendsView.tsx` (React, `client:load`). Interactive national-level view driven by three controls:

- **Metric** — shutoffs, final notices, or reconnections
- **Fuel** — electric, gas, or combined
- **Unit** — rate (share of customers) or raw count

Components on the page:

- `HexMap` — hexagonal tile map of all 51 jurisdictions with a 5-bucket sequential color ramp
- `NationalKpiRow` — headline national statistics (e.g., total shutoffs, total notices)
- `MetricBar` — top 3 and bottom 3 states for the selected metric
- `ScrollableRankList` — full ranked list of states

All aggregates are computed at build time from `src/data/shutoffs.json` through helpers in `src/lib/shutoffs.ts` (see `getAllStateAnnual`, `getNationalMonthly`, `getStateRankings`, etc.).

### `/explore/[code]` — Explore the data → State profiles

`src/pages/explore/[code].astro` is a dynamic route, generated at build time for all 51 state codes (uppercase canonical URL with a lowercase redirect). Each profile shows:

- Totals headline with full-year shutoff count and a **rank card** (the state's position out of 51)
- "1 in N households" subheading comparing the state's rate to the national average
- Optional utility-cost subheading when `cost_metrics` data is available
- `KpiGrid` — four KPIs: electric shutoffs, gas shutoffs, average electric bill, average gas bill
- `MonthlyChart` — 12-month trend with a fuel toggle (electric / gas)
- `ShutoffPipeline` — Sankey-style flow from households → final notices → shutoffs → reconnections → net shutoffs
- `CompareStates` — interactive widget for comparing two states side-by-side

Data-quality flags from EIA (`Q` = revised, `R` = revised/qualitative) are surfaced next to individual numbers where present.

## Editing content

> **Non-technical copy editors:** see [EDITING_GUIDE.md](./EDITING_GUIDE.md) for a step-by-step walkthrough using the GitHub web interface — no code knowledge required.

All narrative content — insights, intro, conclusion, endnotes — lives in `src/data/` and `src/components/`. No build step is required to see changes; just save and reload the dev server.

### Adding, removing, or renumbering an insight

Insights are driven by the array exported from `src/data/insights.ts`. Each entry matches this interface:

```ts
export interface Insight {
  number: number;              // sequential, 1..N
  headline: string;            // bold section headline
  stat: string;                // "Stat:" paragraph — supports inline citations
  frame: string;               // "Why this matters:" paragraph — supports inline citations
  headlineHighlights: string[]; // phrases in `headline` to wrap in a yellow highlight
  statHighlights: string[];     // phrases in `stat` to wrap in a yellow highlight
}
```

A full example (Insight 2):

```ts
{
  number: 2,
  headline: "The scale is worse than we thought",
  stat: "In 2024, utilities in the United States executed 15.1 million shutoffs — about 13.4 million electric (89%) and 1.5 million gas (11%). That is one shutoff every 2.1 seconds, every day, all year. Overall 2 million households were never reconnected.",
  frame: `For years the actual number of shutoffs was a mystery. Many cited 3 million shutoffs reported annually[^carley-konisky-2024], ...`,
  headlineHighlights: ["worse than we thought"],
  statHighlights: ["executed 15.1 million shutoffs"],
},
```

**To add an insight:**

1. Append a new entry to the `insights` array in `src/data/insights.ts` with the next `number`.
2. In `src/pages/index.astro`, update the total in **two places** (both currently hard-coded to `10`):
   - Line ~21: ``label: `Insight ${ins.number} of 10: ${ins.headline}`,`` → change `10` to the new total
   - Line ~43–44: `label={`Insight ${insight.number} of 10`}` and `total={10}` → change both to the new total
3. If the new insight cites sources, add them to `src/data/endnotes.ts` (see below).

**To remove an insight:** delete the entry, decrement the `number` on every insight after it so numbering stays sequential, and update the two totals in `index.astro` as above.

**No other changes are needed** — the scroll-progress navigation dots, the "Insight 03 of N" counter, and the section anchor IDs (`#insight-N`) are all driven off the array.

### Adding, updating, or removing an endnote

Endnotes use a **registry pattern**: citations are collected in reading order as the page renders, assigned sequential numbers automatically, and rendered in a single `<ol>` at the bottom under "References and Notes." The same key referenced multiple times shares one endnote entry.

**1. Define the citation.** Add an entry to the `endnotes` record in `src/data/endnotes.ts`. Keys are kebab-case; values are the full citation (plain text or HTML):

```ts
"eia-112-2024":
  'Energy Information Administration, April 14, 2026. 2024 Residential Utility Disconnections Report. ... Available at: https://www.eia.gov/analysis/requests/residential/utility/',
```

**2a. Cite it inline from an insight or other string-based content** — inside `stat`, `frame`, or `headline` in `src/data/insights.ts`, use the Markdown-style syntax `[^key]` (no space before the bracket):

```ts
stat: "The EIA 112 report is the first comprehensive national survey of shutoffs capturing shutoff data for 95% of Americans[^eia-112-2024]. Before this report, ..."
```

The `[^key]` marker is parsed by `src/lib/endnotes.ts`, registered with the page-level registry, and rendered as `<sup class="endnote-ref"><a href="#endnote-N">N</a></sup>`.

**2b. Cite it from an Astro prose component** (e.g., `Introduction.astro`, `Conclusion.astro`) — use the `<Note>` component, which takes the same endnote key and the shared `registry` prop:

```astro
---
import Note from '../components/Note.astro';
import type { EndnoteRegistry } from '../lib/endnotes';

interface Props { registry: EndnoteRegistry }
const { registry } = Astro.props;
---

<p>
  ...feeling their home descend into a barely habitable shell<Note id="umich-roadmap-ending-shutoffs-2026" registry={registry} />.
</p>
```

Use `<Note>` for any content where you're writing HTML directly; use `[^key]` for content that lives as a string in `insights.ts`. Both resolve against the same `endnotes.ts` keys and share the same numbering.

**Numbering is automatic.** The first citation encountered during page render becomes `1`, the next new key becomes `2`, and so on. If you reorder insights or add a citation earlier in the page, all downstream numbers shift — you do not have to update anything by hand.

**Removing an endnote:** delete the entry from `src/data/endnotes.ts` **and** remove every `[^key]` and `<Note id="key">` reference to it. An unresolved key throws at build time:

```
Error: Endnote key "some-key" not found in src/data/endnotes.ts
```

## Project layout

```
src/
├── pages/
│   ├── index.astro              # "The Story" — narrative with insights + endnotes
│   └── explore/
│       ├── index.astro          # "National trends" tab
│       └── [code].astro         # "State profiles" tab (dynamic, one per state)
├── components/                  # Astro + React components
│   ├── Masthead.astro           # Top-of-page site nav
│   ├── ExploreTabNav.astro      # National trends / State profiles tab switcher
│   ├── Insight.astro            # Renders one insight + its inline citations
│   ├── Introduction.astro       # Editorial intro (uses <Note> for citations)
│   ├── Conclusion.astro         # Editorial conclusion (uses <Note>)
│   ├── Endnotes.astro           # Renders the bottom-of-page references list
│   ├── Note.astro               # Inline citation component for prose
│   ├── ScrollProgress.tsx       # Right-side scroll-progress dots (React)
│   ├── NationalTrendsView.tsx   # National explorer shell (React)
│   ├── HexMap.tsx               # State hex-tile map (SVG)
│   ├── MonthlyChart.tsx         # 12-month fuel trend chart (SVG)
│   ├── ShutoffPipeline.tsx      # Sankey-style pipeline (SVG)
│   ├── CompareStates.tsx        # State-vs-state comparison widget
│   └── ...
├── data/
│   ├── insights.ts              # 10 narrative insights (edit here to change the story)
│   ├── endnotes.ts              # All citation text keyed by kebab-case ID
│   ├── shutoffs.json            # Local-dev fallback data payload
│   └── shutoffs-types.ts        # TypeScript types for the payload
├── lib/
│   ├── shutoffs.ts              # Data access + aggregations over the payload
│   ├── endnotes.ts              # Registry + [^key] parser used by Insight.astro
│   ├── national-constants.ts    # Labels, breakpoints, palette for the explorer
│   ├── shutoffs-constants.ts    # State codes, names, data-quality flag definitions
│   ├── format.ts                # Number/percent/currency formatters
│   └── pipeline.ts              # Pipeline-stage math for ShutoffPipeline.tsx
├── layouts/
│   └── BaseLayout.astro         # Page shell: fonts, meta tags, global CSS
└── styles/
    └── global.css               # Tailwind v4 @theme tokens + global styles
```

## Local development

```bash
npm install
npm run dev
```

The dev server starts at `http://localhost:4321`. The `dev` script sets `NODE_OPTIONS='--max-old-space-size=8192'` because the build graph (51 state pages × a large data payload) exceeds Node's default heap on some machines.

## Build

```bash
npm run build      # outputs to dist/
npm run preview    # serve the built site locally
```

This is a fully static site — no server runtime required.

## Deployment

The app deploys automatically to **Cloudflare Pages** (`eep-state-of-shutoffs.pages.dev`) on every push to `main`.

- Build command: `npm run build`
- Output directory: `dist`
- Node version: 22 (set via `.nvmrc`)
- Cloudflare config: `wrangler.jsonc`
