import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRightIcon, SparklesIcon } from 'lucide-react'

export default function Hero() {
    return (
        <section className="relative w-full overflow-hidden rounded-xl bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 px-6 py-20 md:py-32 text-white">
            {/* Decorative grid overlay */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-10"
                style={{
                    backgroundImage:
                        'linear-gradient(to right, #ffffff22 1px, transparent 1px), linear-gradient(to bottom, #ffffff22 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                }}
            />

            {/* Badge */}
            <div className="flex justify-center mb-6">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium tracking-widest uppercase backdrop-blur-sm">
                    <SparklesIcon className="h-3 w-3" />
                    Türkiye&apos;nin 3D Baskı Markası
                </span>
            </div>

            {/* Headline */}
            <h1 className="mx-auto max-w-3xl text-center text-4xl font-extrabold tracking-tight md:text-6xl leading-tight">
                Sanatı Katman Katman{' '}
                <span className="bg-gradient-to-r from-white via-neutral-300 to-neutral-400 bg-clip-text text-transparent">
                    İnşa Ediyoruz
                </span>
            </h1>

            {/* Brand statement */}
            <p className="mx-auto mt-6 max-w-xl text-center text-base text-neutral-300 md:text-lg leading-relaxed">
                Türkiye&apos;nin en kaliteli 3D baskı figürleri, heykelleri ve dekoratif
                ürünleri — her biri özenle tasarlanır ve üretilir.
            </p>

            {/* Slogan */}
            <p className="mt-3 text-center text-sm font-semibold tracking-[0.2em] uppercase text-neutral-400">
                Tasarım. Hassasiyet. xForgea3D.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/products">
                    <Button
                        size="lg"
                        className="rounded-full px-8 font-semibold text-base bg-white text-neutral-900 hover:bg-neutral-200 transition-all"
                    >
                        Ürünleri Keşfet
                        <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
                <Link href="/products?custom=true">
                    <Button
                        size="lg"
                        variant="outline"
                        className="rounded-full px-8 font-semibold text-base border-white/30 text-white hover:bg-white/10 transition-all"
                    >
                        Kişiselleştir
                    </Button>
                </Link>
            </div>
        </section>
    )
}
