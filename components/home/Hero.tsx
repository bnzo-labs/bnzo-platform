import { Wordmark } from '@/components/brand/Wordmark'
import { EmailCapture } from './EmailCapture'

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden text-chalk"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(to right, var(--color-chalk) 1px, transparent 1px), linear-gradient(to bottom, var(--color-chalk) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      <div className="relative mx-auto max-w-content px-gutter py-section">
        <p className="hero-line hero-line-0 mb-8 font-mono text-xs uppercase tracking-[0.25em] text-slate">
          bnzo studio / 2026 —
        </p>

        <div className="hero-line hero-line-1 flex items-baseline gap-4">
          <Wordmark
            variant="full"
            className="text-[length:var(--text-hero)] leading-none"
          />
        </div>

        <h1
          id="hero-heading"
          className="mt-8 max-w-3xl font-geist font-bold tracking-tighter text-[length:var(--text-2xl)] leading-[1.05]"
        >
          <span className="hero-line hero-line-2 block">We build with agents.</span>
          <span className="hero-line hero-line-3 block text-slate"> we teach how.</span>
        </h1>

        <p className="hero-line hero-line-4 mt-6 max-w-prose font-sans text-[length:var(--text-lg)] text-chalk/80">
          We ship production software with AI agents. Apps, SaaS, automations.
          Then we teach teams the playbook.
        </p>

        <div className="mt-12 max-w-xl" data-reveal data-reveal-delay="0">
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-slate">
            — field notes, drops occasionally
          </p>
          <EmailCapture source="bnzo" />
        </div>
      </div>
    </section>
  )
}

export default Hero
