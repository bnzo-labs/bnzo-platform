import Link from 'next/link'
import type { Resource } from '@/lib/resources'

interface ResourceCardProps {
  resource: Resource
}

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(0)}`
}

export function ResourceCard({ resource }: ResourceCardProps) {
  const isFree = resource.tier === 'free'
  const cta = isFree ? 'Download' : 'Purchase'

  return (
    <Link
      href={`/${resource.slug}`}
      className="group relative flex flex-col justify-between rounded-lg border border-slate/30 bg-black/[0.04] p-6 transition-colors duration-normal ease-out-expo hover:border-lime-deep"
    >
      <div>
        <div className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-slate">
          <span>{isFree ? 'Free' : 'Premium'}</span>
          <span aria-hidden="true">·</span>
          <span>{resource.tags[0]}</span>
        </div>
        <h3 className="font-geist text-xl font-bold leading-tight tracking-tight text-ink">
          {resource.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-ink/70">
          {resource.description}
        </p>
      </div>

      <div className="mt-6 flex items-baseline justify-between">
        <span className="font-geist text-2xl font-bold text-ink">
          {isFree ? 'Free' : formatPrice(resource.price)}
        </span>
        <span className="font-mono text-xs uppercase tracking-wider text-ink transition-colors group-hover:text-lime-deep">
          {cta} →
        </span>
      </div>
    </Link>
  )
}

export default ResourceCard
