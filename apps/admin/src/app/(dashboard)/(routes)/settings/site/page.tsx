export const revalidate = 30
import prisma from '@/lib/prisma'
import { SiteSettingsForm } from './components/site-settings-form'

export default async function SiteSettingsPage() {
    const settings = await prisma.siteSettings.upsert({
        where: { id: 1 },
        update: {},
        create: { id: 1 },
    })

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SiteSettingsForm initialData={settings as any} />
            </div>
        </div>
    )
}
