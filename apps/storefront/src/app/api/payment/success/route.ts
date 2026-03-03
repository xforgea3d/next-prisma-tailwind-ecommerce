import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://xforgea3d.com'

/**
 * GET /api/payment/success?refId=...&mock=...&status=...
 *
 * User is redirected here after payment completion.
 * - On success: redirect to profile/orders with success indicator
 * - On failure: redirect to payment page with error indicator
 * - On mock: auto-complete the test payment and redirect
 */
export async function GET(req: NextRequest) {
   const refId = req.nextUrl.searchParams.get('refId')
   const isMock = req.nextUrl.searchParams.get('mock') === 'true'
   const failStatus = req.nextUrl.searchParams.get('status')

   if (!refId) {
      return NextResponse.redirect(new URL('/profile', SITE_URL))
   }

   try {
      const payment = await prisma.payment.findUnique({
         where: { refId },
         include: { order: true },
      })

      if (!payment) {
         return NextResponse.redirect(new URL('/profile', SITE_URL))
      }

      // Handle failure redirect
      if (failStatus === 'fail') {
         await prisma.payment.update({
            where: { id: payment.id },
            data: { status: 'Failed', isSuccessful: false },
         })

         const failUrl = new URL(`/payment/${payment.orderId}`, SITE_URL)
         failUrl.searchParams.set('error', 'payment_failed')
         return NextResponse.redirect(failUrl)
      }

      // Handle mock payment: auto-complete
      if (isMock && !payment.isSuccessful) {
         await prisma.payment.update({
            where: { id: payment.id },
            data: { status: 'Paid', isSuccessful: true },
         })

         await prisma.order.update({
            where: { id: payment.orderId },
            data: { isPaid: true },
         })

         // Notify admins about test payment
         try {
            const admins = await prisma.profile.findMany({
               where: { role: 'admin' },
            })
            if (admins.length > 0) {
               await prisma.notification.createMany({
                  data: admins.map((admin) => ({
                     userId: admin.id,
                     content: `[TEST] Siparis #${payment.order.number} icin test odemesi tamamlandi — ${payment.payable.toFixed(2)} TL`,
                  })),
               })
            }
         } catch {
            // Notification is best-effort
         }
      }

      // Redirect to profile orders page with success param
      const successUrl = new URL('/profile', SITE_URL)
      successUrl.searchParams.set('payment', 'success')
      successUrl.searchParams.set('order', payment.orderId)
      return NextResponse.redirect(successUrl)
   } catch (error) {
      console.error('[PAYMENT_SUCCESS]', error)
      return NextResponse.redirect(new URL('/profile', SITE_URL))
   }
}
