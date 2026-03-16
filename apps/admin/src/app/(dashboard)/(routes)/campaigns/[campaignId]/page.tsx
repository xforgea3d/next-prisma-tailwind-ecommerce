export const revalidate = 0
import prisma from '@/lib/prisma'

import { CampaignForm } from './components/campaign-form'

const CampaignPage = async ({
   params,
}: {
   params: { campaignId: string }
}) => {
   const campaign =
      params.campaignId !== 'new'
         ? await prisma.campaign.findUnique({
              where: { id: params.campaignId },
              include: {
                 products: {
                    select: { id: true, title: true, price: true, images: true },
                 },
                 discountCode: true,
              },
           })
         : null

   const products = await prisma.product.findMany({
      where: { isAvailable: true },
      select: { id: true, title: true, price: true, images: true },
      orderBy: { title: 'asc' },
      take: 500,
   })

   const discountCodes = await prisma.discountCode.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
   })

   return (
      <div className="flex-col">
         <div className="flex-1 space-y-4 p-8 pt-6">
            <CampaignForm
               initialData={campaign}
               products={products}
               discountCodes={discountCodes}
            />
         </div>
      </div>
   )
}

export default CampaignPage
