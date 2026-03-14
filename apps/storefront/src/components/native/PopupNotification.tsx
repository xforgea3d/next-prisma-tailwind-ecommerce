'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { BellIcon, XIcon } from 'lucide-react'
import { useCsrf } from '@/hooks/useCsrf'

interface Notification {
   id: string
   content: string
   type: string
   isRead: boolean
   createdAt: string
}

interface PopupItem {
   id: string
   content: string
}

export default function PopupNotification() {
   const [popups, setPopups] = useState<PopupItem[]>([])
   const shownIdsRef = useRef<Set<string>>(new Set())
   const csrfToken = useCsrf()

   const fetchAndShowPopups = useCallback(async () => {
      try {
         const res = await fetch('/api/notifications', { cache: 'no-store' })
         if (!res.ok) return
         const data = await res.json()
         const notifications: Notification[] = data.notifications ?? []

         const newPopups = notifications.filter(
            (n) =>
               n.type === 'popup' &&
               !n.isRead &&
               !shownIdsRef.current.has(n.id)
         )

         if (newPopups.length > 0) {
            for (const p of newPopups) {
               shownIdsRef.current.add(p.id)
            }
            setPopups((prev) => [
               ...prev,
               ...newPopups.map((n) => ({ id: n.id, content: n.content })),
            ])

            // Mark popup notifications as read
            const ids = newPopups.map((n) => n.id)
            try {
               await fetch('/api/notifications', {
                  method: 'PATCH',
                  headers: {
                     'Content-Type': 'application/json',
                     ...(csrfToken && { 'x-csrf-token': csrfToken }),
                  },
                  body: JSON.stringify({ ids, csrfToken }),
               })
            } catch {
               // non-critical
            }
         }
      } catch {
         // silently fail
      }
   }, [csrfToken])

   useEffect(() => {
      fetchAndShowPopups()
      const interval = setInterval(fetchAndShowPopups, 30000)
      return () => clearInterval(interval)
   }, [fetchAndShowPopups])

   // Auto-dismiss after 8 seconds
   useEffect(() => {
      if (popups.length === 0) return
      const timer = setTimeout(() => {
         setPopups((prev) => prev.slice(1))
      }, 8000)
      return () => clearTimeout(timer)
   }, [popups])

   function dismiss(id: string) {
      setPopups((prev) => prev.filter((p) => p.id !== id))
   }

   if (popups.length === 0) return null

   return (
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
         {popups.map((popup) => (
            <div
               key={popup.id}
               className="pointer-events-auto animate-in slide-in-from-right-full fade-in duration-300 rounded-lg border border-orange-300 dark:border-orange-600 bg-white dark:bg-neutral-900 shadow-xl overflow-hidden"
            >
               <div className="border-l-4 border-l-orange-500 p-4">
                  <div className="flex items-start gap-3">
                     <div className="shrink-0 mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/40">
                        <BellIcon className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                     </div>
                     <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wide mb-1">
                           Bildirim
                        </p>
                        <p className="text-sm text-foreground leading-relaxed">
                           {popup.content}
                        </p>
                     </div>
                     <button
                        onClick={() => dismiss(popup.id)}
                        className="shrink-0 rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                        aria-label="Kapat"
                     >
                        <XIcon className="h-4 w-4" />
                     </button>
                  </div>
               </div>
            </div>
         ))}
      </div>
   )
}
