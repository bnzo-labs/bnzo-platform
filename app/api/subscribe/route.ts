import { NextRequest, NextResponse } from 'next/server'
import { z, ZodError } from 'zod'
import { supabaseServer } from '@/lib/supabase'
import { sendWelcomeEmail } from '@/lib/resend'

export const dynamic = 'force-dynamic'

const SubscribeSchema = z.object({
  email: z.string().email(),
  source: z.enum(['bnzo', 'learn']),
})

export async function POST(req: NextRequest) {
  try {
    const body = SubscribeSchema.parse(await req.json())

    const supabase = supabaseServer()
    const { error: dbError } = await supabase
      .from('subscribers')
      .upsert({ email: body.email, source: body.source }, { onConflict: 'email' })

    if (dbError) {
      console.error('[subscribe] db error', dbError)
      return NextResponse.json({ error: 'internal' }, { status: 500 })
    }

    try {
      await sendWelcomeEmail(body.email, body.source)
    } catch (emailError) {
      // Subscriber row is written — email retry handled separately
      console.error('[subscribe] email send failed', emailError)
      return NextResponse.json({ error: 'internal' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    if (e instanceof ZodError) {
      return NextResponse.json({ error: 'invalid' }, { status: 400 })
    }
    console.error('[subscribe]', e)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}
