import { ArrowRight } from 'lucide-react'
import { getWorkItems } from '@/lib/work'
import { WorkCard } from '@/components/home/WorkCard'

export async function WorkGrid() {
  const items = await getWorkItems()

  return (
    <section
      id="recent-work"
      aria-labelledby="work-heading"
      className="section-workgrid relative text-chalk"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-32"
        style={{ background: 'radial-gradient(ellipse 60% 100% at 20% 0%, rgba(200,255,0,0.015) 0%, transparent 100%)' }}
      />
      <div className="mx-auto max-w-content px-gutter py-section">
        <div
          className="mb-16 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
          data-reveal
          data-reveal-delay="0"
        >
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-slate">
              — SELECTED WORK
            </p>
            <h2
              id="work-heading"
              className="font-geist font-bold tracking-tighter text-[length:var(--text-2xl)] leading-[1.05]"
            >
              Recent drops<span className="text-lime">.</span>
            </h2>
          </div>
          <p className="font-mono text-sm text-slate">
            Production software, shipped fast.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item, i) => (
            <WorkCard key={item.slug} item={item} index={i} />
          ))}
        </div>

        <div className="mt-12">
          <a
            href="https://lab.bnzo.io"
            className="inline-flex items-center gap-1.5 font-mono text-sm text-chalk/70 transition-all duration-fast hover:text-lime"
          >
            All case studies
            <ArrowRight size={13} strokeWidth={2} />
          </a>
        </div>
      </div>
    </section>
  )
}

export default WorkGrid
