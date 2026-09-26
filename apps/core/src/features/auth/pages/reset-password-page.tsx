import { useState, type FormEvent } from "react"
import { useTranslation } from "react-i18next"
import { Link, useNavigate, useSearchParams } from "react-router"

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
import type { LoginLocationState } from "../components/route-guards"
import { SubmitButton } from "../components/submit-button"
import { ApiError } from "../types"
import {
  hasErrors,
  validateConfirmPassword,
  validatePassword,
  type FieldErrors,
} from "../validation"

type TokenProblem = "invalid" | "expired"

export function ResetPasswordPage() {
  const token = useSearchParams()[0].get("token") ?? ""
  // Remount per token so a new link never inherits the previous link's state.
  return <ResetPasswordForm key={token} token={token} />
}

function ResetPasswordForm({ token }: { token: string }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [errors, setErrors] = useState<FieldErrors<"newPassword" | "confirmPassword">>({})
  const [failed, setFailed] = useState(false)
  const [tokenProblem, setTokenProblem] = useState<TokenProblem | undefined>(
    token ? undefined : "invalid"
  )
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const newPassword = String(form.get("newPassword"))
    const confirmPassword = String(form.get("confirmPassword"))

    const nextErrors = {
      newPassword: validatePassword(newPassword),
      confirmPassword: validateConfirmPassword(newPassword, confirmPassword),
    }
    setErrors(nextErrors)
    setFailed(false)
    if (hasErrors(nextErrors)) return

    setPending(true)
    try {
      await api.resetPassword(token, newPassword)
      const state: LoginLocationState = { notice: "resetPassword.success" }
      navigate("/login", { replace: true, state })
    } catch (error) {
      if (error instanceof ApiError && error.code === "EXPIRED_PASSWORD_RESET_TOKEN") {
        setTokenProblem("expired")
      } else if (error instanceof ApiError && error.code === "INVALID_PASSWORD_RESET_TOKEN") {
        setTokenProblem("invalid")
      } else {
        setFailed(true)
      }
      setPending(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("resetPassword.title")}</CardTitle>
        <CardDescription>{t("resetPassword.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        {tokenProblem ? (
          <FormAlert>
            {t(tokenProblem === "expired" ? "resetPassword.expiredLink" : "resetPassword.invalidLink")}{" "}
            <Link to="/forgot-password" className="font-medium">
              {t("resetPassword.requestNewLink")}
            </Link>
          </FormAlert>
        ) : (
          <form noValidate onSubmit={handleSubmit} className="grid gap-4">
            {failed && <FormAlert>{t("common.somethingWentWrong")}</FormAlert>}
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
            <SubmitButton pending={pending}>{t("resetPassword.submit")}</SubmitButton>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
