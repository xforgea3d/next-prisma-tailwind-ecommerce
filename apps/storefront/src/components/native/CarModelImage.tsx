'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface CarModelImageProps {
   src: string
   alt: string
   className?: string
   containerClassName?: string
   /** Upper threshold: pixels with R,G,B all above this become fully transparent. Default 230. */
   whiteThreshold?: number
   /** Lower threshold: pixels between this and whiteThreshold get proportionally reduced alpha. Default 200. */
   gradientThreshold?: number
}

/**
 * Renders a car model image with white background pixels removed via canvas processing.
 * Pixels near-white (above whiteThreshold) become transparent.
 * Pixels between gradientThreshold and whiteThreshold get smooth alpha falloff.
 * The result is displayed on a black background container.
 */
export default function CarModelImage({
   src,
   alt,
   className = '',
   containerClassName = '',
   whiteThreshold = 230,
   gradientThreshold = 200,
}: CarModelImageProps) {
   const [processedSrc, setProcessedSrc] = useState<string | null>(null)
   const [failed, setFailed] = useState(false)
   const canvasRef = useRef<HTMLCanvasElement | null>(null)

   const processImage = useCallback(() => {
      if (!src) return

      const img = new Image()
      img.crossOrigin = 'anonymous'

      img.onload = () => {
         try {
            const canvas = canvasRef.current || document.createElement('canvas')
            if (!canvasRef.current) canvasRef.current = canvas

            canvas.width = img.naturalWidth
            canvas.height = img.naturalHeight

            const ctx = canvas.getContext('2d', { willReadFrequently: true })
            if (!ctx) {
               setFailed(true)
               return
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(img, 0, 0)

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
            const data = imageData.data
            const len = data.length
            const range = whiteThreshold - gradientThreshold

            for (let i = 0; i < len; i += 4) {
               const r = data[i]
               const g = data[i + 1]
               const b = data[i + 2]

               if (r > whiteThreshold && g > whiteThreshold && b > whiteThreshold) {
                  // Fully white region -> transparent
                  data[i + 3] = 0
               } else if (
                  r > gradientThreshold &&
                  g > gradientThreshold &&
                  b > gradientThreshold &&
                  range > 0
               ) {
                  // Transition zone: smooth alpha falloff
                  // Use the minimum channel to determine how "white" this pixel is
                  const minChannel = Math.min(r, g, b)
                  const t = (minChannel - gradientThreshold) / range
                  // t goes from 0 (at gradientThreshold) to 1 (at whiteThreshold)
                  // We want alpha to go from full (255) to 0
                  const newAlpha = Math.round((1 - t) * data[i + 3])
                  data[i + 3] = newAlpha
               }
            }

            ctx.putImageData(imageData, 0, 0)
            setProcessedSrc(canvas.toDataURL('image/png'))
         } catch {
            // Canvas tainted by CORS or other error
            setFailed(true)
         }
      }

      img.onerror = () => {
         setFailed(true)
      }

      img.src = src
   }, [src, whiteThreshold, gradientThreshold])

   useEffect(() => {
      setProcessedSrc(null)
      setFailed(false)
      processImage()
   }, [processImage])

   // Loading skeleton
   if (!processedSrc && !failed) {
      return (
         <div className={`bg-black animate-pulse ${containerClassName}`}>
            <div className="w-full h-full" />
         </div>
      )
   }

   // Fallback: show original image if canvas processing failed
   if (failed) {
      return (
         <div className={`bg-black ${containerClassName}`}>
            <img
               src={src}
               alt={alt}
               className={className}
               loading="lazy"
            />
         </div>
      )
   }

   // Success: show processed image with transparent whites on black bg
   return (
      <div className={`bg-black ${containerClassName}`}>
         <img
            src={processedSrc!}
            alt={alt}
            className={className}
            loading="lazy"
         />
      </div>
   )
}
