export default function FaqLoading() {
    return (
        <div className="w-full animate-in fade-in duration-300">
            {/* Hero header skeleton */}
            <section className="bg-gradient-to-br from-orange-500/10 via-orange-400/5 to-transparent dark:from-orange-500/20 dark:via-orange-400/10 dark:to-transparent">
                <div className="mx-auto max-w-4xl px-4 py-16 sm:py-20 text-center space-y-4">
                    <div className="mx-auto h-16 w-16 bg-orange-500/10 rounded-2xl animate-pulse" />
                    <div className="h-10 w-64 bg-neutral-200 dark:bg-neutral-800 rounded-lg mx-auto animate-pulse" />
                    <div className="h-4 w-80 max-w-full bg-neutral-200 dark:bg-neutral-800 rounded mx-auto animate-pulse" />
                </div>
            </section>

            {/* FAQ accordion skeleton */}
            <div className="mx-auto max-w-3xl px-4 py-12 space-y-3">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-5 animate-pulse">
                        <div className="flex items-center justify-between">
                            <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded" style={{ width: `${60 + (i % 3) * 15}%` }} />
                            <div className="h-5 w-5 bg-neutral-200 dark:bg-neutral-700 rounded flex-shrink-0 ml-4" />
                        </div>
                    </div>
                ))}
            </div>

            {/* CTA skeleton */}
            <div className="mx-auto max-w-3xl px-4 pb-16">
                <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8 text-center space-y-4 animate-pulse">
                    <div className="h-11 w-11 bg-orange-500/10 rounded-xl mx-auto" />
                    <div className="h-6 w-48 bg-neutral-200 dark:bg-neutral-700 rounded mx-auto" />
                    <div className="h-4 w-72 bg-neutral-200 dark:bg-neutral-700 rounded mx-auto" />
                    <div className="h-10 w-36 bg-orange-500/20 rounded-lg mx-auto" />
                </div>
            </div>
        </div>
    )
}
