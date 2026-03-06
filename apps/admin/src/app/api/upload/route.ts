import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: Request) {
   try {
      const formData = await request.formData()
      const file = formData.get('file') as File

      if (!file) {
         return NextResponse.json({ error: 'No file provided' }, { status: 400 })
      }

      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'png'
      const fileName = `${uuidv4()}.${fileExt}`

      const uploadsDir = join(process.cwd(), 'public', 'uploads')
      await mkdir(uploadsDir, { recursive: true })

      const buffer = Buffer.from(await file.arrayBuffer())
      await writeFile(join(uploadsDir, fileName), buffer)

      const url = `/uploads/${fileName}`
      return NextResponse.json({ url })
   } catch (error) {
      console.error('Upload error:', error)
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
   }
}
