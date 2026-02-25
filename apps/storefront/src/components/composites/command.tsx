'use client'

import { Button } from '@/components/ui/button'
import {
   CommandDialog,
   CommandEmpty,
   CommandGroup,
   CommandInput,
   CommandItem,
   CommandList,
   CommandSeparator,
} from '@/components/ui/command'
import { cn } from '@/lib/utils'
import { CircleIcon, Loader2, PackageIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import Image from 'next/image'

export function CommandMenu({ ...props }: any) {
   const router = useRouter()
   const [open, setOpen] = React.useState(false)
   const [query, setQuery] = React.useState('')
   const [loading, setLoading] = React.useState(false)
   const [products, setProducts] = React.useState<any[]>([])

   // Klavye kısayolu (Cmd+K / Ctrl+K)
   React.useEffect(() => {
      const down = (e: KeyboardEvent) => {
         if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault()
            setOpen((open) => !open)
         }
      }
      document.addEventListener('keydown', down)
      return () => document.removeEventListener('keydown', down)
   }, [])

   // API'ye Arama İsteği Atan Blok (Debounce simüle edilir)
   React.useEffect(() => {
      if (query.length < 2) {
         setProducts([])
         return
      }

      const delayDebounceFn = setTimeout(async () => {
         try {
            setLoading(true)
            const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
            const data = await res.json()
            setProducts(data.products || [])
         } catch (error) {
            console.error("Arama hatası", error)
         } finally {
            setLoading(false)
         }
      }, 400) // 400ms klavye yazma beklemesi

      return () => clearTimeout(delayDebounceFn)
   }, [query])

   const runCommand = React.useCallback((command: () => unknown) => {
      setOpen(false)
      command()
   }, [])

   return (
      <>
         <Button
            variant="outline"
            className={cn(
               'relative w-full justify-start text-sm font-light text-muted-foreground sm:pr-12 md:w-40 lg:w-64'
            )}
            onClick={() => setOpen(true)}
            {...props}
         >
            <span className="inline-flex">Uygulamada ara...</span>
            <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
               <span className="text-xs">⌘</span>K
            </kbd>
         </Button>
         <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput
               placeholder="Ürün adı veya açıklamasıyla arayın..."
               value={query}
               onValueChange={setQuery}
            />
            <CommandList>
               <CommandEmpty>
                  {loading ? (
                     <div className="flex items-center justify-center p-4">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mr-2" />
                        <span className="text-sm">Aranıyor...</span>
                     </div>
                  ) : (
                     query.length > 1 ? 'Hiçbir sonuç bulunamadı.' : 'Aramaya başlamak için yazın.'
                  )}
               </CommandEmpty>

               {products.length > 0 && (
                  <CommandGroup heading="Ürün Sonuçları">
                     {products.map((product) => (
                        <CommandItem
                           key={product.id}
                           value={product.title}
                           onSelect={() => {
                              runCommand(() => router.push(`/products/${product.id}`))
                           }}
                           className="flex items-center gap-3 cursor-pointer p-2"
                        >
                           {/* Ürün Görseli Minyatür */}
                           <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-md border bg-muted">
                              {product.images?.[0] ? (
                                 <Image
                                    src={product.images[0]}
                                    alt={product.title}
                                    fill
                                    className="object-cover"
                                 />
                              ) : (
                                 <PackageIcon className="h-4 w-4 absolute m-auto inset-0 text-muted-foreground" />
                              )}
                           </div>

                           <div className="flex flex-col flex-1">
                              <span className="font-medium text-sm line-clamp-1">{product.title}</span>
                              <span className="text-xs text-muted-foreground line-clamp-1">
                                 {product.categories?.[0]?.title || 'Kategori Yok'}
                              </span>
                           </div>
                           <div className="text-sm font-semibold">
                              {product.price.toFixed(2)}₺
                           </div>
                        </CommandItem>
                     ))}
                  </CommandGroup>
               )}
            </CommandList>
         </CommandDialog>
      </>
   )
}
