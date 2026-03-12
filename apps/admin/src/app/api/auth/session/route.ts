import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
   // This endpoint forces a server-side session refresh so that
   // auth cookies are properly set before the client redirects.
   const cookieStore = cookies()

   const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
         cookies: {
            get(name: string) {
               return cookieStore.get(name)?.value
            },
            set(name: string, value: string, options: CookieOptions) {
               cookieStore.set({ name, value, ...options })
            },
            remove(name: string, options: CookieOptions) {
               cookieStore.set({ name, value: '', ...options })
            },
         },
      }
   )

   const { data: { user } } = await supabase.auth.getUser()

   if (user) {
      return NextResponse.json({ ok: true })
   }

   return NextResponse.json({ ok: false }, { status: 401 })
}
