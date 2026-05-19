import Link from 'next/link'
import Image from 'next/image'
import type { Project } from '@/lib/projects'
import { getProjectImageSrc } from '@/lib/projects'
import { StatusBadge } from './StatusBadge'

interface ProjectCardProps {
  project: Project
  priority?: boolean
  featured?: boolean
}

export function ProjectCard({ project, priority = false, featured = false }: ProjectCardProps) {
  const imageSrc = getProjectImageSrc(project.slug)

  if (featured) {
    return (
      <Link
        href={`/${project.slug}`}
        className="group relative flex w-full overflow-hidden rounded-lg border border-slate/20 bg-white/[0.03] aspect-[16/7] transition-all duration-200 ease-out-expo hover:border-lime/40 hover:shadow-[0_0_0_1px_rgba(200,255,0,0.2),0_8px_32px_rgba(200,255,0,0.06)] focus-visible:border-lime focus-visible:outline-none"
      >
        {imageSrc ? (
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src={imageSrc}
              alt={project.title}
              fill
              objectPosition='top'
              className="object-cover transition-transform duration-300 ease-out-expo group-hover:scale-[1.06]"
              priority={priority}
              loading={priority ? 'eager' : 'lazy'}
            />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center border border-slate/10 bg-ink">
            <span className="font-mono text-2xl text-slate/40">b/</span>
          </div>
        )}

        {/* Gradient overlay - Layer 1 (covers 70-75% from bottom) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
        {/* Gradient overlay - Layer 2 (text zone lock) */}
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-b from-transparent to-ink/80" />

        {/* StatusBadge top-right */}
        <div className="absolute right-5 top-5">
          <StatusBadge status={project.status} />
        </div>

        {/* Content overlay bottom-left */}
        <div className="absolute bottom-0 left-0 max-w-2xl p-8">
          <h3 className="font-geist text-3xl font-bold tracking-tight text-chalk md:text-4xl [text-shadow:0_2px_12px_rgba(0,0,0,0.85)]">
            {project.title}
          </h3>
          <p className="mt-2 text-sm font-medium leading-relaxed text-chalk/95 [text-shadow:0_2px_12px_rgba(0,0,0,0.85)]">{project.description}</p>
          <div className="mt-4 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-slate transition-colors group-hover:text-lime">
            <span className="link-underline">View case study</span>
            <span aria-hidden="true">→</span>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={`/${project.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-slate/20 bg-white/[0.03] transition-all duration-200 ease-out-expo hover:border-lime/40 hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-[0_0_0_1px_rgba(200,255,0,0.2),0_8px_32px_rgba(200,255,0,0.06)] active:scale-[0.97] focus-visible:border-lime focus-visible:outline-none"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-ink" aria-hidden="true">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={project.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 ease-out-expo group-hover:scale-[1.06]"
            priority={priority}
            loading={priority ? 'eager' : 'lazy'}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center border border-slate/10 bg-ink">
            <span className="font-mono text-2xl text-slate/40">b/</span>
          </div>
        )}

        {/* Gradient mask */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />

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
        <p className="text-sm font-medium leading-relaxed text-chalk/90">{project.description}</p>
        <div className="mt-2 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-slate transition-colors group-hover:text-lime">
          <span className="link-underline">View case study</span>
          <span aria-hidden="true">→</span>
        </div>
      </div>
    </Link>
  )
}
