-- Clear existing data (optional, but good for fresh seed)
DELETE FROM public."_CategoryToProduct";
DELETE FROM public."Product";
DELETE FROM public."Category";
DELETE FROM public."Brand";

-- Insert Brands
INSERT INTO public."Brand" (id, title, description, logo) VALUES
('brand_xforge', 'xForge 3D', 'Premium kalite 3D baskı tasarımlarımız', '/seed/brand_xforge.png'),
('brand_nintendo', 'Nintendo', 'Oyun dünyasının efsanevi karakterleri', '/seed/brand_nintendo.png');

-- Insert Categories
INSERT INTO public."Category" (id, title, description, "updatedAt") VALUES
('cat_figurler', 'Figürler', 'Oyun, anime ve fantezi karakterlerinin 3D figürleri', now()),
('cat_heykeller', 'Heykeller', 'Sanatsal ve dekoratif 3D baskı heykeller', now()),
('cat_dekoratif', 'Dekoratif', 'Ev ve ofis dekorasyonu için benzersiz parçalar', now()),
('cat_aksesuarlar', 'Aksesuarlar', 'Kişisel kullanım ve oyun gereçleri', now());

-- Insert Products
INSERT INTO public."Product" (id, title, description, price, discount, "isFeatured", "isAvailable", stock, metadata, images, keywords, "brandId", "updatedAt") VALUES
('prod_malenia', 'Elden Ring: Malenia Figür (Epik Boyut) ⚔️', 'Demigod Malenia karakterinin efsanevi detaylarla işlenmiş 1/6 ölçekli figürü. Premium reçine baskı.', 9500.0, 8990.0, true, true, 12, '{"malzeme": "Premium Reçine", "yukseklik": "35cm", "boyama": "El Boyaması"}', ARRAY['/seed/prod_malenia.png'], ARRAY['elden ring', 'malenia', 'figür', 'oyun'], 'brand_xforge', now()),

('prod_zelda', 'Zelda Master Sword Replica 🗡️', 'The Legend of Zelda oyun serisinden Master Sword. Duvara asılabilir, tam boyutlu cosplay ve dekoratif parça.', 6200.0, 5900.0, true, true, 5, '{"malzeme": "PLA Plus", "uzunluk": "100cm"}', ARRAY['/seed/prod_zelda.png'], ARRAY['zelda', 'Nintendo', 'kılıç', 'cosplay'], 'brand_nintendo', now()),

('prod_apollo', 'Antik Yunan Büstü: Apollo 🏛️', 'Klasik antik Yunan döneminden ilham alan sanat eseri. Ofis masanız veya kütüphaneniz için mükemmel bir heykel.', 4800.0, 4200.0, false, true, 22, '{"malzeme": "Mermer Efektli PLA", "yukseklik": "20cm"}', ARRAY['/seed/prod_apollo.png'], ARRAY['heykel', 'apollo', 'antik', 'büst'], 'brand_xforge', now()),

('prod_dusunena', 'Düşünen Adam Heykeli 🧠', 'Rodin''in efsanevi eserinin geometrik (low-poly) 3D baskı versiyonu.', 3800.0, 3800.0, false, true, 8, '{"malzeme": "Mat Siyah PLA", "yukseklik": "15cm"}', ARRAY['/seed/prod_dusunena.png'], ARRAY['rodin', 'düşünen adam', 'heykel', 'modern'], 'brand_xforge', now()),

('prod_kurt', 'Geometrik Kurt Duvar Dekoru 🐺', 'Modern tasarımlı, duvara asılabilir geometrik kurt figürü.', 3200.0, 3200.0, true, true, 14, '{"malzeme": "PLA", "en": "30cm", "boy": "40cm"}', ARRAY['/seed/prod_kurt.png'], ARRAY['kurt', 'duvar', 'dekoratif', 'geometrik'], 'brand_xforge', now()),

('prod_astronot', 'Astronot Telefon Tutucu 👨‍🚀', 'Masanızda telefonunuzu tutan sevimli bir astronot figürü.', 3400.0, 3100.0, false, true, 50, '{"malzeme": "Beyaz PLA", "yukseklik": "10cm"}', ARRAY['/seed/prod_astronot.png'], ARRAY['telefon tutucu', 'astronot', 'uzay', 'aksesuar'], 'brand_xforge', now());

-- Map Products to Categories (Relations)
INSERT INTO public."_CategoryToProduct" ("A", "B") VALUES
('cat_figurler', 'prod_malenia'),
('cat_figurler', 'prod_zelda'),
('cat_aksesuarlar', 'prod_zelda'),
('cat_heykeller', 'prod_apollo'),
('cat_dekoratif', 'prod_apollo'),
('cat_heykeller', 'prod_dusunena'),
('cat_dekoratif', 'prod_kurt'),
('cat_aksesuarlar', 'prod_astronot');
