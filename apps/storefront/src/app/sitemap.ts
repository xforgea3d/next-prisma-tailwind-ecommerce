import prisma from '@/lib/prisma'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
   const baseUrl = 'https://xforgea3d.com'

   const staticRoutes: MetadataRoute.Sitemap = [
      { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
      { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
      { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
   ]

   const pages = await prisma.contentPage.findMany({
      where: { is_published: true },
      select: { slug: true, updatedAt: true },
   })
   const pageRoutes: MetadataRoute.Sitemap = pages.map(p => ({
      url: `${baseUrl}/${p.slug}`, lastModified: p.updatedAt, changeFrequency: 'monthly', priority: 0.5,
   }))

   const posts = await prisma.blogPost.findMany({
      where: { status: 'published' },
      select: { slug: true, updatedAt: true },
   })
   const postRoutes: MetadataRoute.Sitemap = posts.map(p => ({
      url: `${baseUrl}/blog/${p.slug}`, lastModified: p.updatedAt, changeFrequency: 'weekly', priority: 0.7,
   }))

   const products = await prisma.product.findMany({
      where: { isAvailable: true },
      select: { id: true, updatedAt: true },
   })
   const productRoutes: MetadataRoute.Sitemap = products.map(p => ({
      url: `${baseUrl}/products/${p.id}`, lastModified: p.updatedAt, changeFrequency: 'weekly', priority: 0.8,
   }))

   return [...staticRoutes, ...pageRoutes, ...postRoutes, ...productRoutes]
}
