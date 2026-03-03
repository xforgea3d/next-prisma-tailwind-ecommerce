/**
 * xForgea3D - DB Update Script
 * Updates image URLs for categories, products, car brands, car models
 * Creates new "Araç Aksesuarları" category and 10 car part products
 *
 * Run: cd apps/storefront && node ../../seed-update.js
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ── Category image mapping ──────────────────────────────────────────────────
const categoryImages = {
   'Figürler': 'https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?auto=format&fit=crop&q=80&w=800&h=600',
   'Heykeller': 'https://images.unsplash.com/photo-1544413660-299165566b1d?auto=format&fit=crop&q=80&w=800&h=600',
   'Dekoratif': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800&h=600',
   'Aksesuarlar': 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&q=80&w=800&h=600',
};

// ── Product image mapping (curated, relevant photos) ────────────────────────
const productImages = {
   'Elden Ring': [
      'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1594652634010-275456c808d0?auto=format&fit=crop&q=80&w=800',
   ],
   'Zelda': [
      'https://images.unsplash.com/photo-1555169062-013468b47731?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=800',
   ],
   'Apollo': [
      'https://images.unsplash.com/photo-1620078877543-176c4e09ad7b?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1582531023778-95a2dd78b277?auto=format&fit=crop&q=80&w=800',
   ],
   'Düşünen': [
      'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&q=80&w=800',
   ],
   'Kurt': [
      'https://images.unsplash.com/photo-1534360673418-490b4d44087b?auto=format&fit=crop&q=80&w=800',
   ],
   'Astronot': [
      'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=800',
   ],
};

// ── Car brand logo mapping (Unsplash car brand photos) ──────────────────────
const brandLogos = {
   'bmw': 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=200&h=200',
   'mercedes-benz': 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=200&h=200',
   'audi': 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&q=80&w=200&h=200',
   'volkswagen': 'https://images.unsplash.com/photo-1622353219448-46a009f0d44f?auto=format&fit=crop&q=80&w=200&h=200',
   'toyota': 'https://images.unsplash.com/photo-1621993202323-f438eec934ff?auto=format&fit=crop&q=80&w=200&h=200',
   'honda': 'https://images.unsplash.com/photo-1618843479619-f3d0d81e4d10?auto=format&fit=crop&q=80&w=200&h=200',
   'hyundai': 'https://images.unsplash.com/photo-1629897048514-3dd7414fe72a?auto=format&fit=crop&q=80&w=200&h=200',
   'renault': 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&q=80&w=200&h=200',
   'fiat': 'https://images.unsplash.com/photo-1595787142293-e6b4f30e31d5?auto=format&fit=crop&q=80&w=200&h=200',
   'ford': 'https://images.unsplash.com/photo-1612825173281-9a193378527e?auto=format&fit=crop&q=80&w=200&h=200',
};

// ── Car model image mapping ─────────────────────────────────────────────────
const modelImages = {
   '3-serisi': 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=400&h=250',
   '5-serisi': 'https://images.unsplash.com/photo-1523983388277-336a66bf9bcd?auto=format&fit=crop&q=80&w=400&h=250',
   'x3': 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&q=80&w=400&h=250',
   'x5': 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=400&h=250',
   'm4': 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?auto=format&fit=crop&q=80&w=400&h=250',
   'c-serisi': 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=400&h=250',
   'e-serisi': 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=400&h=250',
   'a-serisi': 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&q=80&w=400&h=250',
   'glc': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=400&h=250',
   'a3': 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=400&h=250',
   'a4': 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&q=80&w=400&h=250',
   'a6': 'https://images.unsplash.com/photo-1610768764270-790fbec18178?auto=format&fit=crop&q=80&w=400&h=250',
   'q5': 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&q=80&w=400&h=250',
   'golf': 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=400&h=250',
   'passat': 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=400&h=250',
   'tiguan': 'https://images.unsplash.com/photo-1622353219448-46a009f0d44f?auto=format&fit=crop&q=80&w=400&h=250',
   'polo': 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&q=80&w=400&h=250',
   'corolla': 'https://images.unsplash.com/photo-1621993202323-f438eec934ff?auto=format&fit=crop&q=80&w=400&h=250',
   'c-hr': 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&q=80&w=400&h=250',
   'rav4': 'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?auto=format&fit=crop&q=80&w=400&h=250',
   'civic': 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=400&h=250',
   'cr-v': 'https://images.unsplash.com/photo-1618843479619-f3d0d81e4d10?auto=format&fit=crop&q=80&w=400&h=250',
   'jazz': 'https://images.unsplash.com/photo-1583267746897-2cf415887172?auto=format&fit=crop&q=80&w=400&h=250',
   'tucson': 'https://images.unsplash.com/photo-1629897048514-3dd7414fe72a?auto=format&fit=crop&q=80&w=400&h=250',
   'i20': 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=400&h=250',
   'kona': 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&q=80&w=400&h=250',
   'bayon': 'https://images.unsplash.com/photo-1612825173281-9a193378527e?auto=format&fit=crop&q=80&w=400&h=250',
   'clio': 'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?auto=format&fit=crop&q=80&w=400&h=250',
   'megane': 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=400&h=250',
   'kadjar': 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&q=80&w=400&h=250',
   'egea': 'https://images.unsplash.com/photo-1595787142293-e6b4f30e31d5?auto=format&fit=crop&q=80&w=400&h=250',
   '500': 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&q=80&w=400&h=250',
   'tipo': 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=400&h=250',
   'focus': 'https://images.unsplash.com/photo-1612825173281-9a193378527e?auto=format&fit=crop&q=80&w=400&h=250',
   'kuga': 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=400&h=250',
   'puma': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=400&h=250',
   'fiesta': 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=400&h=250',
};

// ── New car part products ───────────────────────────────────────────────────
const carParts = [
   {
      title: 'Araç İçi Telefon Tutucu (3D Baskı)',
      description: 'Havalandırma kanalına klipsle takılan, minimalist tasarım araç telefon tutucu. Mat siyah PLA, turuncu aksan detay.',
      price: 189.0,
      discount: 149.0,
      stock: 30,
      images: [
         'https://images.unsplash.com/photo-1600861194942-f883de0dfe96?auto=format&fit=crop&q=80&w=800',
         'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&q=80&w=800',
      ],
      keywords: ['telefon tutucu', 'araç aksesuar', '3d baskı', 'havalandırma'],
      metadata: { malzeme: 'PLA+', renk: 'Mat Siyah / Turuncu', uyumluluk: 'Universal' },
      forModels: ['golf', 'corolla', 'civic'],
   },
   {
      title: 'Araç Bardaklık Adaptörü',
      description: 'Standart bardaklığa oturan, farklı bardak boyutlarına uyum sağlayan 3D baskı adaptör.',
      price: 129.0,
      stock: 45,
      images: [
         'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&q=80&w=800',
      ],
      keywords: ['bardaklık', 'adaptör', 'araç aksesuar', '3d baskı'],
      metadata: { malzeme: 'PETG', renk: 'Gri', ic_cap: '6-9cm' },
      forModels: ['q5', 'tiguan', 'tucson'],
   },
   {
      title: 'Anahtar Kumanda Koruyucu Kılıf',
      description: 'Araç anahtarı için 3D baskı koruyucu kılıf. Karbon fiber doku efekti.',
      price: 99.0,
      discount: 79.0,
      stock: 60,
      images: [
         'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&q=80&w=800',
      ],
      keywords: ['anahtar kılıf', 'key fob', 'araç aksesuar', '3d baskı'],
      metadata: { malzeme: 'PLA+', renk: 'Karbon Siyah', uyumluluk: 'Universal' },
      forModels: ['3-serisi', 'c-serisi', 'a4'],
   },
   {
      title: 'Havalandırma Koku Difüzörü',
      description: 'Geometrik petek tasarımlı, havalandırma kanalına takılan koku yayıcı klips. İçine pamuk veya koku tableti konur.',
      price: 69.0,
      stock: 80,
      images: [
         'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&q=80&w=800',
      ],
      keywords: ['koku difüzör', 'havalandırma', 'araç aksesuar', '3d baskı'],
      metadata: { malzeme: 'PLA', renk: 'Mat Beyaz', tasarim: 'Petek Geometrik' },
      forModels: ['clio', 'egea', 'focus'],
   },
   {
      title: 'Torpido Üstü Organizer',
      description: 'Torpido üzerine oturan, gözlük, bozuk para ve küçük eşyalar için bölmeli organizer.',
      price: 159.0,
      discount: 129.0,
      stock: 25,
      images: [
         'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&q=80&w=800',
         'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800',
      ],
      keywords: ['torpido organizer', 'araç düzenleyici', '3d baskı'],
      metadata: { malzeme: 'PLA+', renk: 'Mat Siyah', bolme_sayisi: '3' },
      forModels: ['passat', 'e-serisi', 'a6'],
   },
   {
      title: 'Özel Vites Topuzu Kapağı',
      description: 'Sportif tasarım vites topuzu kapağı. Turuncu yarış şeridi detay. Manuel vites araçlar için.',
      price: 219.0,
      stock: 15,
      images: [
         'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800',
      ],
      keywords: ['vites topuzu', 'shift knob', 'araç aksesuar', '3d baskı', 'sportif'],
      metadata: { malzeme: 'Reçine', renk: 'Metalik Gri / Turuncu', tip: 'Manuel Vites' },
      forModels: ['m4', 'civic', 'focus'],
   },
   {
      title: '3D Baskı Araç Amblem Seti',
      description: 'Krom görünümlü özel tasarım araç amblemi. Yapışkanlı montaj, araç arkası veya yanları için.',
      price: 149.0,
      discount: 119.0,
      stock: 40,
      images: [
         'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=800',
      ],
      keywords: ['amblem', 'badge', 'araç aksesuar', '3d baskı', 'krom'],
      metadata: { malzeme: 'Reçine + Krom Kaplama', boyut: '8x3cm', montaj: 'Yapışkanlı' },
      forModels: ['x3', 'glc', 'kona'],
   },
   {
      title: 'Araç Şarj Kablosu Klipsi (3\'lü Set)',
      description: 'Torpido ve konsola yapışan, şarj kablolarını düzenli tutan klips seti. 3 adet.',
      price: 49.0,
      stock: 100,
      images: [
         'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&q=80&w=800',
      ],
      keywords: ['kablo klips', 'kablo tutucu', 'araç aksesuar', '3d baskı'],
      metadata: { malzeme: 'TPU Esnek', renk: 'Siyah', adet: '3' },
      forModels: ['polo', 'i20', 'bayon'],
   },
   {
      title: 'Özel Plakalık Çerçevesi',
      description: 'Geometrik desenli, ince profilli 3D baskı plakalık çerçevesi. TR plaka boyutuna uygun.',
      price: 179.0,
      discount: 149.0,
      stock: 35,
      images: [
         'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800',
      ],
      keywords: ['plakalık', 'çerçeve', 'araç aksesuar', '3d baskı'],
      metadata: { malzeme: 'ASA (UV Dayanıklı)', renk: 'Mat Siyah', boyut: '52x11cm' },
      forModels: ['5-serisi', 'rav4', 'kuga'],
   },
   {
      title: 'Ayna Kapağı Dekoratif Trim',
      description: 'Yan ayna üzerine takılan karbon fiber efektli dekoratif trim kapakları. Çift taraflı bant montaj.',
      price: 249.0,
      stock: 20,
      images: [
         'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?auto=format&fit=crop&q=80&w=800',
      ],
      keywords: ['ayna kapağı', 'mirror cover', 'araç aksesuar', '3d baskı', 'karbon'],
      metadata: { malzeme: 'PLA + Karbon Fiber Doku', renk: 'Karbon Siyah', montaj: 'Çift Taraflı Bant' },
      forModels: ['x5', 'a-serisi', 'c-hr'],
   },
];

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
   console.log('\n=== xForgea3D Database Update ===\n');

   // 1. Update category images
   console.log('1. Kategori görselleri güncelleniyor...');
   for (const [title, imageUrl] of Object.entries(categoryImages)) {
      const cat = await prisma.category.findFirst({ where: { title } });
      if (cat) {
         await prisma.category.update({ where: { id: cat.id }, data: { imageUrl } });
         console.log(`   OK: ${title}`);
      } else {
         console.log(`   SKIP: "${title}" bulunamadı`);
      }
   }

   // Create "Araç Aksesuarları" category
   const aracCat = await prisma.category.upsert({
      where: { title: 'Araç Aksesuarları' },
      update: {
         imageUrl: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=800&h=600',
         description: '3D baskı özel araç aksesuarları ve iç mekan parçaları',
      },
      create: {
         title: 'Araç Aksesuarları',
         description: '3D baskı özel araç aksesuarları ve iç mekan parçaları',
         imageUrl: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=800&h=600',
      },
   });
   console.log(`   OK: Araç Aksesuarları (created/updated)`);

   // 2. Update product images (existing products)
   console.log('\n2. Ürün görselleri güncelleniyor...');
   const allProducts = await prisma.product.findMany({ select: { id: true, title: true } });
   for (const [keyword, images] of Object.entries(productImages)) {
      const prod = allProducts.find(p => p.title.includes(keyword));
      if (prod) {
         await prisma.product.update({ where: { id: prod.id }, data: { images } });
         console.log(`   OK: ${prod.title}`);
      } else {
         console.log(`   SKIP: "${keyword}" bulunamadı`);
      }
   }

   // 3. Update car brand logos
   console.log('\n3. Araç marka logoları güncelleniyor...');
   for (const [slug, logoUrl] of Object.entries(brandLogos)) {
      const brand = await prisma.carBrand.findUnique({ where: { slug } });
      if (brand) {
         await prisma.carBrand.update({ where: { id: brand.id }, data: { logoUrl } });
         console.log(`   OK: ${brand.name}`);
      } else {
         console.log(`   SKIP: "${slug}" bulunamadı`);
      }
   }

   // 4. Update car model images
   console.log('\n4. Araç model görselleri güncelleniyor...');
   const allModels = await prisma.carModel.findMany({ select: { id: true, slug: true, name: true } });
   let modelUpdated = 0;
   for (const [slug, imageUrl] of Object.entries(modelImages)) {
      const model = allModels.find(m => m.slug === slug);
      if (model) {
         await prisma.carModel.update({ where: { id: model.id }, data: { imageUrl } });
         modelUpdated++;
      }
   }
   console.log(`   OK: ${modelUpdated}/${allModels.length} model güncellendi`);

   // 5. Get or create xForge brand for car parts
   console.log('\n5. Araç aksesuarı ürünleri oluşturuluyor...');
   let xforgeBrand = await prisma.brand.findFirst({ where: { title: { contains: 'xForge', mode: 'insensitive' } } });
   if (!xforgeBrand) {
      xforgeBrand = await prisma.brand.create({
         data: { title: 'xForge 3D', description: 'Premium kalite 3D baskı tasarımlarımız' },
      });
   }

   let partsCreated = 0;
   for (const part of carParts) {
      // Find car models to link
      const modelConnections = [];
      for (const modelSlug of part.forModels) {
         const model = allModels.find(m => m.slug === modelSlug);
         if (model) modelConnections.push({ id: model.id });
      }

      // Check if product already exists
      const existing = await prisma.product.findFirst({ where: { title: part.title } });
      if (existing) {
         // Update images if already exists
         await prisma.product.update({
            where: { id: existing.id },
            data: { images: part.images },
         });
         console.log(`   UPDATE: ${part.title}`);
         continue;
      }

      await prisma.product.create({
         data: {
            title: part.title,
            description: part.description,
            price: part.price,
            discount: part.discount || 0,
            stock: part.stock,
            isAvailable: true,
            isFeatured: part.discount ? true : false,
            isPhysical: true,
            images: part.images,
            keywords: part.keywords,
            metadata: part.metadata,
            brandId: xforgeBrand.id,
            categories: { connect: [{ id: aracCat.id }] },
            carModels: modelConnections.length > 0
               ? { connect: modelConnections }
               : undefined,
         },
      });
      partsCreated++;
      console.log(`   CREATE: ${part.title} (${modelConnections.length} model)`);
   }

   console.log(`\n   ${partsCreated} yeni ürün oluşturuldu`);

   // Summary
   const totalProducts = await prisma.product.count({ where: { id: { not: 'quote-request-product' } } });
   const totalBrands = await prisma.carBrand.count();
   const totalModels = await prisma.carModel.count();
   const totalCategories = await prisma.category.count();
   console.log(`\n=== Tamamlandı! ===`);
   console.log(`${totalProducts} ürün | ${totalCategories} kategori | ${totalBrands} araç markası | ${totalModels} model`);
}

main()
   .then(() => prisma.$disconnect())
   .catch(async (e) => {
      console.error('HATA:', e);
      await prisma.$disconnect();
      process.exit(1);
   });
