import type { Metadata } from 'next'
import Link from 'next/link'
import { Wordmark } from '@/components/brand/Wordmark'
import { Footer } from '@/components/brand/Footer'

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

export default function LabLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ink text-chalk flex flex-col">
      <header className="border-b border-slate/20">
        <div className="mx-auto max-w-content px-gutter py-5 flex items-center justify-between">
          <Link href="/" aria-label="lab.bnzo.io home" className="transition-opacity hover:opacity-80">
            <Wordmark variant="full" className="text-lg" />
          </Link>
          <nav aria-label="Lab navigation">
            <ul className="flex items-center gap-6 text-sm font-mono uppercase tracking-widest">
              <li>
                <a
                  href="https://bnzo.io"
                  className="text-chalk/70 transition-colors hover:text-lime"
                >
                  Home
                </a>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-chalk/70 transition-colors hover:text-lime"
                >
                  Projects
                </Link>
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
