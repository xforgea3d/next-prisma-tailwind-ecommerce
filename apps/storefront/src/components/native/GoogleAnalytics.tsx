'use client'

import Script from 'next/script'
import { useEffect } from 'react'

const GA_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID

export default function GoogleAnalytics() {
   useEffect(() => {
      if (!GA_ID) return

      const checkConsent = () => {
         try {
            const consent = localStorage.getItem('cookie-consent')
            if (!consent) return
            const parsed = JSON.parse(consent)
            const accepted =
               parsed === 'accepted' ||
               parsed === true ||
               parsed?.analytics === true
            if (accepted) {
               window.gtag?.('consent', 'update', {
                  analytics_storage: 'granted',
               })
            }
         } catch {
            const consent = localStorage.getItem('cookie-consent')
            if (consent === 'accepted' || consent === 'true') {
               window.gtag?.('consent', 'update', {
                  analytics_storage: 'granted',
               })
            }
         }
      }

      checkConsent()

      window.addEventListener('cookie-consent-updated', checkConsent)
      window.addEventListener('storage', checkConsent)
      return () => {
         window.removeEventListener('cookie-consent-updated', checkConsent)
         window.removeEventListener('storage', checkConsent)
      }
   }, [])

   if (!GA_ID) return null

   return (
      <>
         <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
         />
         <Script id="gtag-init" strategy="afterInteractive">
            {`
               window.dataLayer = window.dataLayer || [];
               function gtag(){dataLayer.push(arguments);}
               gtag('consent', 'default', {
                  analytics_storage: 'denied',
               });
               gtag('js', new Date());
               gtag('config', '${GA_ID}', {
                  page_path: window.location.pathname,
               });
            `}
         </Script>
      </>
   )
}
