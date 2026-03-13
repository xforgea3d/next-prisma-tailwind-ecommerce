import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/auth/forgot-password
 *
 * Triggers Supabase's built-in password reset flow.
 * Supabase sends a reset link to the user's email.
 *
 * Body: { email: string }
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { email } = body

        if (!email || typeof email !== 'string') {
            return NextResponse.json({ error: 'E-posta adresi gerekli.' }, { status: 400 })
        }

        const origin = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
            || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : new URL(req.url).origin)

        const supabase = createClient()
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${origin}/auth/callback?next=/login?reset=true`,
        })

        if (error) {
            console.error('[forgot-password] Supabase error:', error.message)
            // Don't reveal whether the email exists
        }

        // Always return success to prevent email enumeration
        return NextResponse.json({
            success: true,
            message: 'Eger bu e-posta adresi kayitliysa, sifre sifirlama baglantisi gonderildi.',
        })
    } catch (error) {
        console.error('[forgot-password] Error:', error)
        return NextResponse.json(
            { error: 'Beklenmeyen bir hata olustu.' },
            { status: 500 }
        )
    }
}
