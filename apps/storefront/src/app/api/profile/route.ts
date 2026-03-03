import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) return new NextResponse('Unauthorized', { status: 401 })

      const profile = await prisma.profile.findUniqueOrThrow({
         where: { id: userId },
         include: {
            cart: {
               include: {
                  items: { include: { product: true } },
               },
            },
            addresses: true,
            wishlist: true,
         },
      })

      return NextResponse.json({
         phone: profile.phone,
         email: profile.email,
         name: profile.name,
         avatar: profile.avatar,
         addresses: profile.addresses,
         wishlist: profile.wishlist,
         cart: profile.cart,
      })
   } catch (error) {
      console.error('[PROFILE_GET]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function PATCH(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) return new NextResponse('Unauthorized', { status: 401 })

      const { name, phone, avatar } = await req.json()

      const profile = await prisma.profile.update({
         where: { id: userId },
         data: {
            ...(name !== undefined && { name }),
            ...(phone !== undefined && { phone }),
            ...(avatar !== undefined && { avatar }),
         },
      })

      return NextResponse.json({
         phone: profile.phone,
         email: profile.email,
         name: profile.name,
         avatar: profile.avatar,
      })
   } catch (error) {
      console.error('[PROFILE_PATCH]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
