'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Wordmark } from './Wordmark'

interface NavLink {
  label: string
  href: string
  external?: boolean
}

interface SiteHeaderProps {
  tone?: 'dark' | 'light'
  navLinks?: NavLink[]
  cta?: { label: string; href: string; external?: boolean }
  enableHeroMorph?: boolean
  centerSlot?: React.ReactNode
}

export function SiteHeader({
  tone = 'dark',
  navLinks,
  cta,
  enableHeroMorph = false,
  centerSlot,
}: SiteHeaderProps) {
  const [mounted, setMounted] = useState(false)
  const [heroVisible, setHeroVisible] = useState(true)
  const [badgePulse, setBadgePulse] = useState(false)
  const pulseTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!enableHeroMorph) return
    const target = document.querySelector<HTMLElement>('[aria-labelledby="hero-heading"]')
    if (!target) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting
        setHeroVisible(visible)
        if (!visible) {
          setBadgePulse(true)
          if (pulseTimer.current) clearTimeout(pulseTimer.current)
          pulseTimer.current = setTimeout(() => setBadgePulse(false), 300)
        }
      },
      { threshold: 0 },
    )
    observer.observe(target)
    return () => {
      observer.disconnect()
      if (pulseTimer.current) clearTimeout(pulseTimer.current)
    }
  }, [enableHeroMorph])

  const isDark = tone === 'dark'
  const showBadge = enableHeroMorph && !heroVisible

  const bgBorder = isDark ? 'bg-ink/60 border-white/10' : 'bg-chalk/60 border-slate/15'
  const linkClass = isDark
    ? 'text-chalk/70 hover:text-chalk transition-colors duration-fast link-underline'
    : 'text-ink/70 hover:text-ink transition-colors duration-fast link-underline'
  const wordmarkTone = isDark ? 'bright' : 'deep'

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-md ${bgBorder} transition-opacity duration-200 ease-out ${mounted ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="mx-auto grid max-w-content grid-cols-[1fr_auto_1fr] items-center gap-4 px-gutter py-4">
        {/* Left: nav links */}
        <nav aria-label="Site navigation">
          {navLinks && navLinks.length > 0 && (
            <ul className="flex items-center gap-6 font-mono text-xs uppercase tracking-widest">
              {navLinks.map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a href={link.href} className={linkClass}>
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href} className={linkClass}>
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          )}
        </nav>

        {/* Center: Wordmark with hero morph badge */}
        <div className="relative flex items-center justify-center">
          <div
            className={`transition-opacity duration-200 ease-out ${showBadge ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
          >
            {centerSlot ?? (
              <Link href="/" aria-label="Home">
                <Wordmark variant="full" tone={wordmarkTone} className="text-lg" />
              </Link>
            )}
          </div>

          {enableHeroMorph && (
            <span
              aria-label="bnzo"
              className={`absolute rounded-md bg-lime px-2 py-1 font-mono text-sm font-bold text-ink transition-opacity duration-200 ease-out ${showBadge ? 'opacity-100' : 'pointer-events-none opacity-0'} ${badgePulse ? 'site-header-badge-pulse' : ''}`}
            >
              /b
            </span>
          )}
        </div>

        {/* Right: CTA */}
        <div className="flex items-center justify-end">
          {cta && (
            cta.external ? (
              <a
                href={cta.href}
                className={`font-mono text-xs uppercase tracking-widest active:scale-[0.97] ${linkClass}`}
              >
                {cta.label}
              </a>
            ) : (
              <Link
                href={cta.href}
                className={`font-mono text-xs uppercase tracking-widest active:scale-[0.97] ${linkClass}`}
              >
                {cta.label}
              </Link>
            )
          )}
        </div>
      </div>
    </header>
  )
}

export default SiteHeader
