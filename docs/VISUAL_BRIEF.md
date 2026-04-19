# VISUAL BRIEF — bnzo-platform

## Aesthetic Direction

Dark editorial with technical precision. Builder-first. No fluff.

- **Hero surfaces:** Ink (`#0C0C0C`) dark background — command-line gravity
- **Content sections:** Chalk (`#F5F4EF`) off-white — legible, warm, intentional
- **Accent:** Lime (`#C8FF00`) — used sparingly for punctuation, not decoration
- **Muted text / borders:** Slate (`#6B6868`) — secondary info, dividers

Style direction: **Dark luxury meets developer tooling**. Think Linear meets a studio agency. Not flashy. Not corporate. Honest.

---

## Color Palette

### CSS Custom Properties

```css
:root {
  --color-ink:   #0C0C0C;
  --color-chalk: #F5F4EF;
  --color-lime:  #C8FF00;
  --color-slate: #6B6868;
}
```

### Semantic Usage

| Token | Usage |
|---|---|
| `--color-ink` | Dark backgrounds, primary text on light |
| `--color-chalk` | Light backgrounds, primary text on dark |
| `--color-lime` | Accents, CTA highlights, wordmark period, hover states |
| `--color-slate` | Secondary text, borders, muted labels |

### Color Rules

- Lime is punctuation. Use it like a period, not a highlighter.
- Never use lime as a background for large areas.
- On dark (Ink) surfaces: body text is Chalk. Accents are Lime.
- On light (Chalk) surfaces: body text is Ink. Accents are Lime.

---

## Typography Scale

### Font Stack

| Role | Font | Source |
|---|---|---|
| Headlines / Wordmark | **Syne** | next/font/google |
| Body copy / UI text | **DM Sans** | next/font/google |
| Code / Logo mark | **Geist Mono** | next/font/google |

### Scale

```css
/* Fluid type scale via clamp */
--text-xs:   clamp(0.75rem,  0.7rem  + 0.25vw, 0.875rem);
--text-sm:   clamp(0.875rem, 0.82rem + 0.27vw, 1rem);
--text-base: clamp(1rem,     0.92rem + 0.4vw,  1.125rem);
--text-lg:   clamp(1.125rem, 1rem    + 0.6vw,  1.375rem);
--text-xl:   clamp(1.375rem, 1.1rem  + 1.4vw,  2rem);
--text-2xl:  clamp(2rem,     1.5rem  + 2.5vw,  3.5rem);
--text-hero: clamp(3rem,     1.5rem  + 7vw,    7rem);
```

### Typography Rules

- Headlines: Syne, bold weight, tight tracking (`letter-spacing: -0.02em` to `-0.04em`)
- Body: DM Sans, regular/medium, comfortable line-height (`1.6–1.7`)
- Code blocks / mono labels: Geist Mono, regular weight
- Never mix Syne and DM Sans in the same line of text

---

## Logo Mark Usage

### Compact: `b/`

- Font: **Geist Mono**, bold weight
- Letterform: lowercase `b` + `/` (forward slash)
- Usage: favicon, nav icon, small surfaces, dark/light safe
- Color: Chalk on Ink, Ink on Chalk
- Never scale below 16px

```tsx
<Wordmark variant="compact" />  // renders: b/
```

### Full Wordmark: `bnzo.`

- Font: **Syne**, bold weight
- Letterform: `bnzo` + `.` (period in Lime)
- Usage: nav bars, footers, hero sections, marketing surfaces
- Color: `bnzo` in Chalk (on dark) or Ink (on light); `.` always in Lime

```tsx
<Wordmark variant="full" />     // renders: bnzo + lime period
```

### Rules

- Always use the component — never hard-code the wordmark as plain text
- The lime period is structural to the brand, not decorative
- Do not apply shadows, gradients, or outlines to the wordmark

---

## Component Patterns

### Hero Sections

```
- Background: var(--color-ink)
- Text: var(--color-chalk)
- Accent: var(--color-lime)
- Layout: constrained max-width (1200px), centered
- Padding: clamp(4rem, 3rem + 5vw, 10rem) vertical
- No image carousels. No sliders. Static with subtle motion only.
```

### Cards

```
- Background: rgba(255,255,255,0.03) on dark surfaces
- Background: rgba(0,0,0,0.04) on light surfaces
- Border: 1px solid rgba(107,104,104,0.2)
- Border-radius: 8px
- Padding: 24px
- Hover: border-color transitions to var(--color-lime)
```

### CTAs / Buttons

Primary (dark surface):
```css
background: var(--color-lime);
color: var(--color-ink);
font-family: DM Sans, medium weight;
padding: 12px 24px;
border-radius: 6px;
```

Secondary:
```css
background: transparent;
border: 1px solid var(--color-slate);
color: var(--color-chalk);
```

### Section Transitions

- Dark → Light: use a subtle divider `border-top: 1px solid var(--color-slate)` or just a clear background shift
- Avoid hard gradients between sections unless intentional
- Spacing between sections: `clamp(4rem, 3rem + 5vw, 10rem)`

---

## Domain-Specific Notes

| Domain | Surface | Tone |
|---|---|---|
| bnzo.io | Dark hero → light sections | Studio credibility, agency authority |
| build.bnzo.io | Light primary, dark feature callouts | Product-focused, conversion |
| lab.bnzo.io | Dark, editorial | Case study depth, technical detail |
| learn.bnzo.io | Light, approachable | Education, accessible |
| erick.bnzo.io | Dark hero, minimal | Personal, portfolio |

---

## Shared Components

### Wordmark (`components/brand/Wordmark.tsx`)

Props:
- `variant: "compact" | "full"` — required
- `className?: string` — optional override

### Footer (`components/brand/Footer.tsx`)

Structure:
- Wordmark (full variant)
- Domain links: bnzo.io, build.bnzo.io, lab.bnzo.io, learn.bnzo.io, erick.bnzo.io
- Social links (placeholder)
- Copyright line
- Appears on all 5 domains without modification

---

## Tailwind Config Extensions

Brand colors mapped to Tailwind:

```js
colors: {
  ink:   'var(--color-ink)',
  chalk: 'var(--color-chalk)',
  lime:  'var(--color-lime)',
  slate: 'var(--color-slate)',
}
```

Usage in classes: `bg-ink`, `text-chalk`, `text-lime`, `border-slate`

---

## Anti-Patterns (do not do)

- No gradient backgrounds using Lime
- No card grids with uniform card height and padding (vary rhythm)
- No centered-everything layouts for all content sections
- No default shadcn gray color scheme (override with brand palette)
- No stock hero with centered H1 + blob + single CTA (add layering, texture, or typographic scale)
- No placeholder copy shipped to production

---

## Quick Reference

```
Ink    #0C0C0C  → dark bg, text on light
Chalk  #F5F4EF  → light bg, text on dark
Lime   #C8FF00  → accent, CTAs, wordmark period
Slate  #6B6868  → secondary text, borders

Syne       → headlines
DM Sans    → body
Geist Mono → code, compact logo
```
