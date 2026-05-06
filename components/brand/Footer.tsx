import React from 'react'
import { Wordmark } from './Wordmark'

const DOMAINS = [
  { label: 'Studio', href: 'https://bnzo.io', title: 'bnzo Studio — AI development agency' },
  { label: 'Build', href: 'https://build.bnzo.io', title: 'Build — templates and starter kits' },
  { label: 'Lab', href: 'https://lab.bnzo.io', title: 'Lab — case studies and experiments' },
  { label: 'Learn', href: 'https://learn.bnzo.io', title: 'Learn — AI agent education' },
  { label: 'Founder', href: 'https://erick.bnzo.io', title: 'Erick Benzo — founder portfolio' },
] as const

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const GitHubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
)

const SOCIAL = [
  { label: 'X / Twitter', href: 'https://x.com/bnzostudio', Icon: XIcon },
  { label: 'GitHub', href: 'https://github.com/bnzostudio', Icon: GitHubIcon },
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
      className="border-t border-slate/20 backdrop-blur-md text-chalk"
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
              {SOCIAL.map(({ label, href, Icon }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="inline-flex items-center gap-2 text-sm text-chalk/70 transition-colors duration-fast hover:text-lime"
                  >
                    <Icon />
                    <span>{label}</span>
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
