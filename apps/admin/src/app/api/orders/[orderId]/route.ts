import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { revalidateAllStorefront } from '@/lib/revalidate-storefront'

export async function PATCH(
    req: Request,
    { params }: { params: { orderId: string } }
) {
    try {
        if (!params.orderId) {
            return new NextResponse('Order ID is required', { status: 400 })
        }

        const body = await req.json()
        const { status, shipping, payable, discount, isPaid, isCompleted, trackingNumber, shippingCompany } = body

        // Auto-set status to Shipped when tracking number is added
        let finalStatus = status
        if (trackingNumber && trackingNumber.trim() !== '') {
            const currentOrder = await prisma.order.findUnique({
                where: { id: params.orderId },
                select: { status: true },
            })
            const shippedStatuses = ['Shipped', 'KargoyaVerildi', 'Delivered', 'TeslimEdildi']
            if (currentOrder && !shippedStatuses.includes(currentOrder.status) && !shippedStatuses.includes(status)) {
                finalStatus = 'Shipped'
            }
        }

        const order = await prisma.order.update({
            where: { id: params.orderId },
            data: {
                ...(finalStatus && { status: finalStatus }),
                ...(shipping !== undefined && { shipping }),
                ...(payable !== undefined && { payable }),
                ...(discount !== undefined && { discount }),
                ...(isPaid !== undefined && { isPaid }),
                ...(isCompleted !== undefined && { isCompleted }),
                ...(trackingNumber !== undefined && { trackingNumber: trackingNumber || null }),
                ...(shippingCompany !== undefined && { shippingCompany: shippingCompany || null }),
            },
        })

        revalidatePath('/orders')
        revalidatePath('/', 'layout')
        await revalidateAllStorefront()

        return NextResponse.json(order)
    } catch (error) {
        console.error('[ORDER_PATCH]', error)
        return new NextResponse('Internal error', { status: 500 })
    }
}
