'use client'

import { AlertModal } from '@/components/modals/alert-modal'
import { Heading } from '@/components/native/heading'
import { Button } from '@/components/ui/button'
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { useCsrf } from '@/hooks/useCsrf'
import { zodResolver } from '@hookform/resolvers/zod'
import { Address } from '@prisma/client'
import { Trash } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import * as z from 'zod'

const formSchema = z.object({
   city: z.string().min(1),
   address: z.string().min(1),
   phone: z.string().min(1),
   postalCode: z.string().min(1),
})

type AddressFormValues = z.infer<typeof formSchema>

interface AddressFormProps {
   initialData: Address | null
}

export const AddressForm: React.FC<AddressFormProps> = ({ initialData }) => {
   const params = useParams()
   const router = useRouter()
   const csrfToken = useCsrf()

   const [open, setOpen] = useState(false)
   const [loading, setLoading] = useState(false)

   const title = initialData ? 'Adresi Düzenle' : 'Yeni Adres'
   const description = initialData ? 'Adres bilgilerinizi güncelleyin.' : 'Yeni bir adres ekleyin.'
   const toastMessage = initialData ? 'Adres güncellendi.' : 'Adres oluşturuldu.'
   const action = initialData ? 'Kaydet' : 'Oluştur'

   const form = useForm<AddressFormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: initialData || {
         phone: '',
         city: '',
         address: '',
         postalCode: '',
      },
   })

   const onSubmit = async (data: AddressFormValues) => {
      if (!csrfToken) {
         toast.error('Sayfa yükleniyor, lütfen birkaç saniye bekleyin.')
         return
      }
      try {
         setLoading(true)

         const url = initialData ? `/api/addresses/${params.addressId}` : `/api/addresses`
         const method = initialData ? 'PATCH' : 'POST'

         const res = await fetch(url, {
            method,
            headers: {
               'Content-Type': 'application/json',
               'x-csrf-token': csrfToken,
            },
            body: JSON.stringify({ ...data, csrfToken }),
         })

         if (!res.ok) {
            const text = await res.text()
            throw new Error(text || 'İşlem başarısız')
         }

         router.refresh()
         router.push(`/profile/addresses`)
         toast.success(toastMessage)
      } catch (error: any) {
         toast.error(error.message || 'Bir hata oluştu. Lütfen tekrar deneyin.')
      } finally {
         setLoading(false)
      }
   }

   const onDelete = async () => {
      if (!csrfToken) {
         toast.error('Sayfa yükleniyor, lütfen birkaç saniye bekleyin.')
         return
      }
      try {
         setLoading(true)

         const res = await fetch(`/api/addresses/${params.addressId}`, {
            method: 'DELETE',
            headers: { 'x-csrf-token': csrfToken },
         })

         if (!res.ok) throw new Error()

         router.refresh()
         router.push(`/profile/addresses`)
         toast.success('Adres silindi.')
      } catch (error: any) {
         toast.error('Adres silinirken bir hata oluştu.')
      } finally {
         setLoading(false)
         setOpen(false)
      }
   }

   return (
      <>
         <AlertModal
            isOpen={open}
            onClose={() => setOpen(false)}
            onConfirm={onDelete}
            loading={loading}
         />
         <div className="flex items-center justify-between">
            <Heading title={title} description={description} />
            {initialData && (
               <Button
                  disabled={loading}
                  variant="destructive"
                  size="sm"
                  onClick={() => setOpen(true)}
               >
                  <Trash className="h-4" />
               </Button>
            )}
         </div>
         <Separator />
         <Form {...form}>
            <form
               onSubmit={form.handleSubmit(onSubmit)}
               className="space-y-8 w-full"
            >
               <div className="md:grid md:grid-cols-3 gap-8">
                  <FormField
                     control={form.control}
                     name="city"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Şehir</FormLabel>
                           <FormControl>
                              <Input
                                 disabled={loading}
                                 placeholder="İstanbul"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <FormField
                     control={form.control}
                     name="phone"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Telefon</FormLabel>
                           <FormControl>
                              <Input
                                 disabled={loading}
                                 placeholder="05XX XXX XX XX"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="postalCode"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Posta Kodu</FormLabel>
                           <FormControl>
                              <Input
                                 disabled={loading}
                                 placeholder="34000"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <div className="col-span-2">
                     <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Adres</FormLabel>
                              <FormControl>
                                 <Textarea
                                    disabled={loading}
                                    placeholder="Mahalle, Cadde, Bina No, Daire No"
                                    {...field}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </div>
               </div>
               <Button disabled={loading} className="ml-auto" type="submit">
                  {action}
               </Button>
            </form>
         </Form>
      </>
   )
}
