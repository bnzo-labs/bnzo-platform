import React from 'react'
import { Wordmark } from './Wordmark'

const DOMAINS = [
  { label: 'Studio', href: 'https://bnzo.io', title: 'bnzo Studio — AI development agency' },
  { label: 'Build', href: 'https://build.bnzo.io', title: 'Build — templates and starter kits' },
  { label: 'Lab', href: 'https://lab.bnzo.io', title: 'Lab — case studies and experiments' },
  { label: 'Learn', href: 'https://learn.bnzo.io', title: 'Learn — AI agent education' },
  { label: 'Founder', href: 'https://erick.bnzo.io', title: 'Erick Benzo — founder portfolio' },
] as const

const SOCIAL = [
  { label: 'X / Twitter', href: 'https://x.com/bnzostudio' },
  { label: 'GitHub', href: 'https://github.com/bnzostudio' },
] as const

/**
 * Footer — shared across all 5 bnzo domains
 *
 * Contains:
 * - Wordmark (full variant)
 * - Cross-domain navigation links
 * - Social links
 * - Copyright line
 */
export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      className="border-t border-slate/20 bg-ink text-chalk"
      role="contentinfo"
    >
      <div className="mx-auto max-w-content px-gutter py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">

          {/* Brand */}
          <div className="flex flex-col gap-3">
            <Wordmark variant="full" className="text-xl" />
            <p className="text-sm text-slate max-w-xs">
              We build with agents. We teach how.
            </p>
          </div>

          {/* Domain Links */}
          <nav aria-label="bnzo properties">
            <p className="mb-3 text-xs font-mono uppercase tracking-widest text-slate">
              Properties
            </p>
            <ul className="flex flex-col gap-2">
              {DOMAINS.map(({ label, href, title }) => (
                <li key={href}>
                  <a
                    href={href}
                    title={title}
                    className="text-sm text-chalk/70 transition-colors duration-fast hover:text-lime"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Social Links */}
          <nav aria-label="Social links">
            <p className="mb-3 text-xs font-mono uppercase tracking-widest text-slate">
              Social
            </p>
            <ul className="flex flex-col gap-2">
              {SOCIAL.map(({ label, href }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-chalk/70 transition-colors duration-fast hover:text-lime"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col gap-2 border-t border-slate/20 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate">
            © {year} Bnzo Studio. All rights reserved.
          </p>
          <p className="font-mono text-xs text-slate/60">
            built with agents
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
