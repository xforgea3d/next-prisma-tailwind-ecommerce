'use client'

import { useEffect, useRef } from 'react'
import { getLocalCart, writeLocalCart } from '@/lib/cart'
import { useUserContext } from '@/state/User'
import { useCartContext } from '@/state/Cart'
import { useCsrf } from '@/hooks/useCsrf'
import { isVariableValid } from '@/lib/utils'

/**
 * Invisible component that syncs localStorage cart items to the server
 * when a user logs in. Prevents cart loss on authentication.
 *
 * Flow:
 * 1. User adds items to cart while unauthenticated (stored in localStorage)
 * 2. User logs in
 * 3. CartSyncer detects authenticated user + localStorage items
 * 4. POSTs each item to /api/cart with CSRF token
 * 5. Refreshes user context so Cart picks up the merged server cart
 * 6. Clears localStorage cart
 */
export default function CartSyncer() {
   const { user, refreshUser } = useUserContext() as { user: any; refreshUser: () => Promise<void> }
   const { dispatchCart } = useCartContext()
   const csrfToken = useCsrf()
   const syncedRef = useRef(false)

   useEffect(() => {
      if (syncedRef.current) return
      if (!isVariableValid(user)) return
      if (!csrfToken) return

      const localCart = getLocalCart()
      const localItems = localCart?.items ?? []

      // Only sync if localStorage has items with productId (authenticated carts use server)
      const itemsToSync = localItems.filter(
         (item: any) => item.productId && item.count > 0
      )

      if (itemsToSync.length === 0) return

      syncedRef.current = true

      async function syncItems() {
         try {
            for (const item of itemsToSync) {
               // Determine the target count: merge with existing server cart item
               const serverItems = user?.cart?.items ?? []
               const serverItem = serverItems.find(
                  (si: any) => si.productId === item.productId
               )
               const targetCount = (serverItem?.count ?? 0) + item.count

               await fetch('/api/cart', {
                  method: 'POST',
                  headers: {
                     'Content-Type': 'application/json',
                     'x-csrf-token': csrfToken!,
                  },
                  body: JSON.stringify({
                     productId: item.productId,
                     count: targetCount,
                     csrfToken,
                  }),
               })
            }

            // Clear localStorage cart after successful sync
            writeLocalCart({ items: [] })

            // Refresh user so Cart context picks up merged server cart
            await refreshUser()
         } catch {
            // Silently fail — items remain in localStorage for next attempt
            syncedRef.current = false
         }
      }

      syncItems()
   }, [user, csrfToken, refreshUser, dispatchCart])

   return null
}
