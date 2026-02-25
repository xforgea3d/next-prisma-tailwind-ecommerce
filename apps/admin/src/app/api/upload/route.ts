import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'

// Bypass RLS using the service role key if available, otherwise fallback to anon key
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
)

export async function POST(request: Request) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        const fileExt = file.name.split('.').pop()
        const fileName = `${uuidv4()}.${fileExt}`
        const filePath = `uploads/${fileName}`

        // Buffer data
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        const { data, error } = await supabase.storage
            .from('ecommerce')
            .upload(filePath, buffer, {
                contentType: file.type,
                upsert: false
            })

        if (error) {
            console.error('Supabase upload error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        const { data: { publicUrl } } = supabase.storage
            .from('ecommerce')
            .getPublicUrl(filePath)

        return NextResponse.json({ url: publicUrl })
    } catch (error) {
        console.error('Server upload error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
