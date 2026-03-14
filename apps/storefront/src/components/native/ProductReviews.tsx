'use client'

import { useAuthenticated } from '@/hooks/useAuthentication'
import { useCsrf } from '@/hooks/useCsrf'
import { Star } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface Review {
   id: string
   text: string
   rating: number
   createdAt: string
   user: { id: string; name: string | null }
}

// ─── Star Display ────────────────────────────────────────────────
function Stars({ rating, size = 16 }: { rating: number; size?: number }) {
   return (
      <div className="flex items-center gap-0.5">
         {[1, 2, 3, 4, 5].map((i) => (
            <Star
               key={i}
               size={size}
               className={
                  i <= rating
                     ? 'fill-orange-500 text-orange-500'
                     : 'fill-neutral-300 text-neutral-300 dark:fill-neutral-600 dark:text-neutral-600'
               }
            />
         ))}
      </div>
   )
}

// ─── Relative Date ───────────────────────────────────────────────
function relativeDate(dateStr: string): string {
   const now = Date.now()
   const then = new Date(dateStr).getTime()
   const diff = now - then
   const mins = Math.floor(diff / 60_000)
   if (mins < 1) return 'Az önce'
   if (mins < 60) return `${mins} dakika önce`
   const hours = Math.floor(mins / 60)
   if (hours < 24) return `${hours} saat önce`
   const days = Math.floor(hours / 24)
   if (days < 30) return `${days} gün önce`
   const months = Math.floor(days / 30)
   if (months < 12) return `${months} ay önce`
   const years = Math.floor(months / 12)
   return `${years} yıl önce`
}

// ─── User Initials Avatar ────────────────────────────────────────
function UserAvatar({ name }: { name: string | null }) {
   const initials = name
      ? name
           .split(' ')
           .map((w) => w[0])
           .join('')
           .toUpperCase()
           .slice(0, 2)
      : '?'

   return (
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-500/10 text-orange-600 font-semibold text-sm flex items-center justify-center">
         {initials}
      </div>
   )
}

// ─── Review Form ─────────────────────────────────────────────────
function ReviewForm({
   productId,
   onSuccess,
}: {
   productId: string
   onSuccess: (review: Review) => void
}) {
   const { authenticated } = useAuthenticated()
   const csrfToken = useCsrf()
   const [rating, setRating] = useState(0)
   const [hoverRating, setHoverRating] = useState(0)
   const [text, setText] = useState('')
   const [submitting, setSubmitting] = useState(false)

   if (!authenticated) {
      return (
         <div className="rounded-xl border p-6 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
               Değerlendirme yapmak için hesabınıza giriş yapın.
            </p>
            <Link
               href="/login"
               className="inline-block text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors"
            >
               Giriş yapın
            </Link>
         </div>
      )
   }

   async function handleSubmit(e: React.FormEvent) {
      e.preventDefault()
      if (rating === 0) {
         toast.error('Lütfen bir puan seçin')
         return
      }
      if (!text.trim()) {
         toast.error('Lütfen bir değerlendirme yazın')
         return
      }

      setSubmitting(true)
      try {
         const res = await fetch(`/api/products/${productId}/reviews`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               ...(csrfToken && { 'x-csrf-token': csrfToken }),
            },
            body: JSON.stringify({ rating, text: text.trim(), csrfToken }),
         })

         if (!res.ok) {
            const errorText = await res.text()
            throw new Error(errorText || 'Bir hata oluştu')
         }

         const review: Review = await res.json()
         onSuccess(review)
         setRating(0)
         setText('')
         toast.success('Değerlendirmeniz eklendi!')
      } catch (err: any) {
         toast.error(err?.message || 'Değerlendirme gönderilemedi')
      } finally {
         setSubmitting(false)
      }
   }

   return (
      <form onSubmit={handleSubmit} className="rounded-xl border p-6 space-y-4">
         <h3 className="text-base font-semibold">Değerlendirmenizi Yazın</h3>

         {/* Star Selector */}
         <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
               <button
                  key={i}
                  type="button"
                  onClick={() => setRating(i)}
                  onMouseEnter={() => setHoverRating(i)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-0.5 transition-transform hover:scale-110"
               >
                  <Star
                     size={28}
                     className={
                        i <= (hoverRating || rating)
                           ? 'fill-orange-500 text-orange-500'
                           : 'fill-neutral-300 text-neutral-300 dark:fill-neutral-600 dark:text-neutral-600'
                     }
                  />
               </button>
            ))}
            {rating > 0 && (
               <span className="ml-2 text-sm text-muted-foreground">
                  {rating}/5
               </span>
            )}
         </div>

         {/* Text Area */}
         <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ürün hakkındaki düşüncelerinizi paylaşın..."
            rows={4}
            maxLength={1000}
            className="w-full rounded-lg border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 resize-none transition-colors"
         />

         {/* Submit */}
         <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
         >
            {submitting ? 'Gönderiliyor...' : 'Değerlendirmeyi Gönder'}
         </button>
      </form>
   )
}

// ─── Main Component ──────────────────────────────────────────────
export default function ProductReviews({ productId }: { productId: string }) {
   const [reviews, setReviews] = useState<Review[]>([])
   const [loading, setLoading] = useState(true)

   const fetchReviews = useCallback(async () => {
      try {
         const res = await fetch(`/api/products/${productId}`)
         if (!res.ok) return
         const data = await res.json()
         setReviews(data.productReviews ?? [])
      } catch {
         // silently fail
      } finally {
         setLoading(false)
      }
   }, [productId])

   useEffect(() => {
      fetchReviews()
   }, [fetchReviews])

   const handleNewReview = (review: Review) => {
      setReviews((prev) => [review, ...prev])
   }

   const avgRating =
      reviews.length > 0
         ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
         : 0

   return (
      <section className="space-y-6">
         {/* Section Header */}
         <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold tracking-tight">
               Değerlendirmeler
            </h2>
            <p className="text-sm text-muted-foreground">
               Müşterilerimizin bu ürün hakkındaki görüşleri.
            </p>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column — Summary & Form */}
            <div className="space-y-6">
               {/* Summary Card */}
               {!loading && reviews.length > 0 && (
                  <div className="rounded-xl border p-6 space-y-3 text-center">
                     <div className="text-4xl font-bold">
                        {avgRating.toFixed(1)}
                     </div>
                     <Stars rating={Math.round(avgRating)} size={22} />
                     <p className="text-sm text-muted-foreground">
                        {reviews.length} değerlendirme
                     </p>
                  </div>
               )}

               {/* Review Form */}
               <ReviewForm productId={productId} onSuccess={handleNewReview} />
            </div>

            {/* Right Column — Review List */}
            <div className="lg:col-span-2 space-y-4">
               {loading ? (
                  <div className="rounded-xl border p-8 flex items-center justify-center">
                     <div className="h-6 w-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                  </div>
               ) : reviews.length === 0 ? (
                  <div className="rounded-xl border p-8 text-center space-y-2">
                     <div className="flex justify-center">
                        <Star
                           size={40}
                           className="text-neutral-300 dark:text-neutral-600"
                        />
                     </div>
                     <p className="text-base font-medium">
                        Henüz değerlendirme yapılmamış
                     </p>
                     <p className="text-sm text-muted-foreground">
                        Bu ürünü değerlendiren ilk kişi siz olun!
                     </p>
                  </div>
               ) : (
                  reviews.map((review) => (
                     <div
                        key={review.id}
                        className="rounded-xl border p-5 space-y-3 transition-colors hover:bg-muted/30"
                     >
                        <div className="flex items-start gap-3">
                           <UserAvatar name={review.user?.name} />
                           <div className="flex-1 min-w-0 space-y-1">
                              <div className="flex items-center justify-between gap-2 flex-wrap">
                                 <span className="text-sm font-semibold truncate">
                                    {review.user?.name || 'Anonim'}
                                 </span>
                                 <span className="text-xs text-muted-foreground">
                                    {relativeDate(review.createdAt)}
                                 </span>
                              </div>
                              <Stars rating={review.rating} size={14} />
                           </div>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                           {review.text}
                        </p>
                     </div>
                  ))
               )}
            </div>
         </div>
      </section>
   )
}
