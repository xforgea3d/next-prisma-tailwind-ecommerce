import prisma from '@/lib/prisma'

export const getTotalRevenue = async () => {
   const result = await prisma.order.aggregate({
      where: { isPaid: true },
      _sum: { payable: true },
   })

   return result._sum.payable || 0
}
