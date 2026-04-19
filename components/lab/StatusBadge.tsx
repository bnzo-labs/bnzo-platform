import type { ProjectStatus } from '@/lib/projects'

interface StatusBadgeProps {
  status: ProjectStatus
  className?: string
}

const STYLES: Record<ProjectStatus, string> = {
  Live: 'bg-lime text-ink',
  Beta: 'bg-chalk/10 text-chalk border border-chalk/30',
  'In Progress': 'bg-transparent text-slate border border-slate/40',
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-1 font-mono text-[11px] uppercase tracking-widest ${STYLES[status]} ${className}`}
      aria-label={`Project status: ${status}`}
    >
      {status}
    </span>
  )
}
