'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRightIcon, SparklesIcon, LayersIcon } from 'lucide-react'

/**
 * Animated 3D Printer SVG — clearly shows a printer nozzle depositing
 * filament layer by layer to build a figure. Much more recognizable than
 * the abstract "layer prism" shown before.
 */
function PrinterAnimation() {
    return (
        <div
            className="hidden md:flex absolute right-0 top-0 bottom-0 w-[44%] items-center justify-center overflow-hidden pointer-events-none"
            aria-hidden="true"
        >
            {/* Ambient glow */}
            <div className="absolute w-72 h-72 rounded-full bg-orange-500/8 dark:bg-orange-400/12 blur-[90px]" />

            <div className="relative w-64 h-72">
                <svg
                    viewBox="0 0 260 300"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full"
                >
                    {/* ── Gantry rail (horizontal bar at top) ── */}
                    <rect x="20" y="28" width="220" height="8" rx="4"
                        className="fill-neutral-300 dark:fill-neutral-600" />
                    {/* Rail end caps */}
                    <rect x="14" y="22" width="16" height="20" rx="3"
                        className="fill-neutral-400 dark:fill-neutral-500" />
                    <rect x="230" y="22" width="16" height="20" rx="3"
                        className="fill-neutral-400 dark:fill-neutral-500" />

                    {/* ── Print head carriage (moves L→R via CSS animation) ── */}
                    <g style={{ animation: 'gantry 4s ease-in-out infinite alternate' }}>
                        {/* Carriage block */}
                        <rect x="100" y="20" width="60" height="24" rx="5"
                            className="fill-neutral-200 dark:fill-neutral-700"
                            style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.15))' }} />
                        {/* Hotend body */}
                        <rect x="118" y="44" width="24" height="32" rx="3"
                            className="fill-neutral-300 dark:fill-neutral-600" />
                        {/* Heat block (orange) */}
                        <rect x="116" y="72" width="28" height="20" rx="3" fill="#f97316" opacity="0.9" />
                        {/* Nozzle cone */}
                        <path d="M120 92 L126 108 L134 108 L140 92Z" fill="#ea580c" />
                        {/* Nozzle tip dot — glowing orange */}
                        <circle cx="130" cy="110" r="3.5" fill="#f97316">
                            <animate attributeName="opacity" values="1;0.4;1" dur="0.9s" repeatCount="indefinite" />
                            <animate attributeName="r" values="3.5;5;3.5" dur="0.9s" repeatCount="indefinite" />
                        </circle>
                        {/* Glow behind nozzle tip */}
                        <circle cx="130" cy="110" r="12" fill="#f97316" opacity="0.15">
                            <animate attributeName="opacity" values="0.15;0.35;0.15" dur="0.9s" repeatCount="indefinite" />
                        </circle>
                        {/* Filament strand coming down into nozzle */}
                        <line x1="130" y1="20" x2="130" y2="44" stroke="#f97316" strokeWidth="3" strokeLinecap="round"
                            opacity="0.6" />
                    </g>

                    {/* ── Print bed ── */}
                    <rect x="30" y="260" width="200" height="10" rx="3"
                        className="fill-neutral-200 dark:fill-neutral-600" />
                    {/* Bed texture lines */}
                    {[40, 55, 70, 85, 100, 115, 130, 145, 160, 175, 190, 205, 220].map(x => (
                        <line key={x} x1={x} y1="260" x2={x} y2="270" stroke="currentColor"
                            strokeWidth="0.5" className="text-neutral-300 dark:text-neutral-500" />
                    ))}

                    {/* ── Printed layers building up ──
                   Each layer fades in sequentially via animation-delay ── */}
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
                        const y = 250 - i * 14
                        const widths = [160, 148, 132, 118, 106, 88, 68, 44]
                        const w = widths[i]
                        const x = 130 - w / 2
                        const opacity = [0.22, 0.28, 0.35, 0.42, 0.52, 0.63, 0.75, 0.9][i]
                        return (
                            <rect
                                key={i}
                                x={x} y={y} width={w} height={11} rx="2"
                                fill="#f97316"
                                style={{
                                    opacity: 0,
                                    animation: `layerIn 0.4s ease-out ${i * 0.5 + 0.2}s forwards`,
                                }}
                            />
                        )
                    })}

                    {/* ── Labels ── */}
                    <text x="130" y="290" textAnchor="middle" fontSize="9" fontWeight="600"
                        letterSpacing="3" className="fill-orange-500/60 uppercase">
                        Katman Katman Üretim
                    </text>

                    {/* ── Z-axis left rail ── */}
                    <line x1="24" y1="28" x2="24" y2="260" stroke="currentColor" strokeWidth="2"
                        className="text-neutral-300 dark:text-neutral-600" strokeDasharray="4 4" />
                    <line x1="236" y1="28" x2="236" y2="260" stroke="currentColor" strokeWidth="2"
                        className="text-neutral-300 dark:text-neutral-600" strokeDasharray="4 4" />
                </svg>
            </div>

            {/* Inject CSS keyframes via style tag */}
            <style>{`
            @keyframes gantry {
               0%   { transform: translateX(-40px); }
               100% { transform: translateX(40px); }
            }
            @keyframes layerIn {
               from { opacity: 0; transform: scaleY(0.3); transform-origin: bottom; }
               to   { opacity: var(--final-opacity, 1); }
            }
         `}</style>
        </div>
    )
}

export default function Hero() {
    return (
        <section className="relative w-full overflow-hidden rounded-2xl
         bg-gradient-to-br from-neutral-50 via-white to-orange-50/30
         dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950
         border border-neutral-200/60 dark:border-neutral-800/60
         shadow-sm min-h-[320px]">

            {/* Radial glow */}
            <div aria-hidden className="pointer-events-none absolute inset-0"
                style={{ background: 'radial-gradient(ellipse 55% 60% at 75% 50%, rgba(249,115,22,0.06) 0%, transparent 70%)' }} />
            {/* Grid */}
            <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.025] dark:opacity-[0.05]"
                style={{ backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)', backgroundSize: '44px 44px' }} />

            {/* 3D Printer visual */}
            <PrinterAnimation />

            {/* Content */}
            <div className="relative z-10 px-8 md:px-12 py-12 md:py-14 md:max-w-[56%]">
                {/* Badge */}
                <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/25 bg-orange-500/8 dark:bg-orange-500/12 px-4 py-1.5 text-[11px] font-bold tracking-[0.18em] uppercase text-orange-600 dark:text-orange-400 mb-6">
                    <SparklesIcon className="h-3 w-3" />
                    Türkiye'nin Seçkin 3D Baskı Stüdyosu
                </span>

                {/* Headline */}
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-[1.05] text-foreground">
                    Fikrine Şekil Ver,
                    <br />
                    <span className="bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600 dark:from-orange-400 dark:via-amber-300 dark:to-orange-500 bg-clip-text text-transparent">
                        Katman Katman Üret.
                    </span>
                </h1>

                {/* Sub-copy */}
                <p className="mt-4 text-sm md:text-base leading-relaxed text-neutral-600 dark:text-neutral-400 max-w-xs md:max-w-sm">
                    Stok ürünler, kişiselleştirilebilir tasarımlar veya tamamen senin fikrin —
                    Elegoo 3D yazıcılarımızla her baskı hassasiyetle hayata geçiyor.
                </p>

                {/* Stats */}
                <div className="mt-6 flex gap-6">
                    {[
                        { value: '500+', label: 'Ürün Çeşidi' },
                        { value: '7/24', label: 'Üretim' },
                        { value: '2 Gün', label: 'Hızlı Kargo' },
                    ].map(({ value, label }) => (
                        <div key={label}>
                            <div className="text-xl md:text-2xl font-black text-foreground leading-none">{value}</div>
                            <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mt-0.5">{label}</div>
                        </div>
                    ))}
                </div>

                {/* CTAs */}
                <div className="mt-7 flex flex-wrap gap-3">
                    <Link href="/products">
                        <Button size="lg" className="rounded-full px-6 h-10 font-bold bg-orange-500 hover:bg-orange-600 text-white border-0 shadow-[0_4px_20px_rgba(249,115,22,0.35)] hover:shadow-[0_4px_30px_rgba(249,115,22,0.55)] hover:scale-105 transition-all duration-200">
                            Ürünleri Keşfet
                            <ArrowRightIcon className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href="/atolye">
                        <Button size="lg" variant="outline"
                            className="rounded-full px-6 h-10 font-semibold border-neutral-300 dark:border-neutral-700 hover:border-orange-400/60 hover:bg-orange-500/5 transition-all duration-200">
                            <LayersIcon className="mr-2 h-4 w-4 text-orange-500" />
                            Kendi Tasarımını Yap
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}
