import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { supabaseServer } from './supabase'
import type { ResourceRow } from './cms-schemas'

export type Resource = {
  slug: string
  title: string
  description: string
  price: number
  priceId?: string
  tier: 'free' | 'paid'
  tags: string[]
  downloadUrl?: string
  content: string
}

const CONTENT_DIR = path.join(process.cwd(), 'content', 'resources')

function rowToResource(row: ResourceRow): Resource {
  return {
    slug: row.slug,
    title: row.title,
    description: row.description,
    price: row.price_cents,
    priceId: row.price_id ?? undefined,
    tier: row.tier,
    tags: row.tags,
    downloadUrl: row.download_url ?? undefined,
    content: row.body,
  }
}

function parseResourceFile(filename: string): Resource {
  const slug = filename.replace(/\.mdx$/, '')
  const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), 'utf8')
  const { data, content } = matter(raw)

  return {
    slug,
    title: data.title as string,
    description: data.description as string,
    price: data.price as number,
    priceId: data.priceId && data.priceId !== 'null' ? (data.priceId as string) : undefined,
    tier: data.tier as 'free' | 'paid',
    tags: (data.tags as string[]) ?? [],
    downloadUrl: data.downloadUrl && data.downloadUrl !== 'null' ? (data.downloadUrl as string) : undefined,
    content: content.trim(),
  }
}

function readMdxAll(): Resource[] {
  if (!fs.existsSync(CONTENT_DIR)) return []
  return fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.mdx')).map(parseResourceFile)
}

function readMdxOne(slug: string): Resource | null {
  const p = path.join(CONTENT_DIR, `${slug}.mdx`)
  if (!fs.existsSync(p)) return null
  return parseResourceFile(`${slug}.mdx`)
}

export async function getAllResources(): Promise<Resource[]> {
  try {
    const db = supabaseServer()
    const { data, error } = await db
      .from('cms_resources')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
    if (error) throw error
    if (data && data.length > 0) return (data as ResourceRow[]).map(rowToResource)
  } catch {
    // fall through
  }
  return readMdxAll()
}

export async function getResourceBySlug(slug: string): Promise<Resource | null> {
  try {
    const db = supabaseServer()
    const { data, error } = await db
      .from('cms_resources')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle()
    if (error) throw error
    if (data) return rowToResource(data as ResourceRow)
  } catch {
    // fall through
  }
  return readMdxOne(slug)
}
