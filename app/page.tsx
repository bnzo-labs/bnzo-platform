import type { Metadata } from 'next'
import { Hero } from '@/components/home/Hero'
import { Services } from '@/components/home/Services'
import { WorkPreview } from '@/components/home/WorkPreview'
import { Footer } from '@/components/brand/Footer'
import { JsonLd } from '@/components/seo/JsonLd'

export const metadata: Metadata = {
  title: 'Bnzo Studio — We build with agents. We teach how.',
  description:
    'We ship production software with AI agents. Apps, SaaS, AI automations, and education — from Bnzo Studio.',
  openGraph: {
    title: 'Bnzo Studio — We build with agents. We teach how.',
    description:
      'We ship production software with AI agents. Apps, SaaS, AI automations, and education.',
    url: '/',
    siteName: 'Bnzo Studio',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bnzo Studio — We build with agents. We teach how.',
    description:
      'We ship production software with AI agents. Apps, SaaS, AI automations, and education.',
  },
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Bnzo Studio',
  url: 'https://bnzo.io',
  logo: 'https://bnzo.io/logo.png',
  description:
    'We ship production software with AI agents. Apps, SaaS, AI automations, and education.',
  founder: {
    '@type': 'Person',
    name: 'Erick Benzo',
    url: 'https://erick.bnzo.io',
  },
  sameAs: ['https://build.bnzo.io', 'https://lab.bnzo.io', 'https://learn.bnzo.io'],
}

export default function HomePage() {
  return (
    <main>
      <JsonLd schema={organizationSchema} />
      <Hero />
      <Services />
      <WorkPreview />
      <Footer />
    </main>
  )
}
