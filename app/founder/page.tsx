import type { Metadata } from 'next'
import { AboutHero } from '@/components/founder/AboutHero'
import { SelectedWork } from '@/components/founder/SelectedWork'
import { Skills } from '@/components/founder/Skills'
import { Contact } from '@/components/founder/Contact'
import { JsonLd } from '@/components/seo/JsonLd'

export function generateMetadata(): Metadata {
  return {
    title: 'Erick Benzo — Founder & Fullstack Developer',
    description:
      '14 years of fullstack. Now building products with AI agents — in public.',
    alternates: { canonical: 'https://erick.bnzo.io' },
    openGraph: {
      title: 'Erick Benzo — Founder & Fullstack Developer',
      description:
        '14 years of fullstack. Now building products with AI agents — in public.',
      url: 'https://erick.bnzo.io',
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Erick Benzo — Founder & Fullstack Developer',
      description:
        '14 years of fullstack. Now building products with AI agents — in public.',
    },
  }
}

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Erick Benzo',
  url: 'https://erick.bnzo.io',
  jobTitle: 'Founder & Fullstack Developer',
  worksFor: {
    '@type': 'Organization',
    name: 'Bnzo Studio',
    url: 'https://bnzo.io',
  },
  description:
    '14 years of fullstack development. Building production software with AI agents — and documenting it in public.',
  sameAs: ['https://bnzo.io'],
}

export default function FounderPage() {
  return (
    <>
      <JsonLd schema={personSchema} />
      <AboutHero />
      <SelectedWork />
      <Skills />
      <Contact />
    </>
  )
}
