import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(_: Request, { params }: { params: { postId: string } }) {
    const post = await prisma.blogPost.findUnique({ where: { id: params.postId } })
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(post)
}

export async function PATCH(req: Request, { params }: { params: { postId: string } }) {
    const data = await req.json()
    const post = await prisma.blogPost.update({ where: { id: params.postId }, data })
    return NextResponse.json(post)
}

export async function DELETE(_: Request, { params }: { params: { postId: string } }) {
    await prisma.blogPost.delete({ where: { id: params.postId } })
    return NextResponse.json({ ok: true })
}
