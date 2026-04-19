import { ImageResponse } from 'next/og'

export const alt = 'Build — Developer Resources from bnzo'
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
        {/* Accent glow */}
        <div
          style={{
            position: 'absolute',
            top: '-40px',
            right: '-40px',
            width: '400px',
            height: '400px',
            background: `radial-gradient(circle, ${LIME}20, transparent 65%)`,
            borderRadius: '50%',
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
          build.bnzo.io
        </div>

        {/* b/ mark */}
        <div
          style={{
            position: 'absolute',
            top: '72px',
            right: '80px',
            fontFamily: 'monospace',
            fontSize: '48px',
            fontWeight: 700,
            color: LIME,
            opacity: 0.4,
          }}
        >
          b/
        </div>

        {/* Headline */}
        <div
          style={{
            fontFamily: 'sans-serif',
            fontSize: '72px',
            fontWeight: 700,
            color: CHALK,
            letterSpacing: '-0.04em',
            lineHeight: 0.95,
            marginBottom: '24px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div>Developer</div>
          <div style={{ display: 'flex' }}>
            <div>Resources</div>
            <div style={{ color: LIME }}>.</div>
          </div>
        </div>

        {/* Sub */}
        <div
          style={{
            fontFamily: 'sans-serif',
            fontSize: '24px',
            color: CHALK,
            opacity: 0.6,
          }}
        >
          Templates and starter kits from bnzo
        </div>
      </div>
    ),
    { ...size }
  )
}
