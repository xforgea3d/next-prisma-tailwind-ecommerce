import Link from 'next/link'
import { Search } from 'lucide-react'

export default function NotFound() {
   return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
         {/* Search icon decoration */}
         <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-500/10 dark:bg-orange-500/20">
            <Search className="h-10 w-10 text-orange-500" />
         </div>

         {/* Large 404 text */}
         <h1 className="text-[8rem] font-extrabold leading-none tracking-tighter text-foreground/10 sm:text-[10rem]">
            404
         </h1>

         {/* Heading */}
         <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Sayfa Bulunamadı
         </h2>

         {/* Description */}
         <p className="mt-4 max-w-md text-muted-foreground">
            Aradığınız sayfa mevcut değil veya taşınmış olabilir.
         </p>

         {/* Action buttons */}
         <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
               href="/"
               className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
            >
               Ana Sayfaya Dön
            </Link>
            <Link
               href="/products"
               className="inline-flex items-center justify-center rounded-lg border border-input bg-background px-6 py-3 text-sm font-semibold transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
               Ürünlere Göz At
            </Link>
         </div>
      </div>
   )
}
