# bnzo CMS

Supabase-native CMS for three content types: **projects**, **resources**, **guides**.

## Where things live

| Concern | Location |
|---|---|
| DB schema | `supabase/migrations/20260419_cms.sql` |
| Zod schemas | `lib/cms-schemas.ts` |
| Admin auth | `lib/admin-auth.ts` |
| Public read (lab) | `lib/projects.ts` |
| Public read (build) | `lib/resources.ts` |
| Public read (learn) | `lib/guides.ts` |
| Admin UI | `app/admin/*` |
| Admin API | `app/api/admin/*` |
| Seed from MDX | `scripts/seed-cms.ts` |

## Content types

| Type | Table | Surface |
|---|---|---|
| projects | `cms_projects` | `lab.bnzo.io` |
| resources | `cms_resources` | `build.bnzo.io` |
| guides | `cms_guides` | `learn.bnzo.io` |

All tables share: `id`, `slug`, `title`, `description`, `body`, `published`, `created_at`, `updated_at`. Type-specific fields vary — see `cms-schemas.ts` for exact shapes.

## Setup

1. Run the migration:
   ```bash
   supabase db push
   # or apply 20260419_cms.sql manually via Supabase SQL editor
   ```
2. Set `ADMIN_EMAILS` env (comma-separated). Only these emails can sign in to `/admin`.
3. Seed existing MDX content:
   ```bash
   npx tsx scripts/seed-cms.ts
   ```
4. Deploy. `/admin` is live on `bnzo.io/admin`.

## Authoring flow

1. Go to `https://bnzo.io/admin/login`.
2. Enter an allowlisted email → Supabase sends a magic link.
3. Click link → land on `/admin` dashboard.
4. Pick a content type → list view.
5. Click `+ new` or an existing row.
6. Fill title, slug, description, body (markdown). Type-specific fields go in the **extras** JSON textarea.
7. Toggle **published** and **save**.
8. Public page is revalidated immediately (`revalidatePath` in API handler).

## Fallback

If Supabase is unreachable or the table is empty, `lib/{projects,resources,guides}.ts` falls back to MDX in `/content/`. That keeps local dev cheap and the site alive during outages.

## Extras JSON — per type

**projects**
```json
{
  "status": "In Progress",
  "hero_image": "/images/lab/foo.svg",
  "problem": "...",
  "architecture": { "stack": [], "decisions": [] },
  "agents": [],
  "result": { "metrics": [], "outcomes": [] },
  "learnings": { "went_well": [], "didnt": [] }
}
```

**resources**
```json
{
  "price_cents": 9700,
  "price_id": "price_abc",
  "tier": "paid",
  "tags": ["nextjs"],
  "download_url": null
}
```

**guides**
```json
{
  "hero_image": "/images/learn/foo.svg",
  "tags": ["agents"],
  "reading_minutes": 5
}
```

## Security notes

- Writes go through service-role `supabaseServer()`. Auth check happens in API handler via `requireAdminApi()`.
- Public `SELECT` is RLS-gated to `published = true`.
- `/admin` middleware redirects to apex when hit on a subdomain.
- No WYSIWYG. Bodies are raw markdown/MDX.

## Next

- Add image upload via Supabase Storage (currently URLs only).
- Add preview mode: admins see unpublished rows on public pages.
- Add `publish_at` + scheduled publish worker.
