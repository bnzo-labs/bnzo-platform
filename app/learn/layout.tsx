import type { Metadata } from 'next'
import Link from 'next/link'
import { Wordmark } from '@/components/brand/Wordmark'
import { Footer } from '@/components/brand/Footer'

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

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-chalk text-ink flex flex-col">
      <header className="border-b border-slate/20">
        <div className="mx-auto max-w-content px-gutter py-5 flex items-center justify-between">
          <Link
            href="/"
            aria-label="learn.bnzo.io home"
            className="transition-opacity hover:opacity-80"
          >
            <Wordmark variant="full" tone="deep" className="text-lg" />
          </Link>
          <nav aria-label="Learn navigation">
            <ul className="flex items-center gap-6 text-sm font-mono uppercase tracking-widest">
              <li>
                <a
                  href="https://bnzo.io"
                  className="text-ink/70 transition-colors hover:text-ink"
                >
                  Home
                </a>
              </li>
              <li>
                <span
                  aria-disabled="true"
                  title="Coming soon"
                  className="cursor-not-allowed text-slate/60"
                >
                  Guides
                </span>
              </li>
              <li>
                <span
                  aria-disabled="true"
                  title="Coming soon"
                  className="cursor-not-allowed text-slate/60"
                >
                  Courses
                </span>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
