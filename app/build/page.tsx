import type { Metadata } from 'next'
import { getAllResources } from '@/lib/resources'
import { ResourceCard } from '@/components/build/ResourceCard'
import { BuildFilter } from '@/components/build/BuildFilter'

export const metadata: Metadata = {
  title: 'Resources',
  description:
    'Templates, starter kits, and reusable patterns for multi-agent Next.js builds.',
}

type SearchParams = { filter?: string }

export default async function BuildHomePage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const all = await getAllResources()
  const filter = searchParams.filter === 'free' || searchParams.filter === 'paid'
    ? searchParams.filter
    : 'all'

  const resources =
    filter === 'all' ? all : all.filter((r) => r.tier === filter)

  return (
    <>
      <section className="border-b border-slate/20 bg-ink text-chalk">
        <div className="mx-auto max-w-content px-6 py-24 md:py-32">
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-lime" data-reveal data-reveal-delay="0">
            build.bnzo.io
          </div>
          <h1
            className="mt-6 font-geist text-5xl font-bold leading-[0.95] tracking-tighter md:text-7xl"
            data-reveal
            data-reveal-delay="80"
          >
            Templates that ship
            <span className="text-lime">.</span>
          </h1>
          <p
            className="mt-6 max-w-prose font-sans text-lg leading-relaxed text-chalk/70"
            data-reveal
            data-reveal-delay="160"
          >
            Battle-tested scaffolds for multi-agent, multi-domain products.
            Stop copying from half-finished repos. Start from a tested base.
          </p>
        </div>
      </section>

      <section className="backdrop-blur-sm bg-black/[0.03] border-t border-slate/10">
        <div className="mx-auto max-w-content px-6 py-20">
          <div className="mb-10 flex items-end justify-between" data-reveal data-reveal-delay="0">
            <h2 className="font-geist text-2xl font-bold tracking-tight">
              All resources
            </h2>
            <BuildFilter current={filter} />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {resources.map((r, i) => (
              <div key={r.slug} data-reveal data-reveal-delay={String(i * 80)}>
                <ResourceCard resource={r} />
              </div>
            ))}
          </div>

          {resources.length === 0 ? (
            <p className="mt-12 text-center font-mono text-sm text-slate">
              No resources match this filter.
            </p>
          ) : null}
        </div>
      </section>
    </>
  )
}
