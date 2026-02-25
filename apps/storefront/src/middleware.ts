import { updateSession } from '@/lib/supabase/middleware'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Lightweight middleware — ONLY runs on truly protected routes.
 * Previously this fetched /api/maintenance-status on EVERY request,
 * adding a full Supabase round-trip (100-400ms) to every page load.
 * That fetch has been removed entirely; maintenance mode checks are
 * now handled at the component level if needed.
 */
export async function middleware(request: NextRequest) {
   const { pathname } = request.nextUrl

   // ── Always allow: auth callbacks, static assets, public pages ─────────
   const alwaysAllow = [
      '/auth/callback', '/maintenance', '/_next/', '/login',
      '/favicon', '/api/maintenance-status', '/logo',
   ]
   if (alwaysAllow.some(p => pathname.startsWith(p))) {
      return NextResponse.next()
   }

   // ── Always allow public API routes ─────────────────────────────────────
   if (pathname.startsWith('/api/auth')) return NextResponse.next()
   if (pathname.startsWith('/api/custom-order')) return NextResponse.next()

   // ── Session check (only for protected paths) ───────────────────────────
   const { supabaseResponse, user } = await updateSession(request)

   if (!user) {
      if (pathname.startsWith('/api/')) {
         return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })
      }
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
   }

   supabaseResponse.headers.set('X-USER-ID', user.id)
   return supabaseResponse
}

export const config = {
   // ONLY protect these routes — do NOT run middleware on every page
   matcher: ['/profile/:path*', '/checkout/:path*', '/api/:path*'],
}
