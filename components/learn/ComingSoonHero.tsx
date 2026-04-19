'use client'

import { useState } from 'react'

type Status = 'idle' | 'loading' | 'success' | 'error'

const BENEFITS = [
  'Early access to new courses',
  'Free, opinionated guides',
  'Real code from shipped products',
  'No newsletter spam',
] as const

export function ComingSoonHero() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'loading') return

    setStatus('loading')
    setMessage(null)

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'learn' }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        setStatus('error')
        setMessage(
          data?.error === 'invalid'
            ? 'Check that email address.'
            : 'Something broke. Try again shortly.',
        )
        return
      }

      setStatus('success')
      setMessage('You\u2019re on the list. Welcome email incoming.')
      setEmail('')
    } catch {
      setStatus('error')
      setMessage('Network error. Try again.')
    }
  }

  return (
    <section
      aria-labelledby="learn-hero-heading"
      className="border-b border-slate/20"
    >
      <div className="mx-auto max-w-content px-gutter py-24 md:py-32">
        <div className="grid gap-16 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <p className="mb-6 font-mono text-xs uppercase tracking-widest text-slate">
              bnzo learn <span className="text-lime">/</span> coming soon
            </p>
            <h1
              id="learn-hero-heading"
              className="font-geist font-bold leading-[0.95] tracking-tight text-ink"
              style={{ fontSize: 'var(--text-hero)' }}
            >
              Learn to build
              <br />
              with AI agents<span className="text-lime">.</span>
            </h1>
            <p
              className="mt-8 max-w-xl text-ink/70"
              style={{ fontSize: 'var(--text-lg)', lineHeight: 1.6 }}
            >
              Guides and courses launching soon. Practical, opinionated material
              from a studio that ships agent-built products.
            </p>

            <form
              onSubmit={onSubmit}
              className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-stretch"
              noValidate
            >
              <label htmlFor="learn-email" className="sr-only">
                Email address
              </label>
              <input
                id="learn-email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@studio.dev"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'loading'}
                className="flex-1 rounded-md border border-slate/40 bg-transparent px-4 py-3 font-mono text-sm text-ink placeholder:text-slate/70 outline-none transition-colors focus:border-ink disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="rounded-md bg-ink px-6 py-3 text-sm font-medium text-chalk transition-colors hover:bg-lime hover:text-ink disabled:opacity-60"
              >
                {status === 'loading' ? 'Joining\u2026' : 'Get early access'}
              </button>
            </form>

            {message && (
              <p
                role={status === 'error' ? 'alert' : 'status'}
                className={`mt-4 text-sm ${
                  status === 'error' ? 'text-red-700' : 'text-ink/70'
                }`}
              >
                {message}
              </p>
            )}
          </div>

          <aside className="md:col-span-4">
            <p className="mb-4 font-mono text-xs uppercase tracking-widest text-slate">
              What you get
            </p>
            <ul className="flex flex-col gap-3 border-l border-slate/30 pl-5">
              {BENEFITS.map((b) => (
                <li key={b} className="text-sm text-ink/80 leading-relaxed">
                  {b}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  )
}
