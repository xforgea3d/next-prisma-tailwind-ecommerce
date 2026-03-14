export default function ShippingLoading() {
    return (
        <div className="w-full animate-in fade-in duration-300">
            {/* Hero skeleton */}
            <section className="bg-gradient-to-br from-orange-500/10 via-orange-400/5 to-transparent dark:from-orange-500/20 dark:via-orange-400/10 dark:to-transparent">
                <div className="mx-auto max-w-4xl px-4 py-16 sm:py-20 text-center space-y-4">
                    <div className="mx-auto h-16 w-16 bg-orange-500/10 rounded-2xl animate-pulse" />
                    <div className="h-10 w-52 bg-neutral-200 dark:bg-neutral-800 rounded-lg mx-auto animate-pulse" />
                    <div className="h-4 w-80 max-w-full bg-neutral-200 dark:bg-neutral-800 rounded mx-auto animate-pulse" />
                </div>
            </section>

            {/* Content skeleton */}
            <div className="mx-auto max-w-4xl px-4 py-12 space-y-8">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-3 animate-pulse">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-orange-500/10 rounded-xl" />
                            <div className="h-6 w-40 bg-neutral-200 dark:bg-neutral-700 rounded" />
                        </div>
                        <div className="h-4 w-full bg-neutral-200 dark:bg-neutral-700 rounded" />
                        <div className="h-4 w-4/5 bg-neutral-200 dark:bg-neutral-700 rounded" />
                    </div>
                ))}
            </div>
        </div>
    )
}
