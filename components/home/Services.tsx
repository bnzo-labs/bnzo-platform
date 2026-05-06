'use client'

import { Layers, Blocks, Bot, GraduationCap, type LucideIcon } from 'lucide-react'

interface Service {
  id: string
  number: string
  title: string
  description: string
  cta: { label: string; href: string }
  icon: LucideIcon
}

const SERVICES: ReadonlyArray<Service> = [
  {
    id: 'apps',
    number: '01',
    title: 'App Development',
    description:
      'Custom mobile + web apps. Shipped fast, built for scale. React Native, Next.js, Supabase.',
    cta: { label: 'See work →', href: 'https://lab.bnzo.io' },
    icon: Layers,
  },
  {
    id: 'saas',
    number: '02',
    title: 'SaaS Development',
    description:
      'Multi-tenant platforms, billing, auth, admin tools. From landing page to production.',
    cta: { label: 'See work →', href: 'https://lab.bnzo.io' },
    icon: Blocks,
  },
  {
    id: 'ai',
    number: '03',
    title: 'AI Automations',
    description:
      'Agent-powered workflows that replace manual work. Claude, tool use, eval harnesses.',
    cta: { label: 'Explore →', href: 'https://build.bnzo.io' },
    icon: Bot,
  },
  {
    id: 'education',
    number: '04',
    title: 'Education',
    description:
      'Courses + workshops. Teach teams to build with agents. From first prompt to production.',
    cta: { label: 'Learn more →', href: 'https://learn.bnzo.io' },
    icon: GraduationCap,
  },
]

export function Services() {
  return (
    <section
      aria-labelledby="services-heading"
      className="backdrop-blur-md bg-white/[0.04] border-t border-white/10 text-chalk"
    >
      <div className="mx-auto max-w-content px-gutter py-section">
        <div
          className="mb-16 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
          data-reveal
          data-reveal-delay="0"
        >
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
              One playbook<span className="text-lime">.</span>
            </h2>
          </div>
          <p className="max-w-sm font-sans text-slate">
            Each practice feeds the next. Build, ship, teach, repeat.
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {SERVICES.map((service, index) => {
            const Icon = service.icon
            return (
              <li
                key={service.id}
                className="group relative rounded-lg border border-white/10 bg-white/[0.04] p-8 text-chalk backdrop-blur-sm transition-all duration-300 ease-out-expo hover:border-lime/40 hover:bg-white/[0.08] hover:shadow-[0_0_0_1px_rgba(200,255,0,0.2),0_8px_32px_rgba(200,255,0,0.06)]"
                data-reveal
                data-reveal-delay={String(index * 80)}
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="font-mono text-xs text-slate transition-colors duration-fast group-hover:text-lime">
                    {service.number}
                  </span>
                  <Icon
                    size={20}
                    strokeWidth={1.5}
                    className="text-chalk/30 transition-colors duration-fast group-hover:text-lime"
                  />
                </div>

                <h3 className="mt-6 font-geist font-bold tracking-tight text-[length:var(--text-xl)] text-chalk">
                  {service.title}
                </h3>

                <p className="mt-3 max-w-md font-sans text-[length:var(--text-base)] text-slate">
                  {service.description}
                </p>

                <a
                  href={service.cta.href}
                  className="mt-6 inline-block font-mono text-sm text-chalk/60 transition-all duration-fast active:scale-[0.97] group-hover:text-lime"
                >
                  {service.cta.label}
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

export default Services
