'use client'

import { cn } from '@/lib/utils'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import { useEffect, useState, useCallback } from 'react'
import { SearchIcon } from 'lucide-react'

// Lightbox is imported lazily so it doesn't bloat the initial JS bundle
import dynamic from 'next/dynamic'
const ProductLightbox = dynamic(() => import('./ProductLightbox'), { ssr: false })

export default function Carousel({ images }: { images: string[] }) {
   const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 4000, stopOnInteraction: true })])
   const [selectedIndex, setSelectedIndex] = useState(0)
   const [lightboxOpen, setLightboxOpen] = useState(false)
   // Only mount the Lightbox component when user first interacts with it
   const [lightboxMounted, setLightboxMounted] = useState(false)

   const onSelect = useCallback(() => {
      if (!emblaApi) return
      setSelectedIndex(emblaApi.selectedScrollSnap())
   }, [emblaApi])

   useEffect(() => {
      if (!emblaApi) return
      emblaApi.on('select', onSelect)
      return () => { emblaApi.off('select', onSelect) }
   }, [emblaApi, onSelect])

   const openLightbox = () => {
      setLightboxMounted(true) // mount lazily on first click
      setLightboxOpen(true)
   }

   if (!images?.length) return null

   return (
      <>
         <div className="overflow-hidden rounded-lg group relative" ref={emblaRef}>
            <div className="flex">
               {images.map((src, i) => (
                  <div
                     className="relative h-96 flex-[0_0_100%] bg-neutral-100 dark:bg-neutral-900 cursor-zoom-in"
                     key={i}
                     onClick={openLightbox}
                  >
                     <Image
                        src={src}
                        fill
                        className="object-contain"
                        alt=""
                        priority={i === 0}
                        sizes="(max-width: 1024px) 100vw, 50vw"
                     />
                  </div>
               ))}
            </div>

            {/* Zoom hint — only visible on hover */}
            <button
               onClick={openLightbox}
               className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 rounded-full bg-background/80 backdrop-blur px-3 py-1.5 text-xs font-medium text-foreground shadow opacity-0 group-hover:opacity-100 transition-opacity"
            >
               <SearchIcon className="w-3.5 h-3.5" />
               Büyüt
            </button>
         </div>

         {/* Dot indicators */}
         <Dots
            itemsLength={images.length}
            selectedIndex={selectedIndex}
            onDotClick={(i) => emblaApi?.scrollTo(i)}
         />

         {/* Lightbox — only mounted after first user click */}
         {lightboxMounted && (
            <ProductLightbox
               images={images}
               initialIndex={selectedIndex}
               open={lightboxOpen}
               onClose={() => setLightboxOpen(false)}
               onIndexChange={(i) => {
                  setSelectedIndex(i)
                  emblaApi?.scrollTo(i)
               }}
            />
         )}
      </>
   )
}

function Dots({
   itemsLength,
   selectedIndex,
   onDotClick,
}: {
   itemsLength: number
   selectedIndex: number
   onDotClick: (index: number) => void
}) {
   if (itemsLength <= 1) return null
   return (
      <div className="flex justify-center gap-2 py-2">
         {Array.from({ length: itemsLength }).map((_, i) => (
            <button
               key={i}
               onClick={() => onDotClick(i)}
               className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  i === selectedIndex
                     ? 'w-6 bg-foreground'
                     : 'w-1.5 bg-foreground/30 hover:bg-foreground/60'
               )}
               aria-label={`Slide ${i + 1}`}
            />
         ))}
      </div>
   )
}
