/**
 * Seed script: Create 12 Turkish holiday campaigns for 2026
 *
 * Run with:
 *   cd apps/admin
 *   npx tsx prisma/seed-campaigns.ts
 *
 * Islamic holidays for 2026 (approximate):
 *   Ramazan Bayrami: ~February 18-20, 2026
 *   Kurban Bayrami:  ~April 27-29, 2026
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const campaigns = [
   {
      name: 'Yeni Yil Indirimleri',
      description: 'Yeni yila ozel firsatlar',
      startDate: new Date('2025-12-25'),
      endDate: new Date('2026-01-05'),
      isActive: true,
      priority: 5,
      emoji: '\uD83C\uDF84',
      primaryColor: '#dc2626',
      secondaryColor: '#16a34a',
      gradientFrom: 'from-red-500/10',
      gradientTo: 'to-green-500/10',
      bannerTitle: 'Yeni Yila Ozel %20 Indirim!',
      bannerSubtitle: 'Sevdiklerinize 3D baski hediyeler',
      bannerCtaText: 'Hediyeleri Kesfet',
      bannerCtaLink: '/products?sort=featured',
      discountPercent: 20,
   },
   {
      name: 'Sevgililer Gunu',
      description: '14 Subat ozel urunler',
      startDate: new Date('2026-02-07'),
      endDate: new Date('2026-02-15'),
      isActive: true,
      priority: 5,
      emoji: '\u2764\uFE0F',
      primaryColor: '#ec4899',
      secondaryColor: '#f43f5e',
      gradientFrom: 'from-pink-500/10',
      gradientTo: 'to-rose-500/10',
      bannerTitle: 'Sevgililer Gunune Ozel Tasarimlar',
      bannerSubtitle: 'Kisiye ozel 3D baski hediyelerle sevginizi gosterin',
      bannerCtaText: 'Hediye Sec',
      bannerCtaLink: '/products?category=Dekoratif',
      discountPercent: 15,
   },
   {
      name: 'Ramazan Bayrami',
      description: 'Ramazan Bayramina ozel firsatlar',
      startDate: new Date('2026-02-15'),
      endDate: new Date('2026-02-22'),
      isActive: true,
      priority: 6,
      emoji: '\uD83C\uDF19',
      primaryColor: '#059669',
      secondaryColor: '#d97706',
      gradientFrom: 'from-emerald-500/10',
      gradientTo: 'to-amber-500/10',
      bannerTitle: 'Ramazan Bayraminiz Kutlu Olsun',
      bannerSubtitle: 'Bayram hediyelerinde ozel indirimler',
      bannerCtaText: 'Hediyeleri Gor',
      bannerCtaLink: '/products',
      discountPercent: 15,
   },
   {
      name: '8 Mart Dunya Kadinlar Gunu',
      description: 'Kadinlar Gunune ozel firsatlar',
      startDate: new Date('2026-03-05'),
      endDate: new Date('2026-03-09'),
      isActive: true,
      priority: 5,
      emoji: '\uD83D\uDC90',
      primaryColor: '#a855f7',
      secondaryColor: '#ec4899',
      gradientFrom: 'from-purple-500/10',
      gradientTo: 'to-pink-500/10',
      bannerTitle: 'Kadinlar Gunune Ozel',
      bannerSubtitle: 'Hayatinizdaki ozel kadinlara benzersiz hediyeler',
      bannerCtaText: 'Hediyeleri Gor',
      bannerCtaLink: '/products',
      discountPercent: 10,
   },
   {
      name: '23 Nisan Cocuk Bayrami',
      description: 'Ulusal Egemenlik ve Cocuk Bayrami',
      startDate: new Date('2026-04-20'),
      endDate: new Date('2026-04-24'),
      isActive: true,
      priority: 5,
      emoji: '\uD83C\uDF88',
      primaryColor: '#3b82f6',
      secondaryColor: '#ef4444',
      gradientFrom: 'from-blue-500/10',
      gradientTo: 'to-red-500/10',
      bannerTitle: '23 Nisan Cocuk Bayrami Senligi!',
      bannerSubtitle: 'Cocuklar icin eglenceli 3D figurler ve oyuncaklar',
      bannerCtaText: 'Figurleri Kesfet',
      bannerCtaLink: '/products?category=Fig%C3%BCrler',
      discountPercent: 15,
   },
   {
      name: 'Kurban Bayrami',
      description: 'Kurban Bayramina ozel firsatlar',
      startDate: new Date('2026-04-24'),
      endDate: new Date('2026-04-30'),
      isActive: true,
      priority: 6,
      emoji: '\uD83D\uDD4C',
      primaryColor: '#059669',
      secondaryColor: '#0284c7',
      gradientFrom: 'from-emerald-500/10',
      gradientTo: 'to-sky-500/10',
      bannerTitle: 'Kurban Bayraminiz Mubarek Olsun',
      bannerSubtitle: 'Bayram hediyelerinde %15 indirim',
      bannerCtaText: 'Hediyeleri Gor',
      bannerCtaLink: '/products',
      discountPercent: 15,
   },
   {
      name: 'Anneler Gunu',
      description: 'Anneler Gunune ozel hediyeler',
      startDate: new Date('2026-05-08'),
      endDate: new Date('2026-05-15'),
      isActive: true,
      priority: 5,
      emoji: '\uD83C\uDF38',
      primaryColor: '#f472b6',
      secondaryColor: '#fb923c',
      gradientFrom: 'from-pink-400/10',
      gradientTo: 'to-orange-400/10',
      bannerTitle: 'Anneler Gunune Ozel',
      bannerSubtitle: 'Annenize en guzel hediye: kisiye ozel 3D baski',
      bannerCtaText: 'Anneye Hediye',
      bannerCtaLink: '/products?category=Dekoratif',
      discountPercent: 15,
   },
   {
      name: 'Babalar Gunu',
      description: 'Babalar Gunune ozel hediyeler',
      startDate: new Date('2026-06-15'),
      endDate: new Date('2026-06-22'),
      isActive: true,
      priority: 5,
      emoji: '\uD83D\uDC54',
      primaryColor: '#2563eb',
      secondaryColor: '#0d9488',
      gradientFrom: 'from-blue-600/10',
      gradientTo: 'to-teal-500/10',
      bannerTitle: 'Babalar Gunune Ozel',
      bannerSubtitle: 'Babaniza ozel arac aksesuarlari ve figurler',
      bannerCtaText: 'Babaya Hediye',
      bannerCtaLink: '/products?category=Ara%C3%A7%20Aksesuarlar%C4%B1',
      discountPercent: 15,
   },
   {
      name: 'Yaz Indirimleri',
      description: 'Yaz kampanyasi firsatlari',
      startDate: new Date('2026-07-01'),
      endDate: new Date('2026-08-31'),
      isActive: true,
      priority: 4,
      emoji: '\u2600\uFE0F',
      primaryColor: '#f59e0b',
      secondaryColor: '#06b6d4',
      gradientFrom: 'from-amber-500/10',
      gradientTo: 'to-cyan-500/10',
      bannerTitle: 'Yaz Kampanyasi Basladi!',
      bannerSubtitle: 'Tum urunlerde buyuk indirimler',
      bannerCtaText: 'Indirimleri Gor',
      bannerCtaLink: '/products?sort=featured',
      discountPercent: 25,
   },
   {
      name: 'Okula Donus',
      description: 'Okula donus kampanyasi',
      startDate: new Date('2026-09-01'),
      endDate: new Date('2026-09-15'),
      isActive: true,
      priority: 4,
      emoji: '\uD83D\uDCDA',
      primaryColor: '#8b5cf6',
      secondaryColor: '#3b82f6',
      gradientFrom: 'from-violet-500/10',
      gradientTo: 'to-blue-500/10',
      bannerTitle: 'Okula Donus Kampanyasi',
      bannerSubtitle: 'Masaustu aksesuarlar ve kisiye ozel okul urunleri',
      bannerCtaText: 'Urunleri Gor',
      bannerCtaLink: '/products?category=Aksesuarlar',
      discountPercent: 10,
   },
   {
      name: '29 Ekim Cumhuriyet Bayrami',
      description: 'Cumhuriyet Bayrami kutlamalari',
      startDate: new Date('2026-10-26'),
      endDate: new Date('2026-10-30'),
      isActive: true,
      priority: 7,
      emoji: '\uD83C\uDDF9\uD83C\uDDF7',
      primaryColor: '#dc2626',
      secondaryColor: '#ffffff',
      gradientFrom: 'from-red-600/10',
      gradientTo: 'to-red-400/5',
      bannerTitle: 'Cumhuriyet Bayrami Kutlu Olsun!',
      bannerSubtitle: 'Bayrama ozel indirimler',
      bannerCtaText: 'Kampanyayi Gor',
      bannerCtaLink: '/products',
      discountPercent: 29,
   },
   {
      name: 'Efsane Cuma / Kasim Indirimleri',
      description: 'Yilin en buyuk indirimleri',
      startDate: new Date('2026-11-11'),
      endDate: new Date('2026-11-30'),
      isActive: true,
      priority: 8,
      emoji: '\uD83C\uDFF7\uFE0F',
      primaryColor: '#000000',
      secondaryColor: '#f59e0b',
      gradientFrom: 'from-neutral-900/20',
      gradientTo: 'to-amber-500/10',
      bannerTitle: 'EFSANE KASIM INDIRIMLERI',
      bannerSubtitle: "Yilin en buyuk indirimleri basladi! %40'a varan firsatlar",
      bannerCtaText: 'Firsatlari Yakala',
      bannerCtaLink: '/products?sort=most_expensive',
      discountPercent: 40,
   },
]

async function main() {
   console.log('Seeding 12 Turkish holiday campaigns for 2026...')

   for (const campaign of campaigns) {
      const existing = await prisma.campaign.findFirst({
         where: {
            name: campaign.name,
            startDate: campaign.startDate,
         },
      })

      if (existing) {
         console.log(`  Skipping "${campaign.name}" (already exists)`)
         continue
      }

      await prisma.campaign.create({ data: campaign })
      console.log(`  Created: ${campaign.emoji} ${campaign.name}`)
   }

   console.log('Done! All 12 campaigns seeded.')
}

main()
   .catch((e) => {
      console.error(e)
      process.exit(1)
   })
   .finally(async () => {
      await prisma.$disconnect()
   })
