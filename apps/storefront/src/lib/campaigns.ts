export interface Campaign {
   id: string
   name: string
   description: string
   startDate: string // MM-DD format
   endDate: string // MM-DD format
   theme: {
      primaryColor: string // hex
      secondaryColor: string // hex
      gradientFrom: string // tailwind color
      gradientTo: string // tailwind color
      emoji: string
      icon: string // lucide icon name
   }
   banner: {
      title: string
      subtitle: string
      ctaText: string
      ctaLink: string
   }
   discountSuggestion: number // suggested discount %
}

// Database campaign shape
export interface DBCampaign {
   id: string
   name: string
   description: string | null
   startDate: string
   endDate: string
   isActive: boolean
   priority: number
   emoji: string
   primaryColor: string
   secondaryColor: string
   gradientFrom: string
   gradientTo: string
   bannerTitle: string
   bannerSubtitle: string | null
   bannerCtaText: string
   bannerCtaLink: string
   bannerImageUrl: string | null
   discountPercent: number
   discountCode: {
      id: string
      code: string
      percent: number
      maxDiscountAmount: number
   } | null
   _count: { products: number }
   views: number
   clicks: number
   orders: number
   revenue: number
}

/**
 * Convert a DB campaign to the legacy Campaign interface for backward compatibility
 */
export function dbCampaignToLegacy(db: DBCampaign): Campaign {
   return {
      id: db.id,
      name: db.name,
      description: db.description || '',
      startDate: '', // not used for DB campaigns
      endDate: '',
      theme: {
         primaryColor: db.primaryColor,
         secondaryColor: db.secondaryColor,
         gradientFrom: db.gradientFrom,
         gradientTo: db.gradientTo,
         emoji: db.emoji,
         icon: 'Tag',
      },
      banner: {
         title: db.bannerTitle,
         subtitle: db.bannerSubtitle || '',
         ctaText: db.bannerCtaText,
         ctaLink: db.bannerCtaLink,
      },
      discountSuggestion: db.discountPercent,
   }
}

/**
 * Hardcoded campaigns kept as SUGGESTED_CAMPAIGNS for admin reference
 * and as a fallback when DB is unavailable.
 */
export const SUGGESTED_CAMPAIGNS: Campaign[] = [
   // Ocak - Yeni Yıl
   {
      id: 'yilbasi',
      name: 'Yeni Yıl İndirimleri',
      description: 'Yeni yıla özel fırsatlar',
      startDate: '12-25',
      endDate: '01-05',
      theme: {
         primaryColor: '#dc2626',
         secondaryColor: '#16a34a',
         gradientFrom: 'from-red-500/10',
         gradientTo: 'to-green-500/10',
         emoji: '\uD83C\uDF84',
         icon: 'Gift',
      },
      banner: {
         title: 'Yeni Yıla Özel %20 İndirim!',
         subtitle: 'Sevdiklerinize 3D baskı hediyeler',
         ctaText: 'Hediyeleri Keşfet',
         ctaLink: '/products?sort=featured',
      },
      discountSuggestion: 20,
   },
   // Şubat - Sevgililer Günü
   {
      id: 'sevgililer',
      name: 'Sevgililer Günü',
      description: '14 Şubat özel ürünler',
      startDate: '02-07',
      endDate: '02-15',
      theme: {
         primaryColor: '#ec4899',
         secondaryColor: '#f43f5e',
         gradientFrom: 'from-pink-500/10',
         gradientTo: 'to-rose-500/10',
         emoji: '\u2764\uFE0F',
         icon: 'Heart',
      },
      banner: {
         title: 'Sevgililer Gününe Özel Tasarımlar',
         subtitle: 'Kişiye özel 3D baskı hediyelerle sevginizi gösterin',
         ctaText: 'Hediye Seç',
         ctaLink: '/products?category=Dekoratif',
      },
      discountSuggestion: 15,
   },
   // Mart - Kadınlar Günü
   {
      id: 'kadinlar',
      name: '8 Mart Dünya Kadınlar Günü',
      description: 'Kadınlar Gününe özel fırsatlar',
      startDate: '03-05',
      endDate: '03-09',
      theme: {
         primaryColor: '#a855f7',
         secondaryColor: '#ec4899',
         gradientFrom: 'from-purple-500/10',
         gradientTo: 'to-pink-500/10',
         emoji: '\uD83D\uDC90',
         icon: 'Flower2',
      },
      banner: {
         title: 'Kadınlar Gününe Özel',
         subtitle: 'Hayatınızdaki özel kadınlara benzersiz hediyeler',
         ctaText: 'Hediyeleri Gör',
         ctaLink: '/products',
      },
      discountSuggestion: 10,
   },
   // Nisan - 23 Nisan
   {
      id: '23nisan',
      name: '23 Nisan Çocuk Bayramı',
      description: 'Ulusal Egemenlik ve Çocuk Bayramı',
      startDate: '04-20',
      endDate: '04-24',
      theme: {
         primaryColor: '#3b82f6',
         secondaryColor: '#ef4444',
         gradientFrom: 'from-blue-500/10',
         gradientTo: 'to-red-500/10',
         emoji: '\uD83C\uDF88',
         icon: 'PartyPopper',
      },
      banner: {
         title: '23 Nisan Çocuk Bayramı Şenliği!',
         subtitle: 'Çocuklar için eğlenceli 3D figürler ve oyuncaklar',
         ctaText: 'Figürleri Keşfet',
         ctaLink: '/products?category=Fig%C3%BCrler',
      },
      discountSuggestion: 15,
   },
   // Mayıs - Anneler Günü
   {
      id: 'anneler',
      name: 'Anneler Günü',
      description: 'Anneler Gününe özel hediyeler',
      startDate: '05-08',
      endDate: '05-15',
      theme: {
         primaryColor: '#f472b6',
         secondaryColor: '#fb923c',
         gradientFrom: 'from-pink-400/10',
         gradientTo: 'to-orange-400/10',
         emoji: '\uD83C\uDF38',
         icon: 'Heart',
      },
      banner: {
         title: 'Anneler Gününe Özel',
         subtitle: 'Annenize en güzel hediye: kişiye özel 3D baskı',
         ctaText: 'Anneye Hediye',
         ctaLink: '/products?category=Dekoratif',
      },
      discountSuggestion: 15,
   },
   // Haziran - Babalar Günü
   {
      id: 'babalar',
      name: 'Babalar Günü',
      description: 'Babalar Gününe özel hediyeler',
      startDate: '06-15',
      endDate: '06-22',
      theme: {
         primaryColor: '#2563eb',
         secondaryColor: '#0d9488',
         gradientFrom: 'from-blue-600/10',
         gradientTo: 'to-teal-500/10',
         emoji: '\uD83D\uDC54',
         icon: 'Trophy',
      },
      banner: {
         title: 'Babalar Gününe Özel',
         subtitle: 'Babanıza özel araç aksesuarları ve figürler',
         ctaText: 'Babaya Hediye',
         ctaLink: '/products?category=Ara%C3%A7%20Aksesuarlar%C4%B1',
      },
      discountSuggestion: 15,
   },
   // Temmuz-Ağustos - Yaz İndirimi
   {
      id: 'yaz',
      name: 'Yaz İndirimleri',
      description: 'Yaz kampanyası fırsatları',
      startDate: '07-01',
      endDate: '08-31',
      theme: {
         primaryColor: '#f59e0b',
         secondaryColor: '#06b6d4',
         gradientFrom: 'from-amber-500/10',
         gradientTo: 'to-cyan-500/10',
         emoji: '\u2600\uFE0F',
         icon: 'Sun',
      },
      banner: {
         title: 'Yaz Kampanyası Başladı!',
         subtitle: 'Tüm ürünlerde büyük indirimler',
         ctaText: 'İndirimleri Gör',
         ctaLink: '/products?sort=featured',
      },
      discountSuggestion: 25,
   },
   // Eylül - Okula Dönüş
   {
      id: 'okul',
      name: 'Okula Dönüş',
      description: 'Okula dönüş kampanyası',
      startDate: '09-01',
      endDate: '09-15',
      theme: {
         primaryColor: '#8b5cf6',
         secondaryColor: '#3b82f6',
         gradientFrom: 'from-violet-500/10',
         gradientTo: 'to-blue-500/10',
         emoji: '\uD83D\uDCDA',
         icon: 'GraduationCap',
      },
      banner: {
         title: 'Okula Dönüş Kampanyası',
         subtitle: 'Masaüstü aksesuarlar ve kişiye özel okul ürünleri',
         ctaText: 'Ürünleri Gör',
         ctaLink: '/products?category=Aksesuarlar',
      },
      discountSuggestion: 10,
   },
   // Ekim - 29 Ekim
   {
      id: '29ekim',
      name: '29 Ekim Cumhuriyet Bayramı',
      description: 'Cumhuriyet Bayramı kutlamaları',
      startDate: '10-26',
      endDate: '10-30',
      theme: {
         primaryColor: '#dc2626',
         secondaryColor: '#ffffff',
         gradientFrom: 'from-red-600/10',
         gradientTo: 'to-red-400/5',
         emoji: '\uD83C\uDDF9\uD83C\uDDF7',
         icon: 'Flag',
      },
      banner: {
         title: 'Cumhuriyet Bayramı Kutlu Olsun!',
         subtitle: 'Bayrama özel indirimler',
         ctaText: 'Kampanyayı Gör',
         ctaLink: '/products',
      },
      discountSuggestion: 29,
   },
   // Kasım - Black Friday / 11.11
   {
      id: 'blackfriday',
      name: 'Efsane Cuma / Kasım İndirimleri',
      description: 'Yılın en büyük indirimleri',
      startDate: '11-11',
      endDate: '11-30',
      theme: {
         primaryColor: '#000000',
         secondaryColor: '#f59e0b',
         gradientFrom: 'from-neutral-900/20',
         gradientTo: 'to-amber-500/10',
         emoji: '\uD83C\uDFF7\uFE0F',
         icon: 'Percent',
      },
      banner: {
         title: 'EFSANE KASIM İNDİRİMLERİ',
         subtitle: "Yılın en büyük indirimleri başladı! %40'a varan fırsatlar",
         ctaText: 'Fırsatları Yakala',
         ctaLink: '/products?sort=most_expensive',
      },
      discountSuggestion: 40,
   },
   // Ramazan (approximate - changes yearly)
   {
      id: 'ramazan',
      name: 'Ramazan Bayramı',
      description: 'Ramazan Bayramına özel fırsatlar',
      startDate: '03-28',
      endDate: '04-02',
      theme: {
         primaryColor: '#059669',
         secondaryColor: '#d97706',
         gradientFrom: 'from-emerald-500/10',
         gradientTo: 'to-amber-500/10',
         emoji: '\uD83C\uDF19',
         icon: 'Moon',
      },
      banner: {
         title: 'Ramazan Bayramınız Kutlu Olsun',
         subtitle: 'Bayram hediyelerinde özel indirimler',
         ctaText: 'Hediyeleri Gör',
         ctaLink: '/products',
      },
      discountSuggestion: 15,
   },
   // Kurban Bayramı (approximate)
   {
      id: 'kurban',
      name: 'Kurban Bayramı',
      description: 'Kurban Bayramına özel fırsatlar',
      startDate: '06-05',
      endDate: '06-10',
      theme: {
         primaryColor: '#059669',
         secondaryColor: '#0284c7',
         gradientFrom: 'from-emerald-500/10',
         gradientTo: 'to-sky-500/10',
         emoji: '\uD83D\uDD4C',
         icon: 'Moon',
      },
      banner: {
         title: 'Kurban Bayramınız Mübarek Olsun',
         subtitle: 'Bayram hediyelerinde %15 indirim',
         ctaText: 'Hediyeleri Gör',
         ctaLink: '/products',
      },
      discountSuggestion: 15,
   },
]

/**
 * Fetch active campaigns from DB API
 */
export async function getActiveCampaignsFromDB(): Promise<DBCampaign[]> {
   try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL
         || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
      const res = await fetch(`${baseUrl}/api/campaigns/active`, {
         next: { revalidate: 60 },
      })
      if (!res.ok) return []
      return res.json()
   } catch {
      return []
   }
}

/**
 * Get the currently active campaign.
 * Checks DB first, falls back to hardcoded SUGGESTED_CAMPAIGNS.
 */
export function getActiveCampaign(): Campaign | null {
   const now = new Date()
   const month = String(now.getMonth() + 1).padStart(2, '0')
   const day = String(now.getDate()).padStart(2, '0')
   const today = `${month}-${day}`

   return (
      SUGGESTED_CAMPAIGNS.find((c) => {
         if (c.startDate <= c.endDate) {
            return today >= c.startDate && today <= c.endDate
         }
         // Handle year-crossing campaigns (like Yılbaşı: 12-25 to 01-05)
         return today >= c.startDate || today <= c.endDate
      }) || null
   )
}

/**
 * Get the end date of a campaign as a full Date object for the current year.
 * Used for countdown timers.
 */
export function getCampaignEndDate(campaign: Campaign): Date {
   const now = new Date()
   const [month, day] = campaign.endDate.split('-').map(Number)
   let year = now.getFullYear()

   // If campaign crosses year boundary and we're in January, end date year = current year
   // If we're in December, end date year = next year
   if (campaign.startDate > campaign.endDate) {
      const currentMonth = now.getMonth() + 1
      if (currentMonth >= 10) {
         year = now.getFullYear() + 1
      }
   }

   // Set to end of day
   return new Date(year, month - 1, day, 23, 59, 59)
}

/**
 * Get the end date for a DB campaign
 */
export function getDBCampaignEndDate(campaign: DBCampaign): Date {
   return new Date(campaign.endDate)
}
