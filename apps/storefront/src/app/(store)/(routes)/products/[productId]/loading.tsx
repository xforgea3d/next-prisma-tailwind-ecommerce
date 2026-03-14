export default function Loading() {
    return (
        <div className="py-8 w-full animate-in fade-in duration-300">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Image area skeleton */}
                <div className="flex-1 space-y-3">
                    <div className="aspect-square w-full bg-neutral-200 dark:bg-neutral-700 rounded-xl animate-pulse relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-300/20 dark:via-neutral-600/20 to-transparent animate-shimmer" />
                    </div>
                    {/* Thumbnail row */}
                    <div className="flex gap-2">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-16 w-16 bg-neutral-200 dark:bg-neutral-700 rounded-lg animate-pulse" />
                        ))}
                    </div>
                </div>

                {/* Product info panel skeleton */}
                <div className="flex-1 space-y-5">
                    {/* Breadcrumb */}
                    <div className="flex gap-2">
                        <div className="h-3 w-16 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
                        <div className="h-3 w-3 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
                        <div className="h-3 w-24 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                        <div className="h-7 w-3/4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
                        <div className="h-5 w-1/2 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
                    </div>

                    {/* Price */}
                    <div className="h-8 w-28 bg-orange-500/20 rounded-lg animate-pulse" />

                    {/* Rating */}
                    <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-5 w-5 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
                        ))}
                        <div className="h-5 w-12 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse ml-2" />
                    </div>

                    {/* Description lines */}
                    <div className="space-y-2 pt-4">
                        <div className="h-4 w-full bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
                        <div className="h-4 w-5/6 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
                        <div className="h-4 w-2/3 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
                    </div>

                    {/* Variant selector */}
                    <div className="flex gap-2 pt-4">
                        <div className="h-10 w-20 bg-neutral-200 dark:bg-neutral-700 rounded-lg animate-pulse" />
                        <div className="h-10 w-20 bg-neutral-200 dark:bg-neutral-700 rounded-lg animate-pulse" />
                        <div className="h-10 w-20 bg-neutral-200 dark:bg-neutral-700 rounded-lg animate-pulse" />
                    </div>

                    {/* Add to cart button */}
                    <div className="h-12 w-full bg-orange-500/20 rounded-xl animate-pulse mt-4" />
                </div>
            </div>
        </div>
    )
}
