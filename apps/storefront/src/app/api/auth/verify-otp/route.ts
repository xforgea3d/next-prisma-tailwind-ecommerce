import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/auth/verify-otp
 *
 * Verifies an OTP code against the in-memory store.
 *
 * Body: { email: string, code: string, type?: 'verify' | 'reset' }
 *
 * Returns: { success: true, verified: true } on match
 */

// Import the shared OTP store
// NOTE: In a serverless/edge environment, the in-memory store won't persist
// across different function invocations. For production, use a database or Redis.
// This works in a single-process Node.js environment (e.g., `next start`).

// We need to access the same module-level Map
// In Next.js API routes, we can use globalThis for cross-route module state
function getOtpStore(): Map<string, { code: string; expiresAt: number; type: string }> {
    const g = globalThis as any
    if (!g.__otpStore) {
        g.__otpStore = new Map()
    }
    return g.__otpStore
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { email, code, type = 'verify' } = body

        if (!email || !code) {
            return NextResponse.json(
                { error: 'E-posta ve dogrulama kodu gerekli.' },
                { status: 400 }
            )
        }

        const otpStore = getOtpStore()
        const otpKey = `otp:${email}:${type}`
        const stored = otpStore.get(otpKey)

        if (!stored) {
            return NextResponse.json(
                { error: 'Dogrulama kodu bulunamadi. Yeni bir kod isteyin.' },
                { status: 400 }
            )
        }

        if (stored.expiresAt < Date.now()) {
            otpStore.delete(otpKey)
            return NextResponse.json(
                { error: 'Dogrulama kodunun suresi doldu. Yeni bir kod isteyin.' },
                { status: 400 }
            )
        }

        if (stored.code !== code) {
            return NextResponse.json(
                { error: 'Dogrulama kodu hatali.' },
                { status: 400 }
            )
        }

        // OTP is valid - delete it so it can't be reused
        otpStore.delete(otpKey)

        return NextResponse.json({ success: true, verified: true })
    } catch (error) {
        console.error('[verify-otp] Error:', error)
        return NextResponse.json(
            { error: 'Beklenmeyen bir hata olustu.' },
            { status: 500 }
        )
    }
}
