import { Metadata } from 'next'
import {
    Truck,
    Package,
    Clock,
    MapPin,
    Shield,
    AlertTriangle,
    ArrowRight,
    CheckCircle2,
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Kargo ve Teslimat',
    description: 'xForgea3D kargo ve teslimat bilgileri, süreleri ve takip detayları.',
}

const timelineSteps = [
    { icon: CheckCircle2, label: 'Sipariş Onayı', desc: 'Siparişiniz alındı' },
    { icon: Package, label: 'Hazırlanıyor', desc: 'Ürününüz paketleniyor' },
    { icon: Truck, label: 'Kargoya Verildi', desc: 'Kargo firmasına teslim edildi' },
    { icon: MapPin, label: 'Teslim Edildi', desc: 'Adresinize ulaştı' },
]

export default function ShippingPage() {
    return (
        <div className="mx-auto max-w-5xl px-4 py-12">
            {/* Hero Section */}
            <div className="relative mb-12 overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 p-8 md:p-12 text-white">
                <div className="absolute -right-8 -top-8 opacity-10">
                    <Truck className="h-48 w-48" strokeWidth={1} />
                </div>
                <div className="relative z-10">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
                        <Truck className="h-4 w-4" />
                        Kargo & Teslimat
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                        Kargo ve Teslimat Bilgileri
                    </h1>
                    <p className="mt-3 max-w-2xl text-orange-100">
                        Siparişlerinizin güvenle ve hızla elinize ulaşması için tüm kargo süreçlerimizi
                        şeffaf bir şekilde paylaşıyoruz.
                    </p>
                </div>
            </div>

            {/* Visual Timeline */}
            <div className="mb-12">
                <h2 className="mb-6 text-center text-xl font-semibold">Sipariş Süreciniz</h2>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {timelineSteps.map((step, i) => (
                        <div key={step.label} className="relative flex flex-col items-center text-center">
                            {i < timelineSteps.length - 1 && (
                                <div className="absolute left-[calc(50%+24px)] top-6 hidden h-0.5 w-[calc(100%-48px)] bg-orange-200 dark:bg-orange-900 md:block" />
                            )}
                            <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/25">
                                <step.icon className="h-5 w-5" />
                            </div>
                            <span className="mt-3 text-sm font-semibold">{step.label}</span>
                            <span className="mt-1 text-xs text-muted-foreground">{step.desc}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Cards Grid */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Kargo Süreleri */}
                <div className="group rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                    <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400">
                            <Clock className="h-5 w-5" />
                        </div>
                        <h2 className="text-lg font-semibold">Kargo Süreleri</h2>
                    </div>
                    <p className="mb-4 text-sm text-muted-foreground">
                        Siparişleriniz onaylandıktan sonra aşağıdaki sürelerde kargoya teslim edilir:
                    </p>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-2 text-sm">
                            <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                            <span>
                                <strong>Standart Ürünler:</strong>{' '}
                                <span className="font-semibold text-orange-600 dark:text-orange-400">1-3 iş günü</span>{' '}
                                içinde kargoya verilir.
                            </span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                            <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                            <span>
                                <strong>Kişiye Özel (Custom) Ürünler:</strong> Üretim sürecine bağlı olarak{' '}
                                <span className="font-semibold text-orange-600 dark:text-orange-400">3-7 iş günü</span>{' '}
                                içinde kargoya verilir.
                            </span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                            <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                            <span>
                                <strong>Otomotiv Aksesuarları:</strong> Stok durumuna göre{' '}
                                <span className="font-semibold text-orange-600 dark:text-orange-400">1-5 iş günü</span>{' '}
                                içinde kargoya verilir.
                            </span>
                        </li>
                    </ul>
                </div>

                {/* Teslimat Süreleri */}
                <div className="group rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                    <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400">
                            <MapPin className="h-5 w-5" />
                        </div>
                        <h2 className="text-lg font-semibold">Teslimat Süreleri</h2>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Kargoya verilen ürünleriniz, bulunduğunuz lokasyona bağlı olarak{' '}
                        <span className="font-semibold text-orange-600 dark:text-orange-400">1-3 iş günü</span>{' '}
                        içinde adresinize teslim edilir. Büyükşehirlerde teslimat genellikle{' '}
                        <span className="font-semibold text-orange-600 dark:text-orange-400">1 iş günü</span>{' '}
                        içinde gerçekleşmektedir.
                    </p>
                </div>

                {/* Kargo Ücreti */}
                <div className="group rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                    <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400">
                            <Package className="h-5 w-5" />
                        </div>
                        <h2 className="text-lg font-semibold">Kargo Ücreti</h2>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Belirli bir tutarın üzerindeki siparişlerinizde{' '}
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700 dark:bg-green-950 dark:text-green-400">
                            Ücretsiz Kargo
                        </span>{' '}
                        avantajından yararlanabilirsiniz. Ücretsiz kargo limiti altındaki siparişlerde
                        kargo ücreti ödeme aşamasında hesaplanarak gösterilir.
                    </p>
                </div>

                {/* Kargo Takibi */}
                <div className="group rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                    <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400">
                            <Truck className="h-5 w-5" />
                        </div>
                        <h2 className="text-lg font-semibold">Kargo Takibi</h2>
                    </div>
                    <p className="mb-4 text-sm text-muted-foreground">
                        Siparişiniz kargoya verildiğinde, kayıtlı e-posta adresinize kargo takip numarası
                        gönderilir. Kargo takibinizi aşağıdaki yollarla yapabilirsiniz:
                    </p>
                    <ul className="space-y-2">
                        <li className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-orange-500" />
                            Hesabınızda <strong className="ml-1">&quot;Siparişlerim&quot;</strong> bölümünden
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-orange-500" />
                            E-posta ile gönderilen kargo takip linkinden
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-orange-500" />
                            Kargo firmasının web sitesinden takip numaranız ile
                        </li>
                    </ul>
                </div>

                {/* Teslimat Sırasında Dikkat */}
                <div className="group rounded-xl border border-amber-200 bg-amber-50/50 p-6 shadow-sm transition-shadow hover:shadow-md dark:border-amber-900 dark:bg-amber-950/30">
                    <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                            <AlertTriangle className="h-5 w-5" />
                        </div>
                        <h2 className="text-lg font-semibold">Teslimat Sırasında Dikkat!</h2>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Kargonuzu teslim alırken mutlaka dış ambalajı kontrol ediniz. Ezilme, yırtılma veya
                        herhangi bir hasar tespit ederseniz, kargo görevlisine{' '}
                        <strong className="text-amber-700 dark:text-amber-400">Hasar Tespit Tutanağı</strong>{' '}
                        tutturduktan sonra teslim alınız. Tutanak tutulmadan teslim alınan hasarlı kargolarda
                        sorumluluk alıcıya aittir.
                    </p>
                </div>

                {/* Teslimat Yapılamadığında */}
                <div className="group rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                    <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400">
                            <Shield className="h-5 w-5" />
                        </div>
                        <h2 className="text-lg font-semibold">Teslimat Yapılamadığında</h2>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Adresinizde bulunamamanız durumunda kargo firması size bilgi mesajı gönderecektir.{' '}
                        <span className="font-semibold text-orange-600 dark:text-orange-400">2 başarısız teslimat denemesinden</span>{' '}
                        sonra kargonuz en yakın şubeye yönlendirilir. Şubede{' '}
                        <span className="font-semibold text-orange-600 dark:text-orange-400">3 iş günü</span>{' '}
                        bekletilen ve teslim alınmayan kargolar tarafımıza iade edilir.
                    </p>
                </div>
            </div>

            {/* CTA Section */}
            <div className="mt-12 flex flex-col items-center rounded-2xl border bg-gradient-to-r from-orange-50 to-amber-50 p-8 text-center dark:from-orange-950/30 dark:to-amber-950/30 dark:border-orange-900/50">
                <Package className="mb-4 h-10 w-10 text-orange-500" />
                <h2 className="text-xl font-semibold">Alışverişe Başlayın</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                    Premium 3D baskı ürünlerimizi keşfedin, hızlı ve güvenli kargo ile kapınıza gelsin.
                </p>
                <Link
                    href="/products"
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
                >
                    Ürünleri Keşfet
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
        </div>
    )
}
