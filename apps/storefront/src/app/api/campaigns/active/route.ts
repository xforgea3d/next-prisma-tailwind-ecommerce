import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const revalidate = 60 // cache for 60 seconds

export async function GET() {
   try {
      const now = new Date()

      const campaigns = await prisma.campaign.findMany({
         where: {
            isActive: true,
            startDate: { lte: now },
            endDate: { gte: now },
         },
         orderBy: { priority: 'desc' },
         include: {
            discountCode: {
               select: {
                  id: true,
                  code: true,
                  percent: true,
                  maxDiscountAmount: true,
               },
            },
            _count: { select: { products: true } },
         },
      })

      // Increment views for all returned campaigns
      if (campaigns.length > 0) {
         await prisma.$transaction(
            campaigns.map((c) =>
               prisma.campaign.update({
                  where: { id: c.id },
                  data: { views: { increment: 1 } },
               })
            )
         )
      }

      return NextResponse.json(campaigns)
   } catch (error) {
      console.error('[CAMPAIGNS_ACTIVE_GET]', error)
      return NextResponse.json([])
   }
}
