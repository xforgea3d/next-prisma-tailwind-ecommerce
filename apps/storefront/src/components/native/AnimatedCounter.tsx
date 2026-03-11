'use client'

import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { useEffect, useState } from 'react'

interface AnimatedCounterProps {
   end: number
   suffix?: string
   prefix?: string
   duration?: number
   className?: string
}

export function AnimatedCounter({
   end,
   suffix = '',
   prefix = '',
   duration = 2000,
   className,
}: AnimatedCounterProps) {
   const { ref, isVisible } = useScrollAnimation({ threshold: 0.5 })
   const [count, setCount] = useState(0)

   useEffect(() => {
      if (!isVisible) return

      let startTime: number | null = null
      let animationFrame: number

      const animate = (timestamp: number) => {
         if (!startTime) startTime = timestamp
         const progress = Math.min((timestamp - startTime) / duration, 1)

         // Ease-out cubic
         const eased = 1 - Math.pow(1 - progress, 3)
         setCount(Math.floor(eased * end))

         if (progress < 1) {
            animationFrame = requestAnimationFrame(animate)
         }
      }

      animationFrame = requestAnimationFrame(animate)
      return () => cancelAnimationFrame(animationFrame)
   }, [isVisible, end, duration])

   return (
      <span ref={ref} className={className}>
         {prefix}{count}{suffix}
      </span>
   )
}
