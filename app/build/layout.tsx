import type { Metadata } from 'next'
import Link from 'next/link'
import { Wordmark } from '@/components/brand/Wordmark'
import { Footer } from '@/components/brand/Footer'

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

export default function BuildLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-chalk text-ink">
      <header className="border-b border-slate/20">
        <nav className="mx-auto flex max-w-content items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="text-xl"
            aria-label="Build home"
          >
            <Wordmark variant="full" tone="deep" />
          </Link>
          <ul className="flex items-center gap-8 font-sans text-sm text-ink/80">
            <li>
              <Link href="/" className="transition-colors hover:text-ink">
                Home
              </Link>
            </li>
            <li>
              <Link href="/" className="transition-colors hover:text-ink">
                Resources
              </Link>
            </li>
            <li>
              <a
                href="https://bnzo.io"
                className="transition-colors hover:text-ink"
              >
                About
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <main>{children}</main>

      <Footer />
    </div>
  )
}
