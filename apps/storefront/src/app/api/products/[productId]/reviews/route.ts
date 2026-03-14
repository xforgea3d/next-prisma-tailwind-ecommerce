import prisma from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(
   req: Request,
   { params }: { params: { productId: string } }
) {
   try {
      // Since /api/products is in PUBLIC_API_ROUTES, middleware won't inject X-USER-ID.
      // Authenticate directly via Supabase server client.
      const supabase = createClient()
      const {
         data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
         return new NextResponse('Yetkilendirme gerekli', { status: 401 })
      }

      const { productId } = params
      if (!productId) {
         return new NextResponse('Product id is required', { status: 400 })
      }

      const body = await req.json()
      const { rating, text } = body

      // Validate rating
      if (typeof rating !== 'number' || rating < 1 || rating > 5) {
         return new NextResponse('Puan 1-5 arasinda olmalidir', { status: 400 })
      }

      // Validate text
      if (!text || typeof text !== 'string' || text.trim().length === 0) {
         return new NextResponse('Degerlendirme metni bos olamaz', { status: 400 })
      }

      if (text.trim().length > 1000) {
         return new NextResponse('Degerlendirme metni en fazla 1000 karakter olabilir', { status: 400 })
      }

      // Verify product exists
      const product = await prisma.product.findUnique({
         where: { id: productId },
         select: { id: true },
      })

      if (!product) {
         return new NextResponse('Urun bulunamadi', { status: 404 })
      }

      // Create the review (unique constraint handles duplicate prevention)
      const review = await prisma.productReview.create({
         data: {
            text: text.trim(),
            rating,
            product: { connect: { id: productId } },
            user: { connect: { id: user.id } },
         },
         select: {
            id: true,
            text: true,
            rating: true,
            createdAt: true,
            user: { select: { id: true, name: true } },
         },
      })

      return NextResponse.json(review, { status: 201 })
   } catch (error: any) {
      // Handle unique constraint violation (user already reviewed this product)
      if (error?.code === 'P2002') {
         return new NextResponse('Bu urunu zaten degerlendirdiniz', { status: 409 })
      }
      console.error('[PRODUCT_REVIEW_POST]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
