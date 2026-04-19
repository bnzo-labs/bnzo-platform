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

export async function GET(
  _req: NextRequest,
  { params }: { params: { type: string } },
) {
  if (!isContentType(params.type)) {
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
  const db = supabaseServer()
  const { data, error } = await db
    .from(CONTENT_TABLE[params.type])
    .select('*')
    .order('updated_at', { ascending: false })
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ data })
}

export async function POST(
  req: NextRequest,
  { params }: { params: { type: string } },
) {
  if (!isContentType(params.type)) {
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

  const raw = await req.json().catch(() => null)
  const schema = SCHEMAS[params.type]
  const parsed = schema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid', issues: parsed.error.issues }, { status: 400 })
  }

  const db = supabaseServer()
  const { data, error } = await db
    .from(CONTENT_TABLE[params.type])
    .insert(parsed.data)
    .select('*')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  touch(params.type)
  return NextResponse.json({ data }, { status: 201 })
}
