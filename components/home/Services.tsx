interface Service {
  id: string
  number: string
  title: string
  description: string
  cta: { label: string; href: string }
}

const SERVICES: ReadonlyArray<Service> = [
  {
    id: 'apps',
    number: '01',
    title: 'App Development',
    description:
      'Custom mobile + web apps. Shipped fast, built for scale. React Native, Next.js, Supabase.',
    cta: { label: 'See work →', href: 'https://lab.bnzo.io' },
  },
  {
    id: 'saas',
    number: '02',
    title: 'SaaS Development',
    description:
      'Multi-tenant platforms, billing, auth, admin tools. From landing page to production.',
    cta: { label: 'See work →', href: 'https://lab.bnzo.io' },
  },
  {
    id: 'ai',
    number: '03',
    title: 'AI Automations',
    description:
      'Agent-powered workflows that replace manual work. Claude, tool use, eval harnesses.',
    cta: { label: 'Explore →', href: 'https://build.bnzo.io' },
  },
  {
    id: 'education',
    number: '04',
    title: 'Education',
    description:
      'Courses + workshops. Teach teams to build with agents. From first prompt to production.',
    cta: { label: 'Learn more →', href: 'https://learn.bnzo.io' },
  },
]

export function Services() {
  return (
    <section
      aria-labelledby="services-heading"
      className="bg-chalk text-ink"
    >
      <div className="mx-auto max-w-content px-gutter py-section">
        <div className="mb-16 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-slate">
              — what we do
            </p>
            <h2
              id="services-heading"
              className="max-w-2xl font-geist font-bold tracking-tighter text-[length:var(--text-2xl)] leading-[1.05]"
            >
              Four practices.
              <br />
              One playbook<span className="text-lime-deep">.</span>
            </h2>
          </div>
          <p className="max-w-sm font-sans text-slate">
            Each practice feeds the next. Build, ship, teach, repeat.
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-px bg-ink/10 md:grid-cols-2">
          {SERVICES.map((service, index) => (
            <li
              key={service.id}
              className={`group relative bg-chalk p-8 transition-colors duration-normal hover:bg-ink hover:text-chalk ${
                index === 0 ? 'md:border-r md:border-ink/10' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <span className="font-mono text-xs text-slate group-hover:text-lime">
                  {service.number}
                </span>
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full bg-slate/30 group-hover:bg-lime"
                />
              </div>

              <h3 className="mt-6 font-geist font-bold tracking-tight text-[length:var(--text-xl)]">
                {service.title}
              </h3>

              <p className="mt-3 max-w-md font-sans text-[length:var(--text-base)] text-slate group-hover:text-chalk/80">
                {service.description}
              </p>

              <a
                href={service.cta.href}
                className="mt-6 inline-block font-mono text-sm text-ink transition-colors duration-fast group-hover:text-lime"
              >
                {service.cta.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Services
