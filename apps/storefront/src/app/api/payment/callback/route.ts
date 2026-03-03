import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://xforgea3d.com'

/**
 * POST /api/payment/callback
 *
 * Webhook handler for payment provider callbacks.
 * The bank/POS provider sends payment result here after 3D Secure or payment completion.
 *
 * Expected body fields (varies by provider — adapt to your chosen POS):
 *   - merchant_oid / order_id / refId: payment reference
 *   - status: success / fail / error
 *   - total_amount: amount paid
 *   - hash / signature: HMAC signature for validation
 *   - card_pan: masked card number (optional)
 */
export async function POST(req: NextRequest) {
   try {
      const body = await req.json().catch(() => null)
      const formData = body ? null : await req.formData().catch(() => null)

      // Support both JSON and form-encoded callbacks
      const getField = (key: string): string | null => {
         if (body && body[key]) return String(body[key])
         if (formData && formData.get(key)) return String(formData.get(key))
         return null
      }

      const refId = getField('merchant_oid') ?? getField('order_id') ?? getField('refId')
      const status = getField('status') ?? getField('payment_status')
      const hash = getField('hash') ?? getField('signature')
      const cardPan = getField('card_pan') ?? getField('masked_card')
      const totalAmount = getField('total_amount') ?? getField('amount')

      if (!refId) {
         console.error('[PAYMENT_CALLBACK] Missing refId')
         return NextResponse.json({ error: 'Missing reference' }, { status: 400 })
      }

      // Find the payment record
      const payment = await prisma.payment.findUnique({
         where: { refId },
         include: { order: true },
      })

      if (!payment) {
         console.error('[PAYMENT_CALLBACK] Payment not found:', refId)
         return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
      }

      // ── Signature validation ──────────────────────────────
      const secretKey = process.env.PAYMENT_SECRET_KEY
      if (secretKey && hash) {
         // Validate HMAC signature from provider
         // The exact signature algorithm depends on your provider.
         // Common pattern: HMAC-SHA256(merchantId + refId + amount, secretKey)
         const merchantId = process.env.PAYMENT_MERCHANT_ID ?? ''
         const expectedHashStr = `${merchantId}${refId}${totalAmount ?? payment.payable.toFixed(2)}`
         const expectedHash = crypto
            .createHmac('sha256', secretKey)
            .update(expectedHashStr)
            .digest('base64')

         if (hash !== expectedHash) {
            console.error('[PAYMENT_CALLBACK] Invalid signature for refId:', refId)

            await prisma.payment.update({
               where: { id: payment.id },
               data: { status: 'Denied' },
            })

            return NextResponse.json({ error: 'Invalid signature' }, { status: 403 })
         }
      }

      // ── Process payment result ────────────────────────────
      const isSuccess = status === 'success' || status === 'completed' || status === 'paid'

      if (isSuccess) {
         // Update payment record
         await prisma.payment.update({
            where: { id: payment.id },
            data: {
               status: 'Paid',
               isSuccessful: true,
               cardPan: cardPan ?? undefined,
               cardHash: hash ?? undefined,
               fee: totalAmount ? parseFloat(totalAmount) : undefined,
            },
         })

         // Update order as paid
         await prisma.order.update({
            where: { id: payment.orderId },
            data: { isPaid: true },
         })

         // Notify admins about successful payment
         try {
            const admins = await prisma.profile.findMany({
               where: { role: 'admin' },
            })

            if (admins.length > 0) {
               await prisma.notification.createMany({
                  data: admins.map((admin) => ({
                     userId: admin.id,
                     content: `Odeme basarili! Siparis #${payment.order.number} icin ${payment.payable.toFixed(2)} TL odeme alindi. Ref: ${refId}`,
                  })),
               })
            }
         } catch (notifyErr) {
            console.error('[PAYMENT_CALLBACK_NOTIFY]', notifyErr)
         }

         // Return success response to payment provider
         return NextResponse.json({ status: 'OK', message: 'Payment confirmed' })
      } else {
         // Payment failed
         await prisma.payment.update({
            where: { id: payment.id },
            data: {
               status: 'Failed',
               isSuccessful: false,
               cardPan: cardPan ?? undefined,
            },
         })

         return NextResponse.json({ status: 'OK', message: 'Payment failure recorded' })
      }
   } catch (error) {
      console.error('[PAYMENT_CALLBACK]', error)
      return NextResponse.json(
         { error: 'Callback processing failed' },
         { status: 500 }
      )
   }
}
