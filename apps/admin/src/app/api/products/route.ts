import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

// FIX: Was only doing findMany (a GET in disguise) — now properly creates products
export async function POST(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) return new NextResponse('Unauthorized', { status: 401 })

      const { data } = await req.json()

      if (!data?.title) return new NextResponse('Title is required', { status: 400 })
      if (!data?.brandId) return new NextResponse('Brand is required', { status: 400 })

      const product = await prisma.product.create({
         data: {
            title: data.title,
            description: data.description,
            price: Number(data.price ?? 0),
            discount: Number(data.discount ?? 0),
            stock: Number(data.stock ?? 0),
            images: data.images ?? [],
            keywords: data.keywords ?? [],
            isFeatured: data.isFeatured ?? false,
            isAvailable: data.isAvailable ?? false,
            isPhysical: data.isPhysical ?? true,
            productType: data.productType ?? 'READY',
            metadata: data.metadata,
            customOptions: data.customOptions,
            brand: { connect: { id: data.brandId } },
            ...(data.categoryIds?.length && {
               categories: { connect: data.categoryIds.map((id: string) => ({ id })) },
            }),
         },
         include: { brand: true, categories: true },
      })

      return NextResponse.json(product, { status: 201 })
   } catch (error) {
      console.error('[PRODUCTS_POST]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function GET(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) return new NextResponse('Unauthorized', { status: 401 })

      const { searchParams } = new URL(req.url)
      const categoryId = searchParams.get('categoryId') || undefined
      const isFeatured = searchParams.get('isFeatured')

      const products = await prisma.product.findMany({
         where: {
            ...(categoryId && { categories: { some: { id: categoryId } } }),
            ...(isFeatured !== null && { isFeatured: isFeatured === 'true' }),
         },
         include: { brand: true, categories: true },
         orderBy: { createdAt: 'desc' },
      })

      return NextResponse.json(products)
   } catch (error) {
      console.error('[PRODUCTS_GET]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
