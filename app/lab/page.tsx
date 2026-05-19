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
  const [featured, ...rest] = projects

  return (
    <>
      <section className="border-b border-slate/20">
        <div className="mx-auto max-w-content px-gutter py-20 md:py-28">
          <p
            className="hero-line hero-line-0 mb-4 font-mono text-xs uppercase tracking-widest text-lime"
            data-reveal
            data-reveal-delay="0"
          >
            bnzo / lab
          </p>
          <h1
            className="hero-line hero-line-1 font-geist text-[clamp(2.5rem,1.5rem+5vw,5rem)] font-bold leading-[0.95] tracking-tight text-chalk"
            data-reveal
            data-reveal-delay="80"
          >
            Case studies<span className="text-lime">.</span>
          </h1>
          <p
            className="hero-line hero-line-2 mt-6 max-w-2xl text-lg leading-relaxed text-chalk/70"
            data-reveal
            data-reveal-delay="160"
          >
            Products built with agents. Architecture, decisions, metrics, and what
            we got wrong. No marketing gloss.
          </p>
        </div>
      </section>

      <section className="border-t border-white/10 bg-white/[0.04] backdrop-blur-md">
        <div className="mx-auto max-w-content px-gutter py-16 md:py-24">
          {featured && (
            <div className="mb-6" data-reveal data-reveal-delay="0">
              <ProjectCard project={featured} priority featured />
            </div>
          )}
          {rest.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((project, index) => (
                <div
                  key={project.slug}
                  data-reveal
                  data-reveal-delay={String((index + 1) * 80)}
                >
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
