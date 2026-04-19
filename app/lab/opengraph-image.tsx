import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'bnzo Lab — Case Studies & Experiments'
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
        {/* Corner accent */}
        <div
          style={{
            position: 'absolute',
            bottom: '0',
            right: '0',
            width: '360px',
            height: '360px',
            background: `conic-gradient(from 180deg at 100% 100%, ${LIME}30, transparent 40%)`,
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
          lab.bnzo.io
        </div>

        {/* Lab index */}
        <div
          style={{
            position: 'absolute',
            top: '78px',
            right: '80px',
            fontFamily: 'monospace',
            fontSize: '13px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: LIME,
          }}
        >
          experiments
        </div>

        {/* Headline */}
        <div
          style={{
            fontFamily: 'sans-serif',
            fontSize: '76px',
            fontWeight: 700,
            color: CHALK,
            letterSpacing: '-0.04em',
            lineHeight: 0.95,
            marginBottom: '24px',
          }}
        >
          Case
          <br />
          Studies
          <span style={{ color: LIME }}>.</span>
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
          Agent-built products with honest retrospectives
        </div>
      </div>
    ),
    { ...size }
  )
}
