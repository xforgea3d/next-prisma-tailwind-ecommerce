'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Heading } from '@/components/ui/heading'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import * as z from 'zod'

const formSchema = z.object({
    brand_name: z.string().min(1),
    slogan: z.string().optional(),
    contact_email: z.string().email().optional().or(z.literal('')),
    contact_phone: z.string().optional(),
    whatsapp: z.string().optional(),
    address_text: z.string().optional(),
    instagram_url: z.string().optional(),
    tiktok_url: z.string().optional(),
    youtube_url: z.string().optional(),
    maintenance_enabled: z.boolean().default(false),
    maintenance_message: z.string().optional(),
    tax_rate: z.coerce.number().min(0).max(100).default(20),
})

type FormValues = z.infer<typeof formSchema>

export function SiteSettingsForm({ initialData }: { initialData: FormValues }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData,
    })

    const onSubmit = async (data: FormValues) => {
        try {
            setLoading(true)
            await fetch('/api/settings/site', {
                method: 'PATCH',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' },
                cache: 'no-store',
            })
            router.refresh()
            toast.success('Site ayarları güncellendi.')
        } catch {
            toast.error('Bir hata oluştu.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title="Site Ayarları" description="Marka ve iletişim bilgilerini düzenle." />
            </div>
            <Separator />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full max-w-2xl">

                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Marka</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="brand_name" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Marka Adı</FormLabel>
                                    <FormControl><Input disabled={loading} {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="slogan" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Slogan</FormLabel>
                                    <FormControl><Input disabled={loading} {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">İletişim</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { name: 'contact_email', label: 'E-posta' },
                                { name: 'contact_phone', label: 'Telefon' },
                                { name: 'whatsapp', label: 'WhatsApp' },
                            ].map(({ name, label }) => (
                                <FormField key={name} control={form.control} name={name as any} render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{label}</FormLabel>
                                        <FormControl><Input disabled={loading} {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            ))}
                            <FormField control={form.control} name="address_text" render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                    <FormLabel>Adres</FormLabel>
                                    <FormControl><Textarea disabled={loading} rows={2} {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Sosyal Medya</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { name: 'instagram_url', label: 'Instagram URL' },
                                { name: 'tiktok_url', label: 'TikTok URL' },
                                { name: 'youtube_url', label: 'YouTube URL' },
                            ].map(({ name, label }) => (
                                <FormField key={name} control={form.control} name={name as any} render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{label}</FormLabel>
                                        <FormControl><Input disabled={loading} placeholder="https://..." {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Vergi</h3>
                        <FormField control={form.control} name="tax_rate" render={({ field }) => (
                            <FormItem className="max-w-xs">
                                <FormLabel>KDV Oranı (%)</FormLabel>
                                <FormControl>
                                    <Input type="number" min={0} max={100} step={1} disabled={loading} {...field} />
                                </FormControl>
                                <FormDescription>Siparişlere uygulanacak KDV yüzdesi (ör. 20 = %20).</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Bakım Modu</h3>
                        <FormField control={form.control} name="maintenance_enabled" render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>Bakım Modunu Etkinleştir</FormLabel>
                                    <FormDescription>Etkinleştirildiğinde mağaza ziyaretçilere bakım sayfası gösterilir.</FormDescription>
                                </div>
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="maintenance_message" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bakım Mesajı</FormLabel>
                                <FormControl><Textarea disabled={loading} rows={2} {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>

                    <Button disabled={loading} type="submit">
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Kaydediliyor...
                            </>
                        ) : (
                            'Kaydet'
                        )}
                    </Button>
                </form>
            </Form>
        </>
    )
}
