import { ArrowRight } from 'lucide-react'

const WORDS = [
  'Software',
  "shouldn't",
  'take',
  'six',
  'months',
  'anymore',
]

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden text-chalk"
    >
      <div className="relative mx-auto max-w-content px-gutter py-section">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-slate mb-6">
          — BNZO STUDIO / 2026
        </p>

        <h1
          id="hero-heading"
          className="font-geist font-bold tracking-tighter text-[length:var(--text-hero)] leading-[0.95] text-chalk"
        >
          {WORDS.map((word, i) => (
            <span key={word} className={`hero-word hero-word-${i}`}>
              {word}{i < WORDS.length - 1 ? ' ' : ''}
            </span>
          ))}<span className="text-lime">.</span>
        </h1>

        <p className="font-sans text-[length:var(--text-lg)] text-chalk/70 max-w-prose mt-6">
          bnzo is the studio for founders who refuse to wait. AI agents in the
          build pipeline + senior engineers in the loop = production apps, SaaS,
          and automations shipped in weeks.
        </p>

        <div
          className="relative mt-10"
          style={{
            background:
              'radial-gradient(circle at 30% 50%, rgba(200,255,0,0.08) 0%, transparent 60%)',
          }}
        >
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="https://cal.com/erick-bnzo/discovery"
              className="inline-flex items-center gap-2 bg-lime text-ink font-mono text-sm font-medium px-6 py-3 rounded-[6px] shadow-lime-glow hover:scale-[1.02] active:scale-[0.98] transition duration-normal ease-out-expo"
            >
              Book a call
              <ArrowRight size={14} strokeWidth={2} />
            </a>
            <a
              href="#recent-work"
              className="inline-flex items-center gap-1.5 font-mono text-sm text-chalk/60 hover:text-chalk transition duration-fast"
            >
              See recent work
              <ArrowRight size={12} strokeWidth={2} />
            </a>
          </div>
          <p className="font-mono text-xs uppercase tracking-widest text-slate mt-8">
            TRUSTED BY · COOK FOR FRIENDS MTL · BONITA RITUALS · JAILBREAK.LIVE · AIMADEMEDOIT
          </p>
        </div>
      </div>
    </section>
  )
}

export default Hero
