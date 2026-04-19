import { ImageResponse } from 'next/og'
import { getProjectBySlug } from '@/lib/projects'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const INK = '#0C0C0C'
const CHALK = '#F5F4EF'
const LIME = '#C8FF00'
const SLATE = '#6B6868'

type StatusColor = { bg: string; text: string }
const STATUS_COLORS: Record<string, StatusColor> = {
  Live:        { bg: LIME,    text: INK },
  Beta:        { bg: '#3B82F6', text: CHALK },
  'In Progress': { bg: SLATE,  text: CHALK },
}

export async function generateImageMetadata({
  params,
}: {
  params: { slug: string }
}) {
  const project = await getProjectBySlug(params.slug)
  return [
    {
      contentType: 'image/png',
      size,
      id: params.slug,
      alt: project ? `${project.title} — bnzo Lab` : 'bnzo Lab',
    },
  ]
}

export default async function Image({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug)
  const title = project?.title ?? 'Project'
  const description = project?.description ?? ''
  const status = project?.status ?? 'In Progress'
  const statusColor = STATUS_COLORS[status] ?? STATUS_COLORS['In Progress']

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
        {/* Domain label */}
        <div
          style={{
            position: 'absolute',
            top: '80px',
            left: '80px',
            fontFamily: 'monospace',
            fontSize: '12px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: SLATE,
          }}
        >
          lab.bnzo.io / case study
        </div>

        {/* Status badge */}
        <div
          style={{
            position: 'absolute',
            top: '72px',
            right: '80px',
            background: statusColor.bg,
            color: statusColor.text,
            fontFamily: 'monospace',
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            padding: '6px 14px',
            borderRadius: '4px',
          }}
        >
          {status}
        </div>

        {/* Title */}
        <div
          style={{
            fontFamily: 'sans-serif',
            fontSize: title.length > 20 ? '60px' : '76px',
            fontWeight: 700,
            color: CHALK,
            letterSpacing: '-0.04em',
            lineHeight: 0.95,
            marginBottom: '20px',
            maxWidth: '900px',
          }}
        >
          {title}
          <span style={{ color: LIME }}>.</span>
        </div>

        {/* Description */}
        {description ? (
          <div
            style={{
              fontFamily: 'sans-serif',
              fontSize: '22px',
              color: CHALK,
              opacity: 0.6,
              maxWidth: '800px',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {description}
          </div>
        ) : null}
      </div>
    ),
    { ...size }
  )
}
