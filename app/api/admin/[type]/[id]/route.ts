import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { supabaseServer } from '@/lib/supabase-server'
import { requireAdminApi, AdminAuthError } from '@/lib/admin-auth'
import {
  CONTENT_TABLE,
  SCHEMAS,
  isContentType,
  type ContentType,
} from '@/lib/cms-schemas'

const REVALIDATE: Record<ContentType, string[]> = {
  projects: ['/lab'],
  resources: ['/build'],
  guides: ['/learn'],
}

function touch(type: ContentType) {
  REVALIDATE[type].forEach((p) => revalidatePath(p, 'page'))
}

async function guard(type: string): Promise<ContentType | NextResponse> {
  if (!isContentType(type)) {
    return NextResponse.json({ error: 'bad_type' }, { status: 400 })
  }
  try {
    await requireAdminApi()
  } catch (e) {
    if (e instanceof AdminAuthError) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }
    throw e
  }
  return type
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { type: string; id: string } },
) {
  const g = await guard(params.type)
  if (g instanceof NextResponse) return g

  const db = supabaseServer()
  const { data, error } = await db
    .from(CONTENT_TABLE[g])
    .select('*')
    .eq('id', params.id)
    .maybeSingle()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data) return NextResponse.json({ error: 'not_found' }, { status: 404 })
  return NextResponse.json({ data })
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { type: string; id: string } },
) {
  const g = await guard(params.type)
  if (g instanceof NextResponse) return g

  const raw = await req.json().catch(() => null)
  const parsed = SCHEMAS[g].partial().safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid', issues: parsed.error.issues }, { status: 400 })
  }

  const db = supabaseServer()
  const { data, error } = await db
    .from(CONTENT_TABLE[g])
    .update(parsed.data)
    .eq('id', params.id)
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  touch(g)
  return NextResponse.json({ data })
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { type: string; id: string } },
) {
  const g = await guard(params.type)
  if (g instanceof NextResponse) return g

  const db = supabaseServer()
  const { error } = await db.from(CONTENT_TABLE[g]).delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  touch(g)
  return NextResponse.json({ ok: true })
}
