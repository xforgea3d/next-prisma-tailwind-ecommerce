import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'KVKK Aydınlatma Metni',
    description: '6698 Sayılı Kişisel Verilerin Korunması Kanunu Aydınlatma Metni.',
}

export default function KvkkAydinlatma() {
    return (
        <div className="mx-auto max-w-4xl py-12 prose prose-neutral dark:prose-invert">
            <h1 className="text-3xl font-bold tracking-tight mb-8">Kişisel Verilerin Korunması (KVKK) Aydınlatma Metni</h1>

            <p>
                <strong>xForgea3D ("Şirket")</strong> olarak, müşteri ve site kullanıcılarımızdan
                elde ettiğimiz kişisel verilerin Türkiye Cumhuriyeti Anayasası, uluslararası sözleşmeler ve
                6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") öncelikli olmak üzere ilgili her
                türlü mevzuata uygun olarak işlenmesine ve korunmasına azami hassasiyet göstermekteyiz.
            </p>

            <h2>1. Veri Sorumlusunun Kimliği</h2>
            <p>
                KVKK kapsamında veri sorumlusu sıfatı <strong>xForgea3D</strong>'ye aittir. Her türlü soru,
                onay ve taleplerinizi <strong>destek@xforgea3d.com</strong> adresi üzerinden iletebilirsiniz.
            </p>

            <h2>2. Kişisel Verilerin Hangi Amaçla İşleneceği</h2>
            <p>
                Toplanan kişisel verileriniz (İsim-Soyisim, Adres, E-Posta, Telefon Numarası vb.),
                şirketimiz tarafından sunulan e-ticaret (3D baskı, tasarım, sipariş vb.) ürün ve
                hizmetlerinden sizleri faydalandırmak için gerekli ticari ve operasyonel çalışmaların
                yapılması amacıyla işlenmektedir.
            </p>
            <ul>
                <li>Üyelik işlemlerinin gerçekleştirilmesi,</li>
                <li>Siparişlerinizin kargoya teslimi ve takibi,</li>
                <li>Sorun, iade ve şikayetlerde hızlı destek hizmeti sunulması,</li>
                <li>Kanuni yükümlülüklerin (Fatura kesimi, vergi/muhasebe işlemleri) yerine getirilmesi.</li>
            </ul>

            <h2>3. İşlenen Kişisel Verilerin Kimlere ve Hangi Amaçla Aktarılabileceği</h2>
            <p>
                Elde edilen veriler; şirketimizin sözleşmeden kaynaklanan yükümlülüklerini yerine getirebilmesi
                amacıyla (kargo firmaları, ödeme entegratörleri, mali yetkililer gibi) KVKK’nın 8. ve 9.
                maddelerinde belirtilen şartlar dahilinde yalnızca yetkili kurumlara aktarılmaktadır.
            </p>

            <h2>4. KVKK 11. Madde Kapsamındaki Haklarınız</h2>
            <p>
                İlgili kişi sıfatıyla KVKK madde 11 uyarınca Şirketimize başvurarak;
            </p>
            <ul>
                <li>Kişisel veri işlenip işlenmediğini öğrenme,</li>
                <li>Kişisel verileri işlenmişse buna ilişkin bilgi talep etme,</li>
                <li>Kişisel verilerin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
                <li>Yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme,</li>
                <li>Kişisel verilerin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme haklarına sahipsiniz.</li>
            </ul>
        </div>
    )
}
