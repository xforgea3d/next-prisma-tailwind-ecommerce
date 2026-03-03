/**
 * revalidate-storefront.ts
 *
 * Calls the storefront's /api/revalidate webhook so that the storefront's
 * ISR cache is immediately busted after any admin mutation.
 *
 * The storefront runs on a DIFFERENT Next.js process, so calling Next.js's
 * own `revalidatePath()` inside the admin app does NOT affect the storefront.
 * This HTTP call is the only correct cross-app invalidation mechanism.
 */

const STOREFRONT_URL =
    process.env.STOREFRONT_URL ||
    (process.env.NODE_ENV === 'development' ? 'http://localhost:7777' : '')

const REVALIDATION_SECRET = process.env.REVALIDATION_SECRET
if (!REVALIDATION_SECRET && process.env.NODE_ENV === 'production') {
    console.warn('[REVALIDATION] REVALIDATION_SECRET env var is not set!')
}

/**
 * Revalidate one or more storefront paths.
 * Fires all requests in parallel and swallows errors so admin mutations
 * are never blocked by a failed webhook.
 */
export async function revalidateStorefront(paths: string[]): Promise<void> {
    if (!STOREFRONT_URL || !REVALIDATION_SECRET) return

    await Promise.allSettled(
        paths.map((path) =>
            fetch(
                `${STOREFRONT_URL}/api/revalidate?secret=${REVALIDATION_SECRET}&path=${encodeURIComponent(path)}`,
                { method: 'POST', cache: 'no-store' }
            )
        )
    ).then((results) => {
        results.forEach((r, i) => {
            if (r.status === 'rejected') {
                console.error(`[STOREFRONT_REVALIDATE] Failed for path "${paths[i]}":`, r.reason)
            }
        })
    })
}
