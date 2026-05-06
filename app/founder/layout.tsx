import type { Metadata } from 'next'
import { Footer } from '@/components/brand/Footer'
import { SiteHeader } from '@/components/brand/SiteHeader'
import { ScrollReveal } from '@/components/home/ScrollReveal'

export const metadata: Metadata = {
  metadataBase: new URL('https://erick.bnzo.io'),
  title: {
    default: 'Erick Benzo — Founder & Fullstack Developer',
    template: '%s | Erick Benzo',
  },
  description:
    '14 years building the web. Now building with AI agents — and documenting it in public.',
  openGraph: {
    title: 'Erick Benzo — Founder & Fullstack Developer',
    description:
      '14 years building the web. Now building with AI agents — and documenting it in public.',
    url: 'https://erick.bnzo.io',
    siteName: 'Erick Benzo',
    type: 'profile',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Erick Benzo — Founder & Fullstack Developer',
    description: '14 years building the web. Now building with AI agents — in public.',
  },
}

const founderNav = [
  { label: 'Work', href: '#work' },
  { label: 'Contact', href: '#contact' },
]

const FounderWordmark = (
  <a
    href="#top"
    className="font-geist text-lg font-bold tracking-tight transition-colors duration-fast hover:text-lime"
  >
    erick<span className="text-lime">.</span>
  </a>
)

export default function FounderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-ink text-chalk font-sans antialiased">
      <ScrollReveal />
      <SiteHeader
        tone="dark"
        navLinks={founderNav}
        centerSlot={FounderWordmark}
      />
      <main id="top">{children}</main>
      <Footer />
    </div>
  )
}
