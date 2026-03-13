import { redirect } from 'next/navigation'

// Maintenance page moved to top-level /maintenance route (outside store layout).
// This redirect ensures old bookmarks still work.
export default function MaintenanceRedirect() {
    redirect('/maintenance')
}
