import { ProductSkeletonGrid } from '@/components/native/Product'

export default function Loading() {
    return (
        <div className="py-10 space-y-6 animate-in fade-in duration-300 w-full">
            <div className="space-y-4">
                <div className="h-8 w-48 bg-neutral-200 dark:bg-neutral-800 rounded-md animate-pulse"></div>
                <div className="h-4 w-64 bg-neutral-200 dark:bg-neutral-800 rounded-md animate-pulse"></div>
            </div>
            <ProductSkeletonGrid />
        </div>
    )
}
