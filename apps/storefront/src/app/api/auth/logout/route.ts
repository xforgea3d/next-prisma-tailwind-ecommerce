import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
   const supabase = createClient()
   await supabase.auth.signOut()

   const origin = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
      || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : new URL(req.url).origin)

   const response = NextResponse.redirect(new URL('/login', origin))
   response.cookies.set('logged-in', '', { path: '/', maxAge: 0 })
   return response
}
