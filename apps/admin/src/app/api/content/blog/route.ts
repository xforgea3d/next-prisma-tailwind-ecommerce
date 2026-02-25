import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
    const posts = await prisma.blogPost.findMany({ orderBy: { updatedAt: 'desc' } })
    return NextResponse.json(posts)
}

export async function POST(req: Request) {
    const data = await req.json()
    const post = await prisma.blogPost.create({ data })
    return NextResponse.json(post)
}
