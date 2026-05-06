import type { Metadata } from 'next'
import { Footer } from '@/components/brand/Footer'
import { SiteHeader } from '@/components/brand/SiteHeader'
import { ScrollReveal } from '@/components/home/ScrollReveal'

export const metadata: Metadata = {
  metadataBase: new URL('https://learn.bnzo.io'),
  title: {
    default: 'Learn — bnzo',
    template: '%s | bnzo Learn',
  },
  description: 'Learn to build with AI agents. Guides and courses for developers shipping real products.',
  openGraph: {
    title: 'Learn — bnzo',
    description: 'Learn to build with AI agents. Guides and courses launching soon.',
    url: 'https://learn.bnzo.io',
    siteName: 'bnzo Learn',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Learn to Build with AI Agents — bnzo',
    description: 'Guides and courses for developers shipping with AI agents.',
  },
}

const learnNav = [
  { label: 'Home', href: 'https://bnzo.io', external: true },
  { label: 'Guides', href: '#guides-heading' },
]

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-chalk text-ink flex flex-col">
      <ScrollReveal />
      <SiteHeader
        tone="light"
        navLinks={learnNav}
        cta={{ label: 'Early Access', href: '#learn-email' }}
      />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
