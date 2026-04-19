import { createServerClient, createBrowserClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Cookie domain: .bnzo.io in prod, undefined in preview/local
const cookieDomain =
  process.env.NEXT_PUBLIC_SITE_URL?.includes('bnzo.io') ? '.bnzo.io' : undefined

export function supabaseServer() {
  const cookieStore = cookies()
  return createServerClient(supabaseUrl, supabaseServiceRoleKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet: { name: string; value: string; options: Record<string, unknown> }[]) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, {
            ...options,
            domain: cookieDomain,
          })
        })
      },
    },
  })
}

export function supabaseBrowser() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
