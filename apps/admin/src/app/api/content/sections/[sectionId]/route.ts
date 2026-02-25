import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PATCH(req: Request, { params }: { params: { sectionId: string } }) {
    const data = await req.json()
    const section = await prisma.homepageSection.update({
        where: { id: params.sectionId },
        data,
    })
    return NextResponse.json(section)
}
