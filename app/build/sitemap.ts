import { MetadataRoute } from 'next'
import { getAllResources } from '@/lib/resources'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const resources = await getAllResources()

  const resourceUrls: MetadataRoute.Sitemap = resources.map((r) => ({
    url: `https://build.bnzo.io/${r.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: 'https://build.bnzo.io',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    ...resourceUrls,
  ]
}
