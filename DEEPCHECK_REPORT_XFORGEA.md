# xForgea3D — Deep Check Raporu

**Tarih:** 2026-03-09
**Analiz Kapsamı:** Kod tabanı, mimari, veritabanı, güvenlik, performans, ölçeklenebilirlik
**Prensip:** "Vasat işlere tahammül yok."

---

## 1. Proje Özeti

xForgea3D, Next.js 14 App Router üzerine kurulu bir 3D baskı e-ticaret platformu. Monorepo yapısında iki uygulama (`storefront` + `admin`), yedi paylaşımlı paket (`@persepolis/*`), Prisma ORM, Supabase (PostgreSQL + Auth + Storage) ve Tailwind CSS kullanıyor. Görsel üretimi Google Gemini/Imagen API ile yapılıyor.

---

## 2. KRİTİK SEVİYE — Acil Müdahale Gerektiren Sorunlar

### 2.1 Hardcoded API Key (GÜVENLİK ACİLİ)

**Dosya:** `generate-seed-images.js:6`
```javascript
const API_KEY = 'AIzaSyBH6Hmhenf1blZm2TVT0qrnJ1Jv7wRInPM';
```

Bu API anahtarı düz metin olarak kaynak kodda duruyor. Git geçmişinde de mevcut. **Bu anahtar anında revoke edilmeli ve `.env` dosyasına taşınmalı.** Git geçmişi BFG veya `git filter-repo` ile temizlenmeli.

**Aksiyon:**
1. Google Cloud Console'dan bu anahtarı iptal et
2. Yeni anahtar oluştur, `.env` dosyasına ekle
3. `generate-seed-images.js`'de `process.env.GEMINI_API_KEY` kullan
4. Git geçmişinden eski anahtarı temizle

### 2.2 CSRF Koruması Etkisiz (Soft Check)

**Dosya:** `apps/storefront/src/middleware.ts`

Middleware'de CSRF kontrolü **hiç yok**. API route'larında da CSRF token zorunlu değil — token varsa kontrol ediliyor, yoksa geçiliyor. Bu, state-changing endpoint'lerin CSRF saldırılarına tamamen açık olduğu anlamına gelir.

**Aksiyon:**
- Tüm POST/PATCH/DELETE endpoint'lerinde CSRF token'ı zorunlu hale getir
- Middleware seviyesinde `!csrfToken → 403` dön

### 2.3 Payment Mock Mode Production Riski

`/api/payment/success` endpoint'inde `?mock=true` parametresi `NODE_ENV === 'development'` kontrolüne bağlı. Eğer production'da yanlışlıkla `NODE_ENV=development` set edilirse, sahte ödeme geçirilebilir.

**Aksiyon:**
- Mock mode'u ek bir `MOCK_PAYMENT_SECRET` token'ına bağla
- Veya mock mode'u tamamen kaldırıp test environment'ta ayrı bir endpoint kullan

---

## 3. HIZ VE VERİMLİLİK

### 3.1 Görsel Üretim: Sıralı İşlem, Sıfır Concurrency

**Dosya:** `generate-seed-images.js:112-118`
```javascript
for (const item of itemsToGenerate) {
    await generateSingleImage(item);
    await new Promise(r => setTimeout(r, 2000));
}
```

8 görsel × (API çağrısı ~3-5sn + 2sn bekleme) = **~40-56 saniye**. Bu tamamen gereksiz.

**Nasıl Olmalı:**
```javascript
// p-limit ile kontrollü paralel işlem
import pLimit from 'p-limit';
const limit = pLimit(3); // 3 concurrent request

await Promise.all(
  itemsToGenerate.map(item =>
    limit(() => generateSingleImage(item))
  )
);
```

Bu yaklaşımla süre **~15 saniyeye** düşer. Ayrıca retry logic (exponential backoff) ve progress tracking eklenmeli.

### 3.2 generate-all-images.js Erişilemez (Deadlock)

Bu dosya (17KB) sistem deadlock'u nedeniyle okunamıyor. Büyük olasılıkla daha kapsamlı bir batch image generation scripti ama dosya kilitli durumda. Bu, dosya handle'larının düzgün kapanmadığına veya circular dependency'ye işaret edebilir.

**Aksiyon:** Dosyayı incele, kilidi çöz, aynı sorunun production'da oluşmadığından emin ol.

### 3.3 Rate Limiter: In-Memory, Dağıtık Ortamda Etkisiz

**Dosya:** `apps/storefront/src/middleware.ts:5`
```typescript
const hits = new Map<string, { count: number; resetAt: number }>()
```

Vercel'de her serverless instance kendi Map'ine sahip. Bir saldırgan farklı instance'lara düşerek rate limit'i kolayca bypass edebilir. Ayrıca `globalThis` üzerindeki `setInterval` cleanup'ı cold start'larda sıfırlanır.

**Nasıl Olmalı:**
- **Kısa vadede:** Vercel KV (Redis) veya Upstash Redis ile distributed rate limiting
- **Minimum:** Request başına `x-vercel-id` header'ını logla, anomali tespiti yap

### 3.4 Veritabanı Sorguları: N+1 Riski

Prisma kullanımında `include` ile eager loading yapılıyor ama bazı route'larda (ör. cart, orders) nested relation'lar tek tek çekilebilir. Prisma'nın query engine'i bunu otomatik optimize etmez.

**Aksiyon:**
- Kritik endpoint'lerde `prisma.$queryRaw` veya `relationLoadStrategy: 'join'` (Prisma 5.x preview) kullan
- Prisma query log'larını development'ta aktif et: `log: ['query']`

### 3.5 Image Cache TTL Çok Kısa

**Dosya:** `apps/storefront/next.config.js`
```javascript
minimumCacheTTL: 86400 // 1 gün
```

Ürün görselleri nadiren değişir. Cache TTL **en az 30 gün** (2592000) olmalı. Bu, Vercel'in Image Optimization API maliyetini ve latency'yi ciddi düşürür.

---

## 4. KOD KALİTESİ VE SÜRDÜRÜLEBİLİRLİK

### 4.1 Duplicate Prisma Schema

**Dosyalar:**
- `apps/storefront/prisma/schema.prisma` (13,853 bytes)
- `apps/admin/prisma/schema.prisma` (13,839 bytes)

İki uygulama neredeyse aynı schema'yı ayrı ayrı barındırıyor. Bu, senkronizasyon hatalarına davetiye çıkarır.

**Nasıl Olmalı:**
```
packages/
  database/
    prisma/
      schema.prisma    ← Tek kaynak
    src/
      client.ts        ← Paylaşılan Prisma client
    package.json       ← @persepolis/database
```

Her iki app bu pakete depend eder. Schema değişikliği tek yerden yapılır.

### 4.2 TypeScript strict: false

**Dosya:** `apps/storefront/tsconfig.json`
```json
{ "strict": false, "strictNullChecks": false }
```

Bu, TypeScript'in en güçlü özelliğini devre dışı bırakıyor. `null` ve `undefined` hataları runtime'a kadar fark edilmez.

**Aksiyon:**
1. `strict: true` aç
2. Hataları kademeli olarak düzelt (büyük olasılıkla 200-300 hata çıkacak)
3. En azından `strictNullChecks: true` ile başla

### 4.3 CartContext: Tip Güvenliği Sıfır

**Dosya:** `apps/storefront/src/state/Cart.tsx`
```typescript
const CartContext = createContext({
   cart: null,
   loading: true,
   refreshCart: () => {},
   dispatchCart: (object) => {},  // 'object' burada parametre adı, tip değil!
})
```

- `cart: null` — tipi yok, `any` olarak davranır
- `dispatchCart: (object) => {}` — `object` parametre adı, TypeScript tipi değil
- Generic `createContext` kullanılmamış

**Nasıl Olmalı:**
```typescript
interface CartState {
  cart: Cart | null;
  loading: boolean;
  refreshCart: () => Promise<void>;
  dispatchCart: (cart: Cart) => Promise<void>;
}

const CartContext = createContext<CartState | undefined>(undefined);
```

### 4.4 Error Handler'da any Kullanımı

**Dosya:** `apps/storefront/src/lib/error-logger.ts:85`
```typescript
} catch (error: any) {
```

`any` yerine `unknown` kullanılmalı ve type guard ile erişilmeli:
```typescript
} catch (error: unknown) {
   const message = error instanceof Error ? error.message : String(error);
```

### 4.5 Node.js 18 EOL Yaklaşıyor

**Dosya:** `.nvmrc` → `18`

Node.js 18 LTS, Nisan 2025'te EOL oldu. **Node.js 20 veya 22 LTS'e geçilmeli.**

### 4.6 ESLint Kuralları Gevşek

```javascript
"@typescript-eslint/no-explicit-any": 0,  // any kullanımı serbest
"@typescript-eslint/no-var-requires": 0   // require() serbest
```

`no-explicit-any` en azından `warn` olmalı. Mevcut `any` kullanımlarını kademeli olarak `unknown` veya proper type'lara dönüştür.

---

## 5. FONKSİYONELLİK VE ÖLÇEKLENEBİLİRLİK

### 5.1 Seed.sql: Statik ve Kırılgan

**Dosya:** `seed.sql`

- Hardcoded ID'ler (`brand_xforge`, `prod_malenia`, vb.) — collision riski düşük ama migration'larda sorun çıkarabilir
- `DELETE FROM` ile başlıyor — production'da yanlışlıkla çalıştırılırsa tüm veri silinir
- Image path'leri local (`/seed/...`) — production'da Supabase Storage URL'leri olmalı

**Aksiyon:**
- Seed script'i `prisma/seed.ts` (admin'de zaten var) ile birleştir
- SQL seed'i yalnızca initial setup için tut, açık `-- WARNING: DELETES ALL DATA` yorumu ekle
- `ON CONFLICT DO NOTHING` ile idempotent yap

### 5.2 Monorepo'da Workspace Kapsam Eksik

`package.json`'da `"workspaces": ["apps/*"]` var ama `packages/*` yok! Bu, `@persepolis/*` paketlerinin workspace resolution'dan yararlanamadığı anlamına gelir.

**Dosya:** `package.json`
```json
"workspaces": ["apps/*"]  // packages/* eksik!
```

**Düzeltme:**
```json
"workspaces": ["apps/*", "packages/*"]
```

### 5.3 Ödeme Entegrasyonu Yarım

- Zarinpal paketi var (`packages/zarinpal/`) ama storefront'ta kullanılmıyor
- Payment endpoint'i generic bir callback yapısı kullanıyor
- Payment provider tablosu var ama hangi provider'ın aktif olduğu dinamik değil
- Refund modeli var ama refund endpoint'i yok

**Aksiyon:**
- Payment flow'u end-to-end test edilmeli
- Refund API endpoint'i eklenmeli
- Provider switching mekanizması tamamlanmalı

### 5.4 Blog Otomasyon Endpoint Güvenliği

Admin'deki cron-based blog generation (`CRON_SECRET`) Gemini ile çalışıyor. Ama:
- `CRON_SECRET` kontrolü sadece string comparison — timing attack'a açık
- Blog içerikleri sanitize ediliyor mu kontrol edilmeli (AI-generated XSS riski)

**Aksiyon:**
- `crypto.timingSafeEqual` kullan
- AI-generated HTML'i `DOMPurify` ile sanitize et

### 5.5 Subscription Endpoint'leri Stub

`/api/subscription/email` ve `/api/subscription/phone` endpoint'leri var ama schema'da `isEmailSubscribed`/`isPhoneSubscribed` alanları yok. Bu endpoint'ler hiçbir şey yapmıyor.

**Aksiyon:** Ya implement et ya kaldır. Dead code bırakma.

---

## 6. GÜVENLİK DERİN ANALİZ

### 6.1 Güçlü Yönler ✓

| Alan | Detay |
|------|-------|
| Auth | Supabase SSR + middleware-enforced X-USER-ID header |
| RLS | 28 tablo için detaylı Row Level Security policies |
| Ödeme | HMAC-SHA256 imza doğrulama + idempotency check |
| XSS | DOMPurify ile HTML sanitization |
| SQL Injection | Prisma parameterized queries |
| File Upload | MIME type + boyut limiti (5MB) + UUID naming |
| Rate Limiting | Endpoint-bazlı konfigürasyon |
| Error Logging | Severity-based, database-backed error tracking |
| Test | 100+ güvenlik testi (middleware, CSRF, auth patterns) |
| Headers | `poweredByHeader: false`, security headers configured |

### 6.2 Zayıf Yönler ✗

| Sorun | Risk | Dosya |
|-------|------|-------|
| Hardcoded API key | KRİTİK | `generate-seed-images.js:6` |
| CSRF soft check | YÜKSEK | Middleware + API routes |
| Mock payment bypass | YÜKSEK | Payment success endpoint |
| In-memory rate limit | ORTA | `middleware.ts:5` |
| Admin email case-sensitive | DÜŞÜK | Admin middleware |
| CORS yapılandırılmamış | ORTA | Tüm API routes |
| File signature verification yok | DÜŞÜK | Upload endpoints |
| Error mesajları detaylı | DÜŞÜK | 500 responses |

### 6.3 Admin Erişim Modeli Kırılgan

Admin paneli tek bir `ADMIN_EMAIL` environment variable'ına bağlı. Birden fazla admin gerekirse bu model çöker. Ayrıca email karşılaştırması case-sensitive:

```typescript
if (user.email !== ALLOWED_ADMIN_EMAIL) // "Admin@email.com" ≠ "admin@email.com"
```

**Nasıl Olmalı:**
- Profile tablosundaki `role: admin` alanını kullan
- `ADMIN_EMAIL` yerine RLS policy + database role check
- Email karşılaştırmasını `.toLowerCase()` ile yap

---

## 7. MİMARİ DEĞERLENDİRME

### 7.1 İyi Kararlar

- **Monorepo yapısı** — storefront ve admin paylaşımlı paketlerle ayrılmış
- **Next.js App Router** — modern, server components desteği
- **Prisma + Supabase** — type-safe ORM + managed PostgreSQL
- **Error logging sistemi** — `withErrorLogging` wrapper pattern'ı zarif
- **Rate limiting endpoint konfigürasyonu** — `RATE_LIMITED_POSTS` objesi temiz
- **Radix UI + shadcn** — accessible, composable UI components
- **Vitest test suite** — güvenlik odaklı test kapsamı

### 7.2 Mimari Borçlar

| Borç | Etki | Çözüm |
|------|------|-------|
| Duplicate schema | Senkronizasyon hatası | Shared `@persepolis/database` paketi |
| `packages/*` workspace'de yok | Dependency resolution sorunları | `workspaces` array'ini güncelle |
| `strict: false` | Runtime null errors | Kademeli strict mode geçişi |
| Cart state untyped | Hata yakalama zorluğu | Generic context + interface |
| Node 18 EOL | Güvenlik yamaları durmuş | Node 20/22 LTS'e geç |
| next-cloudinary kurulu ama az kullanılıyor | Gereksiz dependency | Kullan veya kaldır |

---

## 8. TEST KAPSAMININ DEĞERLENDİRMESİ

### 8.1 Mevcut Testler (İyi)

- `middleware-security.test.ts` — 650+ satır, rate limiting, CSRF, XSS, path traversal
- `csrf-auth.test.ts` — Token generation/verification, timing attack resistance
- `payment.test.ts` — Ödeme flow testleri
- `cart-orders.test.ts` — Sepet ve sipariş logic testleri
- `validation.test.ts` — Input validation testleri

### 8.2 Eksik Test Alanları (Kritik)

- **Integration testleri yok** — API route'ların gerçek DB ile testi
- **Component testleri yok** — React component render/interaction testleri
- **E2E testleri yok** — Playwright/Cypress ile tam kullanıcı flow'u
- **Image generation testleri yok** — API fallback stratejisi test edilmemiş
- **Seed script testleri yok** — Idempotency garanti edilmemiş

**Aksiyon:**
1. Playwright ile kritik flow'lar: login → ürün görüntüle → sepete ekle → ödeme
2. API integration testleri: MSW (Mock Service Worker) ile
3. Component testleri: En azından cart, product card, checkout form

---

## 9. VASAT ALANLARIN TESPİTİ — "Bu İş Böyle Değil"

### 9.1 generate-seed-images.js — Tamamen Yeniden Yazılmalı

**Sorunlar:**
- Hardcoded API key (güvenlik)
- `https` modülü ile raw HTTP request (2016 yaklaşımı)
- Sıralı işlem + sabit 2sn bekleme (verimsiz)
- Hata durumunda `resolve(false)` — sessizce yutulur
- Her iki app'e ayrı ayrı dosya yazıyor (DRY ihlali)
- Progress tracking yok
- Retry logic yok

**Nasıl Olmalı:**
```javascript
// Modern yaklaşım
import pLimit from 'p-limit';

const limit = pLimit(3);
const results = await Promise.allSettled(
  items.map(item => limit(async () => {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const res = await fetch(url, { ... });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        // ... process and save
        return { filename: item.filename, success: true };
      } catch (err) {
        if (attempt === 2) throw err;
        await new Promise(r => setTimeout(r, 1000 * (attempt + 1))); // backoff
      }
    }
  }))
);

// Sonuç raporu
const failed = results.filter(r => r.status === 'rejected');
if (failed.length) console.error(`${failed.length}/${items.length} failed`);
```

### 9.2 Seed Scriptleri Dağınık

Root dizinde **7 adet** seed/setup scripti var:
- `seed.sql`
- `seed-update.js`
- `seed-local-images.js`
- `seed-real-images.js`
- `generate-seed-images.js`
- `generate-all-images.js`
- `supabase_setup.sql`

Bunlar bir `scripts/` dizininde, tek bir orchestrator ile yönetilmeli:

```
scripts/
  seed/
    index.ts          ← Orchestrator: "npm run seed" ile çalışır
    brands.ts
    products.ts
    car-data.ts
    images.ts
  setup/
    supabase.sql
    rls-policies.sql
    triggers.sql
```

### 9.3 Supabase Client Her Yerde Ayrı Oluşturuluyor

`generate-image/route.ts:117-126`'da Supabase client inline oluşturuluyor. Aynı pattern muhtemelen diğer route'larda da tekrar ediyor. Bu, `createServerClient` çağrısının her dosyada cookie handling ile birlikte duplicate edilmesi demek.

**Nasıl Olmalı:** Zaten `lib/supabase/server.ts` var — tüm route'lar oradan import etmeli.

### 9.4 Hata Mesajları Karışık Dil

API response'larında Türkçe ve İngilizce karışık:
- `'Cok fazla istek. Lutfen bekleyin.'` (middleware.ts:58)
- `'UNAUTHORIZED'` (middleware.ts:79)
- `'Sunucu hatasi'` (error-logger.ts:99)
- `'Prompt is required'` (generate-image route)
- `'Internal error'` (generate-image route)

**Aksiyon:** Tüm kullanıcıya görünen mesajları Türkçe, internal log mesajlarını İngilizce yap. Bir `messages.ts` constants dosyası oluştur.

---

## 10. SOMUT AKSİYON PLANI

### P0 — Acil (Bu Hafta)

| # | Aksiyon | Dosya |
|---|---------|-------|
| 1 | API key'i revoke et, `.env`'e taşı, git geçmişini temizle | `generate-seed-images.js` |
| 2 | CSRF token'ı tüm mutating endpoint'lerde zorunlu yap | Middleware + API routes |
| 3 | Mock payment mode'u ekstra secret'a bağla | Payment endpoint |
| 4 | Node.js 20 LTS'e geç | `.nvmrc`, CI/CD |

### P1 — Yüksek Öncelik (2 Hafta)

| # | Aksiyon | Dosya |
|---|---------|-------|
| 5 | Prisma schema'yı `@persepolis/database` paketine taşı | `packages/database/` |
| 6 | `workspaces`'e `packages/*` ekle | Root `package.json` |
| 7 | `strictNullChecks: true` aç, hataları düzelt | `tsconfig.json` |
| 8 | Cart/User context'e proper TypeScript tipleri ekle | `state/Cart.tsx`, `state/User.tsx` |
| 9 | Rate limiter'ı Upstash Redis'e taşı | `middleware.ts` |
| 10 | Image cache TTL'i 30 güne çıkar | `next.config.js` |

### P2 — Orta Öncelik (1 Ay)

| # | Aksiyon | Dosya |
|---|---------|-------|
| 11 | Seed scriptlerini `scripts/seed/` altında birleştir | Root scripts |
| 12 | `generate-seed-images.js`'i modern async/parallel yapıya çevir | Root scripts |
| 13 | Admin erişim modelini database-based role check'e geçir | Admin middleware |
| 14 | Dead code temizliği (subscription stubs, unused Cloudinary) | Çeşitli |
| 15 | Hata mesajlarını tek dilde standardize et | `lib/messages.ts` |
| 16 | E2E test suite'i ekle (Playwright) | `e2e/` |

### P3 — İyileştirme (Devam Eden)

| # | Aksiyon |
|---|---------|
| 17 | `no-explicit-any` kuralını `warn` yap, kademeli olarak azalt |
| 18 | Integration testleri ekle (MSW ile API mocking) |
| 19 | Refund endpoint'i implement et |
| 20 | CORS policy'yi explicit yapılandır |
| 21 | Blog AI output'unu DOMPurify'dan geçir |
| 22 | Component-level test kapsamını genişlet |

---

## 11. SCORECARD

| Kategori | Puan (10 üzerinden) | Not |
|----------|---------------------|-----|
| **Güvenlik** | 5/10 | Güçlü RLS + auth ama hardcoded key ve CSRF açığı var |
| **Performans** | 6/10 | Next.js optimizasyonları iyi, image gen ve rate limiting zayıf |
| **Kod Kalitesi** | 5/10 | Yapı iyi ama strict mode kapalı, any bolca, duplicate schema |
| **Test Kapsamı** | 6/10 | Güvenlik testleri güçlü, integration/E2E/component testleri yok |
| **Mimari** | 7/10 | Monorepo doğru karar, paylaşılan paketler iyi, workspace config eksik |
| **Ölçeklenebilirlik** | 5/10 | In-memory rate limit, sequential image gen, singleton admin |
| **DX (Developer Experience)** | 6/10 | Husky + lint-staged iyi, dağınık seed scriptleri kötü |
| **Sürdürülebilirlik** | 5/10 | Duplicate schema + dead code + mixed languages |

**Genel:** **5.6/10** — İskelet sağlam ama production-grade olmak için ciddi çalışma lazım.

---

## 12. SONUÇ

xForgea3D'nin mimari temeli (Next.js App Router + Prisma + Supabase monorepo) doğru seçilmiş. Güvenlik test suite'i ortalamanın üzerinde. Ancak:

1. **Güvenlik açıkları** (hardcoded key, CSRF bypass) production'a gitmeden kapatılmalı
2. **TypeScript strict mode** kapalı olması, projenin en büyük teknik borcu
3. **Görsel üretim pipeline'ı** 2016 Node.js yaklaşımıyla yazılmış — modern async patterns'a geçmeli
4. **Duplicate Prisma schema** zamanla kaçınılmaz senkronizasyon hatalarına yol açacak
5. **Rate limiting** serverless ortamda etkisiz — distributed çözüm şart

Bu rapordaki P0 aksiyonlar tamamlanmadan production'a çıkılmamalı. P1 aksiyonlar ilk sprint'te tamamlanmalı. Geri kalanı teknik borç olarak backlog'a eklenip kademeli olarak çözülmeli.

---

*Rapor sonlandı. Aksiyon planındaki maddeler öncelik sırasına göre uygulanmalıdır.*
