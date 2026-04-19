import React from 'react'

interface Link {
  label: string
  href: string
  handle: string
}

const LINKS: Link[] = [
  { label: 'Email',    href: 'mailto:erick@bnzo.io',      handle: 'erick@bnzo.io' },
  { label: 'Twitter',  href: 'https://x.com/erickbenzo',  handle: '@erickbenzo' },
  { label: 'GitHub',   href: 'https://github.com/ebenzo', handle: '@ebenzo' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/erickbenzo', handle: 'in/erickbenzo' },
]

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-heading">
      <div className="mx-auto max-w-content px-gutter py-24 md:py-32">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.2fr_1fr] md:gap-20">
          <div className="flex flex-col gap-6">
            <p className="font-mono text-xs uppercase tracking-widest text-slate">
              Contact
            </p>
            <h2
              id="contact-heading"
              className="font-geist text-[clamp(2rem,1.5rem+2.5vw,3.5rem)] font-bold leading-[1] tracking-tight"
            >
              Say hi<span className="text-lime">.</span>
            </h2>
            <p className="max-w-prose text-base text-chalk/75 md:text-lg">
              Open to collaborations on agent-driven products, contract work on
              serious frontends, and conversations with other builders.
            </p>
          </div>

          <ul className="flex flex-col divide-y divide-slate/20 border-y border-slate/20">
            {LINKS.map(({ label, href, handle }) => {
              const external = href.startsWith('http')
              return (
                <li key={label}>
                  <a
                    href={href}
                    {...(external
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                    className="group flex items-center justify-between gap-6 py-5 transition-colors duration-fast hover:text-lime"
                  >
                    <span className="font-mono text-xs uppercase tracking-widest text-slate group-hover:text-lime">
                      {label}
                    </span>
                    <span className="font-geist text-lg font-semibold tracking-tight md:text-xl">
                      {handle}
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default Contact
