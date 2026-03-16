import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
   try {
      const settings = await prisma.siteSettings.findFirst()
      return NextResponse.json(settings || {})
   } catch {
      return NextResponse.json({}, { status: 500 })
   }
}
