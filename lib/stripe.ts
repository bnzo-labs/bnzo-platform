import Stripe from 'stripe'

let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-02-24.acacia',
      typescript: true,
    })
  }
  return _stripe
}


export type ProductKey = 'starter-kit'

const PRICE_ENV_MAP: Record<ProductKey, string> = {
  'starter-kit': 'STRIPE_PRICE_STARTER_KIT',
}

export function getPriceId(product: ProductKey): string {
  const envKey = PRICE_ENV_MAP[product]
  const priceId = process.env[envKey]
  if (!priceId) {
    throw new Error(`Missing env var: ${envKey}`)
  }
  return priceId
}
