# bnzo-platform

Five sites, one Next.js codebase. Subdomains are routed to internal paths by middleware so the entire surface ships from a single Vercel project.

> **Status:** Active work in progress. Migrating from individual repos and progressively rolling each surface out to production.

## What's in here

Each surface lives under `app/` and is exposed at its own subdomain. Middleware rewrites the request based on the `Host` header.

| Subdomain | Internal path | Surface | Status |
|---|---|---|---|
| `bnzo.io` | `/` | Studio landing | In development |
| `lab.bnzo.io` | `/lab` | Projects, case studies, experiments | In development |
| `build.bnzo.io` | `/build` | Marketplace (starter kits, dev resources) | In development |
| `learn.bnzo.io` | `/learn` | Tutorials, guides, learning notes | In development |
| `erick.bnzo.io` | `/founder` | Personal portfolio | In development |

Content lives in `content/` as MDX (projects, work, guides, resources). Shared brand components live in `components/brand/`, with per-surface UI under `components/{home,lab,build,learn,founder}/`.

## Stack

- **Framework:** Next.js 14 (App Router) + TypeScript strict
- **Routing:** Custom `middleware.ts` — host-based rewrites to internal path prefixes
- **Styling:** Tailwind CSS + design tokens in `app/globals.css`
- **Fonts:** Syne, DM Sans, Geist Mono (via `next/font/google`)
- **Content:** MDX with `gray-matter` frontmatter
- **Auth + DB:** Supabase (cookie domain `.bnzo.io` so sessions span subdomains)
- **Payments:** Stripe (single account, signed webhooks)
- **Email:** Resend (`hello@bnzo.io`)
- **Motion:** GSAP
- **Testing:** Playwright (E2E)
- **Analytics:** Vercel Analytics
- **Hosting:** Vercel — one project, six domains

## Why one repo, not a monorepo

Each surface could be its own app. They aren't, because:

- **Shared brand layer** — `Wordmark`, `Footer`, type scale, color tokens evolve in one place.
- **Shared infrastructure** — one Supabase client, one Stripe instance, one Resend wrapper, one `middleware.ts` instead of five.
- **Atomic deploys** — cross-surface changes ship in a single PR. No coordinated multi-repo rollouts.
- **Single Vercel project** — six domains point at one deployment. No per-app billing, env, or build config to maintain.

The trade-off: every surface shares a build. That's acceptable while the surfaces are small and tightly related.

## How routing works

`middleware.ts` maps each subdomain to a path prefix and rewrites (not redirects) — the URL stays on the subdomain, but the request is served from `/build/*`, `/lab/*`, etc. The apex (`bnzo.io`) and `localhost` pass through to `/`. See [docs/CONTRACT.md](docs/CONTRACT.md) for the full contract.

## Local development

```bash
npm install
npm run dev
```

Then either:

- Visit `http://localhost:3000/?host=build.bnzo.io` to simulate a subdomain via query param, or
- Add subdomain entries to `/etc/hosts` pointing at `127.0.0.1` and use `http://build.bnzo.io:3000`.

### Scripts

```bash
npm run dev          # next dev
npm run build        # next build
npm run start        # next start
npm run lint         # next lint
npm run type-check   # tsc --noEmit
npm run test:e2e     # playwright test
```

### Environment

Required env vars are documented in [CLAUDE.md](CLAUDE.md). Copy from `.env.example` (Supabase, Stripe, Resend, site URL).

## Project layout

```
bnzo-platform/
├── middleware.ts          # subdomain → path rewrites
├── app/
│   ├── layout.tsx         # root: fonts, analytics, base metadata
│   ├── page.tsx           # bnzo.io home
│   ├── lab/               # lab.bnzo.io
│   ├── build/             # build.bnzo.io
│   ├── learn/             # learn.bnzo.io
│   ├── founder/           # erick.bnzo.io
│   ├── admin/             # apex-only admin surface
│   └── api/               # checkout, subscribe, stripe webhook
├── components/
│   ├── brand/             # Wordmark, Footer (cross-surface)
│   ├── home/ lab/ build/ learn/ founder/
│   └── seo/
├── content/
│   ├── projects/ work/ guides/ resources/   # MDX
├── lib/                   # supabase, stripe, resend, fonts, projects, work
├── docs/
│   ├── ARCHITECTURE.md
│   └── CONTRACT.md        # shared interfaces, API shapes, DB schema
├── tests/e2e/             # Playwright specs
└── public/
```

## Conventions

- Server components by default; `'use client'` only when needed.
- API routes validate input with Zod.
- No secrets in client components.
- Absolute imports via `@/*`.
- Small files (<400 lines); extract utilities.
- TypeScript strict — no `any`.

---

Maintained by [@benerick](https://github.com/benerick).
