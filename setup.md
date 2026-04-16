# Task: Initialize `eep-state-of-shutoffs` repository

Create a barebones but production-ready Astro + React + TypeScript + Tailwind CSS project in a new local directory called `eep-state-of-shutoffs`. Do not push to GitHub or create the remote repo — I'll handle that step myself after reviewing your work. Just initialize locally with a clean git history.

## Project context

This repository will contain a public-facing web app that presents a debrief of the EIA-112 utility shutoff data (electric and gas disconnections across US states for 2024). The audience is the non-technical general public. The goal is to make energy insecurity, affordability, and shutoffs legible to people who don't already think about utility regulation. The piece combines a guided narrative with interactive data exploration — users should be able to understand the story, then explore states of interest on their own.

The project will eventually live under the `Energy-Equity-Project` GitHub organization and deploy automatically to Cloudflare Pages at `eep-state-of-shutoffs.pages.dev` on every push to `main`.

**Scope boundary:** This repo contains only the web application. Data processing, S3 integration, and transformation from the raw EIA-112 source into the app's consumable JSON happen in a separate repository (to be created later). This repo consumes a pre-processed JSON file as a static asset. For now, include a placeholder JSON with the correct shape so the app can develop against realistic data.

## Technical requirements

- **Framework:** Astro (latest stable), configured for static output (`output: 'static'`)
- **Interactivity:** React islands via `@astrojs/react`
- **Language:** TypeScript with strict mode enabled
- **Styling:** Tailwind CSS via the official Astro integration
- **Package manager:** npm
- **Node version:** Pin via `.nvmrc` to the current LTS
- **Deployment target:** Cloudflare Pages (static). No Cloudflare-specific adapter needed since output is static, but ensure build output goes to `dist/`.

## Deliverables

1. **Initialized Astro project** with the integrations above configured and working. Verify the default `npm run dev` and `npm run build` both succeed before finishing.

2. **Directory structure** that anticipates the project's shape:

src/
components/       # React islands go here
layouts/          # Astro layout components
pages/            # Astro pages (index.astro at minimum)
data/             # Placeholder JSON lives here
styles/           # Global CSS if needed beyond Tailwind
public/             # Static assets

3. **Placeholder data file** at `src/data/shutoffs.json` with 2-3 sample state records matching this shape (one record per state-month):
```json
   {
     "state": "Alabama",
     "year": 2024,
     "month": 1,
     "electric_shutoff_notices": 145028,
     "electric_shutoffs": 26000,
     "electric_customers": 2384730,
     "electric_monthly_shutoff_rate": 0.0109,
     "gas_shutoff_notices": 70940,
     "gas_shutoffs": 6775,
     "gas_customers": 807384,
     "gas_monthly_shutoff_rate": 0.0084
   }
```
   Also create a TypeScript type definition for this shape in `src/data/types.ts`.

4. **Minimal landing page** (`src/pages/index.astro`) with a placeholder title, a one-paragraph description of the project, and one trivial React island component (e.g., a button that increments a counter) to confirm the React integration works. No real content or visualizations yet — those come later.

5. **`README.md`** containing:
   - Project title and one-sentence description
   - Statement of goals: debrief EIA-112 shutoff data for a non-technical audience; combine guided narrative with interactive exploration; surface energy insecurity patterns across US states
   - Note that data processing lives in a separate repository (name TBD) and this repo consumes a pre-processed JSON
   - Local development instructions (`npm install`, `npm run dev`)
   - Build and deployment notes (Cloudflare Pages, auto-deploys from `main`)
   - Tech stack summary (Astro, React islands, TypeScript, Tailwind)
   - A "status" note indicating this is an early scaffold

6. **`.gitignore`** appropriate for a Node/Astro project (node_modules, dist, .env, .DS_Store, editor folders, etc.)

7. **`.editorconfig`** with sensible defaults (UTF-8, LF line endings, 2-space indent, trim trailing whitespace)

8. **Prettier config** (`.prettierrc`) with minimal opinions — 2-space indent, single quotes for JS/TS, no semicolons or with semicolons (your call, pick one and be consistent), 100-char print width

9. **One initial git commit** on `main` with message `Initial scaffold: Astro + React + TypeScript + Tailwind`. Do not make multiple commits — one clean initial commit is easier to review.

## What to skip

- Don't set up testing frameworks yet (Vitest, Playwright, etc.). Premature.
- Don't add charting libraries (Observable Plot, D3) yet. Those come when we build the first visualization.
- Don't add animation libraries (Motion, GSAP). Same reasoning.
- Don't add state management (Nanostores). Add when needed.
- Don't create any CI/CD workflows — Cloudflare Pages handles deployment directly from GitHub, no GitHub Actions needed for deploys.
- Don't add a custom domain config. We're using the default `.pages.dev` subdomain.

## When you're done

Report back with:
- Confirmation that `npm run build` succeeds
- The directory tree of what you created
- Any decisions you made that weren't specified above (e.g., which Prettier options you picked, exact Astro/React versions)
- Anything you noticed that I should think about before pushing this to GitHub