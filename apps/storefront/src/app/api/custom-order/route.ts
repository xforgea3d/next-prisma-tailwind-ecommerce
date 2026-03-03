import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createClient } from '@supabase/supabase-js'
import { randomUUID } from 'crypto'

const supabase = createClient(
   process.env.NEXT_PUBLIC_SUPABASE_URL!,
   process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

/**
 * POST /api/custom-order
 * Accepts multipart FormData: svg (File) + data (JSON string)
 * Uploads SVG to Supabase Storage, creates admin notifications.
 */
export async function POST(req: Request) {
   try {
      const formData = await req.formData()
      const svgFile = formData.get('svg') as File | null
      const rawData = formData.get('data') as string

      if (!rawData) return NextResponse.json({ error: 'Veri eksik' }, { status: 400 })

      const data = JSON.parse(rawData)

      // Upload SVG to Supabase Storage
      let svgUrl: string | null = null
      if (svgFile) {
         const buffer = Buffer.from(await svgFile.arrayBuffer())
         const filename = `custom-orders/${randomUUID()}-${svgFile.name.replace(/[^a-z0-9.-]/gi, '_')}`

         const { error: uploadError } = await supabase.storage
            .from('ecommerce')
            .upload(filename, buffer, {
               contentType: svgFile.type || 'image/svg+xml',
               upsert: false,
            })

         if (!uploadError) {
            const { data: urlData } = supabase.storage.from('ecommerce').getPublicUrl(filename)
            svgUrl = urlData.publicUrl
         }
      }

      // Build notification content for admin
      const orderDetails = [
         `Özel Sipariş Talebi`,
         `Ad: ${data.firstName || ''} ${data.lastName || ''}`,
         `E-posta: ${data.email || '-'}`,
         `Telefon: ${data.phone || '-'}`,
         `Şehir: ${data.city || '-'}`,
         `Adres: ${data.address || '-'}`,
         `Renk: ${data.color || '-'}`,
         `Not: ${data.notes || '-'}`,
         svgUrl ? `Dosya: ${svgUrl}` : 'Dosya yüklenmedi',
         `Tarih: ${new Date().toLocaleString('tr-TR')}`,
      ].join('\n')

      // Notify all admin users
      const admins = await prisma.profile.findMany({
         where: { role: 'admin' },
         select: { id: true },
      })

      if (admins.length) {
         await prisma.notification.createMany({
            data: admins.map((admin) => ({
               userId: admin.id,
               content: orderDetails,
            })),
         })
      }

      return NextResponse.json({ success: true })
   } catch (err) {
      console.error('[Custom Order Error]', err)
      return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
   }
}
