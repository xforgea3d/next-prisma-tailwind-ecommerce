'use client'

import { UserContextProvider } from '@/state/User'
import { CartContextProvider } from '@/state/Cart'
import dynamic from 'next/dynamic'

const CartSyncer = dynamic(() => import('@/components/native/CartSyncer'), {
    ssr: false,
})

/**
 * Wraps the entire store (all storefront pages) with cart + user state.
 * CRITICAL: Without this wrapper, useCartContext() returns the default
 * empty context and dispatchCart is a no-op — cart stays empty even after
 * QuickAdd calls it. This must live in a 'use client' component.
 */
export function StoreProviders({ children }: { children: React.ReactNode }) {
    return (
        <UserContextProvider>
            <CartContextProvider>
                <CartSyncer />
                {children}
            </CartContextProvider>
        </UserContextProvider>
    )
}
