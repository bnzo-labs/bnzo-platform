import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  getProjectBySlug,
  getProjectSlugs,
  getAdjacentProjects,
} from '@/lib/projects'
import type { AgentEntry } from '@/lib/projects'
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

const ROLE_ORDER = ['Design', 'Development', 'Content', 'QA']

function groupAgents(agents: AgentEntry[]): Record<string, AgentEntry[]> {
  return agents.reduce<Record<string, AgentEntry[]>>((acc, a) => {
    const role = ROLE_ORDER.includes(a.role) ? a.role : 'Other'
    if (!acc[role]) acc[role] = []
    acc[role].push(a)
    return acc
  }, {})
}

function parseStatCallout(raw: string): { stat: string; label: string } | null {
  const m = raw.match(/^([<>~]?\s*\$?\s*[\d,.]+\s*[a-zA-Z%]*)(.*)/)
  if (!m || !m[1].trim()) return null
  return { stat: m[1].trim(), label: m[2].trim() }
}

export default async function ProjectDetailPage({ params }: Params) {
  const [project, adjacent] = await Promise.all([
    getProjectBySlug(params.slug),
    getAdjacentProjects(params.slug),
  ])
  if (!project) notFound()

  const groups = groupAgents(project.agents)
  const { next } = adjacent

  return (
    <article>
      {/* Hero */}
      <section className="border-b border-slate/20">
        <div className="mx-auto max-w-content px-gutter py-20 md:py-28">
          <Link
            href="/"
            className="hero-line hero-line-0 mb-10 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-slate transition-colors hover:text-lime"
            data-reveal
            data-reveal-delay="0"
          >
            <span aria-hidden="true">←</span>
            <span>All projects</span>
          </Link>

          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p
                className="hero-line hero-line-1 mb-4 font-mono text-xs uppercase tracking-widest text-lime"
                data-reveal
                data-reveal-delay="80"
              >
                Case study
              </p>
              <h1
                className="hero-line hero-line-2 font-geist text-[clamp(2.5rem,1.5rem+5vw,5.5rem)] font-bold leading-[0.95] tracking-tight text-chalk"
                data-reveal
                data-reveal-delay="160"
              >
                {project.title}
              </h1>
              <p
                className="hero-line hero-line-3 mt-6 max-w-2xl text-lg leading-relaxed text-chalk/70"
                data-reveal
                data-reveal-delay="240"
              >
                {project.description}
              </p>
            </div>
            <div
              className="hero-line hero-line-4 self-start md:self-end"
              data-reveal
              data-reveal-delay="320"
            >
              <StatusBadge status={project.status} />
            </div>
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
            <ul className="flex flex-wrap gap-2" data-reveal data-reveal-delay="200">
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
            <ul className="flex flex-col gap-3" data-reveal data-reveal-delay="200">
              {project.architecture.decisions.map((d) => (
                <li key={d} className="flex gap-3 text-chalk/80">
                  <span aria-hidden="true" className="text-lime">
                    →
                  </span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section title="Agents used" index="03">
        <div className="flex flex-col gap-8 border-l-2 border-lime/40 pl-6">
          {[...ROLE_ORDER, 'Other']
            .filter((role) => groups[role]?.length)
            .map((role) => (
              <div key={role}>
                <p className="mb-3 font-mono text-xs uppercase tracking-widest text-slate">
                  {role}
                </p>
                <ul className="flex flex-wrap gap-2">
                  {groups[role].map((agent) => (
                    <li
                      key={agent.name}
                      className="flex items-center gap-1.5 rounded-md border border-lime/20 bg-lime/[0.05] px-3 py-1.5 font-mono text-sm"
                    >
                      <span
                        style={{ color: 'var(--color-lime)', fontFamily: 'var(--font-geist-mono)' }}
                      >
                        b/
                      </span>
                      <span className="text-chalk/90">{agent.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      </Section>

      <Section title="Result" index="04">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h3 className="mb-6 font-mono text-xs uppercase tracking-widest text-slate">
              Metrics
            </h3>
            <ul className="flex flex-col gap-6">
              {project.result.metrics.map((item) => {
                const parsed = parseStatCallout(item)
                if (parsed) {
                  return (
                    <li key={item}>
                      <div className="font-geist text-4xl font-bold text-chalk">
                        {parsed.stat}
                      </div>
                      <div className="mt-1 text-sm leading-snug text-slate">
                        {parsed.label}
                      </div>
                    </li>
                  )
                }
                return (
                  <li key={item} className="flex gap-3 text-chalk/80">
                    <span aria-hidden="true" className="text-slate">
                      •
                    </span>
                    <span>{item}</span>
                  </li>
                )
              })}
            </ul>
          </div>
          <BulletBlock label="Outcomes" items={project.result.outcomes} />
        </div>
      </Section>

      <Section title="Learnings" index="05" last>
        <div className="grid gap-10 md:grid-cols-2">
          <BulletBlock label="What went well" items={project.learnings.went_well} accent="lime" />
          <BulletBlock label="What didn't" items={project.learnings.didnt} accent="slate" />
        </div>
      </Section>

      {/* Bottom navigation */}
      <div className="mx-auto max-w-content px-gutter py-12">
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate/20 pt-10">
          <Link
            href="/"
            className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-slate transition-colors hover:text-chalk"
          >
            <span aria-hidden="true">←</span>
            <span>All projects</span>
          </Link>
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-lime px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-ink transition-opacity hover:opacity-90"
            >
              See it live →
            </a>
          )}
          {next && (
            <Link
              href={`/${next.slug}`}
              className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-slate transition-colors hover:text-chalk"
            >
              <span>Next: {next.title}</span>
              <span aria-hidden="true">→</span>
            </Link>
          )}
        </div>
      </div>
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
    <section className={`relative overflow-hidden ${last ? '' : 'border-b border-slate/20'}`}>
      <span
        aria-hidden="true"
        className="pointer-events-none select-none absolute right-4 top-4 font-mono text-[8rem] font-bold leading-none text-chalk/[0.04] lg:right-12"
      >
        {index}
      </span>
      <div className="mx-auto max-w-content px-gutter py-16 md:py-24">
        <header
          className="relative mb-10 flex items-baseline gap-4"
          data-reveal
          data-reveal-delay="0"
        >
          <span className="font-mono text-xs text-slate">{index}</span>
          <h2 className="font-geist text-3xl font-bold tracking-tight text-chalk md:text-4xl">
            {title}
          </h2>
        </header>
        <div data-reveal data-reveal-delay="150">
          {children}
        </div>
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
      <h3 className="mb-4 font-mono text-xs uppercase tracking-widest text-slate">{label}</h3>
      <ul className="flex flex-col gap-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-chalk/80">
            <span aria-hidden="true" className={bullet}>
              •
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
