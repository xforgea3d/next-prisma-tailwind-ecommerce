import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

// POST body: [{ id: string, sort_order: number }]
export async function POST(req: Request) {
    const items: { id: string; sort_order: number }[] = await req.json()
    await Promise.all(
        items.map(({ id, sort_order }) =>
            prisma.homepageSection.update({ where: { id }, data: { sort_order } })
        )
    )
    return NextResponse.json({ ok: true })
}
