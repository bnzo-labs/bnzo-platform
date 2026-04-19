/**
 * Seed Supabase CMS tables from existing MDX files in /content.
 * Usage: npx tsx scripts/seed-cms.ts
 *
 * Requires: SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_SUPABASE_URL.
 * Idempotent: upserts by slug.
 */
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}
const supabase = createClient(url, key)

const ROOT = path.join(process.cwd(), 'content')

type MdxFile = { slug: string; data: Record<string, unknown>; body: string }

function readDir(dir: string): MdxFile[] {
  const full = path.join(ROOT, dir)
  if (!fs.existsSync(full)) return []
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => {
      const raw = fs.readFileSync(path.join(full, f), 'utf8')
      const parsed = matter(raw)
      return {
        slug: f.replace(/\.mdx$/, ''),
        data: parsed.data as Record<string, unknown>,
        body: parsed.content.trim(),
      }
    })
}

async function seedProjects() {
  const files = readDir('projects')
  for (const f of files) {
    const row = {
      slug: f.slug,
      title: (f.data.title as string) ?? f.slug,
      description: (f.data.description as string) ?? '',
      body: f.body,
      status: (f.data.status as string) ?? 'In Progress',
      hero_image: (f.data.heroImage as string) ?? '',
      problem: (f.data.problem as string) ?? '',
      architecture: f.data.architecture ?? { stack: [], decisions: [] },
      agents: (f.data.agents as string[]) ?? [],
      result: f.data.result ?? { metrics: [], outcomes: [] },
      learnings: f.data.learnings ?? { went_well: [], didnt: [] },
      published: true,
    }
    const { error } = await supabase
      .from('cms_projects')
      .upsert(row, { onConflict: 'slug' })
    if (error) console.error('project', f.slug, error.message)
    else console.log('project seeded', f.slug)
  }
}

async function seedResources() {
  const files = readDir('resources')
  for (const f of files) {
    const priceId = f.data.priceId
    const row = {
      slug: f.slug,
      title: (f.data.title as string) ?? f.slug,
      description: (f.data.description as string) ?? '',
      body: f.body,
      price_cents: (f.data.price as number) ?? 0,
      price_id:
        typeof priceId === 'string' && priceId !== 'null' && !priceId.startsWith('process.env.')
          ? priceId
          : null,
      tier: ((f.data.tier as string) ?? 'free') as 'free' | 'paid',
      tags: (f.data.tags as string[]) ?? [],
      download_url:
        typeof f.data.downloadUrl === 'string' && f.data.downloadUrl !== 'null'
          ? (f.data.downloadUrl as string)
          : null,
      published: true,
    }
    const { error } = await supabase
      .from('cms_resources')
      .upsert(row, { onConflict: 'slug' })
    if (error) console.error('resource', f.slug, error.message)
    else console.log('resource seeded', f.slug)
  }
}

async function seedGuides() {
  const files = readDir('guides')
  for (const f of files) {
    const row = {
      slug: f.slug,
      title: (f.data.title as string) ?? f.slug,
      description: (f.data.description as string) ?? '',
      body: f.body,
      hero_image: (f.data.heroImage as string) ?? '',
      tags: (f.data.tags as string[]) ?? [],
      reading_minutes: (f.data.readingMinutes as number) ?? 5,
      published: true,
    }
    const { error } = await supabase
      .from('cms_guides')
      .upsert(row, { onConflict: 'slug' })
    if (error) console.error('guide', f.slug, error.message)
    else console.log('guide seeded', f.slug)
  }
}

async function main() {
  await seedProjects()
  await seedResources()
  await seedGuides()
  console.log('done')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
