import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Learn to Build with AI Agents — bnzo'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const CHALK = '#F5F4EF'
const INK = '#0C0C0C'
const LIME = '#C8FF00'
const SLATE = '#6B6868'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: CHALK,
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
        {/* Accent line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '80px',
            width: '4px',
            height: '100%',
            background: LIME,
          }}
        />

        {/* Domain label */}
        <div
          style={{
            position: 'absolute',
            top: '80px',
            left: '112px',
            fontFamily: 'monospace',
            fontSize: '13px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: SLATE,
          }}
        >
          learn.bnzo.io
        </div>

        {/* Headline */}
        <div
          style={{
            fontFamily: 'sans-serif',
            fontSize: '64px',
            fontWeight: 700,
            color: INK,
            letterSpacing: '-0.04em',
            lineHeight: 0.95,
            marginBottom: '24px',
            paddingLeft: '32px',
          }}
        >
          Learn to Build
          <br />
          <span>with AI Agents</span>
          <span style={{ color: LIME }}>.</span>
        </div>

        {/* Sub */}
        <div
          style={{
            fontFamily: 'sans-serif',
            fontSize: '22px',
            color: INK,
            opacity: 0.6,
            paddingLeft: '32px',
          }}
        >
          Guides and courses for developers shipping real products
        </div>
      </div>
    ),
    { ...size }
  )
}
