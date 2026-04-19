'use client'

import { useState } from 'react'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [err, setErr] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setState('sending')
    setErr('')
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    if (!res.ok) {
      const j = await res.json().catch(() => ({}))
      setErr(j.error ?? 'error')
      setState('error')
      return
    }
    setState('sent')
  }

  return (
    <div className="mx-auto max-w-md py-16">
      <h1 className="mb-3 font-geist text-3xl font-bold tracking-tight">
        Sign in<span className="text-lime">.</span>
      </h1>
      <p className="mb-8 text-sm text-chalk/60">
        Admin-only. Magic link sent to allowlisted emails.
      </p>

      {state === 'sent' ? (
        <p className="rounded border border-lime/40 bg-lime/5 p-4 text-sm text-chalk">
          Check your inbox. Click the link to sign in.
        </p>
      ) : (
        <form onSubmit={submit} className="flex flex-col gap-3">
          <label className="font-mono text-xs uppercase tracking-widest text-slate">
            email
          </label>
          <input
            type="email"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded border border-slate/30 bg-transparent px-4 py-3 font-mono text-sm text-chalk outline-none focus:border-lime"
          />
          <button
            type="submit"
            disabled={state === 'sending'}
            className="mt-2 rounded bg-lime px-4 py-3 font-mono text-xs font-semibold uppercase tracking-widest text-ink disabled:opacity-50"
          >
            {state === 'sending' ? 'sending…' : 'send magic link'}
          </button>
          {err && (
            <p className="text-sm text-red-400">
              {err === 'not_allowed' ? 'Email not on allowlist.' : err}
            </p>
          )}
        </form>
      )}
    </div>
  )
}
