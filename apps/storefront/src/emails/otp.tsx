import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Preview,
    Section,
    Tailwind,
    Text,
} from '@react-email/components'
import React from 'react'

interface OtpEmailProps {
    code?: string
    name?: string
    type?: 'verify' | 'reset'
}

export default function OtpEmail({
    code = '123456',
    name = '',
    type = 'verify',
}: OtpEmailProps) {
    const isReset = type === 'reset'
    const previewText = isReset
        ? `xForgea3D - Sifre sifirlama kodunuz: ${code}`
        : `xForgea3D - Dogrulama kodunuz: ${code}`

    const heading = isReset ? 'Sifre Sifirlama' : 'E-posta Dogrulama'
    const description = isReset
        ? 'Sifrenizi sifirlamak icin asagidaki kodu kullanin.'
        : 'Hesabinizi dogrulamak icin asagidaki kodu girin.'

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="bg-[#0a0a0a] my-0 mx-auto font-sans">
                    <Container className="mx-auto max-w-[480px] py-8 px-4">
                        {/* Header with brand */}
                        <Section className="text-center mb-6">
                            <div
                                style={{
                                    fontSize: '28px',
                                    fontWeight: 'bold',
                                    color: '#f97316',
                                    letterSpacing: '-0.5px',
                                }}
                            >
                                xForgea3D
                            </div>
                            <Text
                                style={{
                                    color: '#737373',
                                    fontSize: '13px',
                                    margin: '4px 0 0 0',
                                }}
                            >
                                3D Baski ve Figur Atolvesi
                            </Text>
                        </Section>

                        {/* Main card */}
                        <Section
                            style={{
                                backgroundColor: '#171717',
                                border: '1px solid #262626',
                                borderRadius: '12px',
                                padding: '32px 24px',
                            }}
                        >
                            <Heading
                                style={{
                                    color: '#fafafa',
                                    fontSize: '22px',
                                    fontWeight: '600',
                                    textAlign: 'center' as const,
                                    margin: '0 0 8px 0',
                                }}
                            >
                                {heading}
                            </Heading>

                            {name && (
                                <Text
                                    style={{
                                        color: '#a3a3a3',
                                        fontSize: '14px',
                                        textAlign: 'center' as const,
                                        margin: '0 0 4px 0',
                                    }}
                                >
                                    Merhaba {name},
                                </Text>
                            )}

                            <Text
                                style={{
                                    color: '#a3a3a3',
                                    fontSize: '14px',
                                    textAlign: 'center' as const,
                                    margin: '0 0 24px 0',
                                }}
                            >
                                {description}
                            </Text>

                            {/* OTP Code box */}
                            <Section
                                style={{
                                    backgroundColor: '#0a0a0a',
                                    border: '2px solid #f97316',
                                    borderRadius: '8px',
                                    padding: '20px',
                                    textAlign: 'center' as const,
                                    margin: '0 auto 24px auto',
                                    maxWidth: '280px',
                                }}
                            >
                                <Text
                                    style={{
                                        color: '#f97316',
                                        fontSize: '36px',
                                        fontWeight: '700',
                                        letterSpacing: '8px',
                                        margin: '0',
                                        fontFamily: 'monospace',
                                    }}
                                >
                                    {code}
                                </Text>
                            </Section>

                            <Text
                                style={{
                                    color: '#737373',
                                    fontSize: '12px',
                                    textAlign: 'center' as const,
                                    margin: '0 0 16px 0',
                                }}
                            >
                                Bu kod 10 dakika icerisinde gecerliligini yitirecektir.
                            </Text>

                            <Hr
                                style={{
                                    borderColor: '#262626',
                                    margin: '16px 0',
                                }}
                            />

                            <Text
                                style={{
                                    color: '#525252',
                                    fontSize: '12px',
                                    textAlign: 'center' as const,
                                    margin: '0',
                                    lineHeight: '18px',
                                }}
                            >
                                Bu islemi siz baslatmadiyseniz bu e-postayi guvenlice yok sayabilirsiniz.
                                Hesabiniz guvendedir.
                            </Text>
                        </Section>

                        {/* Footer */}
                        <Section className="text-center mt-6">
                            <Text
                                style={{
                                    color: '#404040',
                                    fontSize: '11px',
                                    margin: '0',
                                }}
                            >
                                &copy; {new Date().getFullYear()} xForgea3D. Tum haklari saklidir.
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}
