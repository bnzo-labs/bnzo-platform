interface PreviewProject {
  slug: string
  title: string
  summary: string
  client: string
  year: number
  status: 'live' | 'shipping' | 'archive'
}

const PROJECTS: ReadonlyArray<PreviewProject> = [
  {
    slug: 'cook-for-friends',
    title: 'Cook for Friends',
    summary: 'Social meal planning app. Realtime menus, guest RSVPs, shared pantry.',
    client: 'Bnzo Studio',
    year: 2026,
    status: 'live',
  },
  {
    slug: 'jailbreak-live',
    title: 'Jailbreak.live',
    summary: 'Multiplayer game with agent-driven NPCs. Colyseus + Claude.',
    client: 'Bnzo Studio',
    year: 2026,
    status: 'shipping',
  },
  {
    slug: 'agent-harness',
    title: 'Agent Harness',
    summary: 'Eval + orchestration framework for autonomous agent fleets.',
    client: 'Internal R&D',
    year: 2026,
    status: 'shipping',
  },
]

const STATUS_LABELS: Record<PreviewProject['status'], string> = {
  live: 'live',
  shipping: 'shipping',
  archive: 'archive',
}

export function WorkPreview() {
  return (
    <section
      aria-labelledby="work-heading"
      className="border-t border-slate/20 bg-ink text-chalk"
    >
      <div className="mx-auto max-w-content px-gutter py-section">
        <div className="mb-16 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
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
            className="font-mono text-sm text-chalk/70 transition-colors duration-fast hover:text-lime"
          >
            All case studies →
          </a>
        </div>

        <ul className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {PROJECTS.map((project, index) => (
            <li key={project.slug}>
              <a
                href={`https://lab.bnzo.io/${project.slug}`}
                className={`group flex h-full flex-col rounded-lg border border-slate/20 bg-chalk/[0.02] p-6 transition-colors duration-normal hover:border-lime ${
                  index === 1 ? 'md:mt-10' : ''
                }`}
              >
                <div
                  aria-hidden="true"
                  className="relative mb-6 aspect-[4/3] overflow-hidden rounded bg-ink"
                >
                  <div
                    className="absolute inset-0 opacity-40 transition-opacity duration-normal group-hover:opacity-70"
                    style={{
                      background: `radial-gradient(circle at ${
                        30 + index * 25
                      }% ${40 + index * 10}%, var(--color-lime) 0%, transparent 60%)`,
                    }}
                  />
                  <span className="absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-widest text-chalk/70">
                    {project.client} / {project.year}
                  </span>
                </div>

                <div className="mb-3 flex items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest ${
                      project.status === 'live' ? 'text-lime' : 'text-slate'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`h-1.5 w-1.5 rounded-full ${
                        project.status === 'live' ? 'bg-lime' : 'bg-slate'
                      }`}
                    />
                    {STATUS_LABELS[project.status]}
                  </span>
                </div>

                <h3 className="font-geist font-bold tracking-tight text-[length:var(--text-lg)] text-chalk transition-colors duration-fast group-hover:text-lime">
                  {project.title}
                </h3>

                <p className="mt-2 font-sans text-sm text-chalk/70">
                  {project.summary}
                </p>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default WorkPreview
