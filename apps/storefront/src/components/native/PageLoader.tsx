/**
 * PageLoader — branded loading component for xForgea3D storefront.
 * Exports a full-page version (default) and a smaller InlineLoader.
 */

function LayersIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
            <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
            <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
        </svg>
    )
}

function LoadingDots() {
    return (
        <span className="inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-[bounce_1.4s_ease-in-out_0s_infinite]" />
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-[bounce_1.4s_ease-in-out_0.2s_infinite]" />
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-[bounce_1.4s_ease-in-out_0.4s_infinite]" />
        </span>
    )
}

export default function PageLoader() {
    return (
        <div className="flex min-h-[60vh] w-full items-center justify-center animate-in fade-in duration-300">
            <div className="flex flex-col items-center gap-5">
                {/* Logo with icon */}
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <LayersIcon className="h-10 w-10 text-orange-500 animate-pulse" />
                        <div className="absolute inset-0 text-orange-500/30 animate-ping">
                            <LayersIcon className="h-10 w-10" />
                        </div>
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent select-none">
                        xForgea3D
                    </span>
                </div>

                {/* Animated progress bar */}
                <div className="w-48 h-1 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden">
                    <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-orange-500 to-orange-400 animate-shimmer" />
                </div>

                {/* Loading text with dots */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="animate-fade-in-out">Yukleniyor</span>
                    <LoadingDots />
                </div>
            </div>
        </div>
    )
}

export function InlineLoader({ text = 'Yukleniyor' }: { text?: string }) {
    return (
        <div className="flex items-center justify-center py-12 animate-in fade-in duration-300">
            <div className="flex flex-col items-center gap-3">
                <LayersIcon className="h-7 w-7 text-orange-500 animate-pulse" />
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{text}</span>
                    <LoadingDots />
                </div>
            </div>
        </div>
    )
}
