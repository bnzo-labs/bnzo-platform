import type { Metadata } from 'next'
import { getProjects } from '@/lib/projects'
import { ProjectCard } from '@/components/lab/ProjectCard'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Case studies and experiments from the bnzo lab. Agent-built products with honest retrospectives.',
  openGraph: {
    title: 'Projects — bnzo Lab',
    description: 'Case studies and experiments from the bnzo lab.',
  },
}

export default async function LabIndexPage() {
  const projects = await getProjects()

  return (
    <>
      <section className="border-b border-slate/20">
        <div className="mx-auto max-w-content px-gutter py-20 md:py-28">
          <p className="mb-4 font-mono text-xs uppercase tracking-widest text-lime" data-reveal data-reveal-delay="0">
            bnzo / lab
          </p>
          <h1
            className="font-geist text-[clamp(2.5rem,1.5rem+5vw,5rem)] font-bold leading-[0.95] tracking-tight text-chalk"
            data-reveal
            data-reveal-delay="80"
          >
            Case studies<span className="text-lime">.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-chalk/70 leading-relaxed" data-reveal data-reveal-delay="160">
            Products built with agents. Architecture, decisions, metrics, and what
            we got wrong. No marketing gloss.
          </p>
        </div>
      </section>

      <section className="backdrop-blur-md bg-white/[0.04] border-t border-white/10">
        <div className="mx-auto max-w-content px-gutter py-16 md:py-24">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <div key={project.slug} data-reveal data-reveal-delay={String(index * 80)}>
                <ProjectCard project={project} priority={index === 0} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
