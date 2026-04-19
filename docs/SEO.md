# SEO — bnzo-platform

## Architecture

Single Next.js app serving 5 domains via middleware rewrite. Each domain has its own metadata, OG image, sitemap, and JSON-LD schema.

## OG Images

Generated with `next/og` (`ImageResponse`). Convention-based files auto-wire into metadata.

| File | Domain | Image |
|------|--------|-------|
| `app/opengraph-image.tsx` | bnzo.io | Wordmark + tagline |
| `app/build/opengraph-image.tsx` | build.bnzo.io | "Developer Resources" + b/ mark |
| `app/lab/opengraph-image.tsx` | lab.bnzo.io | "Case Studies" branded |
| `app/lab/[slug]/opengraph-image.tsx` | lab.bnzo.io/[slug] | Dynamic: project title + status badge |
| `app/learn/opengraph-image.tsx` | learn.bnzo.io | "Learn to Build with AI Agents" |
| `app/founder/opengraph-image.tsx` | erick.bnzo.io | "Erick Benzo — Fullstack Developer" |

All images: 1200×630px, `image/png`, edge runtime.

## Metadata per Domain

Each layout sets `metadataBase` to its own domain so relative URLs resolve correctly.

| Domain | metadataBase | Layout file |
|--------|-------------|-------------|
| bnzo.io | `https://bnzo.io` | `app/layout.tsx` |
| build.bnzo.io | `https://build.bnzo.io` | `app/build/layout.tsx` |
| lab.bnzo.io | `https://lab.bnzo.io` | `app/lab/layout.tsx` |
| learn.bnzo.io | `https://learn.bnzo.io` | `app/learn/layout.tsx` |
| erick.bnzo.io | `https://erick.bnzo.io` | `app/founder/layout.tsx` |

All pages include: `title`, `description`, `openGraph` (title, description, url, siteName, type), `twitter` (card, title, description).

## Sitemaps

Per-domain sitemaps served via Next.js `sitemap.ts` convention. Through middleware rewrite, `build.bnzo.io/sitemap.xml` → internal `/build/sitemap.xml` → `app/build/sitemap.ts`.

| File | URL |
|------|-----|
| `app/sitemap.ts` | `bnzo.io/sitemap.xml` |
| `app/build/sitemap.ts` | `build.bnzo.io/sitemap.xml` |
| `app/lab/sitemap.ts` | `lab.bnzo.io/sitemap.xml` |
| `app/learn/sitemap.ts` | `learn.bnzo.io/sitemap.xml` |
| `app/founder/sitemap.ts` | `erick.bnzo.io/sitemap.xml` |

`app/build/sitemap.ts` dynamically includes all resource slugs from `/content/resources/*.mdx`.
`app/lab/sitemap.ts` dynamically includes all project slugs from `/content/projects/*.mdx`.

## Robots

`app/robots.ts` serves `bnzo.io/robots.txt`. Rules: allow all crawlers. References all 5 domain sitemaps.

Through middleware, subdomain robots.txt requests (e.g. `build.bnzo.io/robots.txt`) rewrite to `/build/robots.txt`. Next.js serves the root robots.ts for `/robots.txt` only. **Subdomains inherit bnzo.io robots.txt behavior via the shared Vercel project.**

## JSON-LD Schemas

Injected via `components/seo/JsonLd.tsx` (renders `<script type="application/ld+json">`).

| Schema | Page | File |
|--------|------|------|
| `Organization` | bnzo.io | `app/page.tsx` |
| `Product` | build.bnzo.io/[slug] (paid only) | `app/build/[slug]/page.tsx` |
| `Person` | erick.bnzo.io | `app/founder/page.tsx` |

### Organization (bnzo.io)
```json
{
  "@type": "Organization",
  "name": "Bnzo Studio",
  "url": "https://bnzo.io",
  "founder": { "@type": "Person", "name": "Erick Benzo" }
}
```

### Product (build.bnzo.io/[slug], paid resources)
```json
{
  "@type": "Product",
  "name": "...",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "USD",
    "availability": "InStock"
  }
}
```

### Person (erick.bnzo.io)
```json
{
  "@type": "Person",
  "name": "Erick Benzo",
  "jobTitle": "Founder & Fullstack Developer",
  "worksFor": { "@type": "Organization", "name": "Bnzo Studio" }
}
```

## Lighthouse Targets

| Metric | Target |
|--------|--------|
| Performance | 90+ |
| Accessibility | 90+ |
| Best Practices | 90+ |
| SEO | 100 |

## Testing OG Images

Locally: `http://localhost:3000/opengraph-image` (bnzo.io), `http://localhost:3000/build/opengraph-image` (build domain), etc.

Production: use [opengraph.xyz](https://www.opengraph.xyz) or Facebook Sharing Debugger to validate.

## Adding a New Resource (build domain)

1. Create `/content/resources/<slug>.mdx` with required frontmatter
2. Sitemap auto-updates on next build (dynamic slug enumeration)
3. OG image auto-generated from layout `opengraph-image.tsx`
4. Product JSON-LD auto-generated if `tier: paid`

## Adding a New Project (lab domain)

1. Create `/content/projects/<slug>.mdx` with required frontmatter
2. Sitemap auto-updates on next build
3. Dynamic OG image reads `title`, `description`, `status` from project file
