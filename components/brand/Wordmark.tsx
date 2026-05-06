import React from 'react'

interface WordmarkProps {
  variant: 'compact' | 'full'
  tone?: 'bright' | 'deep'
  className?: string
}

/**
 * Wordmark — bnzo brand identity component
 *
 * compact: "b/" in Geist Mono — used for favicons, nav icons, small surfaces
 * full:    "bnzo." in Syne with accent period — used in nav bars, footers, hero sections
 *
 * tone:
 *   bright (default) — lime period for dark backgrounds
 *   deep             — lime-deep period for light (chalk/white) backgrounds
 */
export function Wordmark({
  variant,
  tone = 'bright',
  className = '',
}: WordmarkProps) {
  if (variant === 'compact') {
    return (
      <span
        className={`font-mono font-bold tracking-tight ${className}`}
        aria-label="bnzo"
      >
        /b
      </span>
    )
  }

  const periodColor = tone === 'deep' ? 'text-lime-deep' : 'text-lime'

  return (
    <span
      className={`font-geist font-bold tracking-tighter ${className}`}
      aria-label="bnzo."
    >
      bnzo
      <span
        className={`${periodColor} font-syne`}
        aria-hidden="true"
      >
        .
      </span>
    </span>
  )
}

export default Wordmark
