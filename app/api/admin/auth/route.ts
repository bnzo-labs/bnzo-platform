import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabaseAuthClient } from '@/lib/admin-auth'

const sendSchema = z.object({
  email: z.string().email(),
})

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const parsed = sendSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_email' }, { status: 400 })
  }

  const allow = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)

  if (!allow.includes(parsed.data.email.toLowerCase())) {
    return NextResponse.json({ error: 'not_allowed' }, { status: 403 })
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(req.url).origin
  const supabase = supabaseAuthClient()
  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: { emailRedirectTo: `${origin}/admin/callback` },
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}

export async function DELETE() {
  const supabase = supabaseAuthClient()
  await supabase.auth.signOut()
  return NextResponse.json({ ok: true })
}
