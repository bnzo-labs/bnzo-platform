import type { Metadata } from 'next'
import { Footer } from '@/components/brand/Footer'
import { SiteHeader } from '@/components/brand/SiteHeader'
import { ScrollReveal } from '@/components/home/ScrollReveal'
import LabBubblesCanvas from '@/components/lab/LabBubblesCanvas'

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
    <div className="relative min-h-screen bg-ink text-chalk flex flex-col">
      <ScrollReveal />
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <LabBubblesCanvas />
      </div>
      <div className="relative z-10 flex flex-1 flex-col">
        <SiteHeader tone="dark" navLinks={labNav} />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  )
}
