import type { Metadata } from 'next'

export const metadata: Metadata = {
   title: 'Favorilerim',
   description: 'Beğendiğiniz ürünleri kaydedin ve dilediğiniz zaman sepetinize ekleyin.',
}

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
   return children
}
