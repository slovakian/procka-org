# Agent notes

Personal site. The repo is set up so tools and agents can navigate and change it without extra ceremony.

## Stack

- **Astro** 5, **`output: "static"`** (hybrid): pages prerender at build time by default; the Cloudflare Worker still serves **on-demand** routes (e.g. Keystatic, APIs). Add `export const prerender = false` on any page or endpoint that must run per request.
- **React** islands hydrate on prerendered HTML; they do not require SSR for the whole page.
- **Tailwind CSS** 4
- **Cloudflare** via **Alchemy** (`alchemy.run.ts`, `bun run dev` / `bun run deploy`). **`alchemy.run.ts` sets `entrypoint: "dist/_worker.js/index.js"`** so hybrid deploys use Astro’s real Worker (not Alchemy’s stub) for those dynamic routes.
- **Biome** for lint/format; **TypeScript** strict checks via `astro check`

## Useful paths

- Pages: `src/pages/`
- Components: `src/components/`
- Styles: `src/styles/`
- Env (typed): `src/env/`
- Infra: `alchemy.run.ts`

More detail can be added here over time.
