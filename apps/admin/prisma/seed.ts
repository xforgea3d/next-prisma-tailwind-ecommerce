import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
   // Markalar (Brands) oluştur
   const xforgeBrand = await prisma.brand.create({
      data: {
         title: 'xForge 3D',
         description: 'Premium kalite 3D baskı tasarımlarımız',
         logo: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=200&h=200',
      },
   })

   const nintendoBrand = await prisma.brand.create({
      data: {
         title: 'Nintendo',
         description: 'Oyun dünyasının efsanevi karakterleri',
         logo: 'https://images.unsplash.com/photo-1629856515433-2ba9ce9aa23e?auto=format&fit=crop&q=80&w=200&h=200',
      },
   })

   // Kategoriler (Categories) oluştur
   // Navbar ile eşleşmesi için "Figürler", "Heykeller", "Dekoratif" ve "Aksesuarlar" ekleniyor
   const figurlerCat = await prisma.category.create({
      data: {
         title: 'Figürler',
         description: 'Oyun, anime ve fantezi karakterlerinin 3D figürleri',
      },
   })

   const heykellerCat = await prisma.category.create({
      data: {
         title: 'Heykeller',
         description: 'Sanatsal ve dekoratif 3D baskı heykeller',
      },
   })

   const dekoratifCat = await prisma.category.create({
      data: {
         title: 'Dekoratif',
         description: 'Ev ve ofis dekorasyonu için benzersiz parçalar',
      },
   })

   const aksesuarlarCat = await prisma.category.create({
      data: {
         title: 'Aksesuarlar',
         description: 'Kişisel kullanım ve oyun gereçleri',
      },
   })

   // Ürünler (Products) oluştur
   console.log('Ürünler ekleniyor...')

   await prisma.product.create({
      data: {
         title: 'Elden Ring: Malenia Figür (Epik Boyut) ⚔️',
         description: 'Demigod Malenia karakterinin efsanevi detaylarla işlenmiş 1/6 ölçekli figürü. Premium reçine baskı.',
         price: 1850.0,
         discount: 1499.0,
         isFeatured: true,
         isBestseller: true,
         isAvailable: true,
         stock: 12,
         metadata: { "malzeme": "Premium Reçine", "yukseklik": "35cm", "boyama": "El Boyaması" },
         images: [
            'https://res.cloudinary.com/dvjn0gnhd/image/upload/v1740428514/lhm0d6oaj9mxtlyrly89.jpg',
            'https://images.unsplash.com/photo-1621252178000-845f1b1b9e25?auto=format&fit=crop&q=80&w=800'
         ],
         keywords: ['elden ring', 'malenia', 'figür', 'oyun'],
         brandId: xforgeBrand.id,
         categories: {
            connect: [{ id: figurlerCat.id }]
         },
      },
   })

   await prisma.product.create({
      data: {
         title: 'Zelda Master Sword Replica 🗡️',
         description: 'The Legend of Zelda oyun serisinden Master Sword. Duvara asılabilir, tam boyutlu cosplay ve dekoratif parça.',
         price: 1200.0,
         isFeatured: true,
         isAvailable: true,
         stock: 5,
         metadata: { "malzeme": "PLA Plus", "uzunluk": "100cm" },
         images: [
            'https://images.unsplash.com/photo-1555169062-013468b47731?auto=format&fit=crop&q=80&w=800'
         ],
         keywords: ['zelda', 'Nintendo', 'kılıç', 'cosplay'],
         brandId: nintendoBrand.id,
         categories: {
            connect: [{ id: figurlerCat.id }, { id: aksesuarlarCat.id }]
         },
      },
   })

   await prisma.product.create({
      data: {
         title: 'Antik Yunan Büstü: Apollo 🏛️',
         description: 'Klasik antik Yunan döneminden ilham alan sanat eseri. Ofis masanız veya kütüphaneniz için mükemmel bir heykel.',
         price: 650.0,
         discount: 500.0,
         isFeatured: false,
         isBestseller: true,
         isAvailable: true,
         stock: 22,
         metadata: { "malzeme": "Mermer Efektli PLA", "yukseklik": "20cm" },
         images: [
            'https://images.unsplash.com/photo-1620078877543-176c4e09ad7b?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1582531023778-95a2dd78b277?auto=format&fit=crop&q=80&w=800'
         ],
         keywords: ['heykel', 'apollo', 'antik', 'büst'],
         brandId: xforgeBrand.id,
         categories: {
            connect: [{ id: heykellerCat.id }, { id: dekoratifCat.id }]
         },
      },
   })

   await prisma.product.create({
      data: {
         title: 'Düşünen Adam Heykeli 🧠',
         description: 'Rodin\'in efsanevi eserinin geometrik (low-poly) 3D baskı versiyonu.',
         price: 450.0,
         isFeatured: false,
         isAvailable: true,
         stock: 8,
         metadata: { "malzeme": "Mat Siyah PLA", "yukseklik": "15cm" },
         images: [
            'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&q=80&w=800'
         ],
         keywords: ['rodin', 'düşünen adam', 'heykel', 'modern'],
         brandId: xforgeBrand.id,
         categories: {
            connect: [{ id: heykellerCat.id }]
         },
      },
   })

   await prisma.product.create({
      data: {
         title: 'Geometrik Kurt Duvar Dekoru 🐺',
         description: 'Modern tasarımlı, duvara asılabilir geometrik kurt figürü.',
         price: 320.0,
         isFeatured: true,
         isAvailable: true,
         stock: 14,
         metadata: { "malzeme": "PLA", "en": "30cm", "boy": "40cm" },
         images: [
            'https://images.unsplash.com/photo-1534360673418-490b4d44087b?auto=format&fit=crop&q=80&w=800'
         ],
         keywords: ['kurt', 'duvar', 'dekoratif', 'geometrik'],
         brandId: xforgeBrand.id,
         categories: {
            connect: [{ id: dekoratifCat.id }]
         },
      },
   })

   await prisma.product.create({
      data: {
         title: 'Astronot Telefon Tutucu 👨‍🚀',
         description: 'Masanızda telefonunuzu tutan sevimli bir astronot figürü.',
         price: 180.0,
         discount: 150.0,
         isFeatured: false,
         isBestseller: true,
         isAvailable: true,
         stock: 50,
         metadata: { "malzeme": "Beyaz PLA", "yukseklik": "10cm" },
         images: [
            'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&q=80&w=800'
         ],
         keywords: ['telefon tutucu', 'astronot', 'uzay', 'aksesuar'],
         brandId: xforgeBrand.id,
         categories: {
            connect: [{ id: aksesuarlarCat.id }]
         },
      },
   })

   console.log('Seed başarıyla tamamlandı! ✅')
}

main()
   .then(async () => {
      await prisma.$disconnect()
   })
   .catch(async (e) => {
      console.error(e)
      await prisma.$disconnect()
      process.exit(1)
   })
