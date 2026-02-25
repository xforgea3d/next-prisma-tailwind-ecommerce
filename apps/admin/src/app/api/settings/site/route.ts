import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PATCH(req: Request) {
    const data = await req.json()
    const settings = await prisma.siteSettings.upsert({
        where: { id: 1 },
        update: data,
        create: { id: 1, ...data },
    })
    return NextResponse.json(settings)
}

export async function GET() {
    const settings = await prisma.siteSettings.upsert({
        where: { id: 1 },
        update: {},
        create: { id: 1 },
    })
    return NextResponse.json(settings)
}
