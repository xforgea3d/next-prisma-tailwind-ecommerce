import type { Metadata } from 'next'

export const metadata: Metadata = {
   title: 'Kendi Tasarımını Yap',
   description: 'Kendi 3D tasarımınızı yükleyin veya özel sipariş verin. xForgea3D atölyesi ile hayal gücünüzü gerçeğe dönüştürün.',
}

export default function AtolyeLayout({ children }: { children: React.ReactNode }) {
   return children
}
