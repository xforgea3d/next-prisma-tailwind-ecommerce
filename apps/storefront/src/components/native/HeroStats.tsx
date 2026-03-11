'use client'

import { AnimatedCounter } from './AnimatedCounter'

export default function HeroStats() {
    return (
        <div className="mt-6 flex gap-6">
            <div>
                <div className="text-xl md:text-2xl font-black text-foreground leading-none">
                    <AnimatedCounter end={500} suffix="+" />
                </div>
                <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mt-0.5">
                    Ürün Çeşidi
                </div>
            </div>
            <div>
                <div className="text-xl md:text-2xl font-black text-foreground leading-none">
                    7/24
                </div>
                <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mt-0.5">
                    Üretim
                </div>
            </div>
            <div>
                <div className="text-xl md:text-2xl font-black text-foreground leading-none">
                    <AnimatedCounter end={2} suffix=" Gün" />
                </div>
                <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mt-0.5">
                    Hızlı Kargo
                </div>
            </div>
        </div>
    )
}
