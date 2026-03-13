import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PATCH(req: Request) {
   try {
      const body = await req.json()
      const { ids, resolved } = body

      if (!ids || !Array.isArray(ids) || ids.length === 0) {
         return NextResponse.json({ error: 'ids array required' }, { status: 400 })
      }

      const result = await prisma.error.updateMany({
         where: { id: { in: ids } },
         data: { resolved: resolved ?? true },
      })

      return NextResponse.json({ updated: result.count })
   } catch (error) {
      console.error('[ERROR_LOGS_BULK_PATCH]', error)
      return NextResponse.json({ error: 'Internal error' }, { status: 500 })
   }
}

export async function DELETE(req: Request) {
   try {
      const body = await req.json()
      const { ids } = body

      if (!ids || !Array.isArray(ids) || ids.length === 0) {
         return NextResponse.json({ error: 'ids array required' }, { status: 400 })
      }

      const result = await prisma.error.deleteMany({
         where: { id: { in: ids } },
      })

      return NextResponse.json({ deleted: result.count })
   } catch (error) {
      console.error('[ERROR_LOGS_BULK_DELETE]', error)
      return NextResponse.json({ error: 'Internal error' }, { status: 500 })
   }
}
