import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyCsrfToken } from '@/lib/csrf'

export async function POST(req: Request) {
   try {
      // Parse email from request body
      let email: string
      try {
         const body = await req.json()
         email = body.email?.trim()
      } catch {
         return new NextResponse(
            JSON.stringify({ error: 'Geçersiz istek. JSON gövdesi gerekli.' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
         )
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!email || !emailRegex.test(email)) {
         return new NextResponse(
            JSON.stringify({ error: 'Geçersiz e-posta adresi.' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
         )
      }

      const userId = req.headers.get('X-USER-ID')

      // If authenticated, verify CSRF token
      if (userId) {
         const csrfToken = req.headers.get('x-csrf-token')
         if (!csrfToken || !verifyCsrfToken(csrfToken, userId)) {
            return new NextResponse(
               JSON.stringify({ error: 'Geçersiz istek. Sayfayı yenileyip tekrar deneyin.' }),
               { status: 403, headers: { 'Content-Type': 'application/json' } }
            )
         }

         // Log subscription as notification for authenticated users only
         await prisma.notification.create({
            data: {
               userId,
               content: 'E-posta aboneliği aktif edildi.',
               isRead: true,
            },
         })
      }

      // TODO: Rate limiting (IP-based for anonymous, user-based for authenticated)
      // TODO: Consider storing email subscriptions in database for re-engagement campaigns

      return NextResponse.json({ subscribed: true })
   } catch (error) {
      console.error('[EMAIL_SUBSCRIBE]', error)
      return new NextResponse(
         JSON.stringify({ error: 'Sunucu hatası' }),
         { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
   }
}

export async function DELETE(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) return new NextResponse('Unauthorized', { status: 401 })

      const csrfToken = req.headers.get('x-csrf-token')
      if (!csrfToken || !verifyCsrfToken(csrfToken, userId)) {
         return new NextResponse(
            JSON.stringify({ error: 'Geçersiz istek. Sayfayı yenileyip tekrar deneyin.' }),
            { status: 403, headers: { 'Content-Type': 'application/json' } }
         )
      }

      await prisma.notification.create({
         data: {
            userId,
            content: 'E-posta aboneliği iptal edildi.',
            isRead: true,
         },
      })

      return NextResponse.json({ subscribed: false })
   } catch (error) {
      console.error('[EMAIL_UNSUBSCRIBE]', error)
      return new NextResponse(
         JSON.stringify({ error: 'Sunucu hatası' }),
         { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
   }
}
