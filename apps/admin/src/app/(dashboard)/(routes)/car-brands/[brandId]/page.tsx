import prisma from '@/lib/prisma'
import { BrandForm } from './components/brand-form'
import { ModelForm } from './components/model-form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Tag, Car } from 'lucide-react'
import Link from 'next/link'

export default async function CarBrandPage({
   params,
}: {
   params: { brandId: string }
}) {
   const isNew = params.brandId === 'new'

   const brand = isNew
      ? null
      : await prisma.carBrand.findUnique({
           where: { id: params.brandId },
           include: {
              models: { orderBy: { name: 'asc' } },
           },
        })

   return (
      <div className="my-6 space-y-6">
         {/* Back button */}
         <Link href="/car-brands">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
               <ArrowLeft className="h-4 w-4" />
               Markalara Dön
            </Button>
         </Link>

         {isNew ? (
            <>
               <Heading
                  title="Yeni Marka Ekle"
                  description="Yeni bir araç markası oluşturun."
               />
               <Separator />
               <BrandForm initialData={null} />
            </>
         ) : brand ? (
            <>
               <Heading
                  title={brand.name}
                  description="Marka bilgilerini düzenleyin ve modellerini yönetin."
               />
               <Separator />

               <Tabs defaultValue="brand-info" className="w-full">
                  <TabsList className="mb-6">
                     <TabsTrigger value="brand-info" className="gap-2">
                        <Tag className="h-4 w-4" />
                        Marka Bilgileri
                     </TabsTrigger>
                     <TabsTrigger value="models" className="gap-2">
                        <Car className="h-4 w-4" />
                        Modeller ({brand.models.length})
                     </TabsTrigger>
                  </TabsList>

                  <TabsContent value="brand-info">
                     <BrandForm initialData={brand} />
                  </TabsContent>

                  <TabsContent value="models">
                     <ModelForm brandId={brand.id} brandName={brand.name} models={brand.models} />
                  </TabsContent>
               </Tabs>
            </>
         ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
               <h3 className="text-lg font-medium text-muted-foreground">
                  Marka bulunamadı
               </h3>
            </div>
         )}
      </div>
   )
}
