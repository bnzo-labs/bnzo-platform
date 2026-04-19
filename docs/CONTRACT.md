# CONTRACT — bnzo-platform

Interfaces between modules. Treat as source of truth. Downstream agents MUST match these signatures exactly.

---

## 1. Middleware ↔ Domain Layouts

### `middleware.ts` guarantees
Request served at `app/{prefix}/**` where `prefix` derives from host:

| Host | Served from |
|------|-------------|
| `bnzo.io` / `www.bnzo.io` / `localhost` (no query) | `app/page.tsx` + `app/**` (non-domain) |
| `build.bnzo.io` | `app/build/**` |
| `lab.bnzo.io` | `app/lab/**` |
| `learn.bnzo.io` | `app/learn/**` |
| `erick.bnzo.io` | `app/founder/**` |

### Domain layouts must
- Live at `app/{prefix}/layout.tsx`
- Export `metadata: Metadata` with domain-specific title template
- Import `Wordmark` and `Footer` from `@/components/brand`
- Render their own `<nav>` (do not reuse others)

---

## 2. Shared Libraries

### `@/lib/supabase`
```ts
import type { SupabaseClient } from '@supabase/supabase-js'

export function supabaseServer(): SupabaseClient       // service role, server-only
export function supabaseBrowser(): SupabaseClient      // anon key, client-safe
```
Cookie domain: `.bnzo.io` in prod, `undefined` in preview/local.

### `@/lib/stripe`
```ts
import type Stripe from 'stripe'

export const stripe: Stripe

export type ProductKey = 'starter-kit'
export function getPriceId(product: ProductKey): string
```

### `@/lib/resend`
```ts
import { Resend } from 'resend'

export const resend: Resend

export type EmailSource = 'bnzo' | 'learn'
export function sendWelcomeEmail(email: string, source: EmailSource): Promise<void>
```

### `@/lib/fonts`
```ts
import type { NextFontWithVariable } from 'next/dist/compiled/@next/font'

export const syne: NextFontWithVariable        // --font-syne
export const dmSans: NextFontWithVariable      // --font-dm-sans
export const geistMono: NextFontWithVariable   // --font-geist-mono

export const fontVariables: string             // joined className for <html>
```

### `@/lib/resources`
```ts
export type Resource = {
  slug: string
  title: string
  description: string
  price: number            // cents, 0 = free
  priceId?: string         // Stripe price id env key (only for paid)
  tier: 'free' | 'paid'
  tags: string[]
  downloadUrl?: string
  content: string          // compiled MDX html OR raw source (developer-build chooses)
}

export function getAllResources(): Promise<Resource[]>
export function getResourceBySlug(slug: string): Promise<Resource | null>
```

### `@/lib/projects`
```ts
export type Project = {
  slug: string
  title: string
  summary: string
  client: string
  year: number
  tags: string[]
  heroImage: string
  content: string
}

export function getAllProjects(): Promise<Project[]>
export function getProjectBySlug(slug: string): Promise<Project | null>
```

---

## 3. API Routes

### `POST /api/checkout`

**Request**
```ts
{
  priceId: string,
  successUrl: string,
  cancelUrl: string,
  email?: string
}
```

**Response 200**
```ts
{ url: string }   // Stripe Checkout session URL
```

**Response 400** — invalid input
```ts
{ error: string }
```

**Response 500** — Stripe failure
```ts
{ error: string }
```

### `POST /api/webhooks/stripe`

**Request:** raw body, header `stripe-signature` required.
**Processed events:** `checkout.session.completed`
**Side effect:** insert row into `purchases` (idempotent on `stripe_session_id`).

**Response 200** `{ received: true }`
**Response 400** signature invalid / body malformed.

### `POST /api/subscribe`

**Request**
```ts
{
  email: string,                     // validated: email format
  source: 'bnzo' | 'learn'
}
```

**Response 200** `{ ok: true }`
**Response 400** invalid email.
**Response 500** provider failure. Subscriber row still written; email retried later.

---

## 4. Shared Components

### `@/components/brand/Wordmark`
```tsx
type WordmarkProps = {
  variant?: 'full' | 'mark'   // default 'full'
  className?: string
  as?: 'span' | 'h1' | 'div'  // default 'span'
}

export function Wordmark(props: WordmarkProps): JSX.Element
```
- `full` → text `bnzo.` (period uses `text-lime`)
- `mark` → text `b/` in Geist Mono

### `@/components/brand/Footer`
```tsx
type FooterDomain = 'home' | 'build' | 'lab' | 'learn' | 'founder'

type FooterProps = {
  domain: FooterDomain
}

export function Footer(props: FooterProps): JSX.Element
```
Renders:
- Wordmark (full)
- Cross-domain links (absolute URLs to 5 subdomains)
- Legal (`/privacy`, `/terms` — resolve to `bnzo.io/privacy` etc.)
- Tagline: `We build with agents. We teach how.`

---

## 5. MDX Frontmatter Schemas

### `content/resources/*.mdx`
```yaml
---
slug: starter-kit                 # matches filename
title: bnzo Starter Kit
description: Multi-domain Next.js template
price: 9700                       # cents
priceId: STRIPE_PRICE_STARTER_KIT # env var name
tier: paid
tags: [nextjs, template, monorepo]
downloadUrl: null                 # filled post-purchase flow
---
```

### `content/projects/*.mdx`
```yaml
---
slug: cook-for-friends
title: Cook for Friends
summary: Social meal planning app
client: Bnzo Studio
year: 2026
tags: [mobile, supabase, realtime]
heroImage: /images/projects/cook-for-friends.jpg
---
```

---

## 6. Design Tokens (designer output → all developers)

All consumers read from `tailwind.config.ts` `theme.extend.colors`:
- `ink` → #0C0C0C
- `chalk` → #F5F4EF
- `lime` → #C8FF00
- `slate` → #6B6868

CSS custom properties mirror these in `app/globals.css` for non-Tailwind contexts.

Fonts consumed via className:
- `font-sans` → DM Sans
- `font-display` → Syne
- `font-mono` → Geist Mono

(Mapping configured in `tailwind.config.ts` `fontFamily`.)

---

## 7. Environment Variables

| Variable | Consumer | Required |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | lib/supabase | yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | lib/supabase | yes |
| `SUPABASE_SERVICE_ROLE_KEY` | lib/supabase (server) | yes |
| `STRIPE_SECRET_KEY` | lib/stripe | yes |
| `STRIPE_WEBHOOK_SECRET` | api/webhooks/stripe | yes |
| `STRIPE_PRICE_STARTER_KIT` | lib/stripe | yes |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | client checkout | yes |
| `RESEND_API_KEY` | lib/resend | yes |
| `RESEND_FROM_EMAIL` | lib/resend | yes |
| `NEXT_PUBLIC_SITE_URL` | footer, OG, sitemaps | yes |

---

## 8. Error Handling Pattern

All API routes:
```ts
try {
  const body = Schema.parse(await req.json())
  // ... work
  return NextResponse.json({ ok: true })
} catch (e) {
  if (e instanceof ZodError) return NextResponse.json({ error: 'invalid' }, { status: 400 })
  console.error('[route-name]', e)
  return NextResponse.json({ error: 'internal' }, { status: 500 })
}
```

Never expose raw error messages to client.
