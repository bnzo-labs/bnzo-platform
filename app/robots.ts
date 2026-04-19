import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: [
      'https://bnzo.io/sitemap.xml',
      'https://build.bnzo.io/sitemap.xml',
      'https://lab.bnzo.io/sitemap.xml',
      'https://learn.bnzo.io/sitemap.xml',
      'https://erick.bnzo.io/sitemap.xml',
    ],
  }
}
