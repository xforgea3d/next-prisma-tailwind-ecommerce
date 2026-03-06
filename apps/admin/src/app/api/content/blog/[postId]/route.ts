import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { revalidateStorefront } from '@/lib/revalidate-storefront'

export async function GET(_: Request, { params }: { params: { postId: string } }) {
    try {
        const post = await prisma.blogPost.findUnique({ where: { id: params.postId } })
        if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
        return NextResponse.json(post)
    } catch (error) {
        console.error('[BLOG_POST_GET]', error)
        return new NextResponse('Internal error', { status: 500 })
    }
}

export async function PATCH(req: Request, { params }: { params: { postId: string } }) {
    try {
        const body = await req.json()
        const allowedFields = [
            'title', 'slug', 'excerpt_tr', 'body_html_tr', 'cover_image',
            'tags', 'is_published', 'seo_title_tr', 'seo_description_tr',
            'published_at',
        ] as const
        const data: Record<string, unknown> = {}
        for (const key of allowedFields) {
            if (body[key] !== undefined) data[key] = body[key]
        }
        const post = await prisma.blogPost.update({ where: { id: params.postId }, data })
        await revalidateStorefront(['/blog', `/blog/${post.slug ?? params.postId}`, '/'])
        return NextResponse.json(post)
    } catch (error) {
        console.error('[BLOG_POST_PATCH]', error)
        return new NextResponse('Internal error', { status: 500 })
    }
}

export async function DELETE(_: Request, { params }: { params: { postId: string } }) {
    try {
        await prisma.blogPost.delete({ where: { id: params.postId } })
        await revalidateStorefront(['/blog', '/'])
        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error('[BLOG_POST_DELETE]', error)
        return new NextResponse('Internal error', { status: 500 })
    }
}
