// Customization system helper types and utilities for xForgea3D

export interface ColorOption {
    label: string
    hex: string
    price: number
}

export interface SizeOption {
    label: string
    price: number
}

export interface CustomOptions {
    colors: ColorOption[]
    sizes: SizeOption[]
    maxTextLength: number       // 0 = no text input
    allowFileUpload: boolean
    basePriceAddition: number   // flat fee for enabling customization
}

export interface CustomSnapshot {
    text?: string
    color?: ColorOption | null
    size?: SizeOption | null
    fileUrl?: string | null
    note?: string
}

export function parseCustomOptions(raw: unknown): CustomOptions | null {
    if (!raw || typeof raw !== 'object') return null
    const obj = raw as Record<string, unknown>
    return {
        colors: Array.isArray(obj.colors) ? (obj.colors as ColorOption[]) : [],
        sizes: Array.isArray(obj.sizes) ? (obj.sizes as SizeOption[]) : [],
        maxTextLength: typeof obj.maxTextLength === 'number' ? obj.maxTextLength : 0,
        allowFileUpload: typeof obj.allowFileUpload === 'boolean' ? obj.allowFileUpload : false,
        basePriceAddition: typeof obj.basePriceAddition === 'number' ? obj.basePriceAddition : 0,
    }
}

export function calculateCustomPrice(
    basePrice: number,
    discount: number,
    isCustom: boolean,
    options: CustomOptions | null,
    selectedColor: ColorOption | null,
    selectedSize: SizeOption | null
): number {
    const discounted = discount > 0 ? basePrice - discount : basePrice

    if (!isCustom || !options) return discounted

    const colorExtra = selectedColor?.price ?? 0
    const sizeExtra = selectedSize?.price ?? 0
    const baseExtra = options.basePriceAddition ?? 0

    return discounted + baseExtra + colorExtra + sizeExtra
}

// Turkish labels for OrderStatusEnum values
export const ORDER_STATUS_LABELS: Record<string, string> = {
    OnayBekleniyor: 'Onay Bekleniyor',
    Uretimde: 'Üretimde',
    Processing: 'İşlemde',
    Shipped: 'Kargoya Verildi',
    Delivered: 'Teslim Edildi',
    ReturnProcessing: 'İade İşlemde',
    ReturnCompleted: 'İade Tamamlandı',
    Cancelled: 'İptal Edildi',
    RefundProcessing: 'Para İadesi İşlemde',
    RefundCompleted: 'Para İadesi Tamamlandı',
    Denied: 'Reddedildi',
}
