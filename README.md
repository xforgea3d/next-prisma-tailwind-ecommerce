# xForgea3D - Premium 3D Printing E-Commerce Platform

**xForgea3D**, 3D yazici teknolojisiyle uretilen oto yedek parca, heykel, figur, aksesuar ve daha fazlasini sunan profesyonel bir e-ticaret platformudur. Next.js 14, Prisma, Supabase ve Tailwind CSS ile insa edilmistir.

## Ozellikler

### Magaza (Storefront)
- **Urun Katalogu** - Kategorilere ve markalara gore filtreleme, arama, siralama
- **3D Urun Goruntuleme** - Lightbox zoom, coklu resim galerisi
- **Ozel Urun Siparis** - Atolye sayfasindan SVG yukleme ile kisisel urun talebi
- **Sepet Sistemi** - Oturumsuz (localStorage) ve oturumlu sepet destegi
- **Odeme Altyapisi** - Turk banka sanal POS entegrasyonuna hazir (iyzico/PayTR/Param uyumlu)
- **Istek Listesi** - Kullanici begendigi urunleri kaydedebilir
- **Blog** - Gemini AI destekli otomatik blog uretimi (gunluk 4 yazi)
- **SEO** - JSON-LD yapisal veri, Open Graph, Twitter Cards, dinamik sitemap, robots.txt
- **Coklu Adres** - Kullanicilar birden fazla teslimat adresi ekleyebilir
- **Siparis Takibi** - Detayli siparis durumu ve gecmisi
- **Yasal Sayfalar** - Mesafeli satis sozlesmesi, iade kosullari, KVKK, gizlilik politikasi

### Admin Paneli (CMS)
- **Dashboard** - Gelir grafikleri, satis istatistikleri, stok takibi
- **Urun Yonetimi** - Urun ekleme, duzenleme, gorseller, fiyatlandirma, stok
- **Siparis Yonetimi** - Siparis durumu guncelleme, odeme takibi
- **Kategori & Marka** - Kategori ve marka CRUD islemleri
- **Banner Yonetimi** - Ana sayfa banner'lari
- **Kullanici Yonetimi** - Kullanici listesi, rol atama
- **Blog & Sayfa Editoru** - Zengin metin editoruyle icerik yonetimi
- **Gemini AI Entegrasyonu** - Kategori gorselleri icin AI imaj uretimi
- **AI Otomatik Blog** - Cron ile gunluk 4 blog yazisi (3D baski, aksesuarlar, oto parca)
- **Webhook Senkronizasyonu** - Admin degisiklikleri aninda storefront'a yansir (ISR revalidation)

### Guvenlik
- Admin paneli Supabase rol dogrulamasi ile korunur
- Middleware yalnizca korunmasi gereken rotalarda calisir
- HMAC-SHA256 imzali odeme callback dogrulamasi
- XSS/CSRF korumalari
- Hassas verilerin header uzerinden guvenli iletimi

### Performans
- ISR (Incremental Static Regeneration) ile hizli sayfa yuklemeleri
- Prisma sorgu optimizasyonu (N+1 sorgu yok, aggregate kullanimi)
- Akilli cache stratejisi
- Optimize edilmis middleware matcher

## Teknoloji Yigini

| Katman | Teknoloji |
|--------|-----------|
| Framework | Next.js 14 (App Router) |
| Dil | TypeScript |
| Veritabani | PostgreSQL (Supabase) |
| ORM | Prisma |
| Kimlik Dogrulama | Supabase Auth (Email/Sifre + Google OAuth) |
| Depolama | Supabase Storage |
| Stil | Tailwind CSS |
| UI Bilesenler | Radix UI + shadcn/ui |
| AI | Google Gemini 2.0 Flash |
| Ikonlar | Lucide React |
| Deployment | Vercel |

## Proje Yapisi

```
xforgea/
├── apps/
│   ├── storefront/          # Musteri magaza uygulamasi (port 7777)
│   │   ├── prisma/          # Prisma sema ve migration
│   │   └── src/
│   │       ├── app/         # Next.js App Router sayfalari
│   │       ├── components/  # UI bilesenleri
│   │       ├── hooks/       # React hook'lari
│   │       ├── lib/         # Yardimci fonksiyonlar
│   │       └── state/       # Durum yonetimi
│   └── admin/               # Admin panel uygulamasi (port 8888)
│       ├── prisma/          # Prisma sema ve migration
│       └── src/
│           ├── app/         # Admin sayfalari ve API'ler
│           ├── components/  # Admin UI bilesenleri
│           └── lib/         # Yardimci fonksiyonlar
└── packages/                # Paylasilan paketler
```

## Kurulum

### Gereksinimler
- Node.js v18+
- Supabase hesabi (veritabani + auth + storage)

### Adimlar

1. **Projeyi klonlayin ve bagimliliklari yukleyin**
   ```bash
   git clone https://github.com/xforgea3d/xforgea3d.git
   cd xforgea3d
   npm install --legacy-peer-deps
   ```

2. **Ortam degiskenlerini ayarlayin**

   `apps/storefront/.env` ve `apps/admin/.env` dosyalari olusturun:

   ```env
   # Veritabani (Supabase PostgreSQL)
   DATABASE_URL="postgresql://[USER]:[PASSWORD]@[HOST]:6543/postgres?pgbouncer=true&connection_limit=10&pool_timeout=20&sslmode=require"
   DIRECT_URL="postgresql://[USER]:[PASSWORD]@[HOST]:5432/postgres?sslmode=require"

   # Supabase
   NEXT_PUBLIC_SUPABASE_URL="https://[INSTANCE].supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="..."

   # Uygulama
   STOREFRONT_URL="http://localhost:7777"
   REVALIDATION_SECRET="guclu-rastgele-token"

   # AI (opsiyonel)
   GEMINI_API_KEY="google-ai-studio-api-key"

   # Odeme (banka entegrasyonu sonrasi)
   PAYMENT_API_KEY=""
   PAYMENT_SECRET_KEY=""
   PAYMENT_MERCHANT_ID=""
   NEXT_PUBLIC_BASE_URL="https://xforgea3d.com"
   ```

3. **Veritabanini hazirlayin**
   ```bash
   cd apps/storefront
   npx prisma generate
   npx prisma db push
   ```

4. **Uygulamalari baslatin**
   ```bash
   # Terminal 1 - Magaza
   cd apps/storefront && npm run dev

   # Terminal 2 - Admin
   cd apps/admin && npm run dev
   ```

   - Magaza: http://localhost:7777
   - Admin: http://localhost:8888

## Odeme Entegrasyonu

Platform, Turk banka sanal POS sistemleriyle (iyzico, PayTR, Param, vs.) entegrasyona hazirdir. Entegrasyon icin:

1. Bankanizdan sanal POS bilgilerini alin
2. `.env` dosyasina `PAYMENT_API_KEY`, `PAYMENT_SECRET_KEY`, `PAYMENT_MERCHANT_ID` ekleyin
3. `apps/storefront/src/app/api/payment/` altindaki dosyalari bankanizin API'sine gore guncelleyin

## AI Blog Otomasyonu

Gemini 2.0 Flash ile gunluk 4 blog yazisi otomatik uretilir:
- 2x 3D baski teknolojisi
- 1x 3D aksesuarlar
- 1x Oto yedek parca

Vercel Cron uzerinden calisir. `GEMINI_API_KEY` ve `AUTO_BLOG_SECRET` ortam degiskenlerini ayarlayin.

## Lisans

Tum haklari saklidir. Bu yazilim xForgea3D'ye aittir.
