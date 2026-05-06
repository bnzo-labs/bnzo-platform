import Image from 'next/image'
import { getProjects, getProjectImageSrc } from '@/lib/projects'
import type { ProjectStatus } from '@/lib/projects'

const STATUS_LABELS: Record<ProjectStatus, string> = {
  Live: 'live',
  Beta: 'beta',
  'In Progress': 'shipping',
}

export async function WorkPreview() {
  const projects = await getProjects()
  const featured = projects.slice(0, 3)

  return (
    <section
      aria-labelledby="work-heading"
      className="relative border-t border-slate/20 text-chalk"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(to right, var(--color-chalk) 1px, transparent 1px), linear-gradient(to bottom, var(--color-chalk) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />
      <div className="mx-auto max-w-content px-gutter py-section">
        <div
          className="mb-16 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
          data-reveal
          data-reveal-delay="0"
        >
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-slate">
              — selected work
            </p>
            <h2
              id="work-heading"
              className="font-geist font-bold tracking-tighter text-[length:var(--text-2xl)] leading-[1.05]"
            >
              Recent drops<span className="text-lime">.</span>
            </h2>
          </div>
          <a
            href="https://lab.bnzo.io"
            className="font-mono text-sm text-chalk/70 transition-all duration-fast active:scale-[0.97] hover:text-lime"
          >
            All case studies →
          </a>
        </div>

        <ul className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {featured.map((project, index) => {
            const imageSrc = getProjectImageSrc(project.slug)
            return (
              <li
                key={project.slug}
                data-reveal
                data-reveal-delay={String(index * 80)}
              >
                <a
                  href={`https://lab.bnzo.io/${project.slug}`}
                  className={`group flex h-full flex-col rounded-lg border border-slate/20 bg-white/[0.02] p-6 backdrop-blur-sm transition-all duration-300 ease-out-expo hover:scale-[1.02] hover:-translate-y-1 hover:border-lime/40 hover:bg-white/[0.05] hover:backdrop-blur-md hover:shadow-[0_0_0_1px_rgba(200,255,0,0.4),0_8px_32px_rgba(200,255,0,0.08)] active:scale-[0.97] ${index === 1 ? 'md:mt-10' : ''
                    }`}
                >
                  <div
                    aria-hidden="true"
                    className="relative mb-6 aspect-[4/3] overflow-hidden rounded bg-ink"
                  >
                    {imageSrc && (
                      <Image
                        src={imageSrc}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                        priority={index === 0}
                        loading={index === 0 ? 'eager' : 'lazy'}
                      />
                    )}
                    <div
                      className="absolute inset-0 opacity-40 transition-opacity duration-normal group-hover:opacity-70"
                      style={{
                        background: `radial-gradient(circle at ${30 + index * 25
                          }% ${40 + index * 10}%, var(--color-lime) 0%, transparent 60%)`,
                      }}
                    />
                  </div>

                  <div className="mb-3 flex items-center gap-3">
                    <span
                      className={`inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest ${project.status === 'Live' ? 'text-lime' : 'text-slate'
                        }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`h-1.5 w-1.5 rounded-full ${project.status === 'Live' ? 'bg-lime' : 'bg-slate'
                          }`}
                      />
                      {STATUS_LABELS[project.status]}
                    </span>
                  </div>

                  <h3 className="font-geist font-bold tracking-tight text-[length:var(--text-lg)] text-chalk transition-colors duration-fast group-hover:text-lime">
                    {project.title}
                  </h3>

                  <p className="mt-2 font-sans text-sm text-chalk/70">
                    {project.description}
                  </p>
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

export default WorkPreview
