// API route request/response types

// POST /api/checkout
export type CheckoutRequest = {
  priceId: string
  successUrl: string
  cancelUrl: string
  email?: string
}

export type CheckoutResponse = { url: string }

// POST /api/webhooks/stripe
export type WebhookResponse = { received: true }

// POST /api/subscribe
export type SubscribeRequest = {
  email: string
  source: 'bnzo' | 'learn'
}

export type SubscribeResponse = { ok: true }

// Shared error shape
export type ApiError = { error: string }
