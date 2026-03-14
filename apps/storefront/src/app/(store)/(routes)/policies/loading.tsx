export default function PoliciesLoading() {
    return (
        <div className="mx-auto max-w-4xl py-12 animate-in fade-in duration-300">
            <div className="space-y-6 animate-pulse">
                <div className="h-9 w-52 bg-neutral-200 dark:bg-neutral-700 rounded" />
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="space-y-3">
                        <div className="h-6 w-44 bg-neutral-200 dark:bg-neutral-700 rounded" />
                        <div className="h-4 w-full bg-neutral-200 dark:bg-neutral-700 rounded" />
                        <div className="h-4 w-5/6 bg-neutral-200 dark:bg-neutral-700 rounded" />
                        <div className="h-4 w-3/4 bg-neutral-200 dark:bg-neutral-700 rounded" />
                    </div>
                ))}
            </div>
        </div>
    )
}
