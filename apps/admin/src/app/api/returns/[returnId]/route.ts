import prisma from '@/lib/prisma'
import { revalidateAllStorefront } from '@/lib/revalidate-storefront'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export async function GET(
   req: Request,
   { params }: { params: { returnId: string } }
) {
   try {
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
               },
            },
         },
      })

      if (!returnRequest) {
         return new NextResponse('Not found', { status: 404 })
      }

      return NextResponse.json(returnRequest)
   } catch (error) {
      console.error('[ADMIN_RETURN_GET]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function PATCH(
   req: Request,
   { params }: { params: { returnId: string } }
) {
   try {
      const body = await req.json()
      const { status, adminNote, returnTrackingNumber, refundAmount } = body

      // Validate status
      const validStatuses = ['Pending', 'Approved', 'ReturnShipping', 'Received', 'Refunded', 'Rejected']
      if (status && !validStatuses.includes(status)) {
         return new NextResponse('Invalid status', { status: 400 })
      }

      // Validate refund amount
      if (refundAmount !== undefined && refundAmount !== null && refundAmount < 0) {
         return new NextResponse('Refund amount must be >= 0', { status: 400 })
      }

      // Get current return request for context
      const current = await prisma.returnRequest.findUnique({
         where: { id: params.returnId },
         include: {
            order: { select: { id: true, number: true } },
         },
      })

      if (!current) {
         return new NextResponse('Not found', { status: 404 })
      }

      const returnRequest = await prisma.returnRequest.update({
         where: { id: params.returnId },
         data: {
            ...(status && { status }),
            ...(adminNote !== undefined && { adminNote }),
            ...(returnTrackingNumber !== undefined && { returnTrackingNumber }),
            ...(refundAmount !== undefined && { refundAmount }),
         },
         include: {
            order: { select: { id: true, number: true } },
         },
      })

      // Notify user based on status changes
      if (status && status !== current.status) {
         try {
            let notificationContent = ''

            switch (status) {
               case 'Approved':
                  notificationContent = returnTrackingNumber
                     ? `Iade talebiniz onaylandi. Kargo kodunuz: ${returnTrackingNumber}`
                     : `Iade talebiniz onaylandi. Kargo bilgileri icin bildirimlerinizi takip edin.`
                  break
               case 'ReturnShipping':
                  notificationContent = returnTrackingNumber
                     ? `Iade kargo kodunuz: ${returnTrackingNumber}. Urunu bu kod ile gonderebilirsiniz.`
                     : `Iade talebiniz kargo asamasinda. Kargo bilgileri icin bizimle iletisime gecin.`
                  break
               case 'Received':
                  notificationContent = `Iade urununu teslim aldik. Iade isleminiz degerlendirilmektedir.`
                  break
               case 'Refunded':
                  notificationContent = refundAmount
                     ? `Iade isleminiz tamamlandi. ${refundAmount.toFixed(2)} TL iade edildi.`
                     : `Iade isleminiz tamamlandi.`
                  // Update order status to RefundCompleted
                  await prisma.order.update({
                     where: { id: current.orderId },
                     data: { status: 'RefundCompleted' },
                  })
                  break
               case 'Rejected':
                  notificationContent = adminNote
                     ? `Iade talebiniz reddedildi. Sebep: ${adminNote}`
                     : `Iade talebiniz reddedildi.`
                  // Revert order status back to Delivered
                  await prisma.order.update({
                     where: { id: current.orderId },
                     data: { status: 'Delivered' },
                  })
                  break
            }

            if (notificationContent) {
               await prisma.notification.create({
                  data: {
                     userId: current.userId,
                     content: notificationContent,
                  },
               })
            }
         } catch (notifyError) {
            console.error('[RETURN_USER_NOTIFY]', notifyError)
         }
      }

      revalidatePath('/returns')
      await revalidateAllStorefront()

      return NextResponse.json(returnRequest)
   } catch (error) {
      console.error('[ADMIN_RETURN_PATCH]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
