/**
 * Resend email client for xForgea3D
 *
 * Uses the Resend API directly (no SDK needed) for sending
 * transactional emails: OTP verification, password reset, etc.
 *
 * Env vars:
 *   RESEND_API_KEY  - Resend API key
 *   RESEND_FROM     - Sender address (default: onboarding@resend.dev until domain is connected)
 */

const RESEND_API_URL = 'https://api.resend.com/emails'

interface SendEmailOptions {
    to: string | string[]
    subject: string
    html: string
    from?: string
    replyTo?: string
}

export async function sendEmailViaResend({
    to,
    subject,
    html,
    from,
    replyTo,
}: SendEmailOptions): Promise<{ success: boolean; id?: string; error?: string }> {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
        console.error('[Resend] RESEND_API_KEY is not set')
        return { success: false, error: 'RESEND_API_KEY not configured' }
    }

    // Until custom domain is connected, use Resend's onboarding address
    const sender = from
        || process.env.RESEND_FROM
        || 'xForgea3D <onboarding@resend.dev>'

    try {
        const response = await fetch(RESEND_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: sender,
                to: Array.isArray(to) ? to : [to],
                subject,
                html,
                ...(replyTo ? { reply_to: replyTo } : {}),
            }),
        })

        const data = await response.json()

        if (!response.ok) {
            console.error('[Resend] API error:', data)
            return { success: false, error: data.message || 'Unknown Resend error' }
        }

        return { success: true, id: data.id }
    } catch (error: any) {
        console.error('[Resend] Network error:', error)
        return { success: false, error: error.message }
    }
}
