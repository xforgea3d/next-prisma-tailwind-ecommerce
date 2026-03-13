'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

/**
 * Read the `logged-in` cookie value.
 * Used as a fast initial hint before the async Supabase check completes.
 */
function readLoggedInCookie(): boolean {
   if (typeof document === 'undefined') return false
   try {
      return document.cookie.split(';').some(c => c.trim().startsWith('logged-in=true'))
   } catch {
      return false
   }
}

/**
 * Hook that checks authentication state using BOTH the `logged-in` cookie
 * (for instant first render) and the Supabase client session (as source of truth).
 *
 * It also subscribes to Supabase auth state changes so the navbar updates
 * immediately after login/logout without requiring a full page reload.
 */
export function useAuthenticated() {
   // Start with cookie hint so there's no flash of wrong state on hard navigation
   const [authenticated, setAuthenticated] = useState<boolean>(readLoggedInCookie)

   useEffect(() => {
      const supabase = createClient()

      // 1. Check current session on mount
      supabase.auth.getSession().then(({ data: { session } }) => {
         const isLoggedIn = !!session?.user
         setAuthenticated(isLoggedIn)
         // Sync the cookie with reality
         syncCookie(isLoggedIn)
      })

      // 2. Subscribe to auth state changes (login, logout, token refresh)
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
         (_event, session) => {
            const isLoggedIn = !!session?.user
            setAuthenticated(isLoggedIn)
            syncCookie(isLoggedIn)
         }
      )

      return () => {
         subscription.unsubscribe()
      }
   }, [])

   return { authenticated }
}

/**
 * Keep the `logged-in` cookie in sync with the actual Supabase session.
 * This cookie is also read by the middleware and logout flow.
 */
function syncCookie(loggedIn: boolean) {
   if (typeof document === 'undefined') return
   if (loggedIn) {
      document.cookie = 'logged-in=true; path=/; max-age=31536000; SameSite=Lax'
   } else {
      document.cookie = 'logged-in=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
   }
}
