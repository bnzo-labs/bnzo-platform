/**
 * Auth Cross-Domain Test — bnzo-platform
 *
 * STATUS: Auth not yet implemented in Wave 3.
 * These tests are documented and structured for when Supabase auth lands.
 *
 * Architecture intent:
 * - Supabase cookie domain: `.bnzo.io`
 * - Session cookie set on bnzo.io login must be readable on all subdomains
 * - Cookie name: `sb-<project-ref>-auth-token` (Supabase SSR default)
 *
 * Tests below are skipped unless AUTH_IMPLEMENTED=true env var is set.
 * They document the expected behavior for the auth developer.
 */
import { test, expect } from '@playwright/test'

const BASE = process.env.BASE_URL ?? 'http://localhost:3000'
const AUTH_IMPLEMENTED = process.env.AUTH_IMPLEMENTED === 'true'

test.describe('Auth cross-domain session', () => {
  test.skip(!AUTH_IMPLEMENTED, 'Auth not yet implemented — set AUTH_IMPLEMENTED=true when ready')

  test('sign in on bnzo.io sets session cookie with domain .bnzo.io', async ({ page, context }) => {
    // Navigate to login page on bnzo.io
    await page.goto(`${BASE}/login`)
    await expect(page.locator('input[type="email"]')).toBeVisible()

    // Sign in with test credentials
    const testEmail = process.env.TEST_AUTH_EMAIL!
    const testPassword = process.env.TEST_AUTH_PASSWORD!
    await page.fill('input[type="email"]', testEmail)
    await page.fill('input[type="password"]', testPassword)
    await page.click('button[type="submit"]')

    // Wait for redirect post-login
    await page.waitForURL(/\/(dashboard|$)/, { timeout: 10_000 })

    // Check auth cookie is present
    const cookies = await context.cookies()
    const authCookie = cookies.find((c) => c.name.includes('auth-token'))
    expect(authCookie).toBeDefined()
    // Cookie domain must be .bnzo.io for cross-subdomain sharing
    expect(authCookie?.domain).toBe('.bnzo.io')
  })

  test('session persists when navigating to build.bnzo.io', async ({ page, context }) => {
    // Sign in on bnzo.io first
    await page.goto(`${BASE}/login`)
    const testEmail = process.env.TEST_AUTH_EMAIL!
    const testPassword = process.env.TEST_AUTH_PASSWORD!
    await page.fill('input[type="email"]', testEmail)
    await page.fill('input[type="password"]', testPassword)
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/(dashboard|$)/, { timeout: 10_000 })

    // Navigate to build.bnzo.io (simulated via host param)
    await page.goto(`${BASE}?host=build.bnzo.io`)

    // Session cookie still present after navigation
    const cookies = await context.cookies()
    const authCookie = cookies.find((c) => c.name.includes('auth-token'))
    expect(authCookie).toBeDefined()

    // If build domain has a user indicator (nav avatar, email display, etc.)
    // uncomment and adapt:
    // await expect(page.locator('[data-testid="user-indicator"]')).toBeVisible()
  })

  test('unauthenticated user on protected route gets redirected to login', async ({ page }) => {
    // Clear cookies first (ensure unauthenticated state)
    await page.context().clearCookies()

    // Attempt to access a protected route (adjust path when auth lands)
    await page.goto(`${BASE}/dashboard`)

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/)
  })

  test('sign out clears session cookie', async ({ page, context }) => {
    // Sign in
    await page.goto(`${BASE}/login`)
    const testEmail = process.env.TEST_AUTH_EMAIL!
    const testPassword = process.env.TEST_AUTH_PASSWORD!
    await page.fill('input[type="email"]', testEmail)
    await page.fill('input[type="password"]', testPassword)
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/(dashboard|$)/, { timeout: 10_000 })

    // Sign out
    await page.click('[data-testid="sign-out-button"]')
    await page.waitForURL(/\/login/, { timeout: 5_000 })

    // Auth cookie should be gone or expired
    const cookies = await context.cookies()
    const authCookie = cookies.find((c) => c.name.includes('auth-token'))
    expect(authCookie).toBeUndefined()
  })
})

/**
 * Always-run: verify no accidental auth routes exist yet
 * (guard against half-baked auth middleware breaking public pages)
 */
test.describe('Auth non-regression — public pages stay public', () => {
  test('bnzo.io homepage loads without auth', async ({ page }) => {
    await page.context().clearCookies()
    await page.goto(BASE)
    await expect(page.locator('h1')).toBeVisible()
    // Should not redirect to login
    await expect(page).toHaveURL(new RegExp(`^${BASE}`))
  })

  test('build.bnzo.io marketplace loads without auth', async ({ page }) => {
    await page.context().clearCookies()
    await page.goto(`${BASE}?host=build.bnzo.io`)
    await expect(page.locator('h1')).toBeVisible()
  })

  test('lab.bnzo.io loads without auth', async ({ page }) => {
    await page.context().clearCookies()
    await page.goto(`${BASE}?host=lab.bnzo.io`)
    await expect(page.locator('h1')).toBeVisible()
  })
})
