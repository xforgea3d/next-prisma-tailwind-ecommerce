import { Metadata } from 'next'
import { Target, Eye, Shield, Palette, Zap, HeadphonesIcon, Printer, Box } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Hakkımızda',
    description: 'xForgea3D hakkında bilgi edinin. 3D baskı ve otomotiv aksesuar çözümleri.',
}

export default function AboutPage() {
    return (
        <div className="space-y-16 pb-16">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-orange-500/5 via-orange-500/10 to-transparent dark:from-orange-500/10 dark:via-orange-500/5 dark:to-transparent">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-400/10 via-transparent to-transparent" />
                <div className="relative mx-auto max-w-6xl px-4 py-20 sm:py-28 text-center">
                    <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 px-4 py-1.5 text-sm font-medium text-orange-600 dark:text-orange-400 mb-6">
                        <Printer className="h-4 w-4" />
                        <span>3D Baskı &amp; Otomotiv Aksesuarları</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 dark:text-white mb-6">
                        Teknolojiyi Sanatla
                        <span className="block text-orange-500">Buluşturuyoruz</span>
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
                        Yüksek kaliteli 3D baskı ürünler ve otomotiv aksesuarlarıyla hayallerinizi gerçeğe dönüştürüyoruz.
                    </p>
                </div>
            </section>

            {/* Biz Kimiz Section */}
            <section className="mx-auto max-w-6xl px-4">
                <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-8 sm:p-12 shadow-sm">
                    <div className="flex flex-col sm:flex-row items-start gap-6">
                        <div className="flex-shrink-0 rounded-xl bg-orange-500/10 p-4">
                            <Box className="h-8 w-8 text-orange-500" />
                        </div>
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-4">
                                Biz Kimiz?
                            </h2>
                            <p className="text-neutral-600 dark:text-neutral-400 text-lg leading-relaxed">
                                xForgea3D, 3D baskı teknolojisi ve otomotiv aksesuar alanında uzmanlaşmış bir Türk markasıdır.
                                Yüksek kaliteli malzemeler ve son teknoloji 3D yazıcılar kullanarak; figür, dekoratif ürün,
                                prototip ve otomotiv aksesuarları üretmekteyiz. Her ürünümüzde detaylara verdiğimiz önem ve
                                müşteri memnuniyeti önceliğimizdir.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Misyon & Vizyon Section */}
            <section className="mx-auto max-w-6xl px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Misyon Card */}
                    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-8 shadow-sm hover:shadow-md transition-shadow">
                        <div className="rounded-xl bg-orange-500/10 p-3 w-fit mb-6">
                            <Target className="h-7 w-7 text-orange-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                            Misyonumuz
                        </h2>
                        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                            Müşterilerimize en yüksek kalitede 3D baskı ürünler ve otomotiv aksesuarları sunarak,
                            hayallerini gerçeğe dönüştürmek. Kişiye özel üretim anlayışımızla her müşterimizin
                            benzersiz ihtiyaçlarına çözüm üretmek ve sektörde güvenilir bir marka olmayı sürdürmek.
                        </p>
                    </div>

                    {/* Vizyon Card */}
                    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-8 shadow-sm hover:shadow-md transition-shadow">
                        <div className="rounded-xl bg-orange-500/10 p-3 w-fit mb-6">
                            <Eye className="h-7 w-7 text-orange-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                            Vizyonumuz
                        </h2>
                        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                            3D baskı teknolojisinin sunduğu sınırsız olanaklarla Türkiye&apos;nin lider üretim markası olmak.
                            Yenilikçi tasarımlarımız ve sürdürülebilir üretim süreçlerimizle hem bireysel hem de
                            kurumsal müşterilerimize katma değer sağlamak. Teknolojiyi sanatla buluşturarak,
                            her ürünümüzde mükemmelliği hedeflemek.
                        </p>
                    </div>
                </div>
            </section>

            {/* Neden xForgea3D Section */}
            <section className="mx-auto max-w-6xl px-4">
                <div className="text-center mb-10">
                    <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-3">
                        Neden <span className="text-orange-500">xForgea3D</span>?
                    </h2>
                    <p className="text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto">
                        Kaliteden ödün vermeden en iyi hizmeti sunmak için buradayız.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        {
                            icon: Shield,
                            title: 'Kaliteli Malzeme',
                            description: 'Tüm ürünlerimizde endüstriyel kalitede malzemeler kullanıyoruz.',
                        },
                        {
                            icon: Palette,
                            title: 'Kişiye Özel Üretim',
                            description: 'İstediğiniz ölçü, renk ve tasarımda ürün üretebiliyoruz.',
                        },
                        {
                            icon: Zap,
                            title: 'Hızlı Teslimat',
                            description: 'Siparişlerinizi en kısa sürede hazırlayıp kargoya veriyoruz.',
                        },
                        {
                            icon: HeadphonesIcon,
                            title: 'Müşteri Desteği',
                            description: 'Satış öncesi ve sonrası tam destek sağlıyoruz.',
                        },
                    ].map((feature) => (
                        <div
                            key={feature.title}
                            className="group rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm hover:shadow-md hover:border-orange-500/30 transition-all"
                        >
                            <div className="rounded-xl bg-orange-500/10 p-3 w-fit mb-5 group-hover:bg-orange-500/20 transition-colors">
                                <feature.icon className="h-6 w-6 text-orange-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Rakamlarla xForgea3D Stats Section */}
            <section className="mx-auto max-w-6xl px-4">
                <div className="rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 p-8 sm:p-12 shadow-lg">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-10">
                        Rakamlarla xForgea3D
                    </h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { value: '50+', label: 'Renk Seçeneği' },
                            { value: '%99', label: 'Müşteri Memnuniyeti' },
                            { value: '81', label: 'İl Teslimat' },
                            { value: '1000+', label: 'Ürün Çeşidi' },
                        ].map((stat) => (
                            <div key={stat.label} className="text-center">
                                <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-2 tabular-nums">
                                    {stat.value}
                                </div>
                                <div className="text-orange-100 text-sm sm:text-base font-medium">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
