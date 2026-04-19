import { MetadataRoute } from 'next'
import { getProjectSlugs, getProjectBySlug } from '@/lib/projects'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getProjectSlugs()

  const projectUrls: MetadataRoute.Sitemap = await Promise.all(
    slugs.map(async (slug) => {
      const project = await getProjectBySlug(slug)
      return {
        url: `https://lab.bnzo.io/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: project?.status === 'Live' ? 0.9 : 0.7,
      }
    }),
  )

  return [
    {
      url: 'https://lab.bnzo.io',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    ...projectUrls,
  ]
}
