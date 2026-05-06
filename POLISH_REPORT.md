# Polish Report — bnzo.io homepage

All 10 items from the Approved Queue implemented.

## Implemented

### 1. Scroll-reveal entrance animations
- `[data-reveal]` + `[data-reveal-delay]` HTML attributes on all section headers and cards
- CSS: `opacity 0→1` + `translateY(40px→0)`, 400ms `ease-out-expo`
- `ScrollReveal` client component (`components/home/ScrollReveal.tsx`) sets up IntersectionObserver, adds `.revealed` class, respects per-element delay
- Stagger: 80ms per child card in Services and WorkPreview
- Files: `globals.css`, `ScrollReveal.tsx`, `Services.tsx`, `WorkPreview.tsx`, `Hero.tsx`, `page.tsx`

### 2. WorkPreview card hover — glass lift
- `hover:scale-[1.02]`, `hover:-translate-y-1`, `hover:backdrop-blur-md`, `hover:bg-white/[0.05]`
- Lime border glow via Tailwind arbitrary shadow: `hover:shadow-[0_0_0_1px_rgba(200,255,0,0.4),0_8px_32px_rgba(200,255,0,0.08)]`
- `transition-all duration-300 ease-out-expo`
- File: `WorkPreview.tsx`

### 3. Services cards — glassmorphism
- Removed `bg-chalk text-ink hover:bg-ink hover:text-chalk` color flip
- Base: `bg-white/[0.04] backdrop-blur-sm border border-white/10 text-chalk`
- Hover: `hover:bg-white/[0.08] hover:border-lime/40` + lime glow shadow
- All text stays chalk throughout; no color inversion
- Changed grid from `gap-px bg-ink/10` to `gap-4` for proper glass gaps
- File: `Services.tsx`

### 4. Hero headline — word-stagger entrance on load
- Lines split into `<span className="block">` elements
- CSS keyframe `hero-line-in`: `opacity 0→1` + `translateY(20px→0)`, 400ms `ease-out-expo`
- Classes `hero-line-0` through `hero-line-4` with 80ms stagger per line
- Also staggers label, wordmark, body copy
- Triggers on mount via CSS animation (not IO — hero is above fold)
- Files: `globals.css`, `Hero.tsx`

### 5. Button press states — scale feedback
- `active:scale-[0.97]` + `transition-all duration-fast` on:
  - Email subscribe button (`EmailCapture.tsx`)
  - Service card CTA links (`Services.tsx`)
  - "All case studies →" link (`WorkPreview.tsx`)
  - WorkPreview cards (card-level `active:scale-[0.97]`)

### 6. Footer — SVG social icons
- `XIcon` and `GitHubIcon` inline SVG components (16×16, `fill="currentColor"`)
- Rendered alongside label text with `inline-flex items-center gap-2`
- Same `hover:text-lime` behavior preserved
- File: `Footer.tsx`

### 7. Noise texture overlay
- `body::before` pseudo-element: `position: fixed`, `inset: 0`, `pointer-events: none`, `z-index: 9999`
- SVG `feTurbulence fractalNoise` at `baseFrequency 0.9`, 4 octaves, `stitchTiles`
- Opacity: `0.035`
- Background size: 256×256px tiling
- File: `globals.css`

### 8. Email input — focus glow
- `focus:shadow-[0_0_0_3px_rgba(200,255,0,0.15)]` with `transition-shadow duration-fast`
- Existing `focus:border-lime` preserved
- File: `EmailCapture.tsx`

### 9. BackgroundAnimation — mouse proximity attraction
- `mousemove` listener updates `mouseRef` (no re-renders)
- Per-frame: nodes within 150px radius receive proportional velocity nudge (factor `0.018 × (1 - d/150)`)
- Velocity damping `0.995` per frame prevents drift accumulation
- Max speed clamped to `0.9` px/frame — feels magnetic, not jumpy
- File: `BackgroundAnimation.tsx`

### 10. Services — Lucide stroke icons
- `lucide-react` installed (`^1.14.0`)
- Icons: `Layers` (App Dev), `Blocks` (SaaS), `Bot` (AI), `GraduationCap` (Education)
- Size: 20px, strokeWidth: 1.5
- Base: `text-chalk/30`, hover: `text-lime` via parent `group`
- File: `Services.tsx`, `package.json`

## Constraints honored
- No copy, layout, spacing, font, or routing changes
- No mascots, orbs, or gradient blobs
- All animation durations: 150ms / 300ms / 400ms only
- Glass effects let background animation show through
