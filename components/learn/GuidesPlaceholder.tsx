type Guide = {
  code: string
  title: string
  blurb: string
  readTime: string
}

const GUIDES: readonly Guide[] = [
  {
    code: 'G-01',
    title: 'Building Your First AI Agent',
    blurb:
      'From empty repo to an agent that calls tools and returns structured output. The parts nobody explains.',
    readTime: '15 min read',
  },
  {
    code: 'G-02',
    title: 'Multi-Agent Orchestration Patterns',
    blurb:
      'When to fan out, when to chain, when to let one agent do it all. Real trade-offs from production systems.',
    readTime: '20 min read',
  },
  {
    code: 'G-03',
    title: 'Debugging Agent Workflows',
    blurb:
      'Tracing, replaying, and fixing broken agent runs. Tools and mental models that actually scale.',
    readTime: '18 min read',
  },
  {
    code: 'G-04',
    title: 'Prompt Engineering for Developers',
    blurb:
      'Prompts as code: versioning, evaluating, and iterating on them like any other shipped artifact.',
    readTime: '12 min read',
  },
] as const

export function GuidesPlaceholder() {
  return (
    <section aria-labelledby="guides-heading" className="bg-chalk">
      <div className="mx-auto max-w-content px-gutter py-24 md:py-32">
        <header className="mb-12 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-slate">
              Library
            </p>
            <h2
              id="guides-heading"
              className="font-geist font-bold tracking-tight text-ink"
              style={{ fontSize: 'var(--text-2xl)' }}
            >
              Free Guides
              <span className="text-slate/70"> (Coming Soon)</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm text-ink/60">
            Published as we finish shipping the products they came out of.
            Subscribe above to be notified.
          </p>
        </header>

        <ul className="grid gap-6 md:grid-cols-2">
          {GUIDES.map((g, i) => (
            <li
              key={g.code}
              aria-disabled="true"
              className={[
                'group relative flex flex-col gap-4 rounded-lg border border-slate/20 bg-ink/[0.03] p-6 transition-colors',
                'cursor-not-allowed',
                i % 3 === 0 ? 'md:p-8' : '',
              ].join(' ')}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-widest text-slate">
                  {g.code}
                </span>
                <span className="rounded-full border border-slate/30 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-slate">
                  Draft
                </span>
              </div>
              <h3
                className="font-geist font-semibold tracking-tight text-ink"
                style={{ fontSize: 'var(--text-xl)' }}
              >
                {g.title}
              </h3>
              <p className="text-sm text-ink/70 leading-relaxed">{g.blurb}</p>
              <div className="mt-auto flex items-center justify-between pt-2">
                <span className="font-mono text-xs text-slate">
                  {g.readTime}
                </span>
                <span className="font-mono text-xs uppercase tracking-widest text-slate/70">
                  Soon<span className="text-lime-deep">.</span>
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
