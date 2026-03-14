export default function CartLoading() {
    return (
        <div className="py-8 w-full animate-in fade-in duration-300">
            {/* Heading skeleton */}
            <div className="mb-6 space-y-2">
                <div className="h-8 w-32 bg-neutral-200 dark:bg-neutral-800 rounded-md animate-pulse" />
                <div className="h-4 w-72 bg-neutral-200 dark:bg-neutral-800 rounded-md animate-pulse" />
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Cart items list */}
                <div className="flex-[2] space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex gap-4 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 animate-pulse">
                            {/* Item image */}
                            <div className="h-24 w-24 bg-neutral-200 dark:bg-neutral-700 rounded-lg flex-shrink-0" />
                            {/* Item info */}
                            <div className="flex-1 space-y-2">
                                <div className="h-5 w-3/4 bg-neutral-200 dark:bg-neutral-700 rounded" />
                                <div className="h-4 w-1/3 bg-neutral-200 dark:bg-neutral-700 rounded" />
                                <div className="flex items-center gap-3 mt-3">
                                    <div className="h-8 w-24 bg-neutral-200 dark:bg-neutral-700 rounded-lg" />
                                    <div className="h-5 w-16 bg-orange-500/20 rounded ml-auto" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order summary sidebar */}
                <div className="flex-1">
                    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-4 animate-pulse">
                        <div className="h-6 w-36 bg-neutral-200 dark:bg-neutral-700 rounded" />
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <div className="h-4 w-20 bg-neutral-200 dark:bg-neutral-700 rounded" />
                                <div className="h-4 w-16 bg-neutral-200 dark:bg-neutral-700 rounded" />
                            </div>
                            <div className="flex justify-between">
                                <div className="h-4 w-16 bg-neutral-200 dark:bg-neutral-700 rounded" />
                                <div className="h-4 w-16 bg-neutral-200 dark:bg-neutral-700 rounded" />
                            </div>
                            <div className="h-px bg-neutral-200 dark:bg-neutral-700" />
                            <div className="flex justify-between">
                                <div className="h-5 w-16 bg-neutral-200 dark:bg-neutral-700 rounded" />
                                <div className="h-5 w-20 bg-orange-500/20 rounded" />
                            </div>
                        </div>
                        <div className="h-12 w-full bg-orange-500/20 rounded-xl" />
                    </div>
                </div>
            </div>
        </div>
    )
}
