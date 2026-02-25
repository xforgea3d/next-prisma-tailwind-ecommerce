export default function Loading() {
    return (
        <div className="space-y-10 animate-in fade-in duration-300 w-full py-6">
            <div className="h-6 w-64 bg-neutral-200 dark:bg-neutral-800 rounded-md animate-pulse mb-6"></div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="lg:col-span-6 w-full">
                    <div className="h-[60vh] rounded-xl bg-neutral-200 dark:bg-neutral-800 animate-pulse"></div>
                </div>

                <div className="lg:col-span-6 w-full space-y-6">
                    <div className="h-10 w-3/4 bg-neutral-200 dark:bg-neutral-800 rounded-md animate-pulse"></div>
                    <div className="h-12 w-32 bg-neutral-200 dark:bg-neutral-800 rounded-md animate-pulse"></div>

                    <div className="space-y-2 mt-4">
                        <div className="h-4 w-full bg-neutral-200 dark:bg-neutral-800 rounded-md animate-pulse"></div>
                        <div className="h-4 w-5/6 bg-neutral-200 dark:bg-neutral-800 rounded-md animate-pulse"></div>
                        <div className="h-4 w-4/6 bg-neutral-200 dark:bg-neutral-800 rounded-md animate-pulse"></div>
                    </div>

                    <div className="h-[200px] w-full bg-neutral-200 dark:bg-neutral-800 rounded-xl animate-pulse mt-8"></div>
                </div>
            </div>
        </div>
    )
}
