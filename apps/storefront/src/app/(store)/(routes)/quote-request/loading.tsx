export default function QuoteRequestLoading() {
    return (
        <div className="max-w-2xl mx-auto py-10 px-4 animate-in fade-in duration-300">
            {/* Header skeleton */}
            <div className="mb-8 text-center space-y-3">
                <div className="h-5 w-44 rounded-full bg-orange-500/10 mx-auto animate-pulse" />
                <div className="h-8 w-72 rounded-lg bg-neutral-200 dark:bg-neutral-800 mx-auto animate-pulse" />
                <div className="h-4 w-80 max-w-full rounded-lg bg-neutral-200 dark:bg-neutral-800 mx-auto animate-pulse" />
            </div>

            {/* Form skeleton */}
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-5 animate-pulse">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-2">
                        <div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-700 rounded" />
                        <div className="h-10 w-full bg-neutral-200 dark:bg-neutral-700 rounded-lg" />
                    </div>
                ))}
                <div className="space-y-2">
                    <div className="h-4 w-20 bg-neutral-200 dark:bg-neutral-700 rounded" />
                    <div className="h-32 w-full bg-neutral-200 dark:bg-neutral-700 rounded-lg" />
                </div>
                {/* Upload area */}
                <div className="h-40 rounded-2xl border-2 border-dashed border-neutral-200 dark:border-neutral-700" />
                <div className="h-12 w-full bg-orange-500/20 rounded-xl" />
            </div>
        </div>
    )
}
