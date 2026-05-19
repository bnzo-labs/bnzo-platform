import { Bot, Users, Package } from 'lucide-react'

export function Pitch() {
  return (
    <section aria-labelledby="pitch-heading" className="section-pitch relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40"
        style={{ background: 'radial-gradient(ellipse 80% 100% at 50% 0%, rgba(245,244,239,0.018) 0%, transparent 100%)' }}
      />
      <div className="mx-auto max-w-content px-gutter py-section">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-slate">
          — WHY BNZO
        </p>
        <h2
          id="pitch-heading"
          className="mb-16 font-geist font-bold tracking-tighter text-[length:var(--text-2xl)] leading-[1.05] text-chalk"
          data-reveal
          data-reveal-delay="0"
        >
          We ship in weeks<span className="text-lime">.</span> With senior engineering<span className="text-lime">.</span> With AI agents where they help, humans where they matter<span className="text-lime">.</span>
        </h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div
            className="md:border-r md:border-slate/20 md:pr-8"
            data-reveal
            data-reveal-delay="80"
          >
            <Bot size={20} strokeWidth={1.5} className="mb-4 text-lime" />
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-lime">
              AI-NATIVE DELIVERY
            </p>
            <p className="font-sans text-chalk/70">
              Parallel agent waves compress months of work into weeks. We use AI in the build pipeline — not as a marketing tagline.
            </p>
          </div>

          <div
            className="md:border-r md:border-slate/20 md:px-8"
            data-reveal
            data-reveal-delay="160"
          >
            <Users size={20} strokeWidth={1.5} className="mb-4 text-lime" />
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-lime">
              SENIOR ENGINEERS IN THE LOOP
            </p>
            <p className="font-sans text-chalk/70">
              Every line is reviewed by humans who&apos;ve shipped production code for 10+ years. AI accelerates. Humans decide.
            </p>
          </div>

          <div
            className="md:pl-8"
            data-reveal
            data-reveal-delay="240"
          >
            <Package size={20} strokeWidth={1.5} className="mb-4 text-lime" />
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-lime">
              PRODUCTION, NOT PROTOTYPES
            </p>
            <p className="font-sans text-chalk/70">
              Deployed software with real users on day one. No demos that rot in staging. No retainers without shipping.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Pitch
