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
  variant?: 'compact' | 'full'   // default 'full' — NOTE: 'compact' renders b/, NOT 'mark'
  className?: string
  as?: 'span' | 'h1' | 'div'    // default 'span'
}

export function Wordmark(props: WordmarkProps): JSX.Element
```
- `full` → text `bnzo.` (period uses `text-lime`)
- `compact` → text `b/` in Geist Mono
- W1-A corrected 2026-05-09 per DISCOVERY.md audit: variant is `'compact' | 'full'`, NOT `'mark' | 'full'`.

### `@/components/brand/Footer`
```tsx
export function Footer(): JSX.Element
```
Footer takes **no props**. Renders:
- Newsletter column (eyebrow + EmailCapture source="bnzo")
- Wordmark (full)
- Cross-domain links (absolute URLs to 5 subdomains)
- Social links (X, GitHub)
- Copyright line
- W1-A corrected 2026-05-09 per DISCOVERY.md audit: no `domain` prop — Footer is prop-free.

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

### `content/work/*.mdx`
```yaml
---
slug: cook-for-friends-mtl
client: Cook For Friends MTL
title: Bakery Business OS
outcome: Bakery business OS + 5-agent content team. Shipped in 3 weeks.
posterPath: /work/cook-for-friends-mtl.jpg
mp4Path: /work/cook-for-friends-mtl.mp4
webmPath: /work/cook-for-friends-mtl.webm
href: /lab/cook-for-friends
tags: [Shopify, Next.js, AI Agents]
---
```

---

## 9. WorkItem — W1-B (locked 2026-05-10)

Data shape for the home page "Recent Work" gallery (Section 4). Lives in
`content/work/*.mdx`, loaded via `lib/work.ts → getWorkItems()`.

### `@/lib/work`
```ts
export interface WorkItem {
  slug: string      // matches MDX filename stem
  client: string    // display name of the client
  title: string     // project title
  outcome: string   // one-line result (shown as card headline)
  posterPath: string  // absolute path to poster jpg, e.g. /work/slug.jpg
  mp4Path: string     // absolute path to MP4 video, e.g. /work/slug.mp4
  webmPath: string    // absolute path to WebM video, e.g. /work/slug.webm
  href: string        // link to lab case study, e.g. /lab/slug
  tags: string[]      // tech stack tags
}

export async function getWorkItems(): Promise<WorkItem[]>
```

Assets live in `public/work/{slug}.{jpg,mp4,webm}`.
Components: `WorkGrid` (server) + `WorkCard` (client) in `components/home/`.
Video is lazy-mounted via raw `IntersectionObserver` (`rootMargin: '300px'`).
No framer-motion. No react-intersection-observer.

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
