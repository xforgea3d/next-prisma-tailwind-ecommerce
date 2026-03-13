import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
   test: {
      globals: true,
      environment: 'node',
      include: [
         '__tests__/**/*.test.ts',
         'apps/storefront/__tests__/**/*.test.{ts,tsx}',
         'apps/admin/__tests__/**/*.test.{ts,tsx}',
      ],
      setupFiles: ['__tests__/setup.ts'],
      testTimeout: 15000,
   },
   resolve: {
      alias: {
         '@storefront': path.resolve(__dirname, 'apps/storefront/src'),
         '@admin': path.resolve(__dirname, 'apps/admin/src'),
         // @/ alias — admin routes use @/ to mean apps/admin/src/
         // This works for tests that import from a single app at a time.
         // For storefront tests, the setup.ts mock handles @/lib/supabase/*
         '@/': path.resolve(__dirname, 'apps/admin/src') + '/',
      },
   },
})
