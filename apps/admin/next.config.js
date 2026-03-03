/** @type {import('next').NextConfig} */

module.exports = {
   compress: true,
   poweredByHeader: false,
   experimental: {
      optimizePackageImports: [
         'lucide-react',
         '@radix-ui/react-icons',
         '@radix-ui/react-dropdown-menu',
         '@radix-ui/react-dialog',
         '@radix-ui/react-navigation-menu',
         '@radix-ui/react-select',
         '@radix-ui/react-tooltip',
         '@radix-ui/react-tabs',
         '@radix-ui/react-popover',
      ],
   },
   typescript: { ignoreBuildErrors: false },
   eslint: { ignoreDuringBuilds: true },
   images: {
      remotePatterns: [
         {
            protocol: 'https',
            hostname: '**',
         },
      ],
      formats: ['image/avif', 'image/webp'],
      minimumCacheTTL: 86400, // 24h — was 3600 (1h)
      deviceSizes: [640, 750, 828, 1080, 1200],
      imageSizes: [16, 32, 48, 64, 96, 128, 256],
   },
   // Aggressive HTTP caching for static assets
   async headers() {
      return [
         {
            source: '/_next/static/(.*)',
            headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
         },
         {
            source: '/favicon(.*)',
            headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' }],
         },
      ]
   },
}
