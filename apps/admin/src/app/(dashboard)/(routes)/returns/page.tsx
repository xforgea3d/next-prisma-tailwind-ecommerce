export const revalidate = 0

import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import prisma from '@/lib/prisma'
import { format } from 'date-fns'

import type { ReturnColumn } from './components/table'
import { ReturnTable } from './components/table'

const statusLabels: Record<string, string> = {
   Pending: 'Beklemede',
   Approved: 'Onaylandi',
   ReturnShipping: 'Kargo Bekleniyor',
   Received: 'Teslim Alindi',
   Refunded: 'Iade Tamamlandi',
   Rejected: 'Reddedildi',
}

export default async function ReturnsPage({
   searchParams,
}: {
   searchParams: { status?: string }
}) {
   const { status } = searchParams ?? {}

   let requests: any[] = []
   try {
      requests = await prisma.returnRequest.findMany({
         where: {
            ...(status && { status: status as any }),
         },
         include: {
            order: { select: { id: true, number: true, status: true, payable: true } },
            user: { select: { name: true, email: true } },
         },
         orderBy: { createdAt: 'desc' },
         take: 100,
      })
   } catch (error) {
      console.warn('[ReturnsPage] Failed to fetch:', error)
   }

   const formatted: ReturnColumn[] = requests.map((r) => ({
      id: r.id,
      number: `#${r.number}`,
      orderNumber: `#${r.order?.number || '-'}`,
      userName: r.user?.name || r.user?.email || '-',
      userEmail: r.user?.email || '-',
      reason: r.reason.length > 40 ? r.reason.slice(0, 40) + '...' : r.reason,
      status: statusLabels[r.status] || r.status,
      statusRaw: r.status,
      refundAmount: r.refundAmount ? `${r.refundAmount.toFixed(2)} TL` : '-',
      createdAt: format(r.createdAt, 'dd.MM.yyyy HH:mm'),
   }))

   return (
      <div className="block space-y-4 my-6">
         <Heading
            title={`Iade Talepleri (${requests.length})`}
            description="Musteri iade taleplerini yonetin"
         />
         <Separator />
         <ReturnTable data={formatted} />
      </div>
   )
}
