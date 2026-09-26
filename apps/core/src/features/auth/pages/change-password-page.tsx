import { useState, type FormEvent } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import * as api from "../api"
import { FormAlert } from "../components/form-alert"
import { FormField } from "../components/form-field"
import { SubmitButton } from "../components/submit-button"
import { useSession } from "../session-context"
import { ApiError } from "../types"
import {
  hasErrors,
  validateConfirmPassword,
  validatePassword,
  type FieldErrors,
} from "../validation"

type Field = "currentPassword" | "newPassword" | "confirmPassword"

export function ChangePasswordPage() {
  const { clearLocalSession } = useSession()
  const [errors, setErrors] = useState<FieldErrors<Field>>({})
  const [formError, setFormError] = useState<string>()
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const currentPassword = String(form.get("currentPassword"))
    const newPassword = String(form.get("newPassword"))
    const confirmPassword = String(form.get("confirmPassword"))

    const nextErrors: FieldErrors<Field> = {
      currentPassword: currentPassword ? undefined : "Enter your current password.",
      newPassword:
        validatePassword(newPassword) ??
        (newPassword === currentPassword
          ? "New password must be different from the current one."
          : undefined),
      confirmPassword: validateConfirmPassword(newPassword, confirmPassword),
    }
    setErrors(nextErrors)
    setFormError(undefined)
    if (hasErrors(nextErrors)) return

    setPending(true)
    try {
      await api.changePassword(currentPassword, newPassword)
      // The backend revokes every refresh token, so sign out here too. ProtectedRoute redirects.
      clearLocalSession({
        notice: "Your password has been changed. Sign in with your new password.",
      })
    } catch (error) {
      if (error instanceof ApiError && error.code === "CURRENT_PASSWORD_INVALID") {
        setErrors({ currentPassword: "Current password is incorrect." })
      } else if (error instanceof ApiError && error.code === "NEW_PASSWORD_SAME_AS_CURRENT") {
        setErrors({ newPassword: "New password must be different from the current one." })
      } else {
        setFormError("Something went wrong. Please try again.")
      }
      setPending(false)
    }
  }

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Change password</CardTitle>
        <CardDescription>
          You will be signed out on every device after changing your password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form noValidate onSubmit={handleSubmit} className="grid gap-4">
          {formError && <FormAlert>{formError}</FormAlert>}
          <FormField
            name="currentPassword"
            label="Current password"
            type="password"
            autoComplete="current-password"
            error={errors.currentPassword}
          />
          <FormField
            name="newPassword"
            label="New password"
            type="password"
            autoComplete="new-password"
            error={errors.newPassword}
          />
          <FormField
            name="confirmPassword"
            label="Confirm new password"
            type="password"
            autoComplete="new-password"
            error={errors.confirmPassword}
          />
          <SubmitButton pending={pending}>Change password</SubmitButton>
        </form>
      </CardContent>
    </Card>
  )
}
