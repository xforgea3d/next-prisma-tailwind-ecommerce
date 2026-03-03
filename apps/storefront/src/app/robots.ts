import { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://xforgea3d.com'

export default function robots(): MetadataRoute.Robots {
   return {
      rules: [
         {
            userAgent: '*',
            allow: '/',
            disallow: [
               '/api/',
               '/cart',
               '/checkout',
               '/profile',
               '/wishlist',
               '/maintenance',
            ],
         },
         {
            userAgent: 'Googlebot',
            allow: '/',
            disallow: ['/api/', '/cart', '/checkout', '/profile'],
         },
         {
            userAgent: 'Bingbot',
            allow: '/',
            disallow: ['/api/', '/cart', '/checkout', '/profile'],
         },
      ],
      sitemap: `${SITE_URL}/sitemap.xml`,
      host: SITE_URL,
   }
}
