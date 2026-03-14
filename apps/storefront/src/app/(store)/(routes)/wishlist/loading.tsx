export default function WishlistLoading() {
    return (
        <div className="py-8 w-full animate-in fade-in duration-300">
            {/* Heading skeleton */}
            <div className="mb-6 space-y-2">
                <div className="h-8 w-36 bg-neutral-200 dark:bg-neutral-800 rounded-md animate-pulse" />
                <div className="h-4 w-72 bg-neutral-200 dark:bg-neutral-800 rounded-md animate-pulse" />
            </div>

            {/* Wishlist product grid skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden animate-pulse">
                        <div className="aspect-square bg-neutral-200 dark:bg-neutral-700" />
                        <div className="p-3 space-y-2">
                            <div className="h-4 w-3/4 bg-neutral-200 dark:bg-neutral-700 rounded" />
                            <div className="h-3 w-1/2 bg-neutral-200 dark:bg-neutral-700 rounded" />
                            <div className="flex items-center justify-between mt-2">
                                <div className="h-5 w-20 bg-orange-500/20 rounded" />
                                <div className="h-8 w-8 bg-neutral-200 dark:bg-neutral-700 rounded-full" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
