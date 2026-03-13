'use client'

import { AlertModal } from '@/components/modals/alert-modal'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

interface BrandDeleteButtonProps {
   brandId: string
   brandName: string
}

export const BrandDeleteButton: React.FC<BrandDeleteButtonProps> = ({ brandId, brandName }) => {
   const router = useRouter()
   const [open, setOpen] = useState(false)
   const [loading, setLoading] = useState(false)

   const onDelete = async () => {
      try {
         setLoading(true)
         const res = await fetch(`/api/car-brands/${brandId}`, { method: 'DELETE' })
         if (!res.ok) throw new Error(await res.text())
         router.refresh()
         toast.success(`${brandName} silindi.`)
      } catch (e: any) {
         toast.error('Hata: ' + (e?.message || 'Bilinmeyen'))
      } finally {
         setLoading(false)
         setOpen(false)
      }
   }

   return (
      <>
         <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading} />
         <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={(e) => {
               e.preventDefault()
               e.stopPropagation()
               setOpen(true)
            }}
         >
            <Trash2 className="h-4 w-4" />
         </Button>
      </>
   )
}
