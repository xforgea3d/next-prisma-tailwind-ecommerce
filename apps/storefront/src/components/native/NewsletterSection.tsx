'use client'

import { useState } from 'react'

export default function NewsletterSection() {
   const [email, setEmail] = useState('')
   const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
   const [message, setMessage] = useState('')

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!email) return

      setStatus('loading')
      try {
         const res = await fetch('/api/subscription/email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
         })

         if (res.ok) {
            setStatus('success')
            setMessage('Başarıyla abone oldunuz!')
            setEmail('')
            setTimeout(() => {
               setStatus('idle')
               setMessage('')
            }, 4000)
         } else {
            setStatus('error')
            setMessage('Bir hata oluştu, lütfen tekrar deneyin.')
            setTimeout(() => {
               setStatus('idle')
               setMessage('')
            }, 4000)
         }
      } catch {
         setStatus('error')
         setMessage('Bir hata oluştu, lütfen tekrar deneyin.')
         setTimeout(() => {
            setStatus('idle')
            setMessage('')
         }, 4000)
      }
   }

   return (
      <section className="py-16 bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600">
         <div className="px-[1.4rem] md:px-[4rem] lg:px-[6rem] xl:px-[8rem] 2xl:px-[12rem]">
            <div className="max-w-2xl mx-auto text-center">
               <h2 className="text-3xl font-bold tracking-tight text-white">
                  Yeniliklerden Haberdar Ol
               </h2>
               <p className="mt-3 text-white/80 text-sm md:text-base">
                  3D baskı dünyasındaki yenilikler, özel indirimler ve yeni ürünlerden ilk siz haberdar olun.
               </p>

               <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                     type="email"
                     placeholder="E-posta adresiniz"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     required
                     className="flex-1 px-5 py-3 rounded-full bg-white/20 backdrop-blur-sm text-white placeholder:text-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent text-sm"
                  />
                  <button
                     type="submit"
                     disabled={status === 'loading'}
                     className="px-8 py-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm shadow-lg shadow-orange-700/30 transition-colors disabled:opacity-60 border-2 border-white/30"
                  >
                     {status === 'loading' ? 'Gönderiliyor...' : 'Abone Ol'}
                  </button>
               </form>

               {message && (
                  <p className={`mt-4 text-sm font-medium ${status === 'success' ? 'text-white' : 'text-red-100'}`}>
                     {message}
                  </p>
               )}
            </div>
         </div>
      </section>
   )
}
