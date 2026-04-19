'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase'

export default function AdminCallback() {
  const router = useRouter()
  const [msg, setMsg] = useState('Finishing sign-in…')

  useEffect(() => {
    const supabase = supabaseBrowser()
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.replace('/admin')
      } else {
        setMsg('No session found. Try again from /admin/login.')
      }
    })
  }, [router])

  return (
    <div className="mx-auto max-w-md py-16 text-sm text-chalk/70">{msg}</div>
  )
}
