import React from 'react'

interface SkillGroup {
  label: string
  items: string[]
}

const GROUPS: SkillGroup[] = [
  {
    label: 'Frontend',
    items: ['React', 'Next.js', 'TypeScript', 'Tailwind'],
  },
  {
    label: 'Backend',
    items: ['Node.js', 'Supabase', 'Stripe', 'APIs'],
  },
  {
    label: 'AI / Agents',
    items: ['Claude Code', 'Multi-agent systems', 'Orchestration'],
  },
  {
    label: 'Tools',
    items: ['Git', 'Vercel', 'Figma'],
  },
]

export function Skills() {
  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="border-b border-slate/15"
    >
      <div className="mx-auto max-w-content px-gutter py-24 md:py-32">
        <div className="mb-16">
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-slate">
            Toolbox
          </p>
          <h2
            id="skills-heading"
            className="font-geist text-[clamp(2rem,1.5rem+2.5vw,3.5rem)] font-bold leading-[1] tracking-tight"
          >
            What I work with<span className="text-lime">.</span>
          </h2>
        </div>

        <dl className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-x-16 md:gap-y-14">
          {GROUPS.map((group) => (
            <div key={group.label} className="flex flex-col gap-4">
              <dt className="font-mono text-xs uppercase tracking-widest text-lime">
                {group.label}
              </dt>
              <dd>
                <ul className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-md border border-slate/25 bg-white/[0.02] px-3 py-1.5 text-sm text-chalk/85"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

export default Skills
