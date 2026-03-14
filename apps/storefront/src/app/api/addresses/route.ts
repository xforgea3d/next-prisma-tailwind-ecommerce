import prisma from '@/lib/prisma'
import { verifyCsrfToken } from '@/lib/csrf'
import { logError, extractRequestContext } from '@/lib/error-logger'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      const addresses = await prisma.address.findMany({
         where: { userId },
      })

      return NextResponse.json(addresses)
   } catch (error: any) {
      console.error('[ADDRESSES_GET]', error)
      logError({
         message: error?.message || '[ADDRESSES_GET] Unhandled error',
         stack: error?.stack,
         severity: 'critical',
         source: 'backend',
         statusCode: 500,
         ...extractRequestContext(req),
      })
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function POST(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      const { address, city, phone, postalCode, csrfToken } = await req.json()

      if (!csrfToken || !verifyCsrfToken(csrfToken, userId)) {
         return new NextResponse('Geçersiz istek. Sayfayı yenileyip tekrar deneyin.', { status: 403 })
      }

      // Check max address limit
      const existingCount = await prisma.address.count({ where: { userId } })
      if (existingCount >= 10) {
         return new NextResponse('En fazla 10 adres ekleyebilirsiniz', { status: 400 })
      }

      if (!address || !city || !phone) {
         return new NextResponse('Adres, şehir ve telefon zorunlu alanlardır', { status: 400 })
      }

      if (address.length > 500 || city.length > 100) {
         return new NextResponse('Alan uzunluğu limiti aşıldı', { status: 400 })
      }

      const phoneClean = phone.replace(/[^0-9+]/g, '')
      if (phoneClean.length < 10 || phoneClean.length > 15) {
         return new NextResponse('Geçersiz telefon numarası', { status: 400 })
      }

      const object = await prisma.address.create({
         data: {
            user: { connect: { id: userId } },
            city: city.trim(),
            address: address.trim(),
            phone: phoneClean,
            postalCode: postalCode?.trim() || '',
         },
      })

      return NextResponse.json(object)
   } catch (error: any) {
      console.error('[ADDRESS_POST]', error)
      logError({
         message: error?.message || '[ADDRESS_POST] Unhandled error',
         stack: error?.stack,
         severity: 'critical',
         source: 'backend',
         statusCode: 500,
         ...extractRequestContext(req),
      })
      return new NextResponse('Internal error', { status: 500 })
   }
}
