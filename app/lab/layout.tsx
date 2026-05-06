import type { Metadata } from 'next'
import { Footer } from '@/components/brand/Footer'
import { SiteHeader } from '@/components/brand/SiteHeader'
import { ScrollReveal } from '@/components/home/ScrollReveal'

export const metadata: Metadata = {
  metadataBase: new URL('https://lab.bnzo.io'),
  title: {
    default: 'Lab — bnzo',
    template: '%s | bnzo Lab',
  },
  description: 'Case studies and experiments from the bnzo lab. Agent-built products with honest retrospectives.',
  openGraph: {
    title: 'Lab — bnzo',
    description: 'Case studies and experiments from the bnzo lab.',
    url: 'https://lab.bnzo.io',
    siteName: 'bnzo Lab',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lab — bnzo',
    description: 'Case studies and experiments from the bnzo lab.',
  },
}

const labNav = [
  { label: 'Projects', href: '/' },
  { label: 'Home', href: 'https://bnzo.io', external: true },
]

export default function LabLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ink text-chalk flex flex-col">
      <ScrollReveal />
      <SiteHeader tone="dark" navLinks={labNav} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
