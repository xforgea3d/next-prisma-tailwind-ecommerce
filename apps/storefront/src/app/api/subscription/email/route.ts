import { NextResponse } from 'next/server'

// Email subscription is managed via the user's communication preferences.
// The Profile model does not currently track email subscription flags in the DB.
// These endpoints return success stubs to prevent client-side crashes.
// TODO: Add `isEmailSubscribed` + `emailUnsubscribeToken` fields to Profile schema
// when email marketing is implemented.

export async function POST(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) return new NextResponse('Unauthorized', { status: 401 })

      // Subscription preference noted — DB column not yet added
      return NextResponse.json({ subscribed: true })
   } catch (error) {
      console.error('[EMAIL_SUBSCRIBE]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function DELETE(req: Request) {
   try {
      // Token-based unsubscribe — requires emailUnsubscribeToken column on Profile
      return NextResponse.json({ subscribed: false })
   } catch (error) {
      console.error('[EMAIL_UNSUBSCRIBE]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
