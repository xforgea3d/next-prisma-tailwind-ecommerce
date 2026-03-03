import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { revalidateStorefront } from '@/lib/revalidate-storefront'
import { revalidatePath } from 'next/cache'

export async function GET(
   req: Request,
   { params }: { params: { productId: string } }
) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      if (!params.productId) {
         return new NextResponse('Product id is required', { status: 400 })
      }

      const product = await prisma.product.findUniqueOrThrow({
         where: {
            id: params.productId,
         },
      })

      return NextResponse.json(product)
   } catch (error) {
      console.error('[PRODUCT_GET]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function DELETE(
   req: Request,
   { params }: { params: { productId: string } }
) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      const product = await prisma.product.delete({
         where: {
            id: params.productId,
         },
      })

      // Bust admin layout cache and storefront pages
      revalidatePath('/', 'layout')
      await revalidateStorefront(['/', '/products', `/products/${params.productId}`])

      return NextResponse.json(product)
   } catch (error) {
      console.error('[PRODUCT_DELETE]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function PATCH(
   req: Request,
   { params }: { params: { productId: string } }
) {
   try {
      if (!params.productId) {
         return new NextResponse('Product Id is required', { status: 400 })
      }

      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      const {
         data: { title, description, price, discount, stock, isFeatured, isAvailable, images, keywords, categoryIds },
      } = await req.json()

      const product = await prisma.product.update({
         where: { id: params.productId },
         data: {
            ...(title !== undefined && { title }),
            ...(description !== undefined && { description }),
            ...(price !== undefined && { price: Number(price) }),
            ...(discount !== undefined && { discount: Number(discount) }),
            ...(stock !== undefined && { stock: Number(stock) }),
            ...(isFeatured !== undefined && { isFeatured }),
            ...(isAvailable !== undefined && { isAvailable }),
            ...(images !== undefined && { images }),
            ...(keywords !== undefined && { keywords }),
            ...(categoryIds !== undefined && {
               categories: { set: categoryIds.map((id: string) => ({ id })) },
            }),
         },
         include: { brand: true, categories: true },
      })

      // Bust admin layout cache and storefront pages
      revalidatePath('/', 'layout')
      await revalidateStorefront(['/', '/products', `/products/${params.productId}`])

      return NextResponse.json(product)
   } catch (error) {
      console.error('[PRODUCT_PATCH]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
