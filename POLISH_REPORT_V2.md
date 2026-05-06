# Polish Report V2

## Item 1 — Shared SiteHeader (all 5 domains)

**New:** `components/brand/SiteHeader.tsx`
- Client component. Sticky top-0, z-50, backdrop-blur-md.
- Dark tone: `bg-ink/60 border-white/10`. Light tone: `bg-chalk/60 border-slate/15`.
- Three-column grid: left = nav links, center = Wordmark (or custom `centerSlot`), right = optional CTA.
- Mount fade-in: opacity 0→1, 200ms ease-out via `useState` + `useEffect`.
- Nav links styled with `link-underline` utility for underline sweep on hover.

**Updated layouts / pages:**
- `app/build/layout.tsx` — replaced existing `<header>`, tone=light, navLinks=[Resources, About], added ScrollReveal.
- `app/lab/layout.tsx` — replaced existing `<header>`, tone=dark, navLinks=[Projects, Home], added ScrollReveal.
- `app/learn/layout.tsx` — replaced existing `<header>`, tone=light, navLinks=[Home, Guides], cta=Early Access, added ScrollReveal.
- `app/founder/layout.tsx` — replaced existing `<header>`, tone=dark, navLinks=[Work, Contact], custom centerSlot preserving "erick." branding, added ScrollReveal.
- `app/page.tsx` — added SiteHeader (tone=dark, enableHeroMorph=true, navLinks=[Build, Lab, Learn]).

---

## Item 2 — Hero-to-header wordmark morph (home only)

`components/brand/SiteHeader.tsx` (when `enableHeroMorph={true}`):
- IntersectionObserver watches `[aria-labelledby="hero-heading"]` (the Hero section).
- When hero exits viewport: badge `b/` fades in (opacity 0→1, 200ms), wordmark fades out.
- Badge fires `site-header-badge-pulse` keyframe (scale 1→1.08→1, 300ms) on each hero-exit event.
- When hero re-enters: badge fades out, wordmark fades back in.
- Both badge and wordmark rendered always; CSS opacity transitions drive the swap.

**CSS added to `app/globals.css`:**
- `@keyframes site-header-badge-pulse` + `.site-header-badge-pulse` class.
- `.link-underline` + `::after` utility for underline sweep animations.

---

## Item 3 — Glass surface on first section after hero

**Dark domains (home, lab, founder):** `backdrop-blur-md bg-white/[0.04] border-t border-white/10`
**Light domains (build, learn):** `backdrop-blur-sm bg-black/[0.03] border-t border-slate/10`

Applied to:
- `components/home/Services.tsx` — removed solid `bg-ink`, added dark glass classes.
- `app/build/page.tsx` — second section (resources grid) wrapped with light glass.
- `app/lab/page.tsx` — second section (projects grid) wrapped with dark glass.
- `components/learn/GuidesPlaceholder.tsx` — replaced `bg-chalk` with light glass.
- `components/founder/SelectedWork.tsx` — added dark glass to section (combined with existing `border-b border-slate/15`).

---

## Item 4 — ScrollReveal — build, lab, learn, founder

`<ScrollReveal />` added to all four domain layouts (build, lab, learn, founder).

`data-reveal` / `data-reveal-delay` tagged on:
- `app/build/page.tsx` — label div (0ms), h1 (80ms), p (160ms), filter row (0ms), each ResourceCard wrapper (0/80/160ms stagger).
- `app/lab/page.tsx` — label p (0ms), h1 (80ms), p (160ms), each ProjectCard wrapper (0/80/160ms stagger).
- `components/learn/GuidesPlaceholder.tsx` — header row (0ms), each guide card (0/80/160/240ms stagger).
- `components/founder/SelectedWork.tsx` — heading + link row (0ms), each project item (0/80/160/240ms stagger).

---

## Item 5 — Ambient micro-interactions

**ProjectCard (`components/lab/ProjectCard.tsx`):**
- Card Link: `hover:border-lime/40 hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-[lime glow] active:scale-[0.97]`
- "View case study" text: `link-underline` class for underline sweep.

**ResourceCard (`components/build/ResourceCard.tsx`):**
- Card Link: `hover:border-lime-deep hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-[lime-deep glow] active:scale-[0.97]`
- CTA text: `link-underline` class for underline sweep.

**GuidesPlaceholder (`components/learn/GuidesPlaceholder.tsx`):**
- Disabled cards: `hover:border-slate/40` subtle border lift (no translate/scale since not interactive).

**SelectedWork (`components/founder/SelectedWork.tsx`):**
- Project links: `hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.97]`
- "All case studies →": `link-underline` class.

All micro-interactions use `duration-200 ease-out-expo`. CTA buttons: `active:scale-[0.97]`.

---

## Build

`npm run build` — clean, no errors or type warnings.
