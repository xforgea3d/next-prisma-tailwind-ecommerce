import { ProductSkeletonGrid } from '@/components/native/Product'
import { BlogPostSkeletonGrid } from '@/components/native/BlogCard'
import { Separator } from '@/components/native/separator'

export default function Loading() {
    return (
        <div className="flex flex-col gap-0 border-neutral-200 dark:border-neutral-700 w-full animate-in fade-in">
            <section className="py-6">
                <div className="h-[400px] md:h-[500px] w-full bg-neutral-100 dark:bg-neutral-800 rounded-xl animate-pulse"></div>
            </section>

            <Separator />

            <section className="py-10">
                <div className="mb-6 flex flex-col gap-2">
                    <div className="h-8 w-48 bg-neutral-200 dark:bg-neutral-800 rounded-md animate-pulse"></div>
                    <div className="h-4 w-64 bg-neutral-200 dark:bg-neutral-800 rounded-md animate-pulse"></div>
                </div>
                <ProductSkeletonGrid />
            </section>
        </div>
    )
}
