import { useState, type FormEvent } from "react"
import { useTranslation } from "react-i18next"

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
  message,
  validateConfirmPassword,
  validatePassword,
  type FieldErrors,
} from "../validation"

type Field = "currentPassword" | "newPassword" | "confirmPassword"

export function ChangePasswordPage() {
  const { t } = useTranslation()
  const { clearLocalSession } = useSession()
  const [errors, setErrors] = useState<FieldErrors<Field>>({})
  const [failed, setFailed] = useState(false)
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const currentPassword = String(form.get("currentPassword"))
    const newPassword = String(form.get("newPassword"))
    const confirmPassword = String(form.get("confirmPassword"))

    const nextErrors: FieldErrors<Field> = {
      currentPassword: currentPassword
        ? undefined
        : message("validation.currentPasswordRequired"),
      newPassword:
        validatePassword(newPassword) ??
        (newPassword === currentPassword
          ? message("validation.newPasswordSameAsCurrent")
          : undefined),
      confirmPassword: validateConfirmPassword(newPassword, confirmPassword),
    }
    setErrors(nextErrors)
    setFailed(false)
    if (hasErrors(nextErrors)) return

    setPending(true)
    try {
      await api.changePassword(currentPassword, newPassword)
      // The backend revokes every refresh token, so sign out here too. ProtectedRoute redirects.
      clearLocalSession({ notice: "changePassword.success" })
    } catch (error) {
      if (error instanceof ApiError && error.code === "CURRENT_PASSWORD_INVALID") {
        setErrors({ currentPassword: message("changePassword.currentPasswordIncorrect") })
      } else if (error instanceof ApiError && error.code === "NEW_PASSWORD_SAME_AS_CURRENT") {
        setErrors({ newPassword: message("validation.newPasswordSameAsCurrent") })
      } else {
        setFailed(true)
      }
      setPending(false)
    }
  }

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>{t("changePassword.title")}</CardTitle>
        <CardDescription>{t("changePassword.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form noValidate onSubmit={handleSubmit} className="grid gap-4">
          {failed && <FormAlert>{t("common.somethingWentWrong")}</FormAlert>}
          <FormField
            name="currentPassword"
            label={t("fields.currentPassword")}
            type="password"
            autoComplete="current-password"
            error={errors.currentPassword}
          />
          <FormField
            name="newPassword"
            label={t("fields.newPassword")}
            type="password"
            autoComplete="new-password"
            error={errors.newPassword}
          />
          <FormField
            name="confirmPassword"
            label={t("fields.confirmNewPassword")}
            type="password"
            autoComplete="new-password"
            error={errors.confirmPassword}
          />
          <SubmitButton pending={pending}>{t("changePassword.submit")}</SubmitButton>
        </form>
      </CardContent>
    </Card>
  )
}
