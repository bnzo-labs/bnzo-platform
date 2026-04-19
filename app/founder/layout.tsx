import type { Metadata } from 'next'
import Link from 'next/link'
import { Footer } from '@/components/brand/Footer'

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

export default function FounderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-ink text-chalk font-sans antialiased">
      <header className="sticky top-0 z-40 border-b border-slate/15 bg-ink/80 backdrop-blur">
        <nav
          aria-label="Founder navigation"
          className="mx-auto flex max-w-content items-center justify-between px-gutter py-5"
        >
          <Link
            href="#top"
            className="font-geist text-lg font-bold tracking-tight transition-colors duration-fast hover:text-lime"
          >
            erick<span className="text-lime">.</span>
          </Link>
          <ul className="flex items-center gap-6 text-sm font-mono uppercase tracking-widest text-chalk/70">
            <li>
              <a
                href="#work"
                className="transition-colors duration-fast hover:text-lime"
              >
                Work
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className="transition-colors duration-fast hover:text-lime"
              >
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </header>
      <main id="top">{children}</main>
      <Footer />
    </div>
  )
}
