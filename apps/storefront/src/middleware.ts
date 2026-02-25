import { updateSession } from '@/lib/supabase/middleware'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
   const { pathname } = request.nextUrl

   // ── Always allow: auth callbacks, static assets, maintenance page ─────
   const alwaysAllow = ['/auth/callback', '/maintenance', '/_next/', '/login', '/favicon']
   if (alwaysAllow.some(p => pathname.startsWith(p))) {
      return NextResponse.next()
   }

   // ── Maintenance mode check (only for non-API, non-exempt paths) ──────
   // NOTE: We skip this for API routes to avoid fetch loops inside middleware
   if (!pathname.startsWith('/api/')) {
      try {
         const statusUrl = new URL('/api/maintenance-status', request.url)
         const res = await fetch(statusUrl.toString(), { next: { revalidate: 60 } })
         if (res.ok) {
            const data = await res.json()
            if (data?.maintenance_enabled) {
               return NextResponse.redirect(new URL('/maintenance', request.url))
            }
         }
      } catch { /* fail open */ }
   }

   // ── Always allow auth API routes (signOut, etc.) ─────────────────────
   if (pathname.startsWith('/api/auth')) return NextResponse.next()

   // ── maintenance-status: public, no auth needed ───────────────────────
   if (pathname === '/api/maintenance-status') return NextResponse.next()

   // ── Session check (only for protected paths) ─────────────────────────
   const { supabaseResponse, user } = await updateSession(request)

   if (!user) {
      if (pathname.startsWith('/api/')) {
         return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })
      }
      // Redirect unauthenticated users to login, preserving the intended destination
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
   }

   // Set user context header for API routes / server components
   supabaseResponse.headers.set('X-USER-ID', user.id)

   return supabaseResponse
}

export const config = {
   // Protect profile, checkout and all API routes
   matcher: ['/profile/:path*', '/checkout/:path*', '/api/:path*'],
}
