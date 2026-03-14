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

            <h2>3. Çerez (Cookie) Nedir?</h2>
            <p>
                Çerezler (Cookies), web sitemizi ziyaretiniz sırasında cihazınıza kaydedilen küçük metin dosyalarıdır.
                Bu dosyalar, tarayıcınız tarafından saklanır ve web sitesinin sizi tanıması, tercihlerinizi hatırlaması
                ve size daha iyi bir kullanıcı deneyimi sunması için kullanılır. Çerezler, kişisel verilerinize doğrudan
                erişim sağlamaz; yalnızca tarayıcınız ile web sitesi arasındaki iletişimi kolaylaştırır.
            </p>

            <h2>4. Neden Çerez Kullanıyoruz?</h2>
            <p>Çerezleri aşağıdaki amaçlarla kullanmaktayız:</p>
            <ul>
                <li><strong>Site işlevselliğini sağlamak:</strong> Oturum yönetimi, sepet bilgileri ve güvenlik kontrolleri için zorunlu çerezler kullanılır.</li>
                <li><strong>Kullanıcı deneyimini iyileştirmek:</strong> Tema tercihleri, dil seçimi ve filtre ayarlarınızı hatırlamak için işlevsel çerezler kullanılır.</li>
                <li><strong>Site performansını analiz etmek:</strong> Ziyaretçi sayısı, sayfa görüntülenmeleri ve kullanıcı davranışlarını anlamak için analitik çerezler kullanılır.</li>
                <li><strong>Pazarlama ve reklam:</strong> İlgi alanınıza uygun içeriklerin sunulması için pazarlama çerezleri kullanılabilir.</li>
            </ul>

            <h2>5. Kullandığımız Çerezler</h2>
            <p>Aşağıdaki tabloda sitemizde kullanılan çerezlerin detayları yer almaktadır:</p>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left py-3 px-4 font-semibold">Çerez Adı</th>
                            <th className="text-left py-3 px-4 font-semibold">Türü</th>
                            <th className="text-left py-3 px-4 font-semibold">Amacı</th>
                            <th className="text-left py-3 px-4 font-semibold">Süre</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b">
                            <td className="py-3 px-4"><code>logged-in</code></td>
                            <td className="py-3 px-4">Zorunlu</td>
                            <td className="py-3 px-4">Oturum durumu kontrolü</td>
                            <td className="py-3 px-4">1 yıl</td>
                        </tr>
                        <tr className="border-b">
                            <td className="py-3 px-4"><code>sb-*-auth-token</code></td>
                            <td className="py-3 px-4">Zorunlu</td>
                            <td className="py-3 px-4">Supabase kimlik doğrulama</td>
                            <td className="py-3 px-4">Oturum</td>
                        </tr>
                        <tr className="border-b">
                            <td className="py-3 px-4"><code>cookie-consent</code></td>
                            <td className="py-3 px-4">Zorunlu</td>
                            <td className="py-3 px-4">Çerez tercih kaydı</td>
                            <td className="py-3 px-4">1 yıl</td>
                        </tr>
                        <tr className="border-b">
                            <td className="py-3 px-4"><code>xforgea3d_product_filters</code></td>
                            <td className="py-3 px-4">Zorunlu</td>
                            <td className="py-3 px-4">Ürün filtre tercihleri</td>
                            <td className="py-3 px-4">Oturum</td>
                        </tr>
                        <tr className="border-b">
                            <td className="py-3 px-4"><code>recently_viewed</code></td>
                            <td className="py-3 px-4">İşlevsel</td>
                            <td className="py-3 px-4">Son görüntülenen ürünler</td>
                            <td className="py-3 px-4">30 gün</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2>6. Çerez Türleri</h2>
            <h3>Zorunlu Çerezler</h3>
            <p>
                Sitenin düzgün çalışması, üye girişi yapılması ve alışveriş sepeti fonksiyonları için elzem olan çerezlerdir.
                Bu çerezler olmadan site doğru şekilde çalışamaz. Onayınıza tabi değildir ve devre dışı bırakılamaz.
            </p>

            <h3>Performans/Analitik Çerezler</h3>
            <p>
                Ziyaretçi sayısını ve trafiği ölçümlemek, kullanıcıların sitemizde nasıl gezindiğini anlamak için kullanılır
                (örn. Google Analytics). Bu çerezler kişiliğinizi belirlememize yardımcı olmaz; tüm veriler anonim olarak
                toplanır ve işlenir.
            </p>

            <h3>Reklam/Pazarlama Çerezleri</h3>
            <p>
                İlgi alanınıza yönelik içerik ve kampanyaların size özelleştirilerek sunulması amacıyla iş ortaklarımızla
                paylaşılan çerezlerdir. Bu çerezler tercihe bağlıdır ve çerez ayarlarından kontrol edilebilir.
            </p>

            <h2>7. Çerez Tercihlerinizi Yönetme</h2>
            <p>
                Çerez tercihlerinizi aşağıdaki yöntemlerle yönetebilirsiniz:
            </p>
            <ul>
                <li><strong>Çerez Banner&apos;ı:</strong> Sitemizi ilk ziyaretinizde gösterilen çerez banner&apos;ından tercihlerinizi belirleyebilirsiniz.</li>
                <li><strong>Çerez Ayarları:</strong> Sayfa altındaki &quot;Çerez Ayarları&quot; bağlantısına tıklayarak tercihlerinizi istediğiniz zaman güncelleyebilirsiniz.</li>
                <li><strong>Tarayıcı Ayarları:</strong> Tarayıcınızın ayarlarını değiştirerek çerezlere yönelik tercihlerinizi kişiselleştirebilir, çerezleri tamamen veya kısmen engelleyebilir, silebilirsiniz.</li>
            </ul>
            <p>
                Ancak zorunlu çerezlerin devre dışı bırakılması, sipariş süreçlerinin tamamlanamamasına neden olabilir.
            </p>

            <h2>8. KVKK Uyumluluğu</h2>
            <p>
                xForgea3D olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) kapsamında kişisel verilerinizin
                işlenmesi ve korunması konusunda gerekli tüm teknik ve idari tedbirleri almaktayız.
            </p>
            <p>
                KVKK kapsamında haklarınız şunlardır:
            </p>
            <ul>
                <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                <li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme</li>
                <li>Kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme</li>
                <li>Yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı üçüncü kişileri bilme</li>
                <li>Kişisel verilerinizin eksik veya yanlış işlenmiş olması halinde bunların düzeltilmesini isteme</li>
                <li>KVKK madde 7&apos;de öngörülen şartlar çerçevesinde kişisel verilerinizin silinmesini veya yok edilmesini isteme</li>
                <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme</li>
                <li>Kişisel verilerinizin kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız halinde zararın giderilmesini talep etme</li>
            </ul>

            <h2>9. İletişim</h2>
            <p>
                Kişisel verileriniz ile ilgili her türlü soru, talep ve başvurularınız için aşağıdaki iletişim kanallarından
                bize ulaşabilirsiniz:
            </p>
            <ul>
                <li><strong>E-posta:</strong> info@xforgea3d.com</li>
                <li><strong>WhatsApp:</strong> +90 538 288 07 38</li>
            </ul>
            <p>
                Başvurularınız, talebinizin niteliğine göre en kısa sürede ve en geç 30 (otuz) gün içinde ücretsiz
                olarak sonuçlandırılacaktır.
            </p>

            <p className="text-sm mt-8 text-neutral-500">
                <em>Bu politika son olarak 2026 yılında güncellenmiştir.</em>
            </p>
        </div>
    )
}
