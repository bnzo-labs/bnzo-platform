# bnzo-platform — CLAUDE.md

Multi-domain Next.js 14 monorepo. Five domains, one codebase, one Vercel project.

## Mission
Serve 5 properties from single codebase via middleware routing:
- `bnzo.io` → `/` (studio)
- `build.bnzo.io` → `/build` (marketplace)
- `lab.bnzo.io` → `/lab` (case studies)
- `learn.bnzo.io` → `/learn` (education)
- `erick.bnzo.io` → `/founder` (portfolio)

## Stack
- Next.js 14 App Router + TypeScript strict
- Tailwind CSS + shadcn/ui
- Fonts: Syne, DM Sans, Geist Mono (next/font/google)
- Supabase (auth + DB, cookie domain `.bnzo.io`)
- Stripe (single account, webhook signature verification)
- Resend (email, from `hello@bnzo.io`)
- MDX content in `/content/`
- Vercel Analytics
- Hosting: Vercel (6 domains → 1 project)

## Working Directory
`/Users/erick/work/bnzo-platform`

## Folder Structure (Target)
```
bnzo-platform/
├── middleware.ts                    # host → path rewrite
├── next.config.js
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── .env.example
├── app/
│   ├── layout.tsx                   # root (shared fonts, analytics, metadata)
│   ├── globals.css
│   ├── page.tsx                     # bnzo.io home
│   ├── build/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── lab/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── learn/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── founder/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── api/
│       ├── checkout/route.ts
│       ├── subscribe/route.ts
│       └── webhooks/stripe/route.ts
├── components/
│   ├── brand/
│   │   ├── Wordmark.tsx
│   │   └── Footer.tsx
│   ├── home/
│   ├── build/
│   ├── lab/
│   ├── learn/
│   ├── founder/
│   └── ui/                          # shadcn primitives
├── lib/
│   ├── supabase.ts
│   ├── stripe.ts
│   ├── resend.ts
│   ├── fonts.ts
│   ├── resources.ts
│   └── projects.ts
├── content/
│   ├── resources/*.mdx
│   └── projects/*.mdx
├── docs/
│   ├── ARCHITECTURE.md
│   ├── CONTRACT.md
│   └── VISUAL_BRIEF.md              # designer output
└── tests/
    └── e2e/*.spec.ts
```

## Routing — Middleware Contract
File: `middleware.ts`. Matches all paths except `/api`, `/_next/static`, `/_next/image`, `/favicon.ico`, static assets.

Host header mapping:
| Host | Rewrite |
|------|---------|
| `bnzo.io`, `www.bnzo.io`, `localhost:3000` | pass-through to `/` |
| `build.bnzo.io` | prefix with `/build` |
| `lab.bnzo.io` | prefix with `/lab` |
| `learn.bnzo.io` | prefix with `/learn` |
| `erick.bnzo.io` | prefix with `/founder` |

Rewrite (not redirect). URL stays on subdomain. Request served by `/build/*`, `/lab/*`, etc.

Local dev: use `?host=build.bnzo.io` query param or `/etc/hosts` entries.

## Shared Libraries — Interfaces

### `lib/supabase.ts`
```ts
export const supabaseServer: () => SupabaseClient       // RSC/route handlers (service role)
export const supabaseBrowser: () => SupabaseClient      // client components (anon key)
```
Cookie domain MUST be `.bnzo.io` in production.

### `lib/stripe.ts`
```ts
export const stripe: Stripe                             // server-only singleton
export const getPriceId: (product: 'starter-kit') => string
```
Keys from env. Never import in client components.

### `lib/resend.ts`
```ts
export const resend: Resend
export const sendWelcomeEmail: (email: string, source: 'bnzo' | 'learn') => Promise<void>
```

### `lib/fonts.ts`
```ts
export const syne: NextFont         // --font-syne, weight [400,500,600,700,800]
export const dmSans: NextFont       // --font-dm-sans, weight [400,500,700]
export const geistMono: NextFont    // --font-geist-mono, weight [400,500]
```
Used in `app/layout.tsx` to set `html` className.

### `lib/resources.ts` & `lib/projects.ts`
Read MDX from `/content/`. Return typed objects. See CONTRACT.md for schemas.

## API Contracts

### POST `/api/checkout`
Request: `{ priceId: string, successUrl: string, cancelUrl: string }`
Response: `{ url: string }` (Stripe Checkout session URL)
Errors: `400` invalid input, `500` Stripe failure.

### POST `/api/webhooks/stripe`
Raw body. Verify signature via `STRIPE_WEBHOOK_SECRET`.
Events handled: `checkout.session.completed` → insert `purchases` row.
Response: `{ received: true }` or `400` on signature failure.

### POST `/api/subscribe`
Request: `{ email: string, source: 'bnzo' | 'learn' }`
Response: `{ ok: true }` or `400`/`500`.
Side effects: insert into `subscribers` table, send Resend welcome email.

## Database Schema (Supabase)

### `purchases`
| column | type | notes |
|--------|------|-------|
| id | uuid (pk) | default gen_random_uuid() |
| user_id | uuid | nullable (guest checkout allowed) |
| email | text | not null |
| product_id | text | not null (e.g. 'starter-kit') |
| stripe_session_id | text | unique, not null |
| amount_cents | int | not null |
| created_at | timestamptz | default now() |

### `subscribers`
| column | type | notes |
|--------|------|-------|
| id | uuid (pk) | default gen_random_uuid() |
| email | text | unique, not null |
| source | text | 'bnzo' \| 'learn' |
| created_at | timestamptz | default now() |

RLS: disabled for MVP (service-role only writes). Enable before user auth lands.

## Environment Variables

See `.env.example`. Required for launch:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_STARTER_KIT`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL` (default `hello@bnzo.io`)
- `NEXT_PUBLIC_SITE_URL` (e.g. `https://bnzo.io`)

## Shared Components

### `components/brand/Wordmark.tsx`
Props: `{ variant?: 'full' | 'mark', className?: string }`
- `full` → `bnzo.` (Syne, lime period)
- `mark` → `b/` (Geist Mono)

### `components/brand/Footer.tsx`
Props: `{ domain: 'home' | 'build' | 'lab' | 'learn' | 'founder' }`
Renders cross-domain nav + legal. Links to all 5 subdomains via absolute URLs derived from `NEXT_PUBLIC_SITE_URL`.

## Brand Tokens

Defined in `app/globals.css` as CSS custom properties:
- `--color-ink` `#0C0C0C`
- `--color-chalk` `#F5F4EF`
- `--color-lime` `#C8FF00`
- `--color-slate` `#6B6868`

Extended in `tailwind.config.ts` as `colors.ink`, `colors.chalk`, `colors.lime`, `colors.slate`.

## Layout Rules

Root `app/layout.tsx`:
- Apply font CSS variables to `<html>`
- Include Vercel Analytics
- Set default metadata (overridden per domain)

Per-domain layouts (`app/build/layout.tsx`, etc.):
- Own `<nav>` scoped to that domain
- Import `Wordmark` and `Footer` from `/components/brand/`
- Set domain-specific metadata (title template, OG)

## Conventions

- TypeScript strict. No `any`.
- Server components by default. `'use client'` only when needed.
- API routes always validate input (zod).
- No secrets in client components.
- Absolute imports via `@/*` (tsconfig paths).
- Tailwind for styling. CSS modules only for complex animations.
- Small files (<400 lines). Extract utils.

## Communication
Caveman. English only. No filler.

## Downstream Handoff
- Wave 2 reads `docs/CONTRACT.md` for exact shapes
- Wave 3 reads `docs/VISUAL_BRIEF.md` + this file
- All agents read this CLAUDE.md first
