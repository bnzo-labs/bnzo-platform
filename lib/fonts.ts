import { Syne } from 'next/font/google'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'

export const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-syne',
  display: 'swap',
})

export const geistSans = GeistSans
export const geistMono = GeistMono

export const fontVariables = [
  syne.variable,
  geistSans.variable,
  geistMono.variable,
].join(' ')
