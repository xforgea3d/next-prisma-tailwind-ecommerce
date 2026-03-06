import { createServerClient } from '@supabase/ssr'
import { NextResponse, NextRequest } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

const SITE_STYLE = 'Premium 3D printing e-commerce store. Dark elegant aesthetic, cinematic lighting, deep shadows, high contrast. Luxury feel, sharp details.'

const CONTEXT_PROMPTS: Record<string, string> = {
   'category': `${SITE_STYLE} Product category hero image for a navbar dropdown. Wide 16:9 banner format. Subtle dark gradient background with elegant product showcase. The subject is:`,
   'car-model': `Professional studio car photography. Clean white or dark gradient background. Side-angle 3/4 view showing the full vehicle. Sharp focus, professional automotive lighting. The car is:`,
   'product': `${SITE_STYLE} Ultra-premium product photography. Studio lighting on dark surface. The product is:`,
   'banner': `${SITE_STYLE} Wide promotional banner image (16:9). Eye-catching, bold composition. The subject is:`,
}

export async function POST(request: NextRequest) {
   try {
      const { prompt, context } = await request.json()

      if (!prompt) {
         return new NextResponse('Prompt is required', { status: 400 })
      }

      const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY
      if (!apiKey) {
         return new NextResponse('Gemini API Key is missing in .env', { status: 500 })
      }

      // Build context-aware prompt
      const prefix = CONTEXT_PROMPTS[context] || CONTEXT_PROMPTS['product']
      const fullPrompt = `${prefix} ${prompt}`

      // Try Gemini native image generation first (free tier compatible)
      // Then fall back to Imagen 4.0 (paid plan only)
      let base64Str: string | null = null
      let mimeType = 'image/jpeg'

      // Strategy 1: Gemini 2.5 Flash Image (generateContent with IMAGE modality)
      const geminiModels = [
         'gemini-2.5-flash-image',
         'gemini-2.0-flash-exp-image-generation',
      ]

      for (const model of geminiModels) {
         try {
            const res = await fetch(
               `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
               {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                     contents: [{ parts: [{ text: `Generate this image: ${fullPrompt}` }] }],
                     generationConfig: { responseModalities: ['IMAGE', 'TEXT'] },
                  }),
               }
            )

            if (!res.ok) continue

            const json = await res.json()
            const parts = json?.candidates?.[0]?.content?.parts
            if (parts) {
               for (const part of parts) {
                  if (part.inlineData?.data) {
                     base64Str = part.inlineData.data
                     mimeType = part.inlineData.mimeType || 'image/png'
                     break
                  }
               }
            }
            if (base64Str) break
         } catch {
            continue
         }
      }

      // Strategy 2: Imagen 4.0 (paid plan)
      if (!base64Str) {
         const imagenModels = ['imagen-4.0-fast-generate-001', 'imagen-4.0-generate-001']

         for (const model of imagenModels) {
            try {
               const res = await fetch(
                  `https://generativelanguage.googleapis.com/v1beta/models/${model}:predict?key=${apiKey}`,
                  {
                     method: 'POST',
                     headers: { 'Content-Type': 'application/json' },
                     body: JSON.stringify({
                        instances: [{ prompt: fullPrompt }],
                        parameters: {
                           sampleCount: 1,
                           aspectRatio: context === 'car-model' ? '4:3' : '16:9',
                           outputOptions: { mimeType: 'image/jpeg' },
                        },
                     }),
                  }
               )

               if (!res.ok) continue

               const json = await res.json()
               base64Str = json?.predictions?.[0]?.bytesBase64Encoded
               mimeType = 'image/jpeg'
               if (base64Str) break
            } catch {
               continue
            }
         }
      }

      if (!base64Str) {
         return new NextResponse(
            'Görsel oluşturulamadı. Gemini API kotası dolmuş olabilir veya ücretli plan gerekiyor. Lütfen https://ai.dev kontrol edin.',
            { status: 429 }
         )
      }

      // Upload to Supabase Storage
      const supabase = createServerClient(
         process.env.NEXT_PUBLIC_SUPABASE_URL!,
         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
         {
            cookies: {
               getAll() { return request.cookies.getAll() },
               setAll() {},
            },
         }
      )

      const buffer = Buffer.from(base64Str, 'base64')
      const ext = mimeType.includes('png') ? 'png' : 'jpg'
      const folder = context === 'car-model' ? 'cars' : context === 'category' ? 'categories' : 'generated'
      const fileName = `${folder}/${uuidv4()}.${ext}`

      const { error: uploadError } = await supabase.storage
         .from('ecommerce')
         .upload(fileName, buffer, {
            contentType: mimeType,
            upsert: false,
         })

      if (uploadError) {
         console.error('Upload error:', uploadError)
         return new NextResponse(`Upload failed: ${uploadError.message}`, { status: 500 })
      }

      const { data: { publicUrl } } = supabase.storage
         .from('ecommerce')
         .getPublicUrl(fileName)

      return NextResponse.json({ url: publicUrl })
   } catch (error) {
      console.error('[IMAGE_GENERATE]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
