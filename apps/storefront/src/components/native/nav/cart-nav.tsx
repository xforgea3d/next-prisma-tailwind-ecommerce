'use client'

import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useCartContext } from '@/state/Cart'
import { ShoppingBasketIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export function CartNav() {
    const { cart } = useCartContext()
    const items = cart?.items || []
    const itemCount = items.reduce((total, item) => total + (item.count || 0), 0)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="icon" variant="outline" className="h-9 relative">
                    <ShoppingBasketIcon className="h-4" />
                    {itemCount > 0 && (
                        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-background">
                            {itemCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-80 p-4" align="end">
                <h4 className="font-semibold mb-3">Sepetiniz ({itemCount} ürün)</h4>
                <DropdownMenuSeparator />

                <DropdownMenuGroup className="max-h-64 overflow-y-auto py-2 flex flex-col gap-3">
                    {items.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">Sepetiniz boş.</p>
                    ) : (
                        items.map((item, index) => (
                            <div key={index} className="flex gap-3 items-center">
                                <div className="relative h-12 w-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                                    {item.product?.images?.[0] ? (
                                        <Image
                                            src={item.product.images[0]}
                                            alt={item.product.title}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-neutral-200"></div>
                                    )}
                                </div>
                                <div className="flex flex-col overflow-hidden">
                                    <span className="text-sm font-medium truncate">{item.product?.title || 'Ürün'}</span>
                                    <span className="text-xs text-muted-foreground">{item.count} adet x {item.product?.price} ₺</span>
                                </div>
                            </div>
                        ))
                    )}
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="my-3" />

                <Button className="w-full" asChild>
                    <Link href="/cart">
                        Sepete Git
                    </Link>
                </Button>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
