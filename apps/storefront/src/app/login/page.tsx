export const dynamic = 'force-dynamic'

import { Metadata } from 'next'
import Link from 'next/link'

import { UserAuthForm } from '../login/components/user-auth-form'

export const metadata: Metadata = {
   title: 'Giriş Yap',
   description: 'xForgea3D hesabınıza giriş yapın.',
}

export default function AuthenticationPage() {
   return (
      <div className="container relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
         <div className="relative hidden h-full flex-col justify-between overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-10 dark:border-r lg:flex">
            {/* Decorative background glow */}
            <div className="pointer-events-none absolute inset-0">
               <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />
               <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-orange-600/5 blur-3xl" />
            </div>

            {/* Top: Logo */}
            <Link
               href="/"
               className="relative z-20 flex items-center gap-2"
            >
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="url(#logo-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
                  <defs>
                     <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f97316" />
                        <stop offset="100%" stopColor="#ea580c" />
                     </linearGradient>
                  </defs>
                  <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
               </svg>
               <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-xl font-bold tracking-tight text-transparent">
                  xForgea3D
               </span>
            </Link>

            {/* Center: Tagline + Features */}
            <div className="relative z-20 flex flex-col gap-8">
               <div className="space-y-3">
                  <h2 className="text-3xl font-bold leading-tight text-white">
                     Fikrine{' '}
                     <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                        Sekil Ver
                     </span>
                     ,<br />
                     Katman Katman{' '}
                     <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                        Uret.
                     </span>
                  </h2>
                  <p className="max-w-sm text-sm leading-relaxed text-zinc-400">
                     Turkiye&apos;nin premium 3D baski markasi ile hayallerinizi gercege donusturun.
                  </p>
               </div>

               <div className="space-y-4">
                  {/* Feature 1 */}
                  <div className="flex items-center gap-3">
                     <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                           <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                     </div>
                     <div>
                        <p className="text-sm font-medium text-white">Kisiye Ozel 3D Baski</p>
                        <p className="text-xs text-zinc-500">Tasariminizi gonderin, biz uretelim</p>
                     </div>
                  </div>

                  {/* Feature 2 */}
                  <div className="flex items-center gap-3">
                     <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                           <rect x="1" y="3" width="15" height="13" rx="2" ry="2" />
                           <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                           <circle cx="5.5" cy="18.5" r="2.5" />
                           <circle cx="18.5" cy="18.5" r="2.5" />
                        </svg>
                     </div>
                     <div>
                        <p className="text-sm font-medium text-white">Turkiye Geneli Kargo</p>
                        <p className="text-xs text-zinc-500">Hizli ve guvenli teslimat</p>
                     </div>
                  </div>

                  {/* Feature 3 */}
                  <div className="flex items-center gap-3">
                     <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                           <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                     </div>
                     <div>
                        <p className="text-sm font-medium text-white">14 Gun Iade Garantisi</p>
                        <p className="text-xs text-zinc-500">Kosulsuz memnuniyet</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Bottom: Trust indicator + testimonial */}
            <div className="relative z-20 space-y-6">
               <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                     {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-zinc-900 bg-zinc-700 text-[10px] font-medium text-zinc-300">
                           {['MK', 'AY', 'SD', 'EO'][i - 1]}
                        </div>
                     ))}
                  </div>
                  <div className="ml-1">
                     <div className="flex text-orange-500">
                        {[1, 2, 3, 4, 5].map((i) => (
                           <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                           </svg>
                        ))}
                     </div>
                     <p className="text-xs text-zinc-400">
                        <span className="font-semibold text-white">1000+</span> Mutlu Musteri
                     </p>
                  </div>
               </div>

               <blockquote className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
                  <p className="text-sm leading-relaxed text-zinc-300">
                     &ldquo;xForgea3D ile siparis verdigim figur hayallerimden de guzel geldi. Kalite ve detay calismasi inanilmaz.&rdquo;
                  </p>
                  <footer className="mt-2 text-xs text-zinc-500">Mert K., Ankara</footer>
               </blockquote>
            </div>
         </div>
         <div className="p-8">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
               <div className="flex flex-col space-y-2 text-center">
                  <h1 className="text-2xl font-semibold tracking-tight">
                     Giriş Yap
                  </h1>
                  <p className="text-sm text-muted-foreground">
                     E-posta adresinizi girerek giriş yapın veya hesap oluşturun.
                  </p>
               </div>
               <UserAuthForm />
               <p className="px-8 text-center text-sm text-muted-foreground">
                  Devam ederek{' '}
                  <Link
                     href="/terms"
                     className="underline underline-offset-4 hover:text-primary"
                  >
                     Kullanım Koşullarımızı
                  </Link>{' '}
                  ve{' '}
                  <Link
                     href="/privacy"
                     className="underline underline-offset-4 hover:text-primary"
                  >
                     Gizlilik Politikamızı
                  </Link>
                  {' '}kabul etmiş olursunuz.
               </p>
            </div>
         </div>
      </div>
   )
}
