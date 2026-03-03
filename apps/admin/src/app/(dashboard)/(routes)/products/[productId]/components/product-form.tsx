'use client'

import { AlertModal } from '@/components/modals/alert-modal'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
   Form,
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from '@/components/ui/form'
import { Heading } from '@/components/ui/heading'
import ImageUpload from '@/components/ui/image-upload'
import { CustomOptionsEditor } from './custom-options-editor'
import { Input } from '@/components/ui/input'
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import type { ProductWithIncludes } from '@/types/prisma'
import { zodResolver } from '@hookform/resolvers/zod'
import { Category, CarModel } from '@prisma/client'
import { Trash, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import * as z from 'zod'

const formSchema = z.object({
   title: z.string().min(1),
   images: z.string().array(),
   price: z.coerce.number().min(1),
   discount: z.coerce.number().min(0),
   stock: z.coerce.number().min(0),
   categoryId: z.string().min(1),
   productType: z.string().default('READY'),
   customOptions: z.string().optional(),
   carModelIds: z.string().array().optional(),
   isFeatured: z.boolean().default(false).optional(),
   isAvailable: z.boolean().default(false).optional(),
})

type ProductFormValues = z.infer<typeof formSchema>

type CarModelWithBrand = CarModel & { brand: { name: string } }

interface ProductFormProps {
   initialData: ProductWithIncludes | null
   categories: Category[]
   carModels?: CarModelWithBrand[]
}

export const ProductForm: React.FC<ProductFormProps> = ({
   initialData,
   categories,
   carModels = [],
}) => {
   const params = useParams()
   const router = useRouter()

   const [open, setOpen] = useState(false)
   const [loading, setLoading] = useState(false)

   const title = initialData ? 'Edit product' : 'Create product'
   const description = initialData ? 'Edit a product.' : 'Add a new product'
   const toastMessage = initialData ? 'Product updated.' : 'Product created.'
   const action = initialData ? 'Save changes' : 'Create'

   const defaultValues = initialData
      ? {
         ...initialData,
         price: parseFloat(String(initialData?.price.toFixed(2))),
         discount: parseFloat(String(initialData?.discount.toFixed(2))),
         productType: (initialData as any)?.productType ?? 'READY',
         customOptions: (initialData as any)?.customOptions
            ? JSON.stringify((initialData as any).customOptions, null, 2)
            : '',
         carModelIds: (initialData as any)?.carModels?.map((m: any) => m.id) ?? [],
      }
      : {
         title: '---',
         description: '---',
         images: [],
         price: 0,
         discount: 0,
         stock: 0,
         categoryId: '---',
         productType: 'READY',
         customOptions: '',
         carModelIds: [],
         isFeatured: false,
         isAvailable: false,
      }

   const form = useForm<ProductFormValues>({
      resolver: zodResolver(formSchema),
      defaultValues,
   })

   const onSubmit = async (data: ProductFormValues) => {
      try {
         setLoading(true)
         // Parse customOptions JSON string back to object before sending
         const payload = {
            ...data,
            customOptions: data.customOptions
               ? JSON.parse(data.customOptions)
               : null,
         }
         if (initialData) {
            await fetch(`/api/products/${params.productId}`, {
               method: 'PATCH',
               body: JSON.stringify(payload),
               cache: 'no-store',
            })
         } else {
            await fetch(`/api/products`, {
               method: 'POST',
               body: JSON.stringify(payload),
               cache: 'no-store',
            })
         }
         router.refresh()
         router.push(`/products`)
         toast.success(toastMessage)
      } catch (error: any) {
         toast.error('Bir hata oluştu.')
      } finally {
         setLoading(false)
      }
   }

   const onDelete = async () => {
      try {
         setLoading(true)

         await fetch(`/api/products/${params.productId}`, {
            method: 'DELETE',
            cache: 'no-store',
         })

         router.refresh()
         router.push(`/products`)
         toast.success('Product deleted.')
      } catch (error: any) {
         toast.error('Something went wrong.')
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
               <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Images</FormLabel>
                        <FormControl>
                           <ImageUpload
                              value={field.value.map((image) => image)}
                              disabled={loading}
                              onChange={(url) =>
                                 field.onChange([...field.value, { url }])
                              }
                              onRemove={(url) =>
                                 field.onChange([
                                    ...field.value.filter(
                                       (current) => current !== url
                                    ),
                                 ])
                              }
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <div className="md:grid md:grid-cols-3 gap-8">
                  <FormField
                     control={form.control}
                     name="title"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Name</FormLabel>
                           <FormControl>
                              <Input
                                 disabled={loading}
                                 placeholder="Product title"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="price"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Price</FormLabel>
                           <FormControl>
                              <Input
                                 type="number"
                                 disabled={loading}
                                 placeholder="9.99"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="discount"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Discount</FormLabel>
                           <FormControl>
                              <Input
                                 type="number"
                                 disabled={loading}
                                 placeholder="9.99"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="stock"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Stock</FormLabel>
                           <FormControl>
                              <Input
                                 type="number"
                                 disabled={loading}
                                 placeholder="10"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  {/* Product Type */}
                  <FormField
                     control={form.control}
                     name="productType"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Ürün Tipi</FormLabel>
                           <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                              <FormControl>
                                 <SelectTrigger>
                                    <SelectValue placeholder="Ürün tipi seçin" />
                                 </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                 <SelectItem value="READY">HAZIR — Standart Ürün</SelectItem>
                                 <SelectItem value="CUSTOM">KİŞİYE ÖZEL — Özelleştirilebilir</SelectItem>
                              </SelectContent>
                           </Select>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  {/* Custom Options JSON Editor (Shown only if productType is CUSTOM) */}
                  {form.watch('productType') === 'CUSTOM' && (
                     <div className="col-span-1 md:col-span-3">
                        <FormField
                           control={form.control}
                           name="customOptions"
                           render={({ field }) => (
                              <FormItem>
                                 <FormControl>
                                    <CustomOptionsEditor
                                       disabled={loading}
                                       value={field.value || ''}
                                       onChange={field.onChange}
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                     </div>
                  )}

                  {/* Category */}
                  <FormField
                     control={form.control}
                     name="categoryId"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Kategori</FormLabel>
                           <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                              <FormControl>
                                 <SelectTrigger>
                                    <SelectValue defaultValue={field.value} placeholder="Kategori seçin" />
                                 </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                 {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.id}>
                                       {category.title}
                                    </SelectItem>
                                 ))}
                              </SelectContent>
                           </Select>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  {/* Araç Modelleri */}
                  {carModels.length > 0 && (
                     <div className="col-span-1 md:col-span-3">
                        <FormField
                           control={form.control}
                           name="carModelIds"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Uyumlu Araç Modelleri</FormLabel>
                                 <FormDescription>Bu ürünün hangi araç modellerine uygun olduğunu seçin.</FormDescription>
                                 <div className="flex flex-wrap gap-1.5 mb-2">
                                    {(field.value || []).map((id: string) => {
                                       const model = carModels.find(m => m.id === id)
                                       if (!model) return null
                                       return (
                                          <Badge key={id} variant="secondary" className="gap-1">
                                             {model.brand.name} {model.name}
                                             <button
                                                type="button"
                                                onClick={() => field.onChange(field.value?.filter((v: string) => v !== id))}
                                             >
                                                <X className="h-3 w-3" />
                                             </button>
                                          </Badge>
                                       )
                                    })}
                                 </div>
                                 <Select
                                    disabled={loading}
                                    onValueChange={(val) => {
                                       if (!field.value?.includes(val)) {
                                          field.onChange([...(field.value || []), val])
                                       }
                                    }}
                                 >
                                    <FormControl>
                                       <SelectTrigger>
                                          <SelectValue placeholder="Araç modeli ekle..." />
                                       </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                       {carModels
                                          .filter(m => !field.value?.includes(m.id))
                                          .map(m => (
                                             <SelectItem key={m.id} value={m.id}>
                                                {m.brand.name} — {m.name} {m.yearRange ? `(${m.yearRange})` : ''}
                                             </SelectItem>
                                          ))}
                                    </SelectContent>
                                 </Select>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                     </div>
                  )}

                  {/* isFeatured */}
                  <FormField
                     control={form.control}
                     name="isFeatured"
                     render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                           <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                           </FormControl>
                           <div className="space-y-1 leading-none">
                              <FormLabel>Öne Çıkan</FormLabel>
                              <FormDescription>Ana sayfada göster.</FormDescription>
                           </div>
                        </FormItem>
                     )}
                  />

                  {/* isAvailable */}
                  <FormField
                     control={form.control}
                     name="isAvailable"
                     render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                           <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                           </FormControl>
                           <div className="space-y-1 leading-none">
                              <FormLabel>Satışta</FormLabel>
                              <FormDescription>Mağazada görüntülensin.</FormDescription>
                           </div>
                        </FormItem>
                     )}
                  />
               </div>
               <Button disabled={loading} className="ml-auto" type="submit">
                  {action}
               </Button>
            </form>
         </Form>
      </>
   )
}
