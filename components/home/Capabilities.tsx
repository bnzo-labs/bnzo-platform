import { Smartphone, Blocks, BrainCircuit, Rocket } from 'lucide-react'

export function Capabilities() {
  return (
    <section
      aria-labelledby="capabilities-heading"
      className="section-capabilities relative text-chalk"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40"
        style={{ background: 'radial-gradient(ellipse 80% 100% at 50% 0%, rgba(245,244,239,0.02) 0%, transparent 100%)' }}
      />
      <div className="mx-auto max-w-content px-gutter py-section">
        <div className="mb-16" data-reveal data-reveal-delay="0">
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-slate">
            — CAPABILITIES
          </p>
          <h2
            id="capabilities-heading"
            className="font-geist font-bold tracking-tighter text-[length:var(--text-2xl)] leading-[1.05]"
          >
            Four things<span className="text-lime">.</span> Done well<span className="text-lime">.</span>
          </h2>
        </div>

        {/*
          Option A bento: 3-col grid
          Row 1: [01 col 1-2][02 col 3]
          Row 2: [03 col 1 ] [02 cont ]  ← col 2 row 2 is intentional negative space
          Row 3: [04 col 1-2]            ← col 3 row 3 is intentional negative space
        */}
        <ul className="grid grid-cols-1 gap-4 md:auto-rows-[minmax(200px,auto)] md:grid-cols-3">
          {/* 01 Apps — col-span-2, row 1 */}
          <li
            className="group flex flex-col justify-between rounded-lg border border-slate/20 bg-white/[0.03] p-6 transition-all duration-normal ease-out-expo hover:border-lime hover:shadow-lime-glow md:col-span-2"
            data-reveal
            data-reveal-delay="0"
          >
            <div className="flex items-start justify-between">
              <span className="font-mono text-sm text-lime">01</span>
              <Smartphone
                size={20}
                strokeWidth={1.5}
                className="text-chalk/30 transition-colors duration-fast group-hover:text-lime"
              />
            </div>
            <div>
              <h3 className="font-geist font-bold tracking-tight text-[length:var(--text-xl)] text-chalk">
                Apps
              </h3>
              <p className="mt-2 font-sans text-[length:var(--text-base)] text-chalk/70">
                Mobile and web. React Native (Expo) and Next.js. Production-ready on day one.
              </p>
            </div>
          </li>

          {/* 02 SaaS — col 3, row-span-2 (tall card) */}
          <li
            className="group flex flex-col justify-between rounded-lg border border-slate/20 bg-white/[0.03] p-6 transition-all duration-normal ease-out-expo hover:border-lime hover:shadow-lime-glow md:col-start-3 md:row-span-2"
            data-reveal
            data-reveal-delay="80"
          >
            <div className="flex items-start justify-between">
              <span className="font-mono text-sm text-lime">02</span>
              <Blocks
                size={20}
                strokeWidth={1.5}
                className="text-chalk/30 transition-colors duration-fast group-hover:text-lime"
              />
            </div>
            <div>
              <h3 className="font-geist font-bold tracking-tight text-[length:var(--text-xl)] text-chalk">
                SaaS
              </h3>
              <p className="mt-2 font-sans text-[length:var(--text-base)] text-chalk/70">
                Multi-tenant platforms with billing, auth, admin tools. Landing page to live customers.
              </p>
            </div>
          </li>

          {/* 03 AaaS — col 1, row 2 */}
          <li
            className="group flex flex-col justify-between rounded-lg border border-slate/20 bg-white/[0.03] p-6 transition-all duration-normal ease-out-expo hover:border-lime hover:shadow-lime-glow"
            data-reveal
            data-reveal-delay="160"
          >
            <div className="flex items-start justify-between">
              <span className="font-mono text-sm text-lime">03</span>
              <BrainCircuit
                size={20}
                strokeWidth={1.5}
                className="text-chalk/30 transition-colors duration-fast group-hover:text-lime"
              />
            </div>
            <div>
              <h3 className="font-geist font-bold tracking-tight text-[length:var(--text-xl)] text-chalk">
                AaaS
              </h3>
              <p className="mt-2 font-sans text-[length:var(--text-base)] text-chalk/70">
                Agents as a Service. Custom-built, goal-driven, always-on. They work. You don&apos;t.
              </p>
            </div>
          </li>

          {/* 04 MVPs from zero — col-span-2, row 3 */}
          <li
            className="group flex flex-col justify-between rounded-lg border border-slate/20 bg-white/[0.03] p-6 transition-all duration-normal ease-out-expo hover:border-lime hover:shadow-lime-glow md:col-span-2"
            data-reveal
            data-reveal-delay="240"
          >
            <div className="flex items-start justify-between">
              <span className="font-mono text-sm text-lime">04</span>
              <Rocket
                size={20}
                strokeWidth={1.5}
                className="text-chalk/30 transition-colors duration-fast group-hover:text-lime"
              />
            </div>
            <div>
              <h3 className="font-geist font-bold tracking-tight text-[length:var(--text-xl)] text-chalk">
                MVPs from zero
              </h3>
              <p className="mt-2 font-sans text-[length:var(--text-base)] text-chalk/70">
                From idea to live in 2–4 weeks. Fixed scope, fixed price.
              </p>
            </div>
          </li>
        </ul>
      </div>
    </section>
  )
}

export default Capabilities
