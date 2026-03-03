import { NextResponse } from 'next/server'

// Phone subscription is managed via the user's communication preferences.
// The Profile model does not currently track phone subscription flags in the DB.
// These endpoints return success stubs to prevent client-side crashes.
// TODO: Add `isPhoneSubscribed` field to Profile schema when SMS marketing is implemented.

export async function POST(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) return new NextResponse('Unauthorized', { status: 401 })

      return NextResponse.json({ subscribed: true })
   } catch (error) {
      console.error('[PHONE_SUBSCRIBE]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function DELETE(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')
      if (!userId) return new NextResponse('Unauthorized', { status: 401 })

      return NextResponse.json({ subscribed: false })
   } catch (error) {
      console.error('[PHONE_UNSUBSCRIBE]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
