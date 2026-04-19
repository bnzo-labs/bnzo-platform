# ARCHITECTURE — bnzo-platform

## Decision Log

### D1: Single Next.js project, middleware-based routing
**Chosen:** One `app/` tree, `middleware.ts` rewrites requests by host header.
**Rejected:**
- Separate Next.js projects per domain (5x deploy, duplicated code)
- Turborepo multi-app monorepo (over-engineered for solo + tight timeline)
- Next.js multi-zones (requires separate deployments, harder auth sharing)

**Rationale:** Middleware rewrites are officially supported, give one build, one deploy, shared auth/DB via same cookie domain. Matches Vercel Platforms Starter Kit pattern.

**Trade-off:** All domains share one build. A breaking change on `/build` can crash `bnzo.io`. Mitigated by strict TypeScript + E2E tests per domain.

---

### D2: Rewrite, not redirect
**Chosen:** `NextResponse.rewrite()` keeps URL on subdomain while serving internal path.
**Rationale:** User sees `build.bnzo.io/kits` not `bnzo.io/build/kits`. Preserves SEO per domain. Google treats each domain as its own property.

---

### D3: Shared auth via cookie domain `.bnzo.io`
**Chosen:** Supabase cookie scoped to parent domain so session flows across all subdomains.
**Rejected:** Per-subdomain auth (breaks unified UX — user buys on `build`, must re-login on `learn`).
**Risk:** Cookie domain misconfig leaks session to wrong subdomain. Enforced in `lib/supabase.ts` via explicit `cookies.domain` option.

---

### D4: Single Stripe account, env-based price IDs
**Chosen:** One Stripe account. Product price IDs in env vars. Webhook at `/api/webhooks/stripe`.
**Rationale:** Unified customer DB. Future cross-sell (buy kit on `build` → access course on `learn`). Env-based prices allow test/prod separation without code changes.

---

### D5: MDX for content, not CMS
**Chosen:** `/content/*.mdx` files committed to repo.
**Rejected:** Sanity/Contentful (overkill for MVP, adds another service, another key).
**Trade-off:** Content edits require git commits. Acceptable for solo + low-velocity content.

---

### D6: Shared `components/brand/` for cross-domain visual identity
**Chosen:** `Wordmark` + `Footer` live under `/components/brand/`, imported by every domain layout.
**Rationale:** Guarantees consistent branding. Per-domain layouts still own navigation to keep IA distinct.

---

### D7: Root layout holds fonts + analytics; per-domain layouts hold nav + metadata
**Chosen:** Inheritance chain — root sets fonts/analytics, child layouts set `metadata` and nav.
**Rationale:** Next.js metadata merging handles per-domain titles/OG while sharing base config.

---

### D8: TypeScript strict + zod at boundaries
**Chosen:** All API routes validate request body with zod. No `any`. `tsconfig` strict.
**Rationale:** Payment + email paths must not fail silently. Boundary validation catches malformed input early.

---

### D9: Webhook signature verification before any processing
**Chosen:** `/api/webhooks/stripe` reads raw body, verifies via `stripe.webhooks.constructEvent`. Reject before DB writes.
**Rationale:** Prevents spoofed webhooks creating fake purchases.

---

### D10: No user auth for MVP
**Chosen:** Guest checkout. `purchases.user_id` nullable. Email is identity.
**Rationale:** Cuts scope. Auth can be added later without schema migration (user_id column already there).

---

### D11: Local dev via host query param
**Chosen:** Middleware checks `?host=<subdomain>` query param in dev. Falls back to real `Host` header in prod.
**Rejected:** `/etc/hosts` entries (fragile, OS-specific). Subdomain `.localhost` (Safari issues).
**Rationale:** Single port, no root needed, works in all browsers.

---

### D12: Fonts via `next/font/google`
**Chosen:** Syne, DM Sans, Geist Mono loaded via `next/font`. CSS variables exposed.
**Rationale:** Zero layout shift, self-hosted at build, no external CDN risk.

## Architecture Diagram (text)

```
Request → Vercel Edge
           ↓
        middleware.ts (inspect Host header)
           ↓
        Rewrite to internal path
           ↓
        app/{route}/page.tsx (RSC)
           ↓
        Shared lib/* clients (Supabase, Stripe, Resend)
           ↓
        External services
```

## Data Flow — Purchase

```
User click "Buy" on build.bnzo.io/kits/starter
  → POST /api/checkout { priceId, successUrl, cancelUrl }
  → Stripe Checkout Session created
  → Redirect to Stripe hosted page
  → User pays
  → Stripe fires checkout.session.completed
  → POST /api/webhooks/stripe (raw body, signature verified)
  → Supabase insert into purchases
  → Resend sends receipt + access email
  → User redirected to successUrl
```

## Data Flow — Email Capture

```
User submits email on bnzo.io or learn.bnzo.io
  → POST /api/subscribe { email, source }
  → Zod validate
  → Supabase upsert into subscribers
  → Resend sends welcome email
  → Return { ok: true }
```

## Deployment

- Vercel project `bnzo-platform`
- 6 domains bound: `bnzo.io`, `www.bnzo.io`, `build.bnzo.io`, `lab.bnzo.io`, `learn.bnzo.io`, `erick.bnzo.io`
- DNS: CNAME each subdomain to `cname.vercel-dns.com`
- Apex `bnzo.io` via A record to Vercel
- `www.bnzo.io` → redirects to apex via Vercel config
- Preview deployments work under `*.vercel.app` with default host → falls through to `bnzo.io` route

## Risks + Mitigations

| Risk | Mitigation |
|------|------------|
| Middleware perf regression | Keep middleware < 10 lines of logic, no I/O |
| SEO — 5 sites, 5 sitemaps | Wave 5 generates per-domain `sitemap.ts` keyed on host |
| Shared bundle bloats all domains | Dynamic imports for heavy per-domain deps |
| Webhook replay attacks | Stripe event ID dedup via unique constraint on `stripe_session_id` |
| Cookie domain leak on preview URLs | Only set `.bnzo.io` in prod; use default in preview |
