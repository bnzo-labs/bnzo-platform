import React from 'react'

export function AboutHero() {
  return (
    <section
      aria-labelledby="about-heading"
      className="border-b border-slate/15"
    >
      <div className="mx-auto grid max-w-content grid-cols-1 gap-12 px-gutter py-24 md:grid-cols-[1.4fr_1fr] md:gap-16 md:py-32">
        <div className="flex flex-col gap-6">
          <p className="font-mono text-xs uppercase tracking-widest text-lime">
            /founder
          </p>
          <h1
            id="about-heading"
            className="font-geist text-[clamp(2.5rem,1.5rem+5vw,5.5rem)] font-bold leading-[0.95] tracking-tighter"
          >
            Erick Benzo<span className="text-lime">.</span>
          </h1>
          <p className="max-w-prose text-lg text-chalk/80 md:text-xl">
            Founder &amp; Fullstack Developer. I build products with AI agents
            and write about how the work actually goes.
          </p>
        </div>

        <div className="flex items-start justify-start md:justify-end">
          <div
            aria-hidden="true"
            className="relative flex aspect-square w-full max-w-[280px] items-center justify-center overflow-hidden rounded-lg border border-slate/25 bg-white/[0.03]"
          >
            <span className="font-geist text-7xl font-bold text-chalk/25">
              EB
            </span>
            <span className="absolute bottom-3 right-3 font-mono text-[10px] uppercase tracking-widest text-slate">
              avatar
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-content px-gutter pb-24 md:pb-32">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[180px_1fr] md:gap-16">
          <p className="font-mono text-xs uppercase tracking-widest text-slate">
            About
          </p>
          <div className="flex max-w-prose flex-col gap-6 text-base leading-relaxed text-chalk/85 md:text-lg">
            <p>
              I&apos;ve been building for the web for 14 years. Most of that
              time was spent deep in frontend — React, Next.js, design systems,
              and the messy real work of making products feel right on every
              screen. I&apos;ve shipped marketing sites, marketplaces, SaaS
              dashboards, and a few things that never made it out of a
              warehouse.
            </p>
            <p>
              These days I&apos;m building with AI agents. Orchestrating Claude
              across real codebases, designing multi-agent workflows, and
              treating prompts like production code. I document it in public
              — the good runs, the broken loops, the honest receipts. This
              site is a snapshot of that work.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutHero
