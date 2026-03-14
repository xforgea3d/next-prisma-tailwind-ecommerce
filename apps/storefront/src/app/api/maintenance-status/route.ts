import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Cached edge-compatible maintenance status check
// The middleware fetches this endpoint (revalidated every 60s)
export async function GET() {
    try {
        const settings = await prisma.siteSettings.findUnique({
            where: { id: 1 },
            select: { maintenance_enabled: true, tax_rate: true },
        })
        return NextResponse.json({
            maintenance_enabled: settings?.maintenance_enabled ?? false,
            tax_rate: settings?.tax_rate ?? 20,
        })
    } catch {
        return NextResponse.json({ maintenance_enabled: false })
    }
}
