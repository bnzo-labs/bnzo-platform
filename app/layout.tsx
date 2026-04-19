import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { fontVariables } from '@/lib/fonts'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Bnzo Studio',
    template: '%s | Bnzo Studio',
  },
  description: 'We build with agents. We teach how.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bnzo.io'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={fontVariables}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
