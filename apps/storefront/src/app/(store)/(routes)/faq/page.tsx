import { Metadata } from 'next'
import Link from 'next/link'
import { HelpCircle, MessageCircle } from 'lucide-react'

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'

export const metadata: Metadata = {
    title: 'Sıkça Sorulan Sorular',
    description: 'xForgea3D hakkında sıkça sorulan sorular ve cevapları.',
}

const faqs = [
    {
        question: 'Sipariş verdikten sonra ne kadar sürede teslim edilir?',
        answer: 'Standart ürünlerde siparişiniz 1-3 iş günü içinde kargoya verilir. Kargo süresi bulunduğunuz şehre göre 1-3 iş günü arasında değişmektedir. Kişiye özel (custom) ürünlerde üretim süresi tasarımın karmaşıklığına bağlı olarak 3-7 iş günü sürebilir.',
    },
    {
        question: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?',
        answer: 'Kredi kartı ve banka kartı ile ödeme kabul etmekteyiz. Tüm ödemeleriniz 256-bit SSL şifreleme ile güvence altındadır. Taksit seçenekleri de mevcuttur.',
    },
    {
        question: 'Ürün iadesi yapabilir miyim?',
        answer: 'Standart ürünlerde teslimat tarihinden itibaren 14 gün içinde iade hakkınız bulunmaktadır. Ürünün kullanılmamış, orijinal ambalajında ve faturasıyla birlikte iade edilmesi gerekmektedir. Kişiye özel üretilen ürünlerde ise üretim hatası hariç iade kabul edilmemektedir.',
    },
    {
        question: 'Kişiye özel (custom) sipariş verebilir miyim?',
        answer: 'Evet! xForgea3D olarak kişiye özel 3D baskı siparişleri kabul ediyoruz. İstediğiniz tasarım, ölçü ve renk seçenekleriyle size özel üretim yapabiliriz. Detaylı bilgi için iletişim sayfamızdan bize ulaşabilir veya Teklif Al formunu doldurabilirsiniz.',
    },
    {
        question: 'Kargom nerede, nasıl takip edebilirim?',
        answer: 'Siparişiniz kargoya verildiğinde, kargo takip numarası e-posta adresinize gönderilir. Ayrıca hesabınıza giriş yaparak "Siparişlerim" bölümünden kargo durumunuzu takip edebilirsiniz.',
    },
    {
        question: '3D baskı ürünlerin malzeme kalitesi nasıl?',
        answer: 'Ürünlerimizde endüstriyel kalitede PLA, PETG ve Resin malzemeler kullanmaktayız. Tüm malzemelerimiz dayanıklı, UV dayanımlı ve uzun ömürlüdür. Otomotiv aksesuarlarında ise yüksek ısı ve darbe dayanımına sahip özel malzemeler tercih edilmektedir.',
    },
    {
        question: 'Toptan sipariş verebilir miyim?',
        answer: 'Evet, toptan ve kurumsal siparişler için özel fiyatlandırma sunmaktayız. Detaylı bilgi almak için info@xforgea3d.com adresinden bizimle iletişime geçebilirsiniz.',
    },
    {
        question: 'Ürünlerde garanti var mı?',
        answer: 'Tüm ürünlerimiz üretim hatalarına karşı garantilidir. Ürününüz hasarlı veya hatalı ulaştıysa, teslimat tarihinden itibaren 7 gün içinde bizimle iletişime geçmeniz yeterlidir. Fotoğraflı bildirim sonrası ücretsiz değişim veya iade işlemi yapılmaktadır.',
    },
]

export default function FaqPage() {
    return (
        <div className="w-full">
            {/* Hero Header */}
            <section className="relative overflow-hidden bg-gradient-to-br from-orange-500/10 via-orange-400/5 to-transparent dark:from-orange-500/20 dark:via-orange-400/10 dark:to-transparent">
                <div className="mx-auto max-w-4xl px-4 py-16 sm:py-20 text-center">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 dark:bg-orange-500/20">
                        <HelpCircle className="h-8 w-8 text-orange-500" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Sıkça Sorulan Sorular
                    </h1>
                    <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
                        Merak ettiğiniz soruların cevaplarını aşağıda bulabilirsiniz.
                        Başka sorularınız varsa iletişim sayfamızdan bize ulaşabilirsiniz.
                    </p>
                </div>
            </section>

            {/* FAQ Accordion */}
            <section className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
                <div className="rounded-xl border bg-card shadow-sm">
                    <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faq, index) => (
                            <AccordionItem
                                key={index}
                                value={`item-${index}`}
                                className="px-6 last:border-b-0"
                            >
                                <AccordionTrigger className="text-left py-5 text-[15px] hover:text-orange-500 transition-colors">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </section>

            {/* CTA Section */}
            <section className="mx-auto max-w-3xl px-4 pb-16">
                <div className="rounded-xl border bg-gradient-to-br from-orange-500/5 to-transparent dark:from-orange-500/10 dark:to-transparent p-8 sm:p-10 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/10 dark:bg-orange-500/20">
                        <MessageCircle className="h-6 w-6 text-orange-500" />
                    </div>
                    <h2 className="text-xl font-semibold sm:text-2xl">
                        Hala sorunuz mu var?
                    </h2>
                    <p className="mt-2 text-muted-foreground max-w-md mx-auto">
                        Aradığınız cevabı bulamadıysanız, bizimle iletişime geçmekten
                        çekinmeyin. Size yardımcı olmaktan memnuniyet duyarız.
                    </p>
                    <Link
                        href="/contact"
                        className="mt-6 inline-flex items-center justify-center rounded-lg bg-orange-500 px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                    >
                        Bize Ulaşın
                    </Link>
                </div>
            </section>
        </div>
    )
}
