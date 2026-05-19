import type { Metadata } from 'next'
import { CursorFollower } from '@/components/brand/CursorFollower'
import { Hero } from '@/components/home/Hero'
import { Pitch } from '@/components/home/Pitch'
import { WorkGrid } from '@/components/home/WorkGrid'
import { Capabilities } from '@/components/home/Capabilities'
import { Team } from '@/components/home/Team'
import { Process } from '@/components/home/Process'
import { FinalCTA } from '@/components/home/FinalCTA'
import { Footer } from '@/components/brand/Footer'
import { SiteHeader } from '@/components/brand/SiteHeader'
import { JsonLd } from '@/components/seo/JsonLd'
import { ScrollReveal } from '@/components/home/ScrollReveal'
import dynamic from 'next/dynamic'

const BackgroundAnimation = dynamic(() => import('@/components/home/BackgroundAnimation'), { ssr: false })

export const metadata: Metadata = {
  title: 'Bnzo Studio — Software shipped in weeks, not months.',
  description:
    'bnzo is the studio for founders who refuse to wait. AI agents in the build pipeline + senior engineers in the loop = production apps, SaaS, and automations shipped in weeks.',
  openGraph: {
    title: 'Bnzo Studio — Software shipped in weeks, not months.',
    description:
      'bnzo is the studio for founders who refuse to wait. Production apps, SaaS, and automations shipped in weeks.',
    url: '/',
    siteName: 'Bnzo Studio',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bnzo Studio — Software shipped in weeks, not months.',
    description:
      'bnzo is the studio for founders who refuse to wait. Production apps, SaaS, and automations shipped in weeks.',
  },
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Bnzo Studio',
  url: 'https://bnzo.io',
  logo: 'https://bnzo.io/logo.png',
  description:
    'bnzo is the studio for founders who refuse to wait. AI agents in the build pipeline + senior engineers in the loop = production apps, SaaS, and automations shipped in weeks.',
  founder: {
    '@type': 'Person',
    name: 'Erick Benzo',
    url: 'https://erick.bnzo.io',
  },
  sameAs: ['https://build.bnzo.io', 'https://lab.bnzo.io', 'https://learn.bnzo.io'],
}

export default function HomePage() {
  return (
    <main style={{ position: 'relative' }}>
      <CursorFollower />
      <BackgroundAnimation />
      <ScrollReveal />
      <JsonLd schema={organizationSchema} />
      <SiteHeader
        tone="dark"
        enableHeroMorph
        navLinks={[
          { label: 'Lab', href: 'https://lab.bnzo.io', external: true },
          { label: 'Learn', href: 'https://learn.bnzo.io', external: true },
          { label: 'Build', href: 'https://build.bnzo.io', external: true },
          { label: 'Founder', href: 'https://erick.bnzo.io', external: true },
        ]}
        cta={{ label: 'Book a call', href: 'https://cal.com/erick-bnzo/discovery', external: true }}
      />
      <Hero />
      <Pitch />
      <WorkGrid />
      <Capabilities />
      <Team />
      <Process />
      <FinalCTA />
      <Footer />
    </main>
  )
}
