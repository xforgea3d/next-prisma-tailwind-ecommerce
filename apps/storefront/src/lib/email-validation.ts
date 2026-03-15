const DISPOSABLE_DOMAINS = [
  'tempmail.com',
  'guerrillamail.com',
  'throwaway.email',
  'yopmail.com',
  '10minutemail.com',
  'mailinator.com',
  'guerrillamail.info',
  'grr.la',
  'guerrillamail.net',
  'sharklasers.com',
  'guerrillamail.org',
  'guerrillamailblock.com',
  'spam4.me',
  'trashmail.com',
  'trashmail.me',
  'trashmail.net',
  'dispostable.com',
  'maildrop.cc',
  'fakeinbox.com',
  'tempail.com',
  'temp-mail.org',
]

const TEST_DOMAINS = ['test.test', 'test.com', 'example.test', 'asdf.com']

// Vowels including Turkish vowels
const VOWELS = /[aeıioöuüAEIİOÖUÜ]/

// 4+ consecutive consonants (letters that are NOT vowels and NOT digits/special)
// We treat only ASCII + Turkish letters
const CONSONANT_RUN = /[bcçdfgğhjklmnpqrsştvwxyzBCÇDFGĞHJKLMNPQRSŞTVWXYZ]{4,}/

/**
 * Validates an email address with gibberish detection.
 * Returns an error message (in Turkish) or null if valid.
 */
export function validateEmail(email: string): string | null {
  if (!email) return null // empty handled by required

  const trimmed = email.trim()

  // Basic format
  const atIndex = trimmed.indexOf('@')
  if (atIndex < 1) return 'Geçerli bir e-posta adresi girin'

  const local = trimmed.slice(0, atIndex)
  const domain = trimmed.slice(atIndex + 1)

  if (!domain || !domain.includes('.')) return 'Geçerli bir e-posta adresi girin'

  // TLD check (min 2 chars)
  const lastDot = domain.lastIndexOf('.')
  const tld = domain.slice(lastDot + 1)
  if (tld.length < 2) return 'Geçersiz alan adı uzantısı'

  // Local part length
  if (local.length > 30) return 'E-posta adresi çok uzun'

  // Local part must have at least 1 vowel if longer than 3 chars
  // Strip dots and plus-alias for checking
  const localClean = local.replace(/\./g, '').replace(/\+.*$/, '')
  if (localClean.length > 3 && !VOWELS.test(localClean)) {
    return 'Geçerli bir e-posta adresi girin'
  }

  // Consecutive consonants in local part (check clean version)
  if (CONSONANT_RUN.test(localClean)) {
    return 'Geçerli bir e-posta adresi girin'
  }

  // Consecutive consonants in domain (check the part before TLD)
  const domainName = domain.slice(0, lastDot).replace(/\./g, '') // flatten subdomains
  if (CONSONANT_RUN.test(domainName)) {
    return 'Geçerli bir e-posta adresi girin'
  }

  // Test domains
  const domainLower = domain.toLowerCase()
  if (TEST_DOMAINS.includes(domainLower)) {
    return 'Test e-posta adresleri kabul edilmiyor'
  }

  // Disposable email domains
  if (DISPOSABLE_DOMAINS.includes(domainLower)) {
    return 'Geçici e-posta adresleri kabul edilmiyor'
  }

  // Final regex check for valid email chars
  const emailRegex = /^[a-zA-Z0-9._%+\-ğüşıöçĞÜŞİÖÇ]+@[a-zA-Z0-9.\-ğüşıöçĞÜŞİÖÇ]+\.[a-zA-Z]{2,}$/
  if (!emailRegex.test(trimmed)) {
    return 'Geçerli bir e-posta adresi girin'
  }

  return null
}
