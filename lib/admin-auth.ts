import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { redirect } from 'next/navigation'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const cookieDomain =
  process.env.NEXT_PUBLIC_SITE_URL?.includes('bnzo.io') ? '.bnzo.io' : undefined

function authClient() {
  const store = cookies()
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return store.getAll()
      },
      setAll(toSet: { name: string; value: string; options: Record<string, unknown> }[]) {
        toSet.forEach(({ name, value, options }) => {
          store.set(name, value, { ...options, domain: cookieDomain })
        })
      },
    },
  })
}

function allowlist(): string[] {
  return (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
}

export async function getAdminEmail(): Promise<string | null> {
  const { data } = await authClient().auth.getUser()
  const email = data.user?.email?.toLowerCase()
  if (!email) return null
  const allowed = allowlist()
  if (allowed.length === 0) return null
  return allowed.includes(email) ? email : null
}

export async function requireAdmin(): Promise<string> {
  const email = await getAdminEmail()
  if (!email) redirect('/admin/login')
  return email
}

export async function requireAdminApi(): Promise<string> {
  const email = await getAdminEmail()
  if (!email) throw new AdminAuthError()
  return email
}

export class AdminAuthError extends Error {
  constructor() {
    super('admin auth required')
  }
}

export { authClient as supabaseAuthClient }
