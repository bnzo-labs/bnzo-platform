export function Founder() {
  return (
    <section
      aria-labelledby="founder-heading"
      className="section-founder relative"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-32"
        style={{ background: 'radial-gradient(ellipse 60% 100% at 80% 0%, rgba(107,104,104,0.05) 0%, transparent 100%)' }}
      />
      <div className="mx-auto max-w-content px-gutter py-section">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-slate">
          — FOUNDER
        </p>
        <h2 id="founder-heading" className="sr-only">
          Founder
        </h2>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
          <div className="relative" data-reveal data-reveal-delay="0">
            <img
              src="/founder.jpg"
              alt="Erick Benzo, founder of bnzo studio"
              width={600}
              height={750}
              loading="lazy"
              className="w-full aspect-[4/5] object-cover rounded-sm"
            />
          </div>
          <div className="flex flex-col justify-center gap-6">
            <p
              className="font-sans text-[length:var(--text-base)] text-chalk/80 leading-relaxed"
              data-reveal
              data-reveal-delay="80"
            >
              I&apos;m Erick. I&apos;ve been shipping software for 14 years — the last
              two with AI agents in the build loop. bnzo is the studio I wish
              I&apos;d had as a founder.
            </p>
            <p
              className="font-sans text-[length:var(--text-base)] text-chalk/80 leading-relaxed"
              data-reveal
              data-reveal-delay="160"
            >
              I started bnzo because I was tired of two extremes: agencies that
              bill for months and ship nothing, and AI tools that ship demos that
              never make it to production. There&apos;s a third path — senior
              engineering plus parallel AI agents — and that&apos;s what we run here.
            </p>
            <p
              className="font-sans text-[length:var(--text-base)] text-chalk/80 leading-relaxed"
              data-reveal
              data-reveal-delay="240"
            >
              If you&apos;re a founder who needs to ship now, I&apos;d like to talk.
            </p>
            <a
              href="https://erick.bnzo.io"
              className="font-mono text-sm text-lime hover:text-chalk transition duration-fast"
              data-reveal
              data-reveal-delay="320"
            >
              Read full story → erick.bnzo.io
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Founder
