# State of Shutoffs

A public-facing data debrief presenting EIA-112 utility shutoff data for a non-technical general audience.

## Goals

- Make energy insecurity and utility shutoff patterns legible to people unfamiliar with utility regulation
- Combine guided narrative with interactive state-by-state data exploration
- Surface disparities in electric and gas shutoff rates across the US for 2024

## Data

Data processing lives in a separate repository (name TBD). This app consumes a pre-processed JSON file at `src/data/shutoffs.json`. The placeholder data file uses the correct shape but contains sample values — it will be replaced by the pipeline repo's output.

## Local development

```bash
npm install
npm run dev
```

The dev server starts at `http://localhost:4321`.

## Build

```bash
npm run build
```

Output goes to `dist/`. This is a fully static site — no server runtime required.

## Deployment

The app deploys automatically to Cloudflare Pages (`eep-state-of-shutoffs.pages.dev`) on every push to `main`. Build command: `npm run build`. Output directory: `dist`. Node version: 22 (set via `.nvmrc`).

## Tech stack

- [Astro](https://astro.build) — static site framework with island architecture
- [React](https://react.dev) — interactive islands via `@astrojs/react`
- [TypeScript](https://www.typescriptlang.org) — strict mode throughout
- [Tailwind CSS v4](https://tailwindcss.com) — utility-first styling via `@tailwindcss/vite`
- [Prettier](https://prettier.io) — code formatting with `prettier-plugin-astro` and `prettier-plugin-tailwindcss`

## Status

Early scaffold — no real content or visualizations yet. The landing page confirms the framework integrations work (React hydration, Tailwind classes). Visualization components and real data coming in subsequent iterations.
