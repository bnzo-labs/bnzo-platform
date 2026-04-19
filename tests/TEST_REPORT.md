# E2E Test Report — bnzo-platform

**Date:** 2026-04-15
**Framework:** Playwright 1.59.1
**Browser:** Chromium
**Server:** localhost:3000 (Next.js dev)

---

## Summary

| Status | Count |
|--------|-------|
| Passed | 17 |
| Skipped (env vars missing) | 12 |
| Failed | 0 |

---

## Results by Suite

### domain-routing.spec.ts — 8/8 passed

| Test | Status | Notes |
|------|--------|-------|
| bnzo.io renders studio homepage | ✅ Pass | |
| build.bnzo.io → /build renders marketplace | ✅ Pass | |
| lab.bnzo.io → /lab renders case studies | ✅ Pass | |
| learn.bnzo.io → /learn renders education hub | ✅ Pass | |
| erick.bnzo.io → /founder renders portfolio | ✅ Pass | |
| each domain serves distinct content | ✅ Pass | |
| www.bnzo.io → 301 redirect to bnzo.io | ✅ Pass | Middleware redirect verified via response listener |
| path rewrite preserves sub-paths on build | ✅ Pass | |
| API routes not rewritten (exempt from middleware) | ✅ Pass | |

### email-capture.spec.ts — 1/6 passed, 5 skipped

| Test | Status | Notes |
|------|--------|-------|
| Form renders on homepage | ✅ Pass | `input#email-capture` visible |
| Submit valid email → success | ⏭ Skip | Requires SUPABASE_SERVICE_ROLE_KEY + RESEND_API_KEY |
| Submit duplicate email → no crash | ⏭ Skip | Requires env vars |
| API /subscribe returns 200 | ⏭ Skip | Requires env vars |
| API /subscribe returns 400 for invalid email | ⏭ Skip | Requires env vars |
| Subscriber saved in Supabase | ⏭ Skip | Requires SUPABASE_SERVICE_ROLE_KEY |

**Blocker:** `new Resend(undefined)` throws at module load time when `RESEND_API_KEY` is missing. This causes the entire subscribe route to 500 (even for validation errors that should return 400). Tests skip cleanly but this must be fixed before prod.

### stripe-checkout.spec.ts — 4/7 passed, 3 skipped

| Test | Status | Notes |
|------|--------|-------|
| Resource listing page renders | ✅ Pass | |
| Resource detail page renders for starter-kit | ✅ Pass | |
| Purchase button visible for paid resource | ✅ Pass | |
| success=true shows purchase confirmation | ✅ Pass | |
| API /checkout returns URL for valid priceId | ⏭ Skip | Requires STRIPE_PRICE_STARTER_KIT |
| API /checkout returns 400 for missing priceId | ⏭ Skip | Requires STRIPE_SECRET_KEY |
| Full Stripe test-card checkout @slow | ⏭ Skip | Requires STRIPE_TEST_CARD_ENABLED=true |

**Blocker:** `new Stripe(undefined)` throws at module load time. Same pattern as Resend.

### auth-cross-domain.spec.ts — 3/7 passed, 4 skipped

| Test | Status | Notes |
|------|--------|-------|
| bnzo.io homepage loads without auth | ✅ Pass | Public page stays public |
| build.bnzo.io loads without auth | ✅ Pass | |
| lab.bnzo.io loads without auth | ✅ Pass | |
| Sign in sets session cookie with domain .bnzo.io | ⏭ Skip | Auth not yet implemented |
| Session persists on build.bnzo.io | ⏭ Skip | Auth not yet implemented |
| Unauthenticated → redirect to login | ⏭ Skip | Auth not yet implemented |
| Sign out clears cookie | ⏭ Skip | Auth not yet implemented |

---

## Blockers

### BLOCKER 1 — Module-level throws on missing env vars

`lib/resend.ts` and `lib/stripe.ts` initialize their SDK clients at module level:
```ts
export const resend = new Resend(process.env.RESEND_API_KEY!)  // throws if undefined
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, ...)  // throws if undefined
```

When these env vars are missing, the entire API route module fails to load. This means:
- `POST /api/subscribe` returns 500 even for invalid input (should be 400)
- `POST /api/checkout` returns 500 even for missing required fields (should be 400)

**Fix:** Move SDK instantiation inside the route handler (lazy init), or guard with a null check.

### BLOCKER 2 — No .env.local present

All secrets are missing. Tests that require live integrations skip cleanly, but the app cannot function end-to-end without:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_PRICE_STARTER_KIT`
- `RESEND_API_KEY`

---

## How to Run Full Suite (with env vars)

```bash
# Copy and fill .env.example → .env.local
cp .env.example .env.local

# Run all tests (including skipped API tests)
BASE_URL=http://localhost:3000 npm run test:e2e

# Run Stripe end-to-end flow
STRIPE_TEST_CARD_ENABLED=true npm run test:e2e -- --grep "@slow"

# Run auth tests (when auth is implemented)
AUTH_IMPLEMENTED=true npm run test:e2e -- auth-cross-domain
```

---

## Coverage

| Flow | Covered | Notes |
|------|---------|-------|
| Domain routing (5 subdomains) | ✅ Full | All 5 domains verified |
| www → apex redirect | ✅ Full | 301 response verified |
| Middleware path rewrite | ✅ Full | |
| Email capture form (UI) | ✅ Full | Input + button visible |
| Email capture API | ⚠️ Partial | Skip until env vars set |
| Stripe checkout UI | ✅ Full | Button, detail page, success page |
| Stripe checkout API | ⚠️ Partial | Skip until env vars set |
| Auth cross-domain | ⚠️ Pending | Auth not implemented yet |
| Public pages stay public | ✅ Full | 3 domains verified |
