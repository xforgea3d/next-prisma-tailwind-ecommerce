import prisma from '@/lib/prisma'
import { BrandForm } from './components/brand-form'
import { ModelForm } from './components/model-form'
import { Separator } from '@/components/ui/separator'

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
         <BrandForm initialData={brand} />

         {brand && (
            <>
               <Separator />
               <ModelForm brandId={brand.id} brandName={brand.name} models={brand.models} />
            </>
         )}
      </div>
   )
}
