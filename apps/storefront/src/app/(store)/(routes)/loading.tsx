import { ProductSkeletonGrid } from '@/components/native/Product'
import { Separator } from '@/components/native/separator'

export default function Loading() {
    return (
        <div className="flex flex-col gap-0 border-neutral-200 dark:border-neutral-700 w-full animate-in fade-in duration-300">
            {/* Hero banner skeleton */}
            <section className="py-6">
                <div className="h-[400px] md:h-[500px] w-full bg-neutral-100 dark:bg-neutral-800 rounded-xl animate-pulse relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-200/20 dark:via-neutral-700/20 to-transparent animate-shimmer" />
                </div>
            </section>

            <Separator />

            {/* Featured products skeleton */}
            <section className="py-10">
                <div className="mb-6 flex flex-col gap-2">
                    <div className="h-8 w-48 bg-neutral-200 dark:bg-neutral-800 rounded-md animate-pulse" />
                    <div className="h-4 w-64 bg-neutral-200 dark:bg-neutral-800 rounded-md animate-pulse" />
                </div>
                <ProductSkeletonGrid />
            </section>
        </div>
    )
}
