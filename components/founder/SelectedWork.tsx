import React from 'react'
import { getProjects } from '@/lib/projects'

const LAB_URL = 'https://lab.bnzo.io'

export async function SelectedWork() {
  const all = await getProjects()
  const projects = all.slice(0, 4)

  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="border-b border-slate/15 backdrop-blur-md bg-white/[0.04] border-t border-white/10"
    >
      <div className="mx-auto max-w-content px-gutter py-24 md:py-32">
        <div className="mb-16 flex flex-col gap-4 md:flex-row md:items-end md:justify-between" data-reveal data-reveal-delay="0">
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-slate">
              Selected work
            </p>
            <h2
              id="work-heading"
              className="font-geist text-[clamp(2rem,1.5rem+2.5vw,3.5rem)] font-bold leading-[1] tracking-tight"
            >
              Things I&apos;ve built<span className="text-lime">.</span>
            </h2>
          </div>
          <a
            href={LAB_URL}
            className="link-underline font-mono text-xs uppercase tracking-widest text-chalk/70 transition-colors duration-fast hover:text-lime"
          >
            All case studies →
          </a>
        </div>

        <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-slate/20 bg-slate/20 md:grid-cols-2">
          {projects.map((project, idx) => (
            <li key={project.slug} className="bg-ink" data-reveal data-reveal-delay={String(idx * 80)}>
              <a
                href={`${LAB_URL}/${project.slug}`}
                className="group flex h-full flex-col gap-6 p-8 transition-all duration-200 ease-out-expo hover:bg-white/[0.03] hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.97] md:p-10"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-widest text-slate">
                    {String(idx + 1).padStart(2, '0')} / {project.status}
                  </span>
                  <span className="font-mono text-xs uppercase tracking-widest text-chalk/40 transition-colors duration-fast group-hover:text-lime">
                    read →
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  <h3 className="font-geist text-2xl font-bold tracking-tight md:text-3xl">
                    {project.title}
                  </h3>
                  <p className="max-w-prose text-sm text-chalk/70 md:text-base">
                    {project.description}
                  </p>
                </div>

                <div className="mt-auto flex flex-wrap gap-2">
                  {project.architecture.stack.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="rounded border border-slate/25 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-chalk/60"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default SelectedWork
