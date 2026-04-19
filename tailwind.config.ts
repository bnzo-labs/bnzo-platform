import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: 'var(--color-ink)',
        chalk: 'var(--color-chalk)',
        lime: 'var(--color-lime)',
        'lime-deep': 'var(--color-lime-deep)',
        slate: 'var(--color-slate)',
      },
      fontFamily: {
        syne: ['var(--font-syne)', 'sans-serif'],
        geist: ['var(--font-geist-sans)', 'sans-serif'],
        sans: ['var(--font-geist-sans)', 'sans-serif'],
        'dm-sans': ['var(--font-dm-sans)', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      maxWidth: {
        content: '1200px',
        prose: '720px',
      },
      spacing: {
        section: 'var(--space-section)',
        gutter: 'var(--space-gutter)',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        fast: '150ms',
        normal: '300ms',
        slow: '600ms',
      },
      letterSpacing: {
        tight: '-0.02em',
        tighter: '-0.04em',
      },
    },
  },
  plugins: [],
}

export default config
