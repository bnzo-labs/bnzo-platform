import { Fragment } from 'react'
import { Phone, FileText, Zap, Send, type LucideIcon } from 'lucide-react'

interface Step {
  num: string
  label: string
  duration: string
  copy: string
  Icon: LucideIcon
}

const STEPS: Step[] = [
  {
    num: '01',
    label: 'DISCOVERY CALL',
    duration: '20 min',
    copy: "We talk. You share what needs to ship. We tell you if it's a fit.",
    Icon: Phone,
  },
  {
    num: '02',
    label: 'SCOPE',
    duration: '1 week',
    copy: 'Fixed-price proposal with timeline. Tech stack decisions. Wave decomposition.',
    Icon: FileText,
  },
  {
    num: '03',
    label: 'SPRINT',
    duration: '2-6 weeks',
    copy: 'We build. You review weekly. Demos every Friday.',
    Icon: Zap,
  },
  {
    num: '04',
    label: 'SHIP',
    duration: 'day one',
    copy: 'Production deploy. Documentation. Handoff. You own the code.',
    Icon: Send,
  },
]

export function Process() {
  return (
    <section
      aria-labelledby="process-heading"
      className="section-process relative"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-32"
        style={{ background: 'radial-gradient(ellipse 70% 100% at 50% 0%, rgba(245,244,239,0.015) 0%, transparent 100%)' }}
      />
      <div className="mx-auto max-w-content px-gutter py-section">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-slate">
          — HOW IT WORKS
        </p>
        <h2
          id="process-heading"
          className="font-geist font-bold tracking-tighter text-[length:var(--text-2xl)] leading-[1.05] text-chalk"
          data-reveal
          data-reveal-delay="0"
        >
          Four steps<span className="text-lime">.</span> No surprises<span className="text-lime">.</span>
        </h2>

        <div className="mt-16 flex flex-col gap-8 md:flex-row md:items-start md:gap-0">
          {STEPS.map((step, i) => (
            <Fragment key={step.num}>
              <div
                className="flex-1"
                data-reveal
                data-reveal-delay={String(i * 80)}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-lime">{step.num}</span>
                  <step.Icon size={16} strokeWidth={1.5} className="text-slate" />
                </div>
                <p className="mt-2 font-geist font-bold text-[length:var(--text-xl)] tracking-tight text-chalk">
                  {step.label}
                </p>
                <p className="font-mono text-xs uppercase tracking-widest text-slate mt-1">
                  {step.duration}
                </p>
                <p className="font-sans text-[length:var(--text-base)] text-chalk/70 mt-3 max-w-[220px]">
                  {step.copy}
                </p>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className="hidden md:block w-8 self-center mt-8 h-px bg-slate/30 process-line flex-shrink-0"
                  data-reveal
                  data-reveal-delay={String(i * 80 + 40)}
                />
              )}
            </Fragment>
          ))}
        </div>

        <p
          className="mt-16 text-center font-mono text-sm text-lime"
          data-reveal
          data-reveal-delay="320"
        >
          Fixed scope. Fixed price. No retainers.
        </p>
      </div>
    </section>
  )
}

export default Process
