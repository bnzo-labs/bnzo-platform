import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireAdmin } from '@/lib/admin-auth'
import { supabaseServer } from '@/lib/supabase'
import { CONTENT_TABLE, isContentType } from '@/lib/cms-schemas'

export const dynamic = 'force-dynamic'

type Row = {
  id: string
  slug: string
  title: string
  published: boolean
  updated_at: string
}

export default async function ListPage({ params }: { params: { type: string } }) {
  if (!isContentType(params.type)) notFound()
  await requireAdmin()

  const db = supabaseServer()
  const { data } = await db
    .from(CONTENT_TABLE[params.type])
    .select('id,slug,title,published,updated_at')
    .order('updated_at', { ascending: false })

  const rows = (data ?? []) as Row[]

  return (
    <div>
      <header className="mb-8 flex items-end justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-slate">
            {params.type}
          </p>
          <h1 className="mt-2 font-geist text-3xl font-bold tracking-tight">
            All {params.type}
          </h1>
        </div>
        <Link
          href={`/admin/${params.type}/new`}
          className="rounded bg-lime px-4 py-2 font-mono text-xs font-semibold uppercase tracking-widest text-ink"
        >
          + new
        </Link>
      </header>

      {rows.length === 0 ? (
        <p className="rounded border border-slate/25 bg-white/[0.02] p-8 text-center text-sm text-chalk/60">
          Nothing here yet. Create the first one.
        </p>
      ) : (
        <ul className="divide-y divide-slate/20 rounded border border-slate/25">
          {rows.map((row) => (
            <li key={row.id}>
              <Link
                href={`/admin/${params.type}/${row.id}`}
                className="flex items-center justify-between gap-4 p-4 hover:bg-white/[0.03]"
              >
                <div className="min-w-0">
                  <p className="truncate font-geist text-lg font-semibold">
                    {row.title || '(untitled)'}
                  </p>
                  <p className="truncate font-mono text-xs text-slate">
                    /{row.slug}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-4">
                  <span
                    className={
                      'rounded px-2 py-1 font-mono text-[10px] uppercase tracking-widest ' +
                      (row.published
                        ? 'bg-lime/15 text-lime'
                        : 'bg-slate/20 text-chalk/70')
                    }
                  >
                    {row.published ? 'live' : 'draft'}
                  </span>
                  <span className="font-mono text-xs text-chalk/40">
                    {new Date(row.updated_at).toISOString().slice(0, 10)}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
