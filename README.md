# xForgea3D

3D yazici teknolojisiyle uretilen oto yedek parca, heykel, figur ve aksesuar satan e-ticaret platformu.

## Site Nasil Kullanilir?

### Musteri Tarafinda (Magaza)

**Urun Arama ve Filtreleme**
- Ana sayfada one cikan urunler, kategoriler ve markalar goruntulenir.
- Ust menuden kategorilere, markalara veya araba modellerine gore urunleri filtreleyebilirsiniz.
- Arama cubuguna kelime yazarak urun arayabilirsiniz.
- Urun listesinde fiyata gore siralama ve musaitlik filtresi vardir.

**Urun Detay ve Sepete Ekleme**
- Urun sayfasinda gorselleri buyutup inceleyebilirsiniz (zoom destegi).
- "Kisiye Ozel" urunlerde renk, boyut secimi yapabilir, metin girebilir ve dosya yukleyebilirsiniz.
- "Sepete Ekle" butonuyla urunu sepetinize ekleyin. Adet artirip azaltabilirsiniz.

**Siparis Verme**
1. Sepet sayfasinda urunlerinizi kontrol edin.
2. "Siparisi Tamamla" ile odeme sayfasina gecin.
3. Teslimat adresinizi secin veya yeni adres ekleyin.
4. Varsa indirim kodunuzu girin.
5. Siparis ozetini kontrol edip onayla.
6. Odeme sayfasina yonlendirileceksiniz.

**Hesap Islemleri**
- Google hesabinizla veya e-posta/sifre ile giris yapabilirsiniz.
- Profilim sayfasindan: siparislerinizi, adreslerinizi, istek listenizi ve teklif taleplerinizi gorebilirsiniz.
- Birden fazla teslimat adresi ekleyip yonetebilirsiniz.

**Teklif Talebi**
- Ozel parca ihtiyaciniz varsa "Teklif Al" sayfasindan araba markanizi, parca aciklamanizi ve gorsel yukleyerek teklif isteyebilirsiniz.
- Admin tarafindan fiyat belirlendikten sonra teklifi kabul edip siparis olusturabilirsiniz.

### Admin Paneli

**Giris**
- Admin paneline `/login` sayfasindan erisebilirsiniz. Yalnizca tanimli admin e-postasi ile giris yapilabilir.

**Urun Yonetimi**
- Magaza > Urunler: Yeni urun ekleyin, mevcut urunleri duzenleyin veya silin.
- Her urun icin: baslik, aciklama, fiyat, indirim, stok, gorseller, kategori, marka ve arac modeli eslestirmesi.
- "Kisiye Ozel" urunler icin renk, boyut secenekleri ve dosya yukleme ayarlari.

**Kategori, Marka ve Arac Yonetimi**
- Magaza > Kategoriler / Markalar: CRUD islemleri.
- Araclar > Araba Markalari: Marka ve model tanimlama. Urunleri arac modelleriyle eslestirin.

**Siparis ve Odeme Takibi**
- Satislar > Siparisler: Tum siparisleri listele, durumunu guncelle.
- Satislar > Odemeler: Odeme durumlarini takip et.
- Satislar > Teklif Talepleri: Gelen tekliflere fiyat belirle ve yanit ver.

**Icerik Yonetimi**
- Icerik > Blog: Yazi ekle/duzenle. Gemini AI ile otomatik blog uretimi destegi.
- Icerik > Sayfalar: Statik sayfalari (hakkimizda vb.) duzenleyin.
- Icerik > Ana Sayfa Bolumleri: Ana sayfa iceriklerini siralayin.
- Icerik > Banner: Ana sayfa banner gorsellerini yonetin.
- Icerik > Navigasyon: Ust menu, mobil menu ve footer linklerini duzenleyin.

**Site Ayarlari**
- Sistem > Ayarlar: Site adi, iletisim bilgileri, sosyal medya linkleri, bakim modu.
- Sistem > Hata Kayitlari: Otomaik kaydedilen hatalari inceleyin ve cozuldu olarak isaretleyin.
- Sistem > Kullanicilar: Kayitli kullanicilari ve siparis sayilarini gorun.

## Teknik Bilgiler

### Teknoloji Yigini

| Katman | Teknoloji |
|--------|-----------|
| Framework | Next.js 14 (App Router) |
| Dil | TypeScript |
| Veritabani | PostgreSQL (Supabase) |
| ORM | Prisma |
| Kimlik Dogrulama | Supabase Auth (E-posta/Sifre + Google OAuth) |
| Stil | Tailwind CSS + shadcn/ui |
| AI | Google Gemini 2.0 Flash |
| Test | Vitest (777 test) |
| CI/CD | GitHub Actions |
| Deployment | Vercel |

### Proje Yapisi

```
xforgea/
├── apps/
│   ├── storefront/     # Musteri magaza (port 7777)
│   └── admin/          # Yonetim paneli (port 8888)
└── packages/           # Paylasilan paketler (mail, sms, oauth, vb.)
```

### Kurulum

**Gereksinimler:** Node.js 20+, Supabase hesabi

```bash
# 1. Bagimliliklari yukle
npm install

# 2. .env dosyalarini olustur (.env.example'dan kopyala)
cp apps/storefront/.env.example apps/storefront/.env
cp apps/admin/.env.example apps/admin/.env
# Ardindan .env dosyalarini gercek degerlerle doldur

# 3. Veritabanini hazirla
cd apps/storefront && npx prisma generate && npx prisma db push

# 4. Calistir
npm run dev:storefront   # Magaza: http://localhost:7777
npm run dev:admin         # Admin:  http://localhost:8888
```

### Odeme Entegrasyonu

Platform, Turk banka sanal POS sistemleriyle (iyzico, PayTR, Param) entegrasyona hazirdir. `.env` dosyasinda `PAYMENT_API_KEY`, `PAYMENT_SECRET_KEY`, `PAYMENT_MERCHANT_ID` degerlerini tanimlayip `apps/storefront/src/app/api/payment/` altindaki dosyalari bankanizin API'sine gore guncelleyin.

### AI Blog Otomasyonu

Gemini 2.0 Flash ile gunluk 4 blog yazisi otomatik uretilir. Vercel Cron ile calisir. `GEMINI_API_KEY` ve `AUTO_BLOG_SECRET` ortam degiskenlerini ayarlayin.

### Guvenlik

- CSRF token korumasii tum mutasyon isteklerinde zorunlu
- HMAC-SHA256 imzali odeme callback dogrulamasi
- Content Security Policy, HSTS, X-Frame-Options guvenlik header'lari
- Row Level Security (53 RLS politikasi)
- XSS korumasii (DOMPurify ile HTML sanitizasyonu)
- Rate limiting (herkese acik POST endpoint'lerinde)
- Stok race condition onleme (SELECT FOR UPDATE ile satir kilitleme)

## Gelistirici

**Onur Huseyin Kocak**

## Lisans

Tum haklari saklidir. Bu yazilim xForgea3D'ye aittir.
