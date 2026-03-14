'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'

export default function GoogleAnalytics() {
   const [consentGiven, setConsentGiven] = useState(false)
   const googleID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID

   useEffect(() => {
      const checkConsent = () => {
         try {
            const consent = localStorage.getItem('cookie-consent')
            if (consent) {
               const parsed = JSON.parse(consent)
               // Support both { analytics: true } object format and simple "accepted" string
               if (
                  parsed === 'accepted' ||
                  parsed === true ||
                  parsed?.analytics === true
               ) {
                  setConsentGiven(true)
               }
            }
         } catch {
            // If parsing fails, check as plain string
            const consent = localStorage.getItem('cookie-consent')
            if (consent === 'accepted' || consent === 'true') {
               setConsentGiven(true)
            }
         }
      }

      checkConsent()

      // Re-check when cookie consent changes (custom event from cookie banner)
      const handleConsentChange = () => checkConsent()
      window.addEventListener('cookie-consent-updated', handleConsentChange)
      window.addEventListener('storage', handleConsentChange)

      return () => {
         window.removeEventListener('cookie-consent-updated', handleConsentChange)
         window.removeEventListener('storage', handleConsentChange)
      }
   }, [])

   if (!googleID || !consentGiven) return null

   const gtag = `https://www.googletagmanager.com/gtag/js?id=${googleID}`
   const gscript = {
      __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${googleID}', {
                  page_path: window.location.pathname,
                });
              `,
   }

   return (
      <>
         <Script src={gtag} async />
         <Script id="gscript" dangerouslySetInnerHTML={gscript} />
      </>
   )
}
