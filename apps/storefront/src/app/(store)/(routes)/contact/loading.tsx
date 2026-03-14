export default function ContactLoading() {
    return (
        <div className="w-full animate-in fade-in duration-300">
            {/* Hero section skeleton */}
            <div className="bg-gradient-to-br from-orange-500/5 via-orange-400/5 to-transparent dark:from-orange-500/10 dark:via-orange-400/5 dark:to-transparent">
                <div className="mx-auto max-w-5xl px-4 py-16 sm:py-20 text-center space-y-4">
                    <div className="mx-auto h-16 w-16 bg-orange-500/10 rounded-2xl animate-pulse" />
                    <div className="h-10 w-40 bg-neutral-200 dark:bg-neutral-800 rounded-lg mx-auto animate-pulse" />
                    <div className="h-4 w-96 max-w-full bg-neutral-200 dark:bg-neutral-800 rounded mx-auto animate-pulse" />
                </div>
            </div>

            <div className="mx-auto max-w-5xl px-4">
                {/* Contact cards skeleton */}
                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-3 animate-pulse">
                            <div className="h-11 w-11 bg-orange-500/10 rounded-xl" />
                            <div className="h-5 w-20 bg-neutral-200 dark:bg-neutral-700 rounded" />
                            <div className="h-4 w-full bg-neutral-200 dark:bg-neutral-700 rounded" />
                            <div className="h-4 w-2/3 bg-neutral-200 dark:bg-neutral-700 rounded" />
                        </div>
                    ))}
                </div>

                {/* Contact form skeleton */}
                <div className="mt-12 rounded-xl border border-neutral-200 dark:border-neutral-800 p-8 space-y-6 animate-pulse">
                    <div className="h-7 w-48 bg-neutral-200 dark:bg-neutral-700 rounded" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <div className="h-4 w-16 bg-neutral-200 dark:bg-neutral-700 rounded" />
                            <div className="h-10 w-full bg-neutral-200 dark:bg-neutral-700 rounded-lg" />
                        </div>
                        <div className="space-y-2">
                            <div className="h-4 w-16 bg-neutral-200 dark:bg-neutral-700 rounded" />
                            <div className="h-10 w-full bg-neutral-200 dark:bg-neutral-700 rounded-lg" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-4 w-12 bg-neutral-200 dark:bg-neutral-700 rounded" />
                        <div className="h-10 w-full bg-neutral-200 dark:bg-neutral-700 rounded-lg" />
                    </div>
                    <div className="space-y-2">
                        <div className="h-4 w-16 bg-neutral-200 dark:bg-neutral-700 rounded" />
                        <div className="h-32 w-full bg-neutral-200 dark:bg-neutral-700 rounded-lg" />
                    </div>
                    <div className="h-12 w-32 bg-orange-500/20 rounded-xl" />
                </div>
            </div>
        </div>
    )
}
