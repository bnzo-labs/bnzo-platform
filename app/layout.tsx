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
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
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
        {process.env.VERCEL && <Analytics />}
      </body>
    </html>
  )
}
