'use client'

import { AlertModal } from '@/components/modals/alert-modal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from '@/components/ui/form'
import ImageUpload from '@/components/ui/image-upload'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trash2, Save, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import * as z from 'zod'

const formSchema = z.object({
   name: z.string().min(1, 'Marka adı zorunlu'),
   slug: z.string().min(1, 'Slug zorunlu'),
   logoUrl: z.string().optional(),
   sortOrder: z.coerce.number().min(0).default(0),
})

type FormValues = z.infer<typeof formSchema>

interface BrandFormProps {
   initialData: {
      id: string
      name: string
      slug: string
      logoUrl: string | null
      sortOrder: number
   } | null
}

function slugify(text: string) {
   return text
      .toLowerCase()
      .replace(/[çÇ]/g, 'c')
      .replace(/[şŞ]/g, 's')
      .replace(/[ğĞ]/g, 'g')
      .replace(/[üÜ]/g, 'u')
      .replace(/[öÖ]/g, 'o')
      .replace(/[ıİ]/g, 'i')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
}

export const BrandForm: React.FC<BrandFormProps> = ({ initialData }) => {
   const router = useRouter()
   const [open, setOpen] = useState(false)
   const [loading, setLoading] = useState(false)

   const form = useForm<FormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: initialData
         ? {
              name: initialData.name,
              slug: initialData.slug,
              logoUrl: initialData.logoUrl || '',
              sortOrder: initialData.sortOrder,
           }
         : {
              name: '',
              slug: '',
              logoUrl: '',
              sortOrder: 0,
           },
   })

   const onSubmit = async (data: FormValues) => {
      try {
         setLoading(true)
         const url = initialData ? `/api/car-brands/${initialData.id}` : '/api/car-brands'
         const method = initialData ? 'PATCH' : 'POST'
         const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
         })
         if (!res.ok) throw new Error(await res.text())
         router.refresh()
         router.push('/car-brands')
         toast.success(initialData ? 'Marka güncellendi.' : 'Marka oluşturuldu.')
      } catch (e: any) {
         toast.error('Hata: ' + (e?.message || 'Bilinmeyen'))
      } finally {
         setLoading(false)
      }
   }

   const onDelete = async () => {
      try {
         setLoading(true)
         const res = await fetch(`/api/car-brands/${initialData!.id}`, { method: 'DELETE' })
         if (!res.ok) throw new Error(await res.text())
         router.refresh()
         router.push('/car-brands')
         toast.success('Marka silindi.')
      } catch (e: any) {
         toast.error('Hata: ' + (e?.message || 'Bilinmeyen'))
      } finally {
         setLoading(false)
         setOpen(false)
      }
   }

   const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const name = e.target.value
      form.setValue('name', name)
      if (!initialData) {
         form.setValue('slug', slugify(name))
      }
   }

   const logoUrl = form.watch('logoUrl')

   return (
      <>
         <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading} />

         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
               {/* Logo Card */}
               <Card>
                  <CardHeader>
                     <CardTitle className="text-base">Logo</CardTitle>
                     <CardDescription>Marka logosu yükleyin (opsiyonel)</CardDescription>
                  </CardHeader>
                  <CardContent>
                     <div className="flex items-start gap-6">
                        {/* Logo Preview */}
                        {logoUrl && (
                           <div className="relative w-20 h-20 bg-white rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden shrink-0">
                              <Image
                                 src={logoUrl}
                                 alt="Logo"
                                 width={64}
                                 height={64}
                                 className="object-contain"
                              />
                           </div>
                        )}
                        <FormField
                           control={form.control}
                           name="logoUrl"
                           render={({ field }) => (
                              <FormItem className="flex-1">
                                 <FormControl>
                                    <ImageUpload
                                       value={field.value ? [field.value] : []}
                                       disabled={loading}
                                       onChange={(url) => field.onChange(url)}
                                       onRemove={() => field.onChange('')}
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                     </div>
                  </CardContent>
               </Card>

               {/* Brand Details Card */}
               <Card>
                  <CardHeader>
                     <CardTitle className="text-base">Marka Bilgileri</CardTitle>
                     <CardDescription>Marka adı ve slug bilgilerini girin</CardDescription>
                  </CardHeader>
                  <CardContent>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <FormField
                           control={form.control}
                           name="name"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Marka Adı</FormLabel>
                                 <FormControl>
                                    <Input
                                       disabled={loading}
                                       placeholder="BMW"
                                       {...field}
                                       onChange={handleNameChange}
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                        <FormField
                           control={form.control}
                           name="slug"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Slug</FormLabel>
                                 <FormControl>
                                    <Input
                                       disabled={loading}
                                       placeholder="bmw"
                                       {...field}
                                       className="font-mono text-sm"
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                        <FormField
                           control={form.control}
                           name="sortOrder"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Sıralama</FormLabel>
                                 <FormControl>
                                    <Input type="number" disabled={loading} placeholder="0" {...field} />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                     </div>
                  </CardContent>
               </Card>

               {/* Action Buttons */}
               <div className="flex items-center gap-3">
                  <Button disabled={loading} type="submit" className="gap-2">
                     {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                     ) : (
                        <Save className="h-4 w-4" />
                     )}
                     Kaydet
                  </Button>
                  <Button
                     type="button"
                     variant="outline"
                     disabled={loading}
                     onClick={() => router.push('/car-brands')}
                  >
                     İptal
                  </Button>
                  {initialData && (
                     <Button
                        type="button"
                        disabled={loading}
                        variant="destructive"
                        size="sm"
                        onClick={() => setOpen(true)}
                        className="ml-auto gap-2"
                     >
                        <Trash2 className="h-4 w-4" />
                        Sil
                     </Button>
                  )}
               </div>
            </form>
         </Form>
      </>
   )
}
