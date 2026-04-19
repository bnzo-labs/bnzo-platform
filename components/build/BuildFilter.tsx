import Link from 'next/link'

type Filter = 'all' | 'free' | 'paid'

interface BuildFilterProps {
  current: Filter
}

const OPTIONS: { label: string; value: Filter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Free', value: 'free' },
  { label: 'Premium', value: 'paid' },
]

export function BuildFilter({ current }: BuildFilterProps) {
  return (
    <div
      role="group"
      aria-label="Filter resources"
      className="flex gap-1 rounded-md border border-slate/30 p-1 font-mono text-xs uppercase tracking-wider"
    >
      {OPTIONS.map((opt) => {
        const active = opt.value === current
        const href = opt.value === 'all' ? '/' : `/?filter=${opt.value}`
        return (
          <Link
            key={opt.value}
            href={href}
            aria-pressed={active}
            className={
              active
                ? 'rounded bg-ink px-3 py-1.5 text-chalk'
                : 'rounded px-3 py-1.5 text-ink/70 transition-colors hover:text-ink'
            }
          >
            {opt.label}
          </Link>
        )
      })}
    </div>
  )
}

export default BuildFilter
