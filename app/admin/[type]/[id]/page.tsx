import { notFound } from 'next/navigation'
import { requireAdmin } from '@/lib/admin-auth'
import { supabaseServer } from '@/lib/supabase-server'
import { CONTENT_TABLE, isContentType } from '@/lib/cms-schemas'
import { ContentForm } from './ContentForm'

export const dynamic = 'force-dynamic'

export default async function EditPage({
  params,
}: {
  params: { type: string; id: string }
}) {
  if (!isContentType(params.type)) notFound()
  await requireAdmin()

  let initial: Record<string, unknown> | null = null

  if (params.id !== 'new') {
    const db = supabaseServer()
    const { data } = await db
      .from(CONTENT_TABLE[params.type])
      .select('*')
      .eq('id', params.id)
      .maybeSingle()
    if (!data) notFound()
    initial = data
  }

  return <ContentForm type={params.type} id={params.id} initial={initial} />
}
