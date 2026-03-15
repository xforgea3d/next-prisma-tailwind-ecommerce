'use client'

import { Input } from '@/components/ui/input'
import { validateEmail } from '@/lib/email-validation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'

interface EmailInputProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  placeholder?: string
  className?: string
  id?: string
  required?: boolean
  readOnly?: boolean
}

export function EmailInput({
  value,
  onChange,
  disabled,
  placeholder = 'ornek@email.com',
  className,
  id,
  required,
  readOnly,
}: EmailInputProps) {
  const [error, setError] = useState<string | null>(null)
  const [showValid, setShowValid] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const validate = useCallback((val: string) => {
    if (!val || val.length < 3) {
      setError(null)
      setShowValid(false)
      return
    }
    const result = validateEmail(val)
    setError(result)
    setShowValid(!result && val.length > 0)
  }, [])

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => validate(value), 500)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [value, validate])

  return (
    <div className="space-y-1">
      <div className="relative">
        <Input
          id={id}
          type="email"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          readOnly={readOnly}
          placeholder={placeholder}
          required={required}
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect="off"
          className={`pr-9 ${error ? 'border-red-400 focus-visible:ring-red-400' : showValid ? 'border-emerald-400 focus-visible:ring-emerald-400' : ''} ${className || ''}`}
        />
        {showValid && (
          <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
        )}
        {error && (
          <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" />
        )}
      </div>
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  )
}

export default EmailInput
