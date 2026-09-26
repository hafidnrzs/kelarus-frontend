/** Client-side checks. The backend returns no per-field errors, so these run before every submit. */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateEmail(value: string): string | undefined {
  const email = value.trim()
  if (!email) return "Enter your email."
  if (email.length > 254) return "Email must be at most 254 characters."
  if (!EMAIL_PATTERN.test(email)) return "Enter a valid email."
}

export function validatePassword(value: string): string | undefined {
  if (!value) return "Enter a password."
  if (value.length < 8) return "Password must be at least 8 characters."
  if (value.length > 128) return "Password must be at most 128 characters."
}

export function validateConfirmPassword(
  password: string,
  confirm: string
): string | undefined {
  if (!confirm) return "Confirm your password."
  if (password !== confirm) return "Passwords do not match."
}

export type FieldErrors<K extends string> = Partial<Record<K, string>>

export function hasErrors(errors: Record<string, string | undefined>): boolean {
  return Object.values(errors).some(Boolean)
}
