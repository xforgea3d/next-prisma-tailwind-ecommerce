'use client'

import { useAuthenticated } from '@/hooks/useAuthentication'
import { useCsrf } from '@/hooks/useCsrf'
import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'onboarding-completed'

export default function WelcomeOnboarding() {
   const { authenticated } = useAuthenticated()
   const csrfToken = useCsrf()
   const [visible, setVisible] = useState(false)
   const [step, setStep] = useState(1)
   const [kvkkChecked, setKvkkChecked] = useState(false)
   const [privacyChecked, setPrivacyChecked] = useState(false)
   const [marketingChecked, setMarketingChecked] = useState(false)
   const [smsChecked, setSmsChecked] = useState(false)
   const [saving, setSaving] = useState(false)

   useEffect(() => {
      if (authenticated && typeof window !== 'undefined') {
         const completed = localStorage.getItem(STORAGE_KEY)
         if (!completed) {
            setVisible(true)
         }
      }
   }, [authenticated])

   const handleComplete = useCallback(async () => {
      setSaving(true)
      try {
         await fetch('/api/profile', {
            method: 'PATCH',
            headers: {
               'Content-Type': 'application/json',
               ...(csrfToken && { 'x-csrf-token': csrfToken }),
            },
            body: JSON.stringify({
               kvkkAccepted: true,
               marketingConsent: marketingChecked,
               smsConsent: smsChecked,
               csrfToken,
            }),
         })
      } catch (err) {
         console.error('[WelcomeOnboarding] Failed to save preferences', err)
      }
      localStorage.setItem(STORAGE_KEY, 'true')
      setVisible(false)
      setSaving(false)
   }, [csrfToken, marketingChecked, smsChecked])

   if (!visible) return null

   return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
         <div className="relative w-full max-w-md rounded-2xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-900">
            {/* Step Content */}
            <div className="p-6 sm:p-8">
               {step === 1 && (
                  <div className="flex flex-col items-center text-center space-y-5">
                     {/* Logo / Gradient Icon */}
                     <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg">
                        <svg
                           viewBox="0 0 24 24"
                           fill="none"
                           stroke="white"
                           strokeWidth="1.5"
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           className="h-10 w-10"
                        >
                           <path d="M12 2L2 7l10 5 10-5-10-5z" />
                           <path d="M2 17l10 5 10-5" />
                           <path d="M2 12l10 5 10-5" />
                        </svg>
                     </div>

                     <div>
                        <h2 className="text-2xl font-bold text-foreground">
                           Hos Geldiniz! <span aria-hidden="true">&#127881;</span>
                        </h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                           xForgea3D ailesine katildiginiz icin tesekkurler.
                        </p>
                     </div>

                     <p className="text-sm text-muted-foreground leading-relaxed">
                        3D baski urunler, kisiye ozel tasarimlar ve arac aksesuarlari ile
                        tanisin. Size en uygun urunleri kesfetmeye hazir misiniz?
                     </p>

                     <button
                        onClick={() => setStep(2)}
                        className="mt-2 w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:brightness-110 active:scale-[0.98]"
                     >
                        Devam Et
                     </button>
                  </div>
               )}

               {step === 2 && (
                  <div className="space-y-5">
                     <div className="text-center">
                        <h2 className="text-xl font-bold text-foreground">KVKK &amp; Gizlilik Onayi</h2>
                        <p className="mt-1 text-xs text-red-500 font-medium">* Zorunlu</p>
                     </div>

                     <div className="space-y-4">
                        <label className="flex items-start gap-3 cursor-pointer group">
                           <input
                              type="checkbox"
                              checked={kvkkChecked}
                              onChange={(e) => setKvkkChecked(e.target.checked)}
                              className="mt-0.5 h-5 w-5 rounded border-neutral-300 text-orange-500 focus:ring-orange-500 accent-orange-500 flex-shrink-0"
                           />
                           <span className="text-sm text-muted-foreground leading-relaxed">
                              Kisisel Verilerin Korunmasi Kanunu (KVKK) kapsaminda{' '}
                              <a
                                 href="/policies/kvkk-aydinlatma-metni"
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="text-orange-500 underline underline-offset-2 hover:text-orange-600 font-medium"
                              >
                                 aydinlatma metnini
                              </a>{' '}
                              okudum ve kabul ediyorum.
                           </span>
                        </label>

                        <label className="flex items-start gap-3 cursor-pointer group">
                           <input
                              type="checkbox"
                              checked={privacyChecked}
                              onChange={(e) => setPrivacyChecked(e.target.checked)}
                              className="mt-0.5 h-5 w-5 rounded border-neutral-300 text-orange-500 focus:ring-orange-500 accent-orange-500 flex-shrink-0"
                           />
                           <span className="text-sm text-muted-foreground leading-relaxed">
                              <a
                                 href="/policies/gizlilik-ve-cerez-politikasi"
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="text-orange-500 underline underline-offset-2 hover:text-orange-600 font-medium"
                              >
                                 Gizlilik ve Cerez Politikasini
                              </a>{' '}
                              okudum ve kabul ediyorum.
                           </span>
                        </label>
                     </div>

                     <button
                        onClick={() => setStep(3)}
                        disabled={!kvkkChecked || !privacyChecked}
                        className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:brightness-110 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-md disabled:hover:brightness-100"
                     >
                        Devam Et
                     </button>
                  </div>
               )}

               {step === 3 && (
                  <div className="space-y-5">
                     <div className="text-center">
                        <h2 className="text-xl font-bold text-foreground">Iletisim Tercihleri</h2>
                        <p className="mt-1 text-xs text-muted-foreground">Opsiyonel</p>
                     </div>

                     <div className="space-y-4">
                        <label className="flex items-start gap-3 cursor-pointer group">
                           <input
                              type="checkbox"
                              checked={marketingChecked}
                              onChange={(e) => setMarketingChecked(e.target.checked)}
                              className="mt-0.5 h-5 w-5 rounded border-neutral-300 text-orange-500 focus:ring-orange-500 accent-orange-500 flex-shrink-0"
                           />
                           <span className="text-sm text-muted-foreground leading-relaxed">
                              Kampanya ve indirimlerden e-posta ile haberdar olmak istiyorum.
                           </span>
                        </label>

                        <label className="flex items-start gap-3 cursor-pointer group">
                           <input
                              type="checkbox"
                              checked={smsChecked}
                              onChange={(e) => setSmsChecked(e.target.checked)}
                              className="mt-0.5 h-5 w-5 rounded border-neutral-300 text-orange-500 focus:ring-orange-500 accent-orange-500 flex-shrink-0"
                           />
                           <span className="text-sm text-muted-foreground leading-relaxed">
                              Siparis durum guncellemelerini SMS ile almak istiyorum.
                           </span>
                        </label>
                     </div>

                     <button
                        onClick={handleComplete}
                        disabled={saving}
                        className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
                     >
                        {saving ? 'Kaydediliyor...' : 'Tamamla'}
                     </button>
                  </div>
               )}
            </div>

            {/* Step Indicator Dots */}
            <div className="flex items-center justify-center gap-2 pb-6">
               {[1, 2, 3].map((s) => (
                  <div
                     key={s}
                     className={`h-2 rounded-full transition-all duration-300 ${
                        s === step
                           ? 'w-6 bg-gradient-to-r from-orange-500 to-amber-500'
                           : s < step
                           ? 'w-2 bg-orange-300'
                           : 'w-2 bg-neutral-300 dark:bg-neutral-600'
                     }`}
                  />
               ))}
            </div>
         </div>
      </div>
   )
}
