import crypto from 'crypto'

function getSecret(): string {
   const secret = process.env.JWT_SECRET_KEY
   if (!secret) throw new Error('JWT_SECRET_KEY is not set')
   return secret
}

export function generateCsrfToken(userId: string): string {
   const secret = getSecret()
   const timestamp = Date.now().toString(36)
   const hmac = crypto
      .createHmac('sha256', secret)
      .update(`${timestamp}:${userId}`)
      .digest('hex')
      .slice(0, 16)
   return `${timestamp}.${hmac}`
}

export function verifyCsrfToken(token: string, userId: string): boolean {
   try {
      const secret = getSecret()
      if (!token || !token.includes('.')) return false

      const [timestamp, hmac] = token.split('.')
      const ts = parseInt(timestamp, 36)

      if (Date.now() - ts > 1 * 60 * 60 * 1000) return false // 1 hour expiry

      const expectedHmac = crypto
         .createHmac('sha256', secret)
         .update(`${timestamp}:${userId}`)
         .digest('hex')
         .slice(0, 16)

      return hmac === expectedHmac
   } catch {
      return false
   }
}
