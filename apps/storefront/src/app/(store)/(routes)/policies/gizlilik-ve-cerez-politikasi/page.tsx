import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Gizlilik ve Çerez Politikası',
    description: 'xForgea3D Gizlilik ve Çerez Politikası.',
}

export default function GizlilikOdul() {
    return (
        <div className="mx-auto max-w-4xl py-12 prose prose-neutral dark:prose-invert">
            <h1 className="text-3xl font-bold tracking-tight mb-8">Gizlilik ve Çerez Politikası</h1>

            <h2>1. Gizlilik Bildirimi</h2>
            <p>
                xForgea3D olarak kişisel verilerinizin gizliliğine ve güvenliğine en üst düzeyde önem veriyoruz. Sitemizi
                kullanırken sağlamış olduğunuz isim, e-posta, teslimat adresi ve ödeme bilgileri gibi veriler, sadece
                sipariş sürecinizin yürütülmesi ve size daha iyi hizmet verilebilmesi amacıyla saklanmaktadır. Verileriniz,
                yasal zorunluluklar dışında üçüncü kişi veya kurumlarla kesinlikle <strong>paylaşılmamaktadır.</strong>
            </p>

            <h2>2. Ödeme Güvenliği</h2>
            <p>
                Alışveriş esnasında kredi kartı bilgileriniz xForgea3D sunucularında <strong>saklanmaz.</strong> Tüm
                tahsilat işlemleri, yetkili ödeme sağlayıcısı (Stripe/Iyzico) altyapısı üzerinden şifrelenmiş (SSL)
                bir bağlantıyla bankalara iletilir. Sitemize girdiğiniz finansal bilgiler doğrudan banka ile sizin
                aranızda gerçekleşir.
            </p>

            <h2>3. Çerez (Cookie) Kullanımı</h2>
            <p>
                "Çerezler" (Cookies), web sitemizi ziyaretiniz sırasında cihazınıza kaydedilen küçük metin dosyalarıdır.
                Bu dosyalar, kullanıcı deneyiminizi artırmak, site trafiğini analiz etmek ve özel kullanım
                tercihlerinizi hatırlamak (örneğin karanlık/aydınlık tema ve otomatize sepet verileri) için kullanılır.
            </p>

            <h3>Kullandığımız Çerez Türleri</h3>
            <ul>
                <li><strong>Zorunlu Çerezler:</strong> Sitenin düzgün çalışması, üye girişi yapılması ve alışveriş sepeti fonksiyonları için elzem olan çerezlerdir. Onayınıza tabi değildir.</li>
                <li><strong>Performans/Analitik Çerezler:</strong> Ziyaretçi sayısını ve trafiği ölçümlemek, kullanıcıların sitemizde nasıl gezindiğini anlamak için kullanılır (örn. Google Analytics). </li>
                <li><strong>Reklam/Pazarlama Çerezleri:</strong> İlgi alanınıza yönelik içerik ve kampanyaların size özelleştirilerek sunulması amacıyla iş ortaklarımızla paylaşılan çerezlerdir. (Tercihe bağlıdır).</li>
            </ul>

            <h2>4. Çerez Tercihlerini Yönetme</h2>
            <p>
                Tarayıcınızın ayarlarını değiştirerek çerezlere yönelik tercihlerinizi dilediğiniz gibi
                kişiselleştirebilir, çerezleri tamamen veya kısmen engelleyebilir, silebilirsiniz. Ancak
                zorunlu çerezlerin devre dışı bırakılması, sipariş süreçlerinin tamamlanamamasına neden olabilir.
            </p>

            <p className="text-sm mt-8 text-neutral-500">
                <em>Bu politika son olarak 2026 yılında güncellenmiştir.</em>
            </p>
        </div>
    )
}
