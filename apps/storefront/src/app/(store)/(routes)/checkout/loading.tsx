export default function CheckoutLoading() {
    return (
        <div className="py-8 w-full animate-in fade-in duration-300">
            {/* Heading skeleton */}
            <div className="mb-6 space-y-2">
                <div className="h-8 w-44 bg-neutral-200 dark:bg-neutral-800 rounded-md animate-pulse" />
                <div className="h-4 w-64 bg-neutral-200 dark:bg-neutral-800 rounded-md animate-pulse" />
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Checkout form area */}
                <div className="flex-[2] space-y-6">
                    {/* Address section */}
                    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-4 animate-pulse">
                        <div className="h-6 w-32 bg-neutral-200 dark:bg-neutral-700 rounded" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="h-4 w-20 bg-neutral-200 dark:bg-neutral-700 rounded" />
                                    <div className="h-10 w-full bg-neutral-200 dark:bg-neutral-700 rounded-lg" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Payment section */}
                    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-4 animate-pulse">
                        <div className="h-6 w-28 bg-neutral-200 dark:bg-neutral-700 rounded" />
                        <div className="space-y-3">
                            <div className="h-10 w-full bg-neutral-200 dark:bg-neutral-700 rounded-lg" />
                            <div className="grid grid-cols-2 gap-4">
                                <div className="h-10 bg-neutral-200 dark:bg-neutral-700 rounded-lg" />
                                <div className="h-10 bg-neutral-200 dark:bg-neutral-700 rounded-lg" />
                            </div>
                        </div>
                    </div>

                    {/* Discount code */}
                    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 animate-pulse">
                        <div className="flex gap-3">
                            <div className="h-10 flex-1 bg-neutral-200 dark:bg-neutral-700 rounded-lg" />
                            <div className="h-10 w-24 bg-neutral-200 dark:bg-neutral-700 rounded-lg" />
                        </div>
                    </div>
                </div>

                {/* Order summary */}
                <div className="flex-1">
                    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-4 animate-pulse sticky top-24">
                        <div className="h-6 w-36 bg-neutral-200 dark:bg-neutral-700 rounded" />
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="flex gap-3">
                                <div className="h-16 w-16 bg-neutral-200 dark:bg-neutral-700 rounded-lg flex-shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-full bg-neutral-200 dark:bg-neutral-700 rounded" />
                                    <div className="h-3 w-16 bg-neutral-200 dark:bg-neutral-700 rounded" />
                                </div>
                            </div>
                        ))}
                        <div className="h-px bg-neutral-200 dark:bg-neutral-700" />
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <div className="h-4 w-20 bg-neutral-200 dark:bg-neutral-700 rounded" />
                                <div className="h-4 w-16 bg-neutral-200 dark:bg-neutral-700 rounded" />
                            </div>
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
