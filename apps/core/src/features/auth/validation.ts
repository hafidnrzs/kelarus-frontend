import type { MessageKey } from "@/i18n"

/** Client-side checks. The backend returns no per-field errors, so these run before every submit. */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const EMAIL_MAX = 254
const PASSWORD_MIN = 8
const PASSWORD_MAX = 128

/** A translatable message; rendered with `t(key, values)` so it follows the active language. */
export type Message = { key: MessageKey; values?: Record<string, string | number> }

export function message(key: MessageKey, values?: Message["values"]): Message {
  return { key, values }
}

export function validateEmail(value: string): Message | undefined {
  const email = value.trim()
  if (!email) return message("validation.emailRequired")
  if (email.length > EMAIL_MAX) return message("validation.emailTooLong", { max: EMAIL_MAX })
  if (!EMAIL_PATTERN.test(email)) return message("validation.emailInvalid")
}

export function validatePassword(value: string): Message | undefined {
  if (!value) return message("validation.passwordRequired")
  if (value.length < PASSWORD_MIN) {
    return message("validation.passwordTooShort", { min: PASSWORD_MIN })
  }
  if (value.length > PASSWORD_MAX) {
    return message("validation.passwordTooLong", { max: PASSWORD_MAX })
  }
}

export function validateConfirmPassword(
  password: string,
  confirm: string
): Message | undefined {
  if (!confirm) return message("validation.confirmPasswordRequired")
  if (password !== confirm) return message("validation.passwordMismatch")
}

export type FieldErrors<K extends string> = Partial<Record<K, Message>>

export function hasErrors(errors: Record<string, Message | undefined>): boolean {
  return Object.values(errors).some(Boolean)
}
