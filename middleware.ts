import { NextRequest, NextResponse } from 'next/server'

const DOMAIN_MAP: Record<string, string> = {
  'build.bnzo.io': '/build',
  'lab.bnzo.io': '/lab',
  'learn.bnzo.io': '/learn',
  'erick.bnzo.io': '/founder',
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()

  // Support local dev via ?host= query param
  const hostOverride = url.searchParams.get('host')
  const host = hostOverride ?? req.headers.get('host') ?? ''

  // Strip port for local dev
  const hostname = host.split(':')[0]

  // www → apex redirect
  if (hostname === 'www.bnzo.io') {
    url.hostname = 'bnzo.io'
    url.searchParams.delete('host')
    return NextResponse.redirect(url, 301)
  }

  // /admin is apex-only. From a subdomain, redirect to apex.
  if (url.pathname.startsWith('/admin')) {
    if (hostname === 'bnzo.io' || hostname === 'localhost') {
      return NextResponse.next()
    }
    url.hostname = 'bnzo.io'
    url.searchParams.delete('host')
    return NextResponse.redirect(url)
  }

  const prefix = DOMAIN_MAP[hostname]
  if (!prefix) {
    // bnzo.io or localhost — pass through
    return NextResponse.next()
  }

  // Rewrite: keep URL on subdomain, serve from internal path
  url.pathname = `${prefix}${url.pathname}`
  url.searchParams.delete('host')
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)).*)',
  ],
}
