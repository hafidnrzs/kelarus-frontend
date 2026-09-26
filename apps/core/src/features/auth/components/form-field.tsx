import type { ComponentProps } from "react"
import { useTranslation } from "react-i18next"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import type { Message } from "../validation"

type FormFieldProps = ComponentProps<typeof Input> & {
  name: string
  label: string
  error?: Message
}

/** Label, input, and inline error wired together for screen readers. */
export function FormField({ name, label, error, ...inputProps }: FormFieldProps) {
  const { t } = useTranslation()
  const errorId = `${name}-error`
  return (
    <div className="grid gap-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...inputProps}
      />
      {error && (
        <p id={errorId} className="text-sm text-destructive">
          {t(error.key, error.values)}
        </p>
      )}
    </div>
  )
}
