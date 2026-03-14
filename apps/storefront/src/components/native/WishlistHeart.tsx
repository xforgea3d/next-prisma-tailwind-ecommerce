'use client'

import { useAuthenticated } from '@/hooks/useAuthentication'
import { useCsrf } from '@/hooks/useCsrf'
import { Heart, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface WishlistHeartProps {
   productId: string
}

export function WishlistHeart({ productId }: WishlistHeartProps) {
   const { authenticated } = useAuthenticated()
   const csrfToken = useCsrf()
   const router = useRouter()

   const [inWishlist, setInWishlist] = useState(false)
   const [loading, setLoading] = useState(false)

   useEffect(() => {
      if (!authenticated) return

      async function checkWishlist() {
         try {
            const res = await fetch('/api/wishlist')
            const json = await res.json()
            if (Array.isArray(json)) {
               setInWishlist(json.some((item: any) => item.id === productId))
            }
         } catch {
            // silently fail
         }
      }

      checkWishlist()
   }, [authenticated, productId])

   async function toggle(e: React.MouseEvent) {
      e.preventDefault()
      e.stopPropagation()

      if (!authenticated) {
         router.push('/login')
         return
      }

      const wasInWishlist = inWishlist
      // Optimistic update
      setInWishlist(!wasInWishlist)
      setLoading(true)

      try {
         const method = wasInWishlist ? 'DELETE' : 'POST'
         const res = await fetch('/api/wishlist', {
            method,
            body: JSON.stringify({
               productId,
               connect: !wasInWishlist,
               csrfToken,
            }),
            headers: {
               'Content-Type': 'application/json',
               ...(csrfToken && { 'x-csrf-token': csrfToken }),
            },
         })
         const json = await res.json()
         if (Array.isArray(json)) {
            setInWishlist(json.some((item: any) => item.id === productId))
         }
      } catch {
         // Revert on error
         setInWishlist(wasInWishlist)
      } finally {
         setLoading(false)
      }
   }

   return (
      <button
         onClick={toggle}
         className="absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-sm transition-all hover:scale-110 active:scale-95"
         title={inWishlist ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
         aria-label={inWishlist ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
      >
         {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
         ) : (
            <Heart
               className={`h-4 w-4 transition-colors ${
                  inWishlist
                     ? 'fill-red-500 text-red-500'
                     : 'text-neutral-600 dark:text-neutral-300'
               }`}
            />
         )}
      </button>
   )
}
