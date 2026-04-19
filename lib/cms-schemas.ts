import { z } from 'zod'

export const ContentTypes = ['projects', 'resources', 'guides'] as const
export type ContentType = (typeof ContentTypes)[number]

export const CONTENT_TABLE: Record<ContentType, string> = {
  projects: 'cms_projects',
  resources: 'cms_resources',
  guides: 'cms_guides',
}

const slugRe = /^[a-z0-9][a-z0-9-]*$/

export const projectSchema = z.object({
  slug: z.string().regex(slugRe, 'lowercase, digits, hyphens only'),
  title: z.string().min(1),
  description: z.string().default(''),
  body: z.string().default(''),
  status: z.enum(['Live', 'Beta', 'In Progress']).default('In Progress'),
  hero_image: z.string().default(''),
  problem: z.string().default(''),
  architecture: z
    .object({
      stack: z.array(z.string()).default([]),
      decisions: z.array(z.string()).default([]),
    })
    .default({ stack: [], decisions: [] }),
  agents: z.array(z.string()).default([]),
  result: z
    .object({
      metrics: z.array(z.string()).default([]),
      outcomes: z.array(z.string()).default([]),
    })
    .default({ metrics: [], outcomes: [] }),
  learnings: z
    .object({
      went_well: z.array(z.string()).default([]),
      didnt: z.array(z.string()).default([]),
    })
    .default({ went_well: [], didnt: [] }),
  published: z.boolean().default(false),
})

export const resourceSchema = z.object({
  slug: z.string().regex(slugRe),
  title: z.string().min(1),
  description: z.string().default(''),
  body: z.string().default(''),
  price_cents: z.number().int().nonnegative().default(0),
  price_id: z.string().nullable().default(null),
  tier: z.enum(['free', 'paid']).default('free'),
  tags: z.array(z.string()).default([]),
  download_url: z.string().nullable().default(null),
  published: z.boolean().default(false),
})

export const guideSchema = z.object({
  slug: z.string().regex(slugRe),
  title: z.string().min(1),
  description: z.string().default(''),
  body: z.string().default(''),
  hero_image: z.string().default(''),
  tags: z.array(z.string()).default([]),
  reading_minutes: z.number().int().positive().default(5),
  published: z.boolean().default(false),
})

export const SCHEMAS = {
  projects: projectSchema,
  resources: resourceSchema,
  guides: guideSchema,
} as const

export type ProjectRow = z.infer<typeof projectSchema> & {
  id: string
  created_at: string
  updated_at: string
}
export type ResourceRow = z.infer<typeof resourceSchema> & {
  id: string
  created_at: string
  updated_at: string
}
export type GuideRow = z.infer<typeof guideSchema> & {
  id: string
  created_at: string
  updated_at: string
}

export function isContentType(s: string): s is ContentType {
  return (ContentTypes as readonly string[]).includes(s)
}
