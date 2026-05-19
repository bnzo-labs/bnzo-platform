'use client'

import { useState, useEffect, useRef } from 'react'

export function FinalCTA() {
  const [inView, setInView] = useState(false)
  const [calLoaded, setCalLoaded] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      aria-labelledby="final-cta-heading"
      className="relative overflow-hidden bg-ink"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 30%, rgba(200,255,0,0.10) 0%, transparent 65%)',
        }}
      />
      <div className="relative mx-auto max-w-content px-gutter py-section">
        <h2
          id="final-cta-heading"
          className="font-geist font-bold tracking-tighter text-[length:var(--text-2xl)] text-chalk"
          data-reveal
          data-reveal-delay="0"
        >
          Tell us what you need to ship<span className="text-lime">.</span>
        </h2>
        <p className="font-sans text-slate mt-4" data-reveal data-reveal-delay="80">
          20 minutes. No pitch. We figure out if we can help.
        </p>
        <div
          ref={sectionRef}
          className="relative mt-10 w-full min-h-[600px] rounded-sm overflow-hidden bg-white/[0.03]"
        >
          {(!inView || !calLoaded) && (
            <div
              className="absolute inset-0 animate-pulse bg-white/[0.02]"
              aria-hidden
            />
          )}
          {inView && (
            <iframe
              src="https://cal.com/erick-bnzo/discovery?theme=dark"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                border: 'none',
              }}
              allow="camera; microphone"
              title="Book a discovery call"
              onLoad={() => setCalLoaded(true)}
            />
          )}
        </div>
        <p className="font-mono text-xs text-slate text-center mt-6">
          Or email{' '}
          <a
            href="mailto:founder@bnzo.io"
            className="text-chalk/60 hover:text-chalk transition duration-fast"
          >
            founder@bnzo.io
          </a>
        </p>
      </div>
    </section>
  )
}

export default FinalCTA
