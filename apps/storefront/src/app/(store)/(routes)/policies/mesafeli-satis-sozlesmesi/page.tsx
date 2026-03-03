import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Mesafeli Satış Sözleşmesi',
    description: 'xForgea3D Mesafeli Satış Sözleşmesi.',
}

export default function MesafeliSatisSozlesmesi() {
    return (
        <div className="mx-auto max-w-4xl py-12 prose prose-neutral dark:prose-invert">
            <h1 className="text-3xl font-bold tracking-tight mb-8">Mesafeli Satış Sözleşmesi</h1>

            <h2>MADDE 1 – TARAFLAR</h2>
            <h3>1.1. SATICI BİLGİLERİ</h3>
            <p>
                Ünvanı: xForgea3D<br />
                Adresi: [Satıcı Adresi Eklenecek]<br />
                E-posta: destek@xforgea3d.com
            </p>

            <h3>1.2. ALICI BİLGİLERİ</h3>
            <p>
                Tüketici, xforgea3d.com adresinden sipariş veren kişidir. Alıcının sipariş esnasında beyan ettiği adres ve iletişim bilgileri esas alınır.
            </p>

            <h2>MADDE 2 – KONU</h2>
            <p>
                İşbu sözleşmenin konusu, ALICI'nın SATICI'ya ait xforgea3d.com internet sitesinden elektronik ortamda siparişini yaptığı aşağıda nitelikleri ve satış fiyatı belirtilen ürünün satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmelere Dair Yönetmelik hükümleri gereğince tarafların hak ve yükümlülüklerinin saptanmasıdır.
            </p>

            <h2>MADDE 3 – SÖZLEŞME KONUSU ÜRÜN BİLGİLERİ</h2>
            <p>
                Malın/Ürünün/Hizmetin türü, miktarı, marka/modeli, rengi, adedi, satış bedeli, ödeme şekli siparişin sonlandığı andaki bilgilerden oluşmaktadır.
            </p>

            <h2>MADDE 4 – GENEL HÜKÜMLER</h2>
            <ul>
                <li>
                    ALICI, internet sitesinde sözleşme konusu ürünün temel nitelikleri, satış fiyatı, ödeme şekli ve teslimata ilişkin ön bilgileri okuyup bilgi sahibi olduğunu ve elektronik ortamda gerekli teyidi verdiğini beyan eder.
                </li>
                <li>
                    Sözleşme konusu ürün, yasal 30 günlük süreyi aşmamak koşulu ile her bir ürün için ALICI'nın yerleşim yerinin uzaklığına bağlı olarak internet sitesinde ön bilgiler kısmında belirtilen süre zarfında ALICI veya gösterdiği adresteki kişi/kuruluşa teslim edilir.
                </li>
                <li>
                    Sözleşme konusu ürün, ALICI'dan başka bir kişi/kuruluşa teslim edilecek ise, teslim edilecek kişi/kuruluşun teslimatı kabul etmemesinden SATICI sorumlu tutulamaz.
                </li>
            </ul>

            <h2>MADDE 5 – CAYMA HAKKI (14 GÜN İADE HAKKI)</h2>
            <p>
                ALICI, sözleşme konusu ürünün kendisine veya gösterdiği adresteki kişi/kuruluşa tesliminden itibaren <strong>14 (on dört) gün</strong> içerisinde hiçbir hukuki ve cezai sorumluluk üstlenmeksizin ve hiçbir gerekçe göstermeksizin malı reddederek sözleşmeden cayma hakkına sahiptir. Cayma hakkının kullanımı için bu süre içinde SATICI'ya yukarıda belirtilen e-posta adresi üzerinden yazılı bildirimde bulunulması şarttır.
            </p>

            <h2>MADDE 6 – CAYMA HAKKI KULLANILAMAYACAK ÜRÜNLER</h2>
            <p>
                Tüketicinin özel istek ve talepleri uyarınca üretilen, kişiselleştirilen <strong>(Custom - Özel Baskı)</strong> ürünlerde cayma hakkı kullanılamaz. Standart ölçü ve renklerde üretilmiş katalog ürünlerinde 14 günlük iade hakkı tam olarak geçerlidir.
            </p>
        </div>
    )
}
