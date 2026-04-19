import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Bnzo Studio — We build with agents.'
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
        {/* Grid decoration */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '480px',
            height: '480px',
            background: `radial-gradient(circle at top right, ${LIME}18, transparent 60%)`,
          }}
        />

        {/* Domain label */}
        <div
          style={{
            position: 'absolute',
            top: '80px',
            left: '80px',
            fontFamily: 'monospace',
            fontSize: '14px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: SLATE,
          }}
        >
          bnzo.io
        </div>

        {/* Wordmark */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '2px',
            marginBottom: '24px',
          }}
        >
          <span
            style={{
              fontFamily: 'sans-serif',
              fontSize: '96px',
              fontWeight: 700,
              color: CHALK,
              letterSpacing: '-0.04em',
              lineHeight: 1,
            }}
          >
            bnzo
          </span>
          <span
            style={{
              fontFamily: 'sans-serif',
              fontSize: '96px',
              fontWeight: 700,
              color: LIME,
              lineHeight: 1,
            }}
          >
            .
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontFamily: 'sans-serif',
            fontSize: '28px',
            color: CHALK,
            opacity: 0.65,
            letterSpacing: '-0.01em',
          }}
        >
          We build with agents.
        </div>
      </div>
    ),
    { ...size }
  )
}
