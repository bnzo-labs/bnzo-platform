import type { Metadata } from 'next'
import { Footer } from '@/components/brand/Footer'
import { SiteHeader } from '@/components/brand/SiteHeader'
import { ScrollReveal } from '@/components/home/ScrollReveal'

export const metadata: Metadata = {
  metadataBase: new URL('https://build.bnzo.io'),
  title: {
    default: 'Build — bnzo',
    template: '%s | Build · bnzo',
  },
  description:
    'Developer resources, templates, and starter kits from bnzo. Ship multi-agent, multi-domain products faster.',
  openGraph: {
    title: 'Build — bnzo',
    description: 'Developer resources and starter kits from bnzo.',
    url: 'https://build.bnzo.io',
    siteName: 'bnzo Build',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Build — bnzo',
    description: 'Developer resources and starter kits from bnzo.',
  },
}

const buildNav = [
  { label: 'Resources', href: '/' },
  { label: 'About', href: 'https://bnzo.io', external: true },
]

export default function BuildLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-chalk text-ink">
      <ScrollReveal />
      <SiteHeader tone="light" navLinks={buildNav} />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
