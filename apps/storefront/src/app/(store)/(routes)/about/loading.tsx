export default function AboutLoading() {
    return (
        <div className="space-y-16 pb-16 animate-in fade-in duration-300">
            {/* Hero section skeleton */}
            <section className="bg-gradient-to-br from-orange-500/5 via-orange-500/10 to-transparent dark:from-orange-500/10 dark:via-orange-500/5 dark:to-transparent">
                <div className="mx-auto max-w-6xl px-4 py-20 sm:py-28 text-center space-y-6">
                    <div className="h-8 w-56 bg-orange-500/10 rounded-full mx-auto animate-pulse" />
                    <div className="space-y-3">
                        <div className="h-12 w-80 max-w-full bg-neutral-200 dark:bg-neutral-800 rounded-lg mx-auto animate-pulse" />
                        <div className="h-12 w-48 bg-orange-500/20 rounded-lg mx-auto animate-pulse" />
                    </div>
                    <div className="h-5 w-96 max-w-full bg-neutral-200 dark:bg-neutral-800 rounded mx-auto animate-pulse" />
                </div>
            </section>

            {/* Info card skeleton */}
            <section className="mx-auto max-w-6xl px-4">
                <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8 sm:p-12 animate-pulse">
                    <div className="flex flex-col sm:flex-row items-start gap-6">
                        <div className="h-16 w-16 bg-orange-500/10 rounded-xl flex-shrink-0" />
                        <div className="flex-1 space-y-3">
                            <div className="h-7 w-36 bg-neutral-200 dark:bg-neutral-700 rounded" />
                            <div className="h-4 w-full bg-neutral-200 dark:bg-neutral-700 rounded" />
                            <div className="h-4 w-5/6 bg-neutral-200 dark:bg-neutral-700 rounded" />
                            <div className="h-4 w-3/4 bg-neutral-200 dark:bg-neutral-700 rounded" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision skeleton */}
            <section className="mx-auto max-w-6xl px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8 space-y-4 animate-pulse">
                            <div className="h-12 w-12 bg-orange-500/10 rounded-xl" />
                            <div className="h-6 w-28 bg-neutral-200 dark:bg-neutral-700 rounded" />
                            <div className="space-y-2">
                                <div className="h-4 w-full bg-neutral-200 dark:bg-neutral-700 rounded" />
                                <div className="h-4 w-5/6 bg-neutral-200 dark:bg-neutral-700 rounded" />
                                <div className="h-4 w-2/3 bg-neutral-200 dark:bg-neutral-700 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Values grid skeleton */}
            <section className="mx-auto max-w-6xl px-4">
                <div className="text-center mb-10 space-y-3">
                    <div className="h-8 w-48 bg-neutral-200 dark:bg-neutral-800 rounded mx-auto animate-pulse" />
                    <div className="h-4 w-72 bg-neutral-200 dark:bg-neutral-800 rounded mx-auto animate-pulse" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 text-center space-y-3 animate-pulse">
                            <div className="h-12 w-12 bg-orange-500/10 rounded-xl mx-auto" />
                            <div className="h-5 w-24 bg-neutral-200 dark:bg-neutral-700 rounded mx-auto" />
                            <div className="h-4 w-full bg-neutral-200 dark:bg-neutral-700 rounded" />
                            <div className="h-4 w-3/4 bg-neutral-200 dark:bg-neutral-700 rounded mx-auto" />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}
