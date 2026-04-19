import { NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { getStripe } from '@/lib/stripe'
import { supabaseServer } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export const runtime = 'nodejs'

export async function POST(req: NextRequest): Promise<NextResponse> {
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'missing signature' }, { status: 400 })
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('[webhook/stripe] STRIPE_WEBHOOK_SECRET not set')
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }

  let event: Stripe.Event

  try {
    const rawBody = await req.text()
    event = getStripe().webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    )
  } catch (e) {
    console.error('[webhook/stripe] signature verification failed', e)
    return NextResponse.json({ error: 'invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      default:
        // Unhandled event — acknowledge and ignore
        break
    }
  } catch (e) {
    console.error('[webhook/stripe] handler error', { type: event.type }, e)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
  const email = session.customer_details?.email
  if (!email) {
    console.error('[webhook/stripe] checkout.session.completed missing email', {
      sessionId: session.id,
    })
    return
  }

  const productId = (session.metadata?.product_id as string | undefined) ?? 'unknown'
  const userId = (session.metadata?.user_id as string | undefined) ?? null
  const amountCents = session.amount_total ?? 0

  const supabase = supabaseServer()

  const { error } = await supabase.from('purchases').upsert(
    {
      user_id: userId,
      email,
      product_id: productId,
      stripe_session_id: session.id,
      amount_cents: amountCents,
    },
    { onConflict: 'stripe_session_id' },
  )

  if (error) {
    console.error('[webhook/stripe] purchases insert failed', {
      sessionId: session.id,
      error,
    })
    throw new Error(`DB write failed: ${error.message}`)
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
  // MVP: log for now — no subscription status column yet
  console.log('[webhook/stripe] subscription deleted', { subscriptionId: subscription.id })
}
