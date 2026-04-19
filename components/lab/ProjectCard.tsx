import Link from 'next/link'
import type { Project } from '@/lib/projects'
import { StatusBadge } from './StatusBadge'

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/${project.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-slate/20 bg-white/[0.03] transition-colors duration-fast hover:border-lime focus-visible:border-lime focus-visible:outline-none"
    >
      <div
        className="relative aspect-[16/10] w-full overflow-hidden bg-ink"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 bg-gradient-to-br from-chalk/5 via-transparent to-lime/10 transition-opacity duration-normal group-hover:opacity-80"
        />
        <div className="absolute inset-0 flex items-end p-5">
          <span className="font-mono text-xs uppercase tracking-widest text-slate">
            {project.slug}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-geist text-xl font-bold tracking-tight text-chalk">
            {project.title}
          </h3>
          <StatusBadge status={project.status} />
        </div>
        <p className="text-sm leading-relaxed text-chalk/70">
          {project.description}
        </p>
        <div className="mt-2 flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate transition-colors group-hover:text-lime">
          <span>View case study</span>
          <span aria-hidden="true">→</span>
        </div>
      </div>
    </Link>
  )
}
