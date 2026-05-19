import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface WorkItem {
  slug: string
  client: string
  title: string
  outcome: string
  posterPath: string
  mp4Path: string
  webmPath: string
  href: string
  tags: string[]
}

const CONTENT_DIR = path.join(process.cwd(), 'content', 'work')

const SLUG_ORDER = [
  'cook-for-friends-mtl',
  'bonita-rituals',
  'jailbreak-live',
  'aimademedoit',
]

function parseWorkFile(filename: string): WorkItem {
  const slug = filename.replace(/\.mdx$/, '')
  const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), 'utf8')
  const { data } = matter(raw)

  return {
    slug: (data.slug as string) ?? slug,
    client: (data.client as string) ?? '',
    title: (data.title as string) ?? '',
    outcome: (data.outcome as string) ?? '',
    posterPath: (data.posterPath as string) ?? `/work/${slug}.jpg`,
    mp4Path: (data.mp4Path as string) ?? `/work/${slug}.mp4`,
    webmPath: (data.webmPath as string) ?? `/work/${slug}.webm`,
    href: (data.href as string) ?? '/lab',
    tags: (data.tags as string[]) ?? [],
  }
}

export async function getWorkItems(): Promise<WorkItem[]> {
  if (!fs.existsSync(CONTENT_DIR)) return []

  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith('.mdx'))

  const items = files.map(parseWorkFile)

  return SLUG_ORDER
    .map((slug) => items.find((item) => item.slug === slug))
    .filter((item): item is WorkItem => item !== undefined)
}
