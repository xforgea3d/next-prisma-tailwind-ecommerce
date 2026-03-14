'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCheckIcon, BellIcon, InboxIcon, PackageIcon, MegaphoneIcon } from 'lucide-react'
import { useCsrf } from '@/hooks/useCsrf'
import Link from 'next/link'

interface Notification {
   id: string
   content: string
   type: string
   isRead: boolean
   createdAt: string
}

function linkifyOrderReferences(content: string): React.ReactNode {
   const regex = /([Ss]ipari[s\u015F]\s*#?)(\d+)/g
   const parts: React.ReactNode[] = []
   let lastIndex = 0
   let match: RegExpExecArray | null

   while ((match = regex.exec(content)) !== null) {
      if (match.index > lastIndex) {
         parts.push(content.slice(lastIndex, match.index))
      }
      parts.push(
         <Link
            key={match.index}
            href={`/profile/orders/${match[2]}`}
            className="font-semibold text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 underline underline-offset-2"
            onClick={(e) => e.stopPropagation()}
         >
            {match[0]}
         </Link>
      )
      lastIndex = regex.lastIndex
   }

   if (lastIndex < content.length) {
      parts.push(content.slice(lastIndex))
   }

   return parts.length > 0 ? parts : content
}

function isOrderRelated(content: string): boolean {
   return /sipari[s\u015F]/i.test(content)
}

function relativeTime(dateStr: string): string {
   const now = Date.now()
   const date = new Date(dateStr).getTime()
   const diff = now - date
   const seconds = Math.floor(diff / 1000)
   const minutes = Math.floor(seconds / 60)
   const hours = Math.floor(minutes / 60)
   const days = Math.floor(hours / 24)

   if (seconds < 60) return 'az \u00F6nce'
   if (minutes < 60) return `${minutes} dk \u00F6nce`
   if (hours < 24) return `${hours} saat \u00F6nce`
   if (days === 1) return 'd\u00FCn'
   if (days < 7) return `${days} g\u00FCn \u00F6nce`
   if (days < 30) return `${Math.floor(days / 7)} hafta \u00F6nce`
   return `${Math.floor(days / 30)} ay \u00F6nce`
}

export default function NotificationsPage() {
   const csrfToken = useCsrf()
   const [notifications, setNotifications] = useState<Notification[]>([])
   const [unreadCount, setUnreadCount] = useState(0)
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState<string | null>(null)

   const fetchNotifications = useCallback(async () => {
      try {
         const res = await fetch('/api/notifications', { cache: 'no-store' })
         if (!res.ok) return
         const data = await res.json()
         setNotifications(data.notifications ?? [])
         setUnreadCount(data.unreadCount ?? 0)
      } catch {
         // silently fail
      } finally {
         setLoading(false)
      }
   }, [])

   useEffect(() => {
      fetchNotifications()
   }, [fetchNotifications])

   async function markAllAsRead() {
      setError(null)
      try {
         const res = await fetch('/api/notifications', {
            method: 'PATCH',
            headers: {
               'Content-Type': 'application/json',
               ...(csrfToken && { 'x-csrf-token': csrfToken }),
            },
            body: JSON.stringify({ all: true, csrfToken }),
         })
         if (!res.ok) {
            setError('Bildirimler okundu olarak i\u015Faretlenemedi. L\u00FCtfen tekrar deneyin.')
            return
         }
         await fetchNotifications()
      } catch {
         setError('Bir hata olu\u015Ftu. L\u00FCtfen tekrar deneyin.')
      }
   }

   async function markAsRead(id: string) {
      setError(null)
      try {
         const res = await fetch('/api/notifications', {
            method: 'PATCH',
            headers: {
               'Content-Type': 'application/json',
               ...(csrfToken && { 'x-csrf-token': csrfToken }),
            },
            body: JSON.stringify({ ids: [id], csrfToken }),
         })
         if (!res.ok) {
            setError('Bildirim okundu olarak i\u015Faretlenemedi. L\u00FCtfen tekrar deneyin.')
            return
         }
         await fetchNotifications()
      } catch {
         setError('Bir hata olu\u015Ftu. L\u00FCtfen tekrar deneyin.')
      }
   }

   if (loading) {
      return (
         <div className="flex items-center justify-center py-16">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
         </div>
      )
   }

   return (
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <div>
               <h3 className="text-lg font-medium">Bildirim Ge\u00E7mi\u015Fi</h3>
               <p className="text-sm text-muted-foreground">
                  {unreadCount > 0
                     ? `${unreadCount} okunmam\u0131\u015F bildirim`
                     : 'T\u00FCm bildirimler okundu'}
               </p>
            </div>
            {unreadCount > 0 && (
               <Button variant="outline" size="sm" onClick={markAllAsRead}>
                  <CheckCheckIcon className="mr-2 h-4 w-4" />
                  T\u00FCm\u00FCn\u00FC Okundu \u0130\u015Faretle
               </Button>
            )}
         </div>

         {error && (
            <div className="rounded-lg border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800 p-3 text-sm text-red-700 dark:text-red-400">
               {error}
            </div>
         )}

         {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
               <InboxIcon className="h-12 w-12 mb-4" />
               <p className="text-lg font-medium">Bildiriminiz yok</p>
               <p className="text-sm">Yeni bildirimler burada g\u00F6r\u00FCnecek.</p>
            </div>
         ) : (
            <div className="space-y-2">
               {notifications.map(notification => {
                  const orderRelated = isOrderRelated(notification.content)
                  const isPopup = notification.type === 'popup'

                  return (
                     <div
                        key={notification.id}
                        className={`flex items-start gap-3 rounded-lg border p-4 transition-colors ${
                           !notification.isRead
                              ? 'bg-accent/20 border-l-4 border-l-orange-500 border-t border-r border-b'
                              : 'bg-background border-muted'
                        }`}
                     >
                        <div className="mt-0.5 shrink-0">
                           {isPopup ? (
                              <MegaphoneIcon className={`h-4 w-4 ${!notification.isRead ? 'text-orange-500' : 'text-muted-foreground'}`} />
                           ) : orderRelated ? (
                              <PackageIcon className={`h-4 w-4 ${!notification.isRead ? 'text-orange-500' : 'text-muted-foreground'}`} />
                           ) : !notification.isRead ? (
                              <span className="flex h-2.5 w-2.5 rounded-full bg-blue-500 mt-0.5" />
                           ) : (
                              <BellIcon className="h-4 w-4 text-muted-foreground" />
                           )}
                        </div>
                        <div className="flex-1 min-w-0">
                           <div className="flex items-center gap-2">
                              <p className={`text-sm ${!notification.isRead ? 'font-medium' : 'text-muted-foreground'}`}>
                                 {linkifyOrderReferences(notification.content)}
                              </p>
                           </div>
                           <div className="flex items-center gap-2 mt-1.5">
                              <p className="text-xs text-muted-foreground">
                                 {relativeTime(notification.createdAt)}
                              </p>
                              {isPopup && (
                                 <span className="text-[10px] bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 px-1.5 py-0.5 rounded-full font-medium">
                                    Popup
                                 </span>
                              )}
                              {notification.isRead && (
                                 <span className="text-[10px] text-muted-foreground">
                                    Okundu
                                 </span>
                              )}
                           </div>
                        </div>
                        {!notification.isRead && (
                           <Button
                              variant="ghost"
                              size="sm"
                              className="shrink-0 text-xs"
                              onClick={() => markAsRead(notification.id)}
                           >
                              Okundu
                           </Button>
                        )}
                     </div>
                  )
               })}
            </div>
         )}
      </div>
   )
}
