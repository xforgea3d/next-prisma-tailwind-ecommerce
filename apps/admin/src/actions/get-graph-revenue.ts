import prisma from '@/lib/prisma'

interface GraphData {
   name: string
   total: number
}

export const getGraphRevenue = async (): Promise<GraphData[]> => {
   const paidOrders = await prisma.order.findMany({
      where: { isPaid: true },
      select: {
         createdAt: true,
         payable: true,
      },
   })

   const monthlyRevenue: { [key: number]: number } = {}

   for (const order of paidOrders) {
      const month = order.createdAt.getMonth()
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + order.payable
   }

   const graphData: GraphData[] = [
      { name: 'Oca', total: 0 },
      { name: 'Şub', total: 0 },
      { name: 'Mar', total: 0 },
      { name: 'Nis', total: 0 },
      { name: 'May', total: 0 },
      { name: 'Haz', total: 0 },
      { name: 'Tem', total: 0 },
      { name: 'Ağu', total: 0 },
      { name: 'Eyl', total: 0 },
      { name: 'Eki', total: 0 },
      { name: 'Kas', total: 0 },
      { name: 'Ara', total: 0 },
   ]

   for (const month in monthlyRevenue) {
      graphData[parseInt(month)].total = monthlyRevenue[parseInt(month)]
   }

   return graphData
}
