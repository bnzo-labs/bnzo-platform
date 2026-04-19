'use client'

import { useState } from 'react'
import type { Resource } from '@/lib/resources'

interface PurchaseCTAProps {
  resource: Resource
}

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(0)}`
}

export function PurchaseCTA({ resource }: PurchaseCTAProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handlePurchase() {
    setLoading(true)
    setError(null)
    try {
      const origin = window.location.origin
      const basePath = `/${resource.slug}`
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          priceId: resource.priceId,
          successUrl: `${origin}${basePath}?success=true`,
          cancelUrl: `${origin}${basePath}`,
        }),
      })
      if (!res.ok) {
        throw new Error('checkout_failed')
      }
      const data = (await res.json()) as { url: string }
      window.location.href = data.url
    } catch {
      setError('Checkout failed. Try again.')
      setLoading(false)
    }
  }

  return (
    <aside className="sticky top-8 rounded-lg border border-slate/30 bg-ink p-6 text-chalk">
      <div className="font-mono text-xs uppercase tracking-wider text-slate">
        One-time purchase
      </div>
      <div className="mt-2 font-geist text-4xl font-bold tracking-tight">
        {formatPrice(resource.price)}
      </div>
      <ul className="mt-6 space-y-2 text-sm text-chalk/80">
        <li>· Lifetime access</li>
        <li>· Source files + docs</li>
        <li>· Private repo invite</li>
      </ul>
      <button
        type="button"
        onClick={handlePurchase}
        disabled={loading}
        className="mt-6 w-full rounded-md bg-lime px-6 py-3 font-sans font-medium text-ink transition-opacity duration-fast hover:opacity-90 disabled:opacity-50"
      >
        {loading ? 'Redirecting…' : 'Purchase'}
      </button>
      {error ? (
        <p className="mt-3 font-mono text-xs text-lime">{error}</p>
      ) : null}
    </aside>
  )
}

export default PurchaseCTA
