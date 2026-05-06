import Link from 'next/link'
import Image from 'next/image'
import type { Project } from '@/lib/projects'
import { getProjectImageSrc } from '@/lib/projects'
import { StatusBadge } from './StatusBadge'

interface ProjectCardProps {
  project: Project
  priority?: boolean
}

export function ProjectCard({ project, priority = false }: ProjectCardProps) {
  const imageSrc = getProjectImageSrc(project.slug)
  return (
    <Link
      href={`/${project.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-slate/20 bg-white/[0.03] transition-all duration-200 ease-out-expo hover:border-lime/40 hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-[0_0_0_1px_rgba(200,255,0,0.2),0_8px_32px_rgba(200,255,0,0.06)] active:scale-[0.97] focus-visible:border-lime focus-visible:outline-none"
    >
      <div
        className="relative aspect-[16/10] w-full overflow-hidden bg-ink"
        aria-hidden="true"
      >
        {imageSrc && (
          <Image
            src={imageSrc}
            alt={project.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
            priority={priority}
            loading={priority ? 'eager' : 'lazy'}
          />
        )}
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
          <span className="link-underline">View case study</span>
          <span aria-hidden="true">→</span>
        </div>
      </div>
    </Link>
  )
}
