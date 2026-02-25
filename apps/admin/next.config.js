/** @type {import('next').NextConfig} */

module.exports = {
   compress: true,
   poweredByHeader: false,
   experimental: {
      optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
   },
   images: {
      remotePatterns: [
         {
            protocol: 'https',
            hostname: '**',
         },
      ],
      formats: ['image/avif', 'image/webp'],
      minimumCacheTTL: 3600,
   },
}
