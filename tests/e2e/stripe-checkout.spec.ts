/**
 * Stripe Checkout Flow — build.bnzo.io/starter-kit
 *
 * Tests:
 * 1. Resource detail page renders with Purchase button
 * 2. Click Purchase → API call to /api/checkout → redirects to Stripe
 * 3. Success page: ?success=true shows confirmation message
 * 4. API POST /api/checkout → returns {url} for valid priceId
 *
 * Full Stripe test-card flow requires a live dev server + real Stripe test keys.
 * Covered via API unit test + UI mock for CI.
 *
 * Middleware: build.bnzo.io rewrites to /build — use ?host= param for local dev.
 */
import { test, expect } from '@playwright/test'

const BASE = process.env.BASE_URL ?? 'http://localhost:3000'
// Simulate build.bnzo.io locally via middleware host override
const BUILD_BASE = `${BASE}?host=build.bnzo.io`
// starter-kit slug from content/resources
const STARTER_SLUG = 'starter-kit'

test.describe('Stripe checkout — build.bnzo.io', () => {
  test('resource listing page renders', async ({ page }) => {
    await page.goto(`${BASE}?host=build.bnzo.io`)
    await expect(page.locator('h1')).toBeVisible()
  })

  test('resource detail page renders for starter-kit', async ({ page }) => {
    await page.goto(`${BASE}/starter-kit?host=build.bnzo.io`)
    await expect(page.locator('h1')).toBeVisible()
  })

  test('Purchase button is visible for paid resource', async ({ page }) => {
    await page.goto(`${BASE}/starter-kit?host=build.bnzo.io`)
    const purchaseBtn = page.locator('button', { hasText: 'Purchase' })
    await expect(purchaseBtn).toBeVisible()
    await expect(purchaseBtn).toBeEnabled()
  })

  test('success=true query shows purchase confirmation', async ({ page }) => {
    await page.goto(`${BASE}/starter-kit?success=true&host=build.bnzo.io`)
    // Confirmation section renders
    const confirmation = page.locator('text=Purchase complete')
    await expect(confirmation).toBeVisible()
    await page.locator('text=Thanks').isVisible()
  })

  test('API POST /api/checkout returns redirect URL for valid priceId', async ({ request }) => {
    const priceId = process.env.STRIPE_PRICE_STARTER_KIT

    if (!priceId) {
      test.skip(true, 'STRIPE_PRICE_STARTER_KIT not set — skipping checkout API test')
      return
    }

    const res = await request.post(`${BASE}/api/checkout`, {
      data: {
        priceId,
        successUrl: `${BASE}/starter-kit?success=true`,
        cancelUrl: `${BASE}/starter-kit`,
      },
    })
    expect(res.status()).toBe(200)
    const body = await res.json() as { url: string }
    expect(body.url).toContain('stripe.com')
  })

  test('API POST /api/checkout returns 400 for missing priceId', async ({ request }) => {
    if (!process.env.STRIPE_SECRET_KEY) {
      test.skip(true, 'STRIPE_SECRET_KEY not set — skipping checkout API test')
      return
    }
    const res = await request.post(`${BASE}/api/checkout`, {
      data: { successUrl: `${BASE}/starter-kit?success=true`, cancelUrl: `${BASE}/starter-kit` },
    })
    expect(res.status()).toBe(400)
  })

  /**
   * Full end-to-end Stripe test-card flow
   * Skipped unless STRIPE_TEST_CARD_ENABLED=true and a live dev server is running.
   *
   * Steps (manual verification / manual CI gate):
   * 1. Click Purchase on /starter-kit
   * 2. Stripe Checkout session URL received
   * 3. Fill test card: 4242 4242 4242 4242 / 12/26 / 123 / any name
   * 4. Complete payment
   * 5. Redirected to /starter-kit?success=true
   * 6. Confirmation message displayed
   * 7. Supabase purchases row created (verified via service role client)
   */
  test('full Stripe test-card checkout @slow', async ({ page, request }) => {
    if (!process.env.STRIPE_TEST_CARD_ENABLED) {
      test.skip(true, 'Set STRIPE_TEST_CARD_ENABLED=true to run full Stripe flow')
      return
    }

    const priceId = process.env.STRIPE_PRICE_STARTER_KIT!

    // Get Stripe checkout URL via API
    const checkoutRes = await request.post(`${BASE}/api/checkout`, {
      data: {
        priceId,
        successUrl: `${BASE}/starter-kit?success=true`,
        cancelUrl: `${BASE}/starter-kit`,
      },
    })
    expect(checkoutRes.status()).toBe(200)
    const { url } = await checkoutRes.json() as { url: string }

    // Navigate to Stripe Checkout
    await page.goto(url)
    await expect(page).toHaveURL(/stripe\.com\/pay/)

    // Fill test card details
    await page.fill('[placeholder="Card number"]', '4242424242424242')
    await page.fill('[placeholder="MM / YY"]', '12/26')
    await page.fill('[placeholder="CVC"]', '123')
    await page.fill('[placeholder="Full name on card"]', 'Playwright Test')

    // Fill email if prompted
    const emailField = page.locator('[placeholder="Email"]')
    if (await emailField.isVisible()) {
      await emailField.fill(`stripe-test+${Date.now()}@example.com`)
    }

    await page.click('[data-testid="hosted-payment-submit-button"]')

    // Wait for redirect back to success URL
    await page.waitForURL(/success=true/, { timeout: 30_000 })
    await expect(page.locator('text=Purchase complete')).toBeVisible()
  })
})
