import Link from 'next/link'
import { requireAdmin } from '@/lib/admin-auth'
import { supabaseServer } from '@/lib/supabase-server'
import { CONTENT_TABLE, ContentTypes } from '@/lib/cms-schemas'

export const dynamic = 'force-dynamic'

export default async function AdminHome() {
  const email = await requireAdmin()
  const db = supabaseServer()

  const counts = await Promise.all(
    ContentTypes.map(async (type) => {
      const { count } = await db
        .from(CONTENT_TABLE[type])
        .select('id', { count: 'exact', head: true })
      const { count: published } = await db
        .from(CONTENT_TABLE[type])
        .select('id', { count: 'exact', head: true })
        .eq('published', true)
      return { type, total: count ?? 0, published: published ?? 0 }
    }),
  )

  return (
    <div>
      <header className="mb-10">
        <p className="font-mono text-xs uppercase tracking-widest text-slate">
          signed in as {email}
        </p>
        <h1 className="mt-2 font-geist text-4xl font-bold tracking-tight">
          Content<span className="text-lime">.</span>
        </h1>
      </header>

      <ul className="grid gap-4 md:grid-cols-3">
        {counts.map(({ type, total, published }) => (
          <li key={type}>
            <Link
              href={`/admin/${type}`}
              className="group block rounded-lg border border-slate/25 bg-white/[0.02] p-6 transition-colors hover:border-lime/50"
            >
              <p className="font-mono text-xs uppercase tracking-widest text-slate">
                {type}
              </p>
              <p className="mt-4 font-geist text-3xl font-bold">{total}</p>
              <p className="mt-1 text-sm text-chalk/60">
                {published} published
              </p>
              <p className="mt-6 font-mono text-xs uppercase tracking-widest text-chalk/50 group-hover:text-lime">
                manage →
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
