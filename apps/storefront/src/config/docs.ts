import { NavItem } from '@/types/nav'

interface DocsConfig {
   mainNav: NavItem[]
   sidebarNav: NavItem[]
}

export const docsConfig: DocsConfig = {
   mainNav: [
      {
         title: 'Ürünler',
         href: '/products',
      },
      {
         title: 'Blog',
         href: '/blog',
         external: false,
      },
   ],
   sidebarNav: [
      {
         title: 'Ürünler',
         href: '/products',
      },
      {
         title: 'Blog',
         href: '/blog',
      },
      {
         title: 'Siparişlerim',
         href: '/profile/orders',
      },
      {
         title: 'Ödemelerim',
         href: '/profile/payments',
      },
      {
         title: 'İletişim',
         href: '/contact',
      },
      {
         title: 'Hakkımızda',
         href: '/about',
      },
   ],
}
