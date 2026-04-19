'use client'

import { useState, FormEvent } from 'react'

type Status = 'idle' | 'loading' | 'success' | 'error'

interface EmailCaptureProps {
  source?: 'bnzo' | 'learn'
  className?: string
}

export function EmailCapture({ source = 'bnzo', className = '' }: EmailCaptureProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'loading') return

    setStatus('loading')
    setMessage('')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      })

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string }
        setStatus('error')
        setMessage(
          data.error === 'invalid'
            ? 'that email no work. try again.'
            : 'something broke. try again soon.',
        )
        return
      }

      setStatus('success')
      setMessage('you in. check inbox.')
      setEmail('')
    } catch {
      setStatus('error')
      setMessage('network error. try again.')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-col gap-3 sm:flex-row sm:items-stretch ${className}`}
      noValidate
    >
      <label htmlFor="email-capture" className="sr-only">
        Email address
      </label>
      <input
        id="email-capture"
        type="email"
        name="email"
        required
        autoComplete="email"
        placeholder="you@domain.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={status === 'loading'}
        aria-invalid={status === 'error'}
        aria-describedby="email-capture-feedback"
        className="flex-1 rounded-md border border-slate/40 bg-transparent px-4 py-3 text-chalk placeholder:text-slate focus:border-lime focus:outline-none focus-visible:outline-none"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="rounded-md bg-lime px-6 py-3 font-sans font-medium text-ink transition-colors duration-fast hover:bg-chalk disabled:opacity-60"
      >
        {status === 'loading' ? 'sending...' : 'subscribe'}
      </button>
      <p
        id="email-capture-feedback"
        role="status"
        aria-live="polite"
        className={`sm:w-full text-sm ${
          status === 'error' ? 'text-lime' : 'text-slate'
        }`}
      >
        {message}
      </p>
    </form>
  )
}

export default EmailCapture
