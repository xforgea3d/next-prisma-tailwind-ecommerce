-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- xForgea3D — TAM VERİTABANI KURULUM SQL
-- Supabase Dashboard > SQL Editor'da çalıştırın
-- Idempotent: Birden fazla çalıştırılabilir
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- ════════════════════════════════════════════════════════════════
-- 1. ENUM TİPLERİ
-- ════════════════════════════════════════════════════════════════

DO $$ BEGIN
  CREATE TYPE "RoleEnum" AS ENUM ('admin', 'customer');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "ProductTypeEnum" AS ENUM ('READY', 'CUSTOM');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "OrderStatusEnum" AS ENUM (
    'OnayBekleniyor', 'Uretimde', 'Processing', 'Shipped',
    'Delivered', 'ReturnProcessing', 'ReturnCompleted',
    'Cancelled', 'RefundProcessing', 'RefundCompleted', 'Denied'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "PaymentStatusEnum" AS ENUM ('Processing', 'Paid', 'Failed', 'Denied');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "BlogStatusEnum" AS ENUM ('draft', 'published');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ════════════════════════════════════════════════════════════════
-- 2. TABLOLAR
-- ════════════════════════════════════════════════════════════════

-- Profile
CREATE TABLE IF NOT EXISTS "Profile" (
  "id"        TEXT        NOT NULL PRIMARY KEY,
  "email"     TEXT        NOT NULL UNIQUE,
  "role"      "RoleEnum"  NOT NULL DEFAULT 'customer',
  "name"      TEXT,
  "phone"     TEXT        UNIQUE,
  "avatar"    TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- SiteSettings
CREATE TABLE IF NOT EXISTS "SiteSettings" (
  "id"                   INTEGER     NOT NULL PRIMARY KEY DEFAULT 1,
  "brand_name"           TEXT        NOT NULL DEFAULT 'xForgea3D',
  "slogan"               TEXT        NOT NULL DEFAULT 'Tasarım. Hassasiyet. xForgea3D.',
  "contact_email"        TEXT,
  "contact_phone"        TEXT,
  "whatsapp"             TEXT,
  "address_text"         TEXT,
  "instagram_url"        TEXT,
  "tiktok_url"           TEXT,
  "youtube_url"          TEXT,
  "maintenance_enabled"  BOOLEAN     NOT NULL DEFAULT FALSE,
  "maintenance_message"  TEXT        DEFAULT 'Bakım çalışmaları devam ediyor. Lütfen daha sonra tekrar deneyin.',
  "updatedAt"            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Varsayılan site ayarları satırı (id=1)
INSERT INTO "SiteSettings" ("id", "brand_name", "slogan", "updatedAt")
VALUES (1, 'xForgea3D', 'Tasarım. Hassasiyet. xForgea3D.', NOW())
ON CONFLICT ("id") DO NOTHING;

-- Cart
CREATE TABLE IF NOT EXISTS "Cart" (
  "userId"    TEXT        NOT NULL PRIMARY KEY,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Profile"("id") ON DELETE CASCADE
);

-- Author
CREATE TABLE IF NOT EXISTS "Author" (
  "id"        TEXT        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "email"     TEXT        NOT NULL UNIQUE,
  "phone"     TEXT        UNIQUE,
  "name"      TEXT,
  "avatar"    TEXT,
  "OTP"       TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Brand
CREATE TABLE IF NOT EXISTS "Brand" (
  "id"          TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "title"       TEXT NOT NULL UNIQUE,
  "description" TEXT,
  "logo"        TEXT
);

-- Category
CREATE TABLE IF NOT EXISTS "Category" (
  "id"          TEXT        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "title"       TEXT        NOT NULL UNIQUE,
  "description" TEXT,
  "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- PaymentProvider
CREATE TABLE IF NOT EXISTS "PaymentProvider" (
  "id"          TEXT    NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "title"       TEXT    NOT NULL UNIQUE,
  "description" TEXT,
  "websiteUrl"  TEXT,
  "isActive"    BOOLEAN NOT NULL DEFAULT FALSE
);

-- DiscountCode
CREATE TABLE IF NOT EXISTS "DiscountCode" (
  "id"                TEXT        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "code"              TEXT        NOT NULL UNIQUE,
  "stock"             INTEGER     NOT NULL DEFAULT 1,
  "description"       TEXT,
  "percent"           INTEGER     NOT NULL,
  "maxDiscountAmount" DOUBLE PRECISION NOT NULL DEFAULT 1,
  "startDate"         TIMESTAMPTZ NOT NULL,
  "endDate"           TIMESTAMPTZ NOT NULL,
  "createdAt"         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Product
CREATE TABLE IF NOT EXISTS "Product" (
  "id"            TEXT                NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "title"         TEXT                NOT NULL,
  "description"   TEXT,
  "images"        TEXT[]              NOT NULL DEFAULT '{}',
  "keywords"      TEXT[]              NOT NULL DEFAULT '{}',
  "metadata"      JSONB,
  "productType"   "ProductTypeEnum"   NOT NULL DEFAULT 'READY',
  "customOptions" JSONB,
  "price"         DOUBLE PRECISION    NOT NULL DEFAULT 100,
  "discount"      DOUBLE PRECISION    NOT NULL DEFAULT 0,
  "stock"         INTEGER             NOT NULL DEFAULT 0,
  "isPhysical"    BOOLEAN             NOT NULL DEFAULT TRUE,
  "isAvailable"   BOOLEAN             NOT NULL DEFAULT FALSE,
  "isFeatured"    BOOLEAN             NOT NULL DEFAULT FALSE,
  "brandId"       TEXT                NOT NULL,
  "createdAt"     TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
  "updatedAt"     TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
  CONSTRAINT "Product_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE RESTRICT
);
CREATE INDEX IF NOT EXISTS "Product_brandId_idx" ON "Product"("brandId");

-- Banner
CREATE TABLE IF NOT EXISTS "Banner" (
  "id"        TEXT        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "label"     TEXT        NOT NULL,
  "image"     TEXT        NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- CartItem
CREATE TABLE IF NOT EXISTS "CartItem" (
  "id"             TEXT    NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "cartId"         TEXT    NOT NULL,
  "productId"      TEXT    NOT NULL,
  "count"          INTEGER NOT NULL,
  "isCustom"       BOOLEAN NOT NULL DEFAULT FALSE,
  "customSnapshot" JSONB,
  CONSTRAINT "CartItem_cartId_fkey"    FOREIGN KEY ("cartId")    REFERENCES "Cart"("userId")    ON DELETE CASCADE,
  CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id")     ON DELETE RESTRICT
);
CREATE INDEX IF NOT EXISTS "CartItem_cartId_idx"    ON "CartItem"("cartId");
CREATE INDEX IF NOT EXISTS "CartItem_productId_idx" ON "CartItem"("productId");

-- Address
CREATE TABLE IF NOT EXISTS "Address" (
  "id"         TEXT        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "country"    TEXT        NOT NULL DEFAULT 'IRI',
  "address"    TEXT        NOT NULL,
  "city"       TEXT        NOT NULL,
  "phone"      TEXT        NOT NULL,
  "postalCode" TEXT        NOT NULL,
  "userId"     TEXT        NOT NULL,
  "createdAt"  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Profile"("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "Address_userId_idx" ON "Address"("userId");

-- Order
CREATE TABLE IF NOT EXISTS "Order" (
  "id"             TEXT               NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "number"         SERIAL             UNIQUE,
  "status"         "OrderStatusEnum"  NOT NULL,
  "total"          DOUBLE PRECISION   NOT NULL DEFAULT 100,
  "shipping"       DOUBLE PRECISION   NOT NULL DEFAULT 100,
  "payable"        DOUBLE PRECISION   NOT NULL DEFAULT 100,
  "tax"            DOUBLE PRECISION   NOT NULL DEFAULT 100,
  "discount"       DOUBLE PRECISION   NOT NULL DEFAULT 0,
  "isPaid"         BOOLEAN            NOT NULL DEFAULT FALSE,
  "isCompleted"    BOOLEAN            NOT NULL DEFAULT FALSE,
  "discountCodeId" TEXT,
  "addressId"      TEXT,
  "userId"         TEXT               NOT NULL,
  "createdAt"      TIMESTAMPTZ        NOT NULL DEFAULT NOW(),
  "updatedAt"      TIMESTAMPTZ        NOT NULL DEFAULT NOW(),
  CONSTRAINT "Order_discountCodeId_fkey" FOREIGN KEY ("discountCodeId") REFERENCES "DiscountCode"("id") ON DELETE SET NULL,
  CONSTRAINT "Order_addressId_fkey"      FOREIGN KEY ("addressId")      REFERENCES "Address"("id")      ON DELETE SET NULL,
  CONSTRAINT "Order_userId_fkey"         FOREIGN KEY ("userId")         REFERENCES "Profile"("id")      ON DELETE RESTRICT
);
CREATE INDEX IF NOT EXISTS "Order_userId_idx"         ON "Order"("userId");
CREATE INDEX IF NOT EXISTS "Order_addressId_idx"      ON "Order"("addressId");
CREATE INDEX IF NOT EXISTS "Order_discountCodeId_idx" ON "Order"("discountCodeId");

-- OrderItem
CREATE TABLE IF NOT EXISTS "OrderItem" (
  "id"             TEXT             NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "orderId"        TEXT             NOT NULL,
  "productId"      TEXT             NOT NULL,
  "count"          INTEGER          NOT NULL,
  "price"          DOUBLE PRECISION NOT NULL,
  "discount"       DOUBLE PRECISION NOT NULL,
  "isCustom"       BOOLEAN          NOT NULL DEFAULT FALSE,
  "customSnapshot" JSONB,
  CONSTRAINT "OrderItem_orderId_fkey"   FOREIGN KEY ("orderId")   REFERENCES "Order"("id")   ON DELETE CASCADE,
  CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT
);
CREATE INDEX IF NOT EXISTS "OrderItem_orderId_idx"   ON "OrderItem"("orderId");
CREATE INDEX IF NOT EXISTS "OrderItem_productId_idx" ON "OrderItem"("productId");

-- Refund
CREATE TABLE IF NOT EXISTS "Refund" (
  "id"        TEXT             NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "amount"    DOUBLE PRECISION NOT NULL,
  "reason"    TEXT             NOT NULL,
  "orderId"   TEXT             NOT NULL UNIQUE,
  "createdAt" TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
  CONSTRAINT "Refund_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "Refund_orderId_idx" ON "Refund"("orderId");

-- Payment
CREATE TABLE IF NOT EXISTS "Payment" (
  "id"           TEXT                 NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "number"       SERIAL               UNIQUE,
  "status"       "PaymentStatusEnum"  NOT NULL,
  "refId"        TEXT                 NOT NULL UNIQUE,
  "cardPan"      TEXT,
  "cardHash"     TEXT,
  "fee"          DOUBLE PRECISION,
  "isSuccessful" BOOLEAN              NOT NULL DEFAULT FALSE,
  "payable"      DOUBLE PRECISION     NOT NULL,
  "providerId"   TEXT                 NOT NULL,
  "userId"       TEXT                 NOT NULL,
  "orderId"      TEXT                 NOT NULL,
  "createdAt"    TIMESTAMPTZ          NOT NULL DEFAULT NOW(),
  "updatedAt"    TIMESTAMPTZ          NOT NULL DEFAULT NOW(),
  CONSTRAINT "Payment_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "PaymentProvider"("id") ON DELETE RESTRICT,
  CONSTRAINT "Payment_userId_fkey"     FOREIGN KEY ("userId")     REFERENCES "Profile"("id")         ON DELETE RESTRICT,
  CONSTRAINT "Payment_orderId_fkey"    FOREIGN KEY ("orderId")    REFERENCES "Order"("id")            ON DELETE RESTRICT
);
CREATE INDEX IF NOT EXISTS "Payment_userId_idx"     ON "Payment"("userId");
CREATE INDEX IF NOT EXISTS "Payment_providerId_idx" ON "Payment"("providerId");
CREATE INDEX IF NOT EXISTS "Payment_orderId_idx"    ON "Payment"("orderId");

-- Notification
CREATE TABLE IF NOT EXISTS "Notification" (
  "id"        TEXT        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "content"   TEXT        NOT NULL,
  "isRead"    BOOLEAN     NOT NULL DEFAULT FALSE,
  "userId"    TEXT        NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Profile"("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "Notification_userId_idx" ON "Notification"("userId");

-- Error
CREATE TABLE IF NOT EXISTS "Error" (
  "id"        TEXT        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "error"     TEXT        NOT NULL,
  "userId"    TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "Error_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Profile"("id") ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS "Error_userId_idx" ON "Error"("userId");

-- File
CREATE TABLE IF NOT EXISTS "File" (
  "id"        TEXT        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "url"       TEXT        NOT NULL,
  "userId"    TEXT        NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "File_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Profile"("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "File_userId_idx" ON "File"("userId");

-- ProductReview
CREATE TABLE IF NOT EXISTS "ProductReview" (
  "id"        TEXT        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "text"      TEXT        NOT NULL,
  "rating"    INTEGER     NOT NULL,
  "productId" TEXT        NOT NULL,
  "userId"    TEXT        NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "ProductReview_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE,
  CONSTRAINT "ProductReview_userId_fkey"    FOREIGN KEY ("userId")    REFERENCES "Profile"("id") ON DELETE CASCADE,
  CONSTRAINT "UniqueProductProductReview"   UNIQUE ("productId", "userId")
);
CREATE INDEX IF NOT EXISTS "ProductReview_userId_idx"    ON "ProductReview"("userId");
CREATE INDEX IF NOT EXISTS "ProductReview_productId_idx" ON "ProductReview"("productId");

-- Blog (legacy)
CREATE TABLE IF NOT EXISTS "Blog" (
  "slug"        TEXT        NOT NULL PRIMARY KEY,
  "title"       TEXT        NOT NULL,
  "image"       TEXT        NOT NULL,
  "description" TEXT        NOT NULL,
  "content"     TEXT,
  "categories"  TEXT[]      NOT NULL DEFAULT '{}',
  "keywords"    TEXT[]      NOT NULL DEFAULT '{}',
  "authorId"    TEXT        NOT NULL,
  "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "Blog_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE RESTRICT
);
CREATE INDEX IF NOT EXISTS "Blog_authorId_idx" ON "Blog"("authorId");

-- ── Ara tablolar (Many-to-Many) ──────────────────────────────────

-- Product ↔ Category
CREATE TABLE IF NOT EXISTS "_CategoryToProduct" (
  "A" TEXT NOT NULL,
  "B" TEXT NOT NULL,
  CONSTRAINT "_CategoryToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE,
  CONSTRAINT "_CategoryToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id")  ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "_CategoryToProduct_AB_unique" ON "_CategoryToProduct"("A","B");
CREATE INDEX IF NOT EXISTS "_CategoryToProduct_B_idx" ON "_CategoryToProduct"("B");

-- Profile ↔ Product (Wishlist)
CREATE TABLE IF NOT EXISTS "_Wishlist" (
  "A" TEXT NOT NULL,
  "B" TEXT NOT NULL,
  CONSTRAINT "_Wishlist_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE,
  CONSTRAINT "_Wishlist_B_fkey" FOREIGN KEY ("B") REFERENCES "Profile"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "_Wishlist_AB_unique" ON "_Wishlist"("A","B");
CREATE INDEX IF NOT EXISTS "_Wishlist_B_idx" ON "_Wishlist"("B");

-- Banner ↔ Category
CREATE TABLE IF NOT EXISTS "_BannerToCategory" (
  "A" TEXT NOT NULL,
  "B" TEXT NOT NULL,
  CONSTRAINT "_BannerToCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "Banner"("id")   ON DELETE CASCADE,
  CONSTRAINT "_BannerToCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "Category"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "_BannerToCategory_AB_unique" ON "_BannerToCategory"("A","B");
CREATE INDEX IF NOT EXISTS "_BannerToCategory_B_idx" ON "_BannerToCategory"("B");

-- ── CMS Modelleri ───────────────────────────────────────────────

-- ContentPage
CREATE TABLE IF NOT EXISTS "ContentPage" (
  "id"                 TEXT        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "slug"               TEXT        NOT NULL UNIQUE,
  "title_tr"           TEXT        NOT NULL,
  "body_html_tr"       TEXT,
  "is_published"       BOOLEAN     NOT NULL DEFAULT FALSE,
  "seo_title_tr"       TEXT,
  "seo_description_tr" TEXT,
  "updatedAt"          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- HomepageSection
CREATE TABLE IF NOT EXISTS "HomepageSection" (
  "id"           TEXT        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "key"          TEXT        NOT NULL UNIQUE,
  "title_tr"     TEXT        NOT NULL,
  "content_json" JSONB,
  "is_enabled"   BOOLEAN     NOT NULL DEFAULT TRUE,
  "sort_order"   INTEGER     NOT NULL DEFAULT 0,
  "updatedAt"    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- BlogPost (CMS)
CREATE TABLE IF NOT EXISTS "BlogPost" (
  "id"                 TEXT             NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "slug"               TEXT             NOT NULL UNIQUE,
  "title_tr"           TEXT             NOT NULL,
  "excerpt_tr"         TEXT,
  "body_html_tr"       TEXT,
  "cover_image_url"    TEXT,
  "tags"               TEXT[]           NOT NULL DEFAULT '{}',
  "status"             "BlogStatusEnum" NOT NULL DEFAULT 'draft',
  "published_at"       TIMESTAMPTZ,
  "seo_title_tr"       TEXT,
  "seo_description_tr" TEXT,
  "updatedAt"          TIMESTAMPTZ      NOT NULL DEFAULT NOW()
);

-- SeoSettings
CREATE TABLE IF NOT EXISTS "SeoSettings" (
  "id"                          INTEGER     NOT NULL PRIMARY KEY DEFAULT 1,
  "default_title_template_tr"   TEXT        NOT NULL DEFAULT '%s | xForgea3D',
  "default_meta_description_tr" TEXT,
  "default_og_image_url"        TEXT,
  "robots_index"                BOOLEAN     NOT NULL DEFAULT TRUE,
  "robots_follow"               BOOLEAN     NOT NULL DEFAULT TRUE,
  "updatedAt"                   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO "SeoSettings" ("id","updatedAt")
VALUES (1, NOW())
ON CONFLICT ("id") DO NOTHING;

-- ════════════════════════════════════════════════════════════════
-- 3. updatedAt OTOMATİK GÜNCELLEME FONKSİYONU
-- ════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger'ları kur (zaten varsa yenile)
DO $$ DECLARE t text;
BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'Profile','Cart','SiteSettings','Order','Payment','Notification',
    'ProductReview','Refund','Blog','ContentPage','HomepageSection','BlogPost','SeoSettings','Product','Category','Author','Banner'
  ]) LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS set_updated_at ON "%s"', t);
    EXECUTE format('CREATE TRIGGER set_updated_at BEFORE UPDATE ON "%s" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()', t);
  END LOOP;
END $$;

-- ════════════════════════════════════════════════════════════════
-- 4. PROFILE TRIGGER (auth.users → Profile otomatik)
-- ════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public."Profile" (id, email, name, role, "createdAt", "updatedAt")
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    'customer',
    now(),
    now()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ════════════════════════════════════════════════════════════════
-- 5. STORAGE BUCKET: ecommerce
-- ════════════════════════════════════════════════════════════════

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'ecommerce', 'ecommerce', true, 5242880,
  ARRAY['image/jpeg','image/png','image/webp','image/gif','image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage RLS
DROP POLICY IF EXISTS "Public read access"             ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own files"     ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own files"     ON storage.objects;

CREATE POLICY "Public read access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'ecommerce');

CREATE POLICY "Authenticated users can upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'ecommerce' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update own files"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'ecommerce' AND auth.uid() = owner);

CREATE POLICY "Users can delete own files"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'ecommerce' AND auth.uid() = owner);

-- ════════════════════════════════════════════════════════════════
-- 6. RLS POLİTİKALARI: Profile tablosu
-- ════════════════════════════════════════════════════════════════

ALTER TABLE public."Profile" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Profiles are publicly readable"  ON public."Profile";
DROP POLICY IF EXISTS "Users can update own profile"    ON public."Profile";
DROP POLICY IF EXISTS "Service role can insert profiles" ON public."Profile";

CREATE POLICY "Profiles are publicly readable"
  ON public."Profile" FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON public."Profile" FOR UPDATE
  USING (auth.uid()::text = id);

CREATE POLICY "Service role can insert profiles"
  ON public."Profile" FOR INSERT WITH CHECK (true);

-- ════════════════════════════════════════════════════════════════
SELECT 'xForgea3D veritabanı kurulumu tamamlandı ✅' AS status;
