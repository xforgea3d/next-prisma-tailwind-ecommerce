import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(_: Request, { params }: { params: { pageId: string } }) {
    const page = await prisma.contentPage.findUnique({ where: { id: params.pageId } })
    if (!page) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(page)
}

export async function PATCH(req: Request, { params }: { params: { pageId: string } }) {
    const data = await req.json()
    const page = await prisma.contentPage.update({ where: { id: params.pageId }, data })
    return NextResponse.json(page)
}

export async function DELETE(_: Request, { params }: { params: { pageId: string } }) {
    await prisma.contentPage.delete({ where: { id: params.pageId } })
    return NextResponse.json({ ok: true })
}
