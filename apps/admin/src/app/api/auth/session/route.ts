import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
   // This endpoint forces a server-side session refresh so that
   // auth cookies are properly set before the client redirects.
   const supabase = createClient()
   const { data: { user } } = await supabase.auth.getUser()

   if (user) {
      return NextResponse.json({ ok: true })
   }

   return NextResponse.json({ ok: false }, { status: 401 })
}
