import { Resend } from 'resend'

let _resend: Resend | null = null

function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY!)
  }
  return _resend
}

export type EmailSource = 'bnzo' | 'learn'

const WELCOME_SUBJECTS: Record<EmailSource, string> = {
  bnzo: 'Welcome to Bnzo Studio',
  learn: 'Welcome to Bnzo Learn',
}

export async function sendWelcomeEmail(
  email: string,
  source: EmailSource,
): Promise<void> {
  const FROM = process.env.RESEND_FROM_EMAIL ?? 'hello@bnzo.io'
  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: WELCOME_SUBJECTS[source],
    html: `<p>Welcome! You're now subscribed to ${source === 'learn' ? 'Bnzo Learn' : 'Bnzo Studio'}.</p>`,
  })
}
