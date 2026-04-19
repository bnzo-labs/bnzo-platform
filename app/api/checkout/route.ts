import { NextResponse } from 'next/server'
import { z, ZodError } from 'zod'
import { getStripe } from '@/lib/stripe'

export const dynamic = 'force-dynamic'

const Schema = z.object({
  priceId: z.string().min(1),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
  email: z.string().email().optional(),
})

export async function POST(req: Request) {
  try {
    const body = Schema.parse(await req.json())

    const session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: body.priceId, quantity: 1 }],
      success_url: body.successUrl,
      cancel_url: body.cancelUrl,
      customer_email: body.email,
      allow_promotion_codes: true,
    })

    if (!session.url) {
      return NextResponse.json({ error: 'internal' }, { status: 500 })
    }

    return NextResponse.json({ url: session.url })
  } catch (e) {
    if (e instanceof ZodError) {
      return NextResponse.json({ error: 'invalid' }, { status: 400 })
    }
    console.error('[api/checkout]', e)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}
