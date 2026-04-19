import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'bnzo admin',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ink text-chalk">
      <header className="border-b border-slate/25">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/admin"
            className="font-mono text-xs uppercase tracking-widest text-chalk hover:text-lime"
          >
            bnzo / admin
          </Link>
          <nav className="flex gap-6 font-mono text-xs uppercase tracking-widest">
            <Link href="/admin/projects" className="text-chalk/70 hover:text-lime">
              projects
            </Link>
            <Link href="/admin/resources" className="text-chalk/70 hover:text-lime">
              resources
            </Link>
            <Link href="/admin/guides" className="text-chalk/70 hover:text-lime">
              guides
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  )
}
