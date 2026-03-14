import prisma from '@/lib/prisma'
import { verifyCsrfToken } from '@/lib/csrf'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) return new NextResponse('Unauthorized', { status: 401 })

      const returnRequests = await prisma.returnRequest.findMany({
         where: { userId },
         include: {
            order: {
               select: { id: true, number: true, status: true, payable: true },
            },
         },
         orderBy: { createdAt: 'desc' },
         take: 100,
      })

      return NextResponse.json(returnRequests)
   } catch (error) {
      console.error('[RETURNS_GET]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function POST(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) return new NextResponse('Unauthorized', { status: 401 })

      const { orderId, reason, description, csrfToken } = await req.json()

      if (!csrfToken || !verifyCsrfToken(csrfToken, userId)) {
         return new NextResponse('Gecersiz istek. Sayfayi yenileyip tekrar deneyin.', { status: 403 })
      }

      if (!orderId || !reason) {
         return new NextResponse('orderId ve reason zorunludur', { status: 400 })
      }

      // Validate order belongs to user and is delivered
      const order = await prisma.order.findFirst({
         where: { id: orderId, userId },
      })

      if (!order) {
         return new NextResponse('Siparis bulunamadi veya size ait degil', { status: 404 })
      }

      if (order.status !== 'Delivered') {
         return new NextResponse('Yalnizca teslim edilmis siparisler icin iade talebi olusturulabilir', { status: 400 })
      }

      // Check if a return request already exists for this order
      const existingReturn = await prisma.returnRequest.findFirst({
         where: { orderId, userId },
      })

      if (existingReturn) {
         return new NextResponse('Bu siparis icin zaten bir iade talebi bulunmaktadir', { status: 400 })
      }

      // Create return request
      const returnRequest = await prisma.returnRequest.create({
         data: {
            reason,
            description: description || null,
            order: { connect: { id: orderId } },
            user: { connect: { id: userId } },
         },
         include: {
            order: {
               select: { id: true, number: true, status: true },
            },
         },
      })

      // Update order status to ReturnProcessing
      await prisma.order.update({
         where: { id: orderId },
         data: { status: 'ReturnProcessing' },
      })

      // Notify all admins
      try {
         const admins = await prisma.profile.findMany({
            where: { role: 'admin' },
         })

         if (admins.length) {
            await prisma.notification.createMany({
               data: admins.map((admin) => ({
                  userId: admin.id,
                  content: `Yeni iade talebi: Siparis #${order.number} - Sebep: ${reason}`,
               })),
            })
         }
      } catch (notifyError) {
         console.error('[RETURN_NOTIFY]', notifyError)
      }

      return NextResponse.json(returnRequest)
   } catch (error) {
      console.error('[RETURNS_POST]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
