import { sendEmailViaResend } from '@/lib/resend'
import OtpEmail from '@/emails/otp'
import { render } from '@react-email/render'
import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/auth/send-otp
 *
 * Generates a 6-digit OTP, stores it via globalThis (shared with verify-otp),
 * and sends it via Resend.
 *
 * Body: { email: string, type?: 'verify' | 'reset', name?: string }
 *
 * NOTE: This is a standalone OTP flow using Resend. If you are using
 * Supabase Auth's built-in OTP (signInWithOtp), you can configure
 * Supabase to use a custom SMTP (Resend SMTP) instead.
 * This route is for cases where you want full control over the OTP flow.
 */

// Shared in-memory OTP store via globalThis (accessible from verify-otp route too)
// For production with serverless, replace with Redis or DB
function getOtpStore(): Map<string, { code: string; expiresAt: number; type: string }> {
    const g = globalThis as any
    if (!g.__otpStore) {
        g.__otpStore = new Map()
    }
    return g.__otpStore
}

// Cleanup expired OTPs every 5 minutes
if (typeof globalThis !== 'undefined') {
    const g = globalThis as any
    if (!g.__otpCleanup) {
        g.__otpCleanup = setInterval(() => {
            const now = Date.now()
            const store = getOtpStore()
            for (const [key, val] of store) {
                if (val.expiresAt < now) store.delete(key)
            }
        }, 300_000)
    }
}

function generateOTP(): string {
    // Crypto-safe 6-digit code
    const array = new Uint32Array(1)
    crypto.getRandomValues(array)
    return String(array[0] % 1000000).padStart(6, '0')
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { email, type = 'verify', name = '' } = body

        if (!email || typeof email !== 'string') {
            return NextResponse.json({ error: 'E-posta adresi gerekli.' }, { status: 400 })
        }

        const store = getOtpStore()

        // Rate limit: max 3 OTPs per email per 10 minutes
        const recentKey = `rate:${email}`
        const existing = store.get(recentKey)
        if (existing && existing.expiresAt > Date.now()) {
            const attempts = parseInt(existing.code) || 0
            if (attempts >= 3) {
                return NextResponse.json(
                    { error: 'Cok fazla deneme. Lutfen birkas dakika bekleyin.' },
                    { status: 429 }
                )
            }
            store.set(recentKey, {
                code: String(attempts + 1),
                expiresAt: existing.expiresAt,
                type: 'rate',
            })
        } else {
            store.set(recentKey, {
                code: '1',
                expiresAt: Date.now() + 10 * 60 * 1000,
                type: 'rate',
            })
        }

        // Generate and store OTP
        const code = generateOTP()
        const otpKey = `otp:${email}:${type}`
        store.set(otpKey, {
            code,
            expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
            type,
        })

        // Render email
        const html = await render(OtpEmail({ code, name, type: type as 'verify' | 'reset' }))

        // Send via Resend
        const subject = type === 'reset'
            ? 'xForgea3D - Sifre Sifirlama Kodu'
            : 'xForgea3D - Dogrulama Kodu'

        const result = await sendEmailViaResend({
            to: email,
            subject,
            html,
        })

        if (!result.success) {
            console.error('[send-otp] Resend error:', result.error)
            return NextResponse.json(
                { error: 'E-posta gonderilemedi. Lutfen tekrar deneyin.' },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true, message: 'Dogrulama kodu gonderildi.' })
    } catch (error) {
        console.error('[send-otp] Error:', error)
        return NextResponse.json(
            { error: 'Beklenmeyen bir hata olustu.' },
            { status: 500 }
        )
    }
}
