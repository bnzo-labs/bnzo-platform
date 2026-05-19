import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { supabaseServer } from './supabase-server'
import type { ProjectRow } from './cms-schemas'

export type ProjectStatus = 'Live' | 'Beta' | 'In Progress'

export interface AgentEntry {
  name: string
  role: string
}

export interface Project {
  slug: string
  title: string
  description: string
  status: ProjectStatus
  heroImage: string
  url?: string
  problem: string
  architecture: {
    stack: string[]
    decisions: string[]
  }
  agents: AgentEntry[]
  result: {
    metrics: string[]
    outcomes: string[]
  }
  learnings: {
    went_well: string[]
    didnt: string[]
  }
  body?: string
}

const CONTENT_DIR = path.join(process.cwd(), 'content', 'projects')
const IMAGE_DIR = path.join(process.cwd(), 'public', 'images', 'lab')
const IMAGE_EXTS = ['png', 'jpg', 'jpeg', 'webp', 'PNG', 'JPG', 'JPEG']

export function getProjectImageSrc(slug: string): string | null {
  for (const ext of IMAGE_EXTS) {
    if (fs.existsSync(path.join(IMAGE_DIR, `${slug}.${ext}`))) {
      return `/images/lab/${slug}.${ext}`
    }
  }
  return null
}

function normalizeAgents(raw: unknown[]): AgentEntry[] {
  return raw.map((a) => {
    if (typeof a === 'string') return { name: a, role: 'Development' }
    if (a && typeof a === 'object' && 'name' in a) {
      const entry = a as { name: string; role?: string }
      return { name: entry.name, role: entry.role ?? 'Development' }
    }
    return { name: String(a), role: 'Development' }
  })
}

function rowToProject(row: ProjectRow): Project {
  return {
    slug: row.slug,
    title: row.title,
    description: row.description,
    status: row.status,
    heroImage: row.hero_image,
    problem: row.problem,
    architecture: row.architecture,
    agents: normalizeAgents(row.agents),
    result: row.result,
    learnings: row.learnings,
    body: row.body,
  }
}

function parseProjectFile(filename: string): Project {
  const slug = filename.replace(/\.mdx$/, '')
  const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), 'utf8')
  const { data, content } = matter(raw)

  return {
    slug,
    title: data.title as string,
    description: data.description as string,
    status: data.status as ProjectStatus,
    heroImage: data.heroImage as string,
    url: data.url as string | undefined,
    problem: data.problem as string,
    architecture: {
      stack: (data.architecture?.stack as string[]) ?? [],
      decisions: (data.architecture?.decisions as string[]) ?? [],
    },
    agents: normalizeAgents((data.agents as unknown[]) ?? []),
    result: {
      metrics: (data.result?.metrics as string[]) ?? [],
      outcomes: (data.result?.outcomes as string[]) ?? [],
    },
    learnings: {
      went_well: (data.learnings?.went_well as string[]) ?? [],
      didnt: (data.learnings?.didnt as string[]) ?? [],
    },
    body: content.trim(),
  }
}

function readMdxAll(): Project[] {
  if (!fs.existsSync(CONTENT_DIR)) return []
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map(parseProjectFile)
}

function readMdxOne(slug: string): Project | null {
  const p = path.join(CONTENT_DIR, `${slug}.mdx`)
  if (!fs.existsSync(p)) return null
  return parseProjectFile(`${slug}.mdx`)
}

export async function getProjects(): Promise<Project[]> {
  try {
    const db = supabaseServer()
    const { data, error } = await db
      .from('cms_projects')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
    if (error) throw error
    if (data && data.length > 0) return (data as ProjectRow[]).map(rowToProject)
  } catch {
    // fall through
  }
  return readMdxAll()
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const db = supabaseServer()
    const { data, error } = await db
      .from('cms_projects')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle()
    if (error) throw error
    if (data) return rowToProject(data as ProjectRow)
  } catch {
    // fall through
  }
  return readMdxOne(slug)
}

export async function getProjectSlugs(): Promise<string[]> {
  const projects = await getProjects()
  return projects.map((p) => p.slug)
}

export async function getAdjacentProjects(slug: string): Promise<{
  prev: Project | null
  next: Project | null
}> {
  const all = await getProjects()
  const idx = all.findIndex((p) => p.slug === slug)
  if (idx === -1) return { prev: null, next: null }
  return {
    prev: idx > 0 ? all[idx - 1] : null,
    next: idx < all.length - 1 ? all[idx + 1] : null,
  }
}
