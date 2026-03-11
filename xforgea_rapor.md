# xForgea3D — Kapsamlı Proje Denetim Raporu

**Tarih:** 9 Mart 2026
**Kapsam:** Frontend ↔ Backend ↔ Veritabanı bağlantıları, güvenlik, kod kalitesi, yapılandırma

---

## 1. Proje Genel Yapısı

| Katman | Teknoloji | Port | Konum |
|--------|-----------|------|-------|
| **Storefront** (müşteri) | Next.js 14 (App Router), React 18, Tailwind CSS | 7777 | `apps/storefront/` |
| **Admin Panel** | Next.js 14, Zustand, Recharts, Framer Motion | 8888 | `apps/admin/` |
| **Veritabanı** | PostgreSQL (Supabase) | 6543/5432 | Supabase Cloud |
| **Auth** | Supabase Auth (Email + Google OAuth) | — | Supabase |
| **Depolama** | Supabase Storage (bucket: `ecommerce`) | — | Supabase |
| **AI** | Google Gemini 2.0 Flash | — | Google API |
| **Ortak Paketler** | `@persepolis/*` (mail, oauth, regex, rng, slugify, sms, zarinpal) | — | `packages/` |

**Monorepo:** npm workspaces (`apps/*`), 26 veritabanı modeli, ~50+ API endpoint

---

## 2. Frontend ↔ Backend Bağlantısı

### Storefront → API Routes
- Tüm API çağrıları relative path (`/api/*`) üzerinden
- Client-side: SWR ile veri çekme
- Server Components: Prisma ile doğrudan veritabanı sorgusu
- Rate limiting: Middleware seviyesinde (5-30 req/dk IP bazlı)

### Admin → Storefront Senkronizasyonu
- Admin, ürün/kategori güncellemelerinde storefront'un `/api/revalidate` webhook'unu çağırır
- `REVALIDATION_SECRET` token eşleşmesi gerekli
- Paralel istekler, hata yutma (non-blocking)

### Doğrulanan Bağlantılar
- ✅ Storefront API routes çalışır durumda (products, cart, orders, search, wishlist, quote-requests, custom-order, payment, files, error-logs)
- ✅ Admin CRUD endpointleri (products, categories, brands, banners, nav-items, blog, orders, quote-requests)
- ✅ Admin → Storefront revalidation mekanizması mevcut
- ✅ CSRF token endpoint (`/api/csrf`) tanımlı
- ⚠️ CSRF koruması **zorunlu değil** (soft check — aşağıda detaylı)

---

## 3. Backend ↔ Veritabanı Bağlantısı

### Prisma ORM Yapılandırması
```
DATABASE_URL  → Transaction pooler (port 6543, PgBouncer) — serverless uyumlu
DIRECT_URL    → Session pooler (port 5432) — migration'lar için
```

### Doğrulanan Bağlantılar
- ✅ Her iki uygulama aynı PostgreSQL veritabanına bağlı
- ✅ Prisma Client singleton pattern ile oluşturuluyor (connection leak koruması)
- ✅ 26 model tanımlı: Profile, Product, Order, Cart, Payment, CarBrand, CarModel, QuoteRequest, Blog, ContentPage, Error, Notification vb.
- ⚠️ **İki ayrı schema.prisma dosyası** — senkronizasyon riski (aşağıda detaylı)

---

## 4. Tespit Edilen Sorunlar ve Önceliklendirme

### 🔴 KRİTİK — Hemen Çözülmeli

#### 4.1 Kaynak Kodda Açık API Anahtarı
**Dosya:** `generate-seed-images.js:6`
**Sorun:** Google Gemini API key plaintext olarak kodda
**Etki:** Herhangi biri API'yi proje hesabından kullanabilir, maliyet oluşturabilir
**Çözüm:**
1. Google Cloud Console'dan anahtarı iptal et
2. Yeni anahtar üret → `process.env.GEMINI_API_KEY` kullan
3. `git filter-repo` veya BFG ile Git geçmişini temizle

#### 4.2 .env Dosyalarında Gerçek Credentials
**Dosyalar:** `apps/storefront/.env`, `apps/admin/.env`
**Sorun:** Veritabanı şifreleri, Supabase JWT anahtarları, OAuth secrets, SMTP şifreleri plaintext
**Etki:** Repo erişimi olan herkes production veritabanına tam yetki ile ulaşabilir
**Çözüm:**
1. Tüm anahtarları iptal et ve yenile
2. `.env` → `.env.local` olarak taşı (gitignored)
3. Vercel Dashboard üzerinden production env var ayarla
4. Git geçmişini temizle

#### 4.3 CSRF Koruması Zorunlu Değil
**Dosya:** `apps/storefront/src/middleware.ts`
**Sorun:** CSRF token "soft check" — token yoksa istek yine de geçer
**Etki:** POST/PATCH/DELETE endpoint'leri CSRF saldırılarına açık
**Çözüm:** Token kontrolünü zorunlu yap, eksik token → 403 dön

#### 4.4 Ödeme Mock Modu Sömürülebilir
**Dosya:** `apps/storefront/src/app/api/payment/success/route.ts`
**Sorun:** `NODE_ENV=development` veya ödeme anahtarları eksikse, `?mock=true` ile sahte ödeme onaylanabilir
**Çözüm:**
1. Explicit `MOCK_PAYMENT_SECRET` token gerekli kıl
2. Mock sadece `PAYMENT_API_KEY` `test_` ile başlıyorsa aktif olsun
3. Mock ödemeleri audit log'a yaz

---

### 🟠 YÜKSEK — Bu Sprint İçinde Çözülmeli

#### 4.5 Ortam Değişkeni Adı Tutarsızlığı
**Sorun:** Kod `NEXT_PUBLIC_SITE_URL` kullanıyor, `.env` dosyasında `NEXT_PUBLIC_URL` tanımlı
**Etki:** Payment callback URL yanlış domain'e gidebilir, sitemap/robots.txt/JSON-LD bozuk
**Etkilenen dosyalar:** `robots.ts`, `sitemap.ts`, `json-ld.tsx`, `layout.tsx`, `payment/*.ts`, ürün/blog sayfaları
**Çözüm:** `.env` içinde `NEXT_PUBLIC_URL` → `NEXT_PUBLIC_SITE_URL` olarak değiştir

#### 4.6 Duplicate Prisma Schema
**Dosyalar:** `apps/storefront/prisma/schema.prisma` (13,853 B) vs `apps/admin/prisma/schema.prisma` (13,839 B)
**Sorun:** İki ayrı şema = schema drift, çift migration, bakım kabusu
**Çözüm:** `packages/database/` altında tek şema oluştur, her iki uygulamadan referans ver

#### 4.7 Workspace Yapılandırması Eksik
**Dosya:** Root `package.json`
**Sorun:** `"workspaces": ["apps/*"]` — `packages/*` dahil değil
**Etki:** `@persepolis/*` paketleri symlink'lenmez, geliştirme ortamında resolution hataları
**Çözüm:** `"workspaces": ["apps/*", "packages/*"]`

---

### 🟡 ORTA — 2 Hafta İçinde Çözülmeli

#### 4.8 In-Memory Rate Limiting (Dağıtık Değil)
**Dosya:** `apps/storefront/src/middleware.ts`
**Sorun:** `new Map()` ile rate limiting — Vercel'de her serverless instance ayrı counter
**Çözüm:** Vercel KV veya Upstash Redis kullan

#### 4.9 Node.js 18 EOL (Nisan 2025'te Doldu)
**Dosya:** `.nvmrc → 18`
**Çözüm:** Node.js 20 LTS veya 22 LTS'ye yükselt

#### 4.10 TypeScript strict: false
**Dosyalar:** Her iki `tsconfig.json`
**Etki:** Null/undefined hataları runtime'da patlıyor
**Çözüm:** Aşamalı — önce `strictNullChecks: true`, ardından `strict: true`

#### 4.11 Image Cache TTL Çok Kısa
**Dosya:** `apps/storefront/next.config.js`
**Sorun:** `minimumCacheTTL: 86400` (1 gün) — ürün görselleri nadiren değişir
**Çözüm:** `minimumCacheTTL: 2592000` (30 gün) — maliyet ve hız iyileştirmesi

#### 4.12 Ödeme Entegrasyonu Tamamlanmamış
**Sorun:** Zarinpal paketi var ama kullanılmıyor, generic payment endpoint'i mevcut ama gerçek banka SDK'sı yok, refund endpoint eksik
**Çözüm:** iyzico/PayTR/Param seç → SDK entegre et → webhook signature doğrulama → refund endpoint yaz

#### 4.13 ESLint Kuralları Çok Gevşek
**Sorun:** `no-explicit-any: 0`, `no-var-requires: 0`
**Çözüm:** `"warn"` seviyesine çek, kademeli düzelt

---

### 🟢 DÜŞÜK — Backlog

| # | Sorun | Çözüm |
|---|-------|-------|
| 4.14 | Storefront seed script eksik | `apps/storefront/prisma/seed.ts` oluştur |
| 4.15 | API dokümantasyonu yok | OpenAPI/Swagger spec ekle |
| 4.16 | Test coverage raporlama yok | Vitest coverage yapılandır |
| 4.17 | Sentry hata izleme yok | Sentry SDK entegre et |
| 4.18 | CI/CD pipeline yok | GitHub Actions workflow ekle |

---

## 5. Uygulanan Doğrudan Düzeltmeler

> Bu denetim raporu **analiz ve tespit** odaklıdır. Aşağıdaki düzeltmeler hemen uygulanabilir:

### Hızlı Kazanımlar (Quick Wins)

```bash
# 1. .env dosyalarını .gitignore'a ekle (zaten ekliyse doğrula)
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore

# 2. Workspace config düzelt (root package.json)
# "workspaces": ["apps/*"] → "workspaces": ["apps/*", "packages/*"]

# 3. .env'de değişken adını düzelt
# NEXT_PUBLIC_URL → NEXT_PUBLIC_SITE_URL

# 4. Node.js sürümünü güncelle
# .nvmrc: 18 → 20

# 5. Image cache TTL artır
# next.config.js: minimumCacheTTL: 86400 → 2592000
```

---

## 6. Mimari Özet Diyagramı

```
┌─────────────┐     ┌─────────────┐
│  Storefront  │     │   Admin     │
│  (Next.js)   │     │  (Next.js)  │
│  Port 7777   │     │  Port 8888  │
└──────┬───────┘     └──────┬──────┘
       │ API Routes          │ API Routes + Server Actions
       │                     │
       │  ┌──────────────┐   │  revalidate webhook
       ├──┤ Supabase Auth ├──┤  ──────────────────►
       │  └──────────────┘   │
       │                     │
       │  ┌──────────────┐   │
       ├──┤ Prisma ORM   ├──┤
       │  └──────┬───────┘   │
       │         │           │
       │  ┌──────▼───────┐   │
       └──┤  PostgreSQL   ├──┘
          │  (Supabase)   │
          │  Port 6543    │
          └──────────────┘
```

---

## 7. Sonuç ve Öncelik Matrisi

| Öncelik | Sayı | Kategori | Tahmini Etki |
|---------|------|----------|-------------|
| 🔴 Kritik | 4 | Güvenlik | Veri sızıntısı, finansal kayıp |
| 🟠 Yüksek | 3 | Bağlantı/Yapı | Hatalı çalışma, bakım zorluğu |
| 🟡 Orta | 6 | Kalite/Performans | Ölçeklenme sorunları, teknik borç |
| 🟢 Düşük | 5 | İyileştirme | Geliştirici deneyimi |

**Toplam tespit:** 18 sorun
**Acil müdahale gerektiren:** 4 (güvenlik)
**İlk sprint hedefi:** Kritik + Yüksek (7 sorun)

---

*Bu rapor `/Users/jinx/Desktop/projeler/xforgea/xforgea_rapor.md` konumuna yazılmıştır.*
