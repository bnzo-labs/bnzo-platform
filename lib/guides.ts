import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { supabaseServer } from './supabase-server'
import type { GuideRow } from './cms-schemas'

export type Guide = {
  slug: string
  title: string
  description: string
  body: string
  heroImage: string
  tags: string[]
  readingMinutes: number
}

const CONTENT_DIR = path.join(process.cwd(), 'content', 'guides')

function rowToGuide(row: GuideRow): Guide {
  return {
    slug: row.slug,
    title: row.title,
    description: row.description,
    body: row.body,
    heroImage: row.hero_image,
    tags: row.tags,
    readingMinutes: row.reading_minutes,
  }
}

function parseFile(filename: string): Guide {
  const slug = filename.replace(/\.mdx$/, '')
  const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), 'utf8')
  const { data, content } = matter(raw)
  return {
    slug,
    title: (data.title as string) ?? slug,
    description: (data.description as string) ?? '',
    body: content.trim(),
    heroImage: (data.heroImage as string) ?? '',
    tags: (data.tags as string[]) ?? [],
    readingMinutes: (data.readingMinutes as number) ?? 5,
  }
}

function readMdxAll(): Guide[] {
  if (!fs.existsSync(CONTENT_DIR)) return []
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map(parseFile)
}

function readMdxOne(slug: string): Guide | null {
  const p = path.join(CONTENT_DIR, `${slug}.mdx`)
  if (!fs.existsSync(p)) return null
  return parseFile(`${slug}.mdx`)
}

export async function getAllGuides(): Promise<Guide[]> {
  try {
    const db = supabaseServer()
    const { data, error } = await db
      .from('cms_guides')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
    if (error) throw error
    if (data && data.length > 0) return (data as GuideRow[]).map(rowToGuide)
  } catch {
    // fall through to MDX
  }
  return readMdxAll()
}

export async function getGuideBySlug(slug: string): Promise<Guide | null> {
  try {
    const db = supabaseServer()
    const { data, error } = await db
      .from('cms_guides')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle()
    if (error) throw error
    if (data) return rowToGuide(data as GuideRow)
  } catch {
    // fall through
  }
  return readMdxOne(slug)
}
