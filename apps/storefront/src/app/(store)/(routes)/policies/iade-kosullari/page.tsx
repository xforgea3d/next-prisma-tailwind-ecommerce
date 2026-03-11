import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'İptal ve İade Koşulları',
    description: 'xForgea3D İptal ve İade Koşulları.',
}

export default function IadeKosullari() {
    return (
        <div className="mx-auto max-w-4xl py-12 prose prose-neutral dark:prose-invert">
            <h1 className="text-3xl font-bold tracking-tight mb-8">İptal ve İade Koşulları</h1>

            <h2>1. 14 Günlük Koşulsuz İade Hakkı</h2>
            <p>
                Tüketici Kanunu gereği, xForgea3D üzerinden satın aldığınız standart ürünleri, teslimat tarihinden itibaren <strong>14 gün içerisinde</strong> faturasıyla birlikte, ambalajı hasar görmemiş ve ürün kullanılmamış olmak şartıyla iade edebilirsiniz.
            </p>

            <h2>2. İade Şartları</h2>
            <ul>
                <li>İade edilecek ürünlerin orijinal kutusu/ambalajı ve etiketleriyle birlikte eksiksiz ve hasarsız olarak teslim edilmesi gerekmektedir.</li>
                <li>3D baskı ürünlerinde kullanım izi, kırılma, montajlama deformasyonu veya kullanıcı kaynaklı fiziksel hasar tespit edilen ürünlerin iadesi kabul edilmemektedir.</li>
                <li>İade işlemi başlatmak için <strong>destek@xforgea3d.com</strong> adresi üzerinden bizimle iletişime geçmeniz gerekmektedir.</li>
            </ul>

            <h2>3. Kişiye Özel (Custom) Ürünlerde İade</h2>
            <p>
                Müşterinin talebiyle özel ölçü, ebat, renk seçenekleriyle özel olarak üretilen (Custom) 3D baskı figür, heykeller ve dekoratif ürünlerde <strong>cayma hakkı geçerli değildir</strong>. Üretim hataları hariç olmak üzere bu ürünler iade alınamamaktadır.
            </p>

            <h2>4. Geri Ödeme Süreci</h2>
            <p>
                İade kargonuz bize ulaşıp inceleme süreci tamamlandığında (ortalama 1-3 iş günü) iadeni tutarı, alışverişte kullandığınız ödeme yöntemine iade edilir. Kredi kartı iadelerinin ekstrenize yansıması bankanıza bağlı olarak 1-7 iş günü sürebilir.
            </p>

            <h2>5. Kırık / Hasarlı Teslimat</h2>
            <p>
                Ürününüzü kargo görevlisinden teslim alırken mutlaka dış paketi kontrol ediniz. Eğer ezilme, yırtılma veya hasar varsa kargo görevlisine <strong>Hasar Tespit Tutanağı</strong> tutturmanız zorunludur. Tutanak tutulmadan teslim alınan ve içerisinden kırık çıkan kargolar için sorumluluk müşteriye aittir.
            </p>
        </div>
    )
}
