'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { EmailInput } from '@/components/native/EmailInput'
import { validateEmail } from '@/lib/email-validation'

export function ContactForm() {
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [email, setEmail] = useState('')

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const emailErr = validateEmail(email)
        if (emailErr) {
            toast({ title: 'Hata', description: emailErr, variant: 'destructive' })
            return
        }

        setIsSubmitting(true)

        // Simulate a short delay
        await new Promise((resolve) => setTimeout(resolve, 800))

        toast({
            title: 'Mesajınız iletildi!',
            description:
                'En kısa sürede size geri dönüş yapacağız. Teşekkürler!',
        })

        setIsSubmitting(false)
        ;(e.target as HTMLFormElement).reset()
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="name">Ad Soyad</Label>
                    <Input
                        id="name"
                        placeholder="Adınız Soyadınız"
                        required
                        className="rounded-xl"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">E-posta</Label>
                    <EmailInput
                        id="email"
                        value={email}
                        onChange={setEmail}
                        placeholder="ornek@email.com"
                        required
                        className="rounded-xl"
                    />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="subject">Konu</Label>
                <Input
                    id="subject"
                    placeholder="Mesajınızın konusu"
                    required
                    className="rounded-xl"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="message">Mesaj</Label>
                <Textarea
                    id="message"
                    placeholder="Mesajınızı buraya yazın..."
                    rows={5}
                    required
                    className="rounded-xl resize-none"
                />
            </div>
            <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto rounded-xl bg-orange-500 hover:bg-orange-600 text-white px-8"
                size="lg"
            >
                {isSubmitting ? (
                    'Gönderiliyor...'
                ) : (
                    <>
                        <Send className="mr-2 h-4 w-4" />
                        Mesaj Gönder
                    </>
                )}
            </Button>
        </form>
    )
}
