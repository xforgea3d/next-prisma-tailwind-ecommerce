import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
    const pages = await prisma.contentPage.findMany({ orderBy: { updatedAt: 'desc' } })
    return NextResponse.json(pages)
}

export async function POST(req: Request) {
    const data = await req.json()
    const page = await prisma.contentPage.create({ data })
    return NextResponse.json(page)
}
