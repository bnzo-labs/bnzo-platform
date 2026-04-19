import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProjectBySlug, getProjectSlugs } from '@/lib/projects'
import { StatusBadge } from '@/components/lab/StatusBadge'

interface Params {
  params: { slug: string }
}

export async function generateStaticParams() {
  const slugs = await getProjectSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug)
  if (!project) {
    return { title: 'Not found' }
  }
  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: `https://lab.bnzo.io/${params.slug}` },
    openGraph: {
      title: `${project.title} — bnzo Lab`,
      description: project.description,
      url: `https://lab.bnzo.io/${params.slug}`,
      siteName: 'bnzo Lab',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.title} — bnzo Lab`,
      description: project.description,
    },
  }
}

export default async function ProjectDetailPage({ params }: Params) {
  const project = await getProjectBySlug(params.slug)
  if (!project) notFound()

  return (
    <article>
      {/* Hero */}
      <section className="border-b border-slate/20">
        <div className="mx-auto max-w-content px-gutter py-20 md:py-28">
          <Link
            href="/"
            className="mb-10 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-slate transition-colors hover:text-lime"
          >
            <span aria-hidden="true">←</span>
            <span>All projects</span>
          </Link>

          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-4 font-mono text-xs uppercase tracking-widest text-lime">
                Case study
              </p>
              <h1 className="font-geist text-[clamp(2.5rem,1.5rem+5vw,5.5rem)] font-bold leading-[0.95] tracking-tight text-chalk">
                {project.title}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-chalk/70">
                {project.description}
              </p>
            </div>
            <StatusBadge status={project.status} className="self-start md:self-end" />
          </div>
        </div>
      </section>

      <Section title="Problem" index="01">
        <p className="text-lg leading-relaxed text-chalk/80">{project.problem}</p>
      </Section>

      <Section title="Architecture" index="02">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h3 className="mb-4 font-mono text-xs uppercase tracking-widest text-slate">
              Stack
            </h3>
            <ul className="flex flex-wrap gap-2">
              {project.architecture.stack.map((item) => (
                <li
                  key={item}
                  className="rounded-md border border-slate/30 px-3 py-1 font-mono text-xs text-chalk/80"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-mono text-xs uppercase tracking-widest text-slate">
              Design decisions
            </h3>
            <ul className="flex flex-col gap-3">
              {project.architecture.decisions.map((d) => (
                <li key={d} className="flex gap-3 text-chalk/80">
                  <span aria-hidden="true" className="text-lime">→</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section title="Agents used" index="03">
        <ul className="flex flex-wrap gap-3">
          {project.agents.map((a) => (
            <li
              key={a}
              className="rounded-md bg-white/[0.04] border border-slate/20 px-4 py-2 font-mono text-sm text-chalk"
            >
              {a}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Result" index="04">
        <div className="grid gap-10 md:grid-cols-2">
          <BulletBlock label="Metrics" items={project.result.metrics} />
          <BulletBlock label="Outcomes" items={project.result.outcomes} />
        </div>
      </Section>

      <Section title="Learnings" index="05" last>
        <div className="grid gap-10 md:grid-cols-2">
          <BulletBlock label="What went well" items={project.learnings.went_well} accent="lime" />
          <BulletBlock label="What didn't" items={project.learnings.didnt} accent="slate" />
        </div>
      </Section>
    </article>
  )
}

function Section({
  title,
  index,
  children,
  last = false,
}: {
  title: string
  index: string
  children: React.ReactNode
  last?: boolean
}) {
  return (
    <section className={last ? '' : 'border-b border-slate/20'}>
      <div className="mx-auto max-w-content px-gutter py-16 md:py-24">
        <header className="mb-10 flex items-baseline gap-4">
          <span className="font-mono text-xs text-slate">{index}</span>
          <h2 className="font-geist text-3xl md:text-4xl font-bold tracking-tight text-chalk">
            {title}
          </h2>
        </header>
        {children}
      </div>
    </section>
  )
}

function BulletBlock({
  label,
  items,
  accent = 'slate',
}: {
  label: string
  items: string[]
  accent?: 'slate' | 'lime'
}) {
  const bullet = accent === 'lime' ? 'text-lime' : 'text-slate'
  return (
    <div>
      <h3 className="mb-4 font-mono text-xs uppercase tracking-widest text-slate">
        {label}
      </h3>
      <ul className="flex flex-col gap-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-chalk/80">
            <span aria-hidden="true" className={bullet}>•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
