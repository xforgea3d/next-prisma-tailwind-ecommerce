/**
 * Seed script: Creates fake car parts products for each car model.
 * Run: npx -w apps/admin tsx scripts/seed-car-parts.ts
 */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Placeholder car parts images (royalty-free)
const PART_IMAGES: Record<string, string[]> = {
   'Ön Tampon Lip': [
      'https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=600&q=80',
   ],
   'Yan Ayna Kapağı': [
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&q=80',
   ],
   'Spoiler': [
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&q=80',
   ],
   'Egzoz Ucu': [
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&q=80',
   ],
   'Jant Kapağı': [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80',
   ],
   'Torpido Kaplama': [
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&q=80',
   ],
   'Direksiyon Kılıfı': [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&q=80',
   ],
   'Telefon Tutucu': [
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0bbe?w=600&q=80',
   ],
}

const PART_NAMES = Object.keys(PART_IMAGES)

async function main() {
   // Get or create "Araç Aksesuarları" category
   let category = await prisma.category.findFirst({
      where: { title: { contains: 'Araç', mode: 'insensitive' } },
   })
   if (!category) {
      category = await prisma.category.create({
         data: { title: 'Araç Aksesuarları', description: 'Aracınıza özel 3D baskı aksesuarlar.' },
      })
      console.log('Created category: Araç Aksesuarları')
   }

   // Get or create a brand for car parts
   let brand = await prisma.brand.findFirst({
      where: { title: { contains: 'xForge', mode: 'insensitive' } },
   })
   if (!brand) {
      brand = await prisma.brand.create({
         data: { title: 'xForge 3D', description: '3D baskı araç parçaları' },
      })
   }

   // Get all car brands + models
   const carBrands = await prisma.carBrand.findMany({
      include: { models: true },
      orderBy: { sortOrder: 'asc' },
   })

   let created = 0

   for (const carBrand of carBrands) {
      for (const model of carBrand.models) {
         // Pick 3 random parts per model
         const shuffled = [...PART_NAMES].sort(() => Math.random() - 0.5)
         const selectedParts = shuffled.slice(0, 3)

         for (const partName of selectedParts) {
            const title = `${carBrand.name} ${model.name} ${partName}`

            // Skip if already exists
            const existing = await prisma.product.findFirst({
               where: { title },
            })
            if (existing) {
               console.log(`  Skip (exists): ${title}`)
               continue
            }

            const price = Math.round((150 + Math.random() * 850) / 10) * 10
            const hasDiscount = Math.random() > 0.6
            const discount = hasDiscount ? Math.round(price * (0.1 + Math.random() * 0.2)) : 0

            await prisma.product.create({
               data: {
                  title,
                  description: `${carBrand.name} ${model.name} için özel tasarlanmış 3D baskı ${partName.toLowerCase()}. Yüksek kalite PLA/PETG malzeme, mükemmel uyum.`,
                  price,
                  discount,
                  stock: 5 + Math.floor(Math.random() * 20),
                  images: PART_IMAGES[partName],
                  keywords: [carBrand.name, model.name, partName, 'araç parçası', '3D baskı'],
                  isFeatured: Math.random() > 0.8,
                  isAvailable: true,
                  isPhysical: true,
                  productType: 'READY',
                  brand: { connect: { id: brand!.id } },
                  categories: { connect: { id: category!.id } },
                  carModels: { connect: { id: model.id } },
               },
            })
            created++
            console.log(`  Created: ${title} (${price}₺)`)
         }
      }
   }

   console.log(`\nDone! Created ${created} car part products.`)
   await prisma.$disconnect()
}

main().catch((e) => {
   console.error(e)
   process.exit(1)
})
