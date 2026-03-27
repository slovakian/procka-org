# Agent notes

Personal site. The repo is set up so tools and agents can navigate and change it without extra ceremony.

## Stack

- **Astro** 5 (SSR, `output: "server"`) with **React** islands and **Tailwind CSS** 4
- **Cloudflare** via **Alchemy** (`alchemy.run.ts`, `bun run dev` / `bun run deploy`)
- **Biome** for lint/format; **TypeScript** strict checks via `astro check`

## Useful paths

- Pages: `src/pages/`
- Components: `src/components/`
- Styles: `src/styles/`
- Env (typed): `src/env/`
- Infra: `alchemy.run.ts`

More detail can be added here over time.
