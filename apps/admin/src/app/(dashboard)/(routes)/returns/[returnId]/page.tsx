export const revalidate = 0

import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import prisma from '@/lib/prisma'
import { format } from 'date-fns'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { ReturnForm } from './components/return-form'

const statusLabels: Record<string, string> = {
   Pending: 'Beklemede',
   Approved: 'Onaylandi',
   ReturnShipping: 'Kargo Bekleniyor',
   Received: 'Teslim Alindi',
   Refunded: 'Iade Tamamlandi',
   Rejected: 'Reddedildi',
}

export default async function ReturnDetailPage({
   params,
}: {
   params: { returnId: string }
}) {
   const returnRequest = await prisma.returnRequest.findUnique({
      where: { id: params.returnId },
      include: {
         user: { select: { name: true, email: true, phone: true } },
         order: {
            select: {
               id: true,
               number: true,
               status: true,
               isPaid: true,
               payable: true,
               total: true,
            },
         },
      },
   })

   if (!returnRequest) redirect('/returns')

   return (
      <div className="block space-y-6 my-6">
         <Heading
            title={`Iade Talebi #${returnRequest.number}`}
            description={`Olusturulma: ${format(returnRequest.createdAt, 'dd.MM.yyyy HH:mm')}`}
         />
         <Separator />

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Details */}
            <div className="space-y-4">
               <div className="rounded-lg border p-4 space-y-3">
                  <h3 className="font-semibold text-sm">Talep Bilgileri</h3>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                     <span className="text-muted-foreground">Durum:</span>
                     <span className="font-medium">{statusLabels[returnRequest.status]}</span>

                     <span className="text-muted-foreground">Sebep:</span>
                     <span>{returnRequest.reason}</span>

                     <span className="text-muted-foreground">Musteri:</span>
                     <span>{returnRequest.user?.name || returnRequest.user?.email || '-'}</span>

                     <span className="text-muted-foreground">E-posta:</span>
                     <span>{returnRequest.user?.email || '-'}</span>

                     <span className="text-muted-foreground">Telefon:</span>
                     <span>{returnRequest.user?.phone || '-'}</span>

                     {returnRequest.refundAmount && (
                        <>
                           <span className="text-muted-foreground">Iade Tutari:</span>
                           <span className="font-bold text-orange-600">
                              {returnRequest.refundAmount.toFixed(2)} TL
                           </span>
                        </>
                     )}

                     {returnRequest.returnTrackingNumber && (
                        <>
                           <span className="text-muted-foreground">Kargo Takip No:</span>
                           <span className="font-mono text-sm">{returnRequest.returnTrackingNumber}</span>
                        </>
                     )}
                  </div>
               </div>

               {returnRequest.description && (
                  <div className="rounded-lg border p-4 space-y-2">
                     <h3 className="font-semibold text-sm">Musteri Aciklamasi</h3>
                     <p className="text-sm whitespace-pre-wrap">{returnRequest.description}</p>
                  </div>
               )}

               {returnRequest.adminNote && (
                  <div className="rounded-lg border p-4 space-y-2">
                     <h3 className="font-semibold text-sm">Admin Notu</h3>
                     <p className="text-sm whitespace-pre-wrap">{returnRequest.adminNote}</p>
                  </div>
               )}

               {returnRequest.order && (
                  <div className="rounded-lg border p-4 space-y-2">
                     <h3 className="font-semibold text-sm">Bagli Siparis</h3>
                     <Link
                        href={`/orders/${returnRequest.order.id}`}
                        className="text-sm text-blue-600 hover:underline"
                     >
                        Siparis #{returnRequest.order.number} — {returnRequest.order.status}{' '}
                        {returnRequest.order.isPaid ? '(Odendi)' : '(Odenmedi)'} — {returnRequest.order.payable.toFixed(2)} TL
                     </Link>
                  </div>
               )}
            </div>

            {/* Right: Form */}
            <div>
               <ReturnForm
                  returnId={returnRequest.id}
                  currentStatus={returnRequest.status}
                  currentAdminNote={returnRequest.adminNote}
                  currentTrackingNumber={returnRequest.returnTrackingNumber}
                  currentRefundAmount={returnRequest.refundAmount}
                  orderPayable={returnRequest.order?.payable || 0}
               />
            </div>
         </div>
      </div>
   )
}
