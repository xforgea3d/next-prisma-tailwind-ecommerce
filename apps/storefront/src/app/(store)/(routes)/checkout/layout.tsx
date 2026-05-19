import type { Metadata } from 'next'

export const metadata: Metadata = {
   title: 'Siparişi Tamamla',
   description: 'Adres, kargo ve ödeme bilgilerinizi girerek siparişinizi tamamlayın.',
}

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
   return children
}
