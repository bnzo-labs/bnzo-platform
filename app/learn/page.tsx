import type { Metadata } from 'next'
import { ComingSoonHero } from '@/components/learn/ComingSoonHero'
import { GuidesPlaceholder } from '@/components/learn/GuidesPlaceholder'

export function generateMetadata(): Metadata {
  return {
    title: 'Learn to build with AI agents',
    description:
      'Guides and courses for developers shipping with AI agents. Early access list open.',
    alternates: { canonical: 'https://learn.bnzo.io' },
    openGraph: {
      title: 'Learn to build with AI agents — bnzo',
      description:
        'Guides and courses for developers shipping with AI agents. Early access list open.',
      url: 'https://learn.bnzo.io',
      siteName: 'bnzo Learn',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Learn to Build with AI Agents — bnzo',
      description: 'Guides and courses for developers shipping with AI agents. Early access open.',
    },
  }
}

export default function LearnPage() {
  return (
    <>
      <ComingSoonHero />
      <GuidesPlaceholder />
    </>
  )
}
