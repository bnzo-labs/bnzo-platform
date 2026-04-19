/**
 * Email Capture Flow — bnzo.io
 *
 * Tests:
 * 1. Form renders on homepage
 * 2. Submit valid email → success message
 * 3. Submit invalid email → error message (HTML5 or server)
 * 4. API POST /api/subscribe → 200 + {ok:true}
 *
 * Supabase DB check requires SUPABASE_SERVICE_ROLE_KEY in env.
 */
import { test, expect, request } from '@playwright/test'
import { createClient } from '@supabase/supabase-js'

const BASE = process.env.BASE_URL ?? 'http://localhost:3000'

// Use a unique email per run so the DB check is unambiguous
const TEST_EMAIL = `playwright+${Date.now()}@example.com`

test.describe('Email capture — bnzo.io', () => {
  test('form renders on homepage', async ({ page }) => {
    await page.goto(BASE)
    const input = page.locator('input#email-capture')
    await expect(input).toBeVisible()
    const button = page.locator('button[type="submit"]')
    await expect(button).toBeVisible()
  })

  test('submit valid email → success message', async ({ page }) => {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.RESEND_API_KEY) {
      test.skip(true, 'Supabase/Resend env vars not set — skipping live subscribe test')
      return
    }
    await page.goto(BASE)
    await page.fill('input#email-capture', TEST_EMAIL)
    await page.click('button[type="submit"]')
    const feedback = page.locator('#email-capture-feedback')
    await expect(feedback).toContainText('you in', { timeout: 8_000 })
  })

  test('submit duplicate email → does not crash', async ({ page }) => {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.RESEND_API_KEY) {
      test.skip(true, 'Supabase/Resend env vars not set — skipping live subscribe test')
      return
    }
    // Re-submit same email — API should return 409 or handle gracefully
    await page.goto(BASE)
    await page.fill('input#email-capture', TEST_EMAIL)
    await page.click('button[type="submit"]')
    // Expect either success or error message (not a blank crash)
    const feedback = page.locator('#email-capture-feedback')
    await expect(feedback).not.toBeEmpty({ timeout: 8_000 })
  })

  test('API POST /api/subscribe returns 200 for valid email', async ({ request }) => {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.RESEND_API_KEY) {
      test.skip(true, 'Supabase/Resend env vars not set — skipping subscribe API test')
      return
    }
    const res = await request.post(`${BASE}/api/subscribe`, {
      data: { email: `api-test+${Date.now()}@example.com`, source: 'bnzo' },
    })
    expect(res.status()).toBe(200)
    const body = await res.json() as { ok: boolean }
    expect(body.ok).toBe(true)
  })

  test('API POST /api/subscribe returns 400 for invalid email', async ({ request }) => {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.RESEND_API_KEY) {
      test.skip(true, 'Supabase/Resend env vars not set — skipping subscribe API test')
      return
    }
    const res = await request.post(`${BASE}/api/subscribe`, {
      data: { email: 'not-an-email', source: 'bnzo' },
    })
    expect(res.status()).toBe(400)
  })

  test('subscriber saved in Supabase', async ({ request }) => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceKey) {
      test.skip(true, 'SUPABASE_SERVICE_ROLE_KEY not set — skipping DB check')
      return
    }

    const uniqueEmail = `db-check+${Date.now()}@example.com`

    // Subscribe via API
    const res = await request.post(`${BASE}/api/subscribe`, {
      data: { email: uniqueEmail, source: 'bnzo' },
    })
    expect(res.status()).toBe(200)

    // Check DB
    const client = createClient(supabaseUrl, serviceKey)
    const { data, error } = await client
      .from('subscribers')
      .select('email')
      .eq('email', uniqueEmail)
      .single()

    expect(error).toBeNull()
    expect(data?.email).toBe(uniqueEmail)
  })
})
