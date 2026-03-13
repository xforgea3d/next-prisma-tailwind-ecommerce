import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Determines the correct site origin, preferring NEXT_PUBLIC_SITE_URL
 * so that Supabase OAuth callbacks always redirect to the right domain
 * (not localhost or another project).
 */
function getSiteOrigin(request: NextRequest): string {
    // 1. Explicit env var (most reliable for production)
    if (process.env.NEXT_PUBLIC_SITE_URL) {
        return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
    }
    // 2. Vercel deployment URL
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`
    }
    // 3. Fall back to the request origin
    return new URL(request.url).origin
}

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const origin = getSiteOrigin(request)

    const code = requestUrl.searchParams.get('code')
    // Support both 'next' and 'redirect' param names for backwards compat
    const rawNext = requestUrl.searchParams.get('next')
        ?? requestUrl.searchParams.get('redirect')
        ?? '/'
    const next = rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/'

    if (code) {
        const supabase = createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            const response = NextResponse.redirect(new URL(next, origin))
            response.cookies.set('logged-in', 'true', { path: '/', maxAge: 31536000, sameSite: 'lax' })
            return response
        }
    }

    // Auth hatasi - login sayfasina geri yonlendir
    return NextResponse.redirect(new URL('/login?error=auth_callback_failed', origin))
}
