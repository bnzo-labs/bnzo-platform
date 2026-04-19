import { Syne, DM_Sans } from 'next/font/google'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'

export const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
})

export const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const geistSans = GeistSans
export const geistMono = GeistMono

export const fontVariables = [
  syne.variable,
  dmSans.variable,
  geistSans.variable,
  geistMono.variable,
].join(' ')
