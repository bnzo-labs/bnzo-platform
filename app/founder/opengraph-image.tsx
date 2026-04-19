import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Erick Benzo — Fullstack Developer & Founder'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const INK = '#0C0C0C'
const CHALK = '#F5F4EF'
const LIME = '#C8FF00'
const SLATE = '#6B6868'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: INK,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          padding: '80px',
          position: 'relative',
        }}
      >
        {/* Subtle grid */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `linear-gradient(${CHALK}06 1px, transparent 1px), linear-gradient(90deg, ${CHALK}06 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Domain label */}
        <div
          style={{
            position: 'absolute',
            top: '80px',
            left: '80px',
            fontFamily: 'monospace',
            fontSize: '13px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: SLATE,
          }}
        >
          erick.bnzo.io
        </div>

        {/* Name */}
        <div
          style={{
            fontFamily: 'sans-serif',
            fontSize: '80px',
            fontWeight: 700,
            color: CHALK,
            letterSpacing: '-0.04em',
            lineHeight: 0.95,
            marginBottom: '24px',
          }}
        >
          Erick
          <br />
          Benzo
          <span style={{ color: LIME }}>.</span>
        </div>

        {/* Role */}
        <div
          style={{
            fontFamily: 'sans-serif',
            fontSize: '24px',
            color: CHALK,
            opacity: 0.6,
          }}
        >
          Fullstack Developer & Founder — bnzo Studio
        </div>
      </div>
    ),
    { ...size }
  )
}
