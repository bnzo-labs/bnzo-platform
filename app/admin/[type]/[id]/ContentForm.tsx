'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ContentType } from '@/lib/cms-schemas'

const DEFAULTS: Record<ContentType, Record<string, unknown>> = {
  projects: {
    slug: '',
    title: '',
    description: '',
    body: '',
    status: 'In Progress',
    hero_image: '',
    problem: '',
    architecture: { stack: [], decisions: [] },
    agents: [],
    result: { metrics: [], outcomes: [] },
    learnings: { went_well: [], didnt: [] },
    published: false,
  },
  resources: {
    slug: '',
    title: '',
    description: '',
    body: '',
    price_cents: 0,
    price_id: null,
    tier: 'free',
    tags: [],
    download_url: null,
    published: false,
  },
  guides: {
    slug: '',
    title: '',
    description: '',
    body: '',
    hero_image: '',
    tags: [],
    reading_minutes: 5,
    published: false,
  },
}

function pretty(obj: unknown) {
  return JSON.stringify(obj, null, 2)
}

type Props = {
  type: ContentType
  id: string
  initial: Record<string, unknown> | null
}

export function ContentForm({ type, id, initial }: Props) {
  const router = useRouter()
  const isNew = id === 'new'
  const seed = initial ?? DEFAULTS[type]

  const [slug, setSlug] = useState<string>((seed.slug as string) ?? '')
  const [title, setTitle] = useState<string>((seed.title as string) ?? '')
  const [description, setDescription] = useState<string>(
    (seed.description as string) ?? '',
  )
  const [body, setBody] = useState<string>((seed.body as string) ?? '')
  const [published, setPublished] = useState<boolean>(
    (seed.published as boolean) ?? false,
  )

  // Shared "extras" blob — everything else as JSON textarea (keeps UI tight)
  const extrasSeed: Record<string, unknown> = { ...(seed as object) }
  delete extrasSeed.slug
  delete extrasSeed.title
  delete extrasSeed.description
  delete extrasSeed.body
  delete extrasSeed.published
  delete extrasSeed.id
  delete extrasSeed.created_at
  delete extrasSeed.updated_at
  const [extras, setExtras] = useState<string>(pretty(extrasSeed))

  const [state, setState] = useState<'idle' | 'saving' | 'error'>('idle')
  const [err, setErr] = useState<string>('')

  async function save() {
    setState('saving')
    setErr('')
    let extraObj: Record<string, unknown> = {}
    try {
      extraObj = extras.trim() ? JSON.parse(extras) : {}
    } catch (e) {
      setErr('extras JSON invalid')
      setState('error')
      return
    }
    const payload = {
      ...extraObj,
      slug,
      title,
      description,
      body,
      published,
    }
    const url = isNew
      ? `/api/admin/${type}`
      : `/api/admin/${type}/${id}`
    const method = isNew ? 'POST' : 'PATCH'
    const res = await fetch(url, {
      method,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const j = await res.json().catch(() => ({}))
      setErr(typeof j.error === 'string' ? j.error : 'save failed')
      setState('error')
      return
    }
    const { data } = await res.json()
    if (isNew && data?.id) {
      router.replace(`/admin/${type}/${data.id}`)
    }
    router.refresh()
    setState('idle')
  }

  async function remove() {
    if (isNew) return
    if (!confirm('Delete this row?')) return
    const res = await fetch(`/api/admin/${type}/${id}`, { method: 'DELETE' })
    if (res.ok) router.replace(`/admin/${type}`)
  }

  return (
    <div className="max-w-3xl">
      <header className="mb-8 flex items-end justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-slate">
            {type} / {isNew ? 'new' : id.slice(0, 8)}
          </p>
          <h1 className="mt-2 font-geist text-3xl font-bold tracking-tight">
            {isNew ? 'New entry' : title || '(untitled)'}
          </h1>
        </div>
        <div className="flex gap-3">
          {!isNew && (
            <button
              type="button"
              onClick={remove}
              className="rounded border border-red-500/40 px-3 py-2 font-mono text-xs uppercase tracking-widest text-red-400 hover:bg-red-500/10"
            >
              delete
            </button>
          )}
          <button
            type="button"
            onClick={save}
            disabled={state === 'saving'}
            className="rounded bg-lime px-4 py-2 font-mono text-xs font-semibold uppercase tracking-widest text-ink disabled:opacity-50"
          >
            {state === 'saving' ? 'saving…' : 'save'}
          </button>
        </div>
      </header>

      <div className="flex flex-col gap-5">
        <Field label="slug">
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full rounded border border-slate/30 bg-transparent px-3 py-2 font-mono text-sm text-chalk outline-none focus:border-lime"
          />
        </Field>
        <Field label="title">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded border border-slate/30 bg-transparent px-3 py-2 text-base text-chalk outline-none focus:border-lime"
          />
        </Field>
        <Field label="description">
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded border border-slate/30 bg-transparent px-3 py-2 text-sm text-chalk outline-none focus:border-lime"
          />
        </Field>
        <Field label="body (markdown / MDX)">
          <textarea
            rows={14}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full rounded border border-slate/30 bg-transparent px-3 py-2 font-mono text-sm text-chalk outline-none focus:border-lime"
          />
        </Field>
        <Field label="extras (JSON — type-specific fields)">
          <textarea
            rows={12}
            value={extras}
            onChange={(e) => setExtras(e.target.value)}
            className="w-full rounded border border-slate/30 bg-transparent px-3 py-2 font-mono text-xs text-chalk outline-none focus:border-lime"
          />
        </Field>
        <label className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-chalk">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="h-4 w-4 accent-lime"
          />
          published
        </label>

        {err && (
          <p className="rounded border border-red-500/40 bg-red-500/5 p-3 font-mono text-xs text-red-400">
            {err}
          </p>
        )}
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono text-xs uppercase tracking-widest text-slate">
        {label}
      </span>
      {children}
    </div>
  )
}
