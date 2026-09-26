import { useState, type FormEvent } from "react"
import { useTranslation } from "react-i18next"
import { Link, useLocation } from "react-router"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { MessageKey } from "@/i18n"

import { FormAlert } from "../components/form-alert"
import { FormField } from "../components/form-field"
import type { LoginLocationState } from "../components/route-guards"
import { SubmitButton } from "../components/submit-button"
import { useSession } from "../session-context"
import { ApiError } from "../types"
import { hasErrors, message, validateEmail, type FieldErrors } from "../validation"

function errorMessage(error: unknown): MessageKey {
  if (error instanceof ApiError) {
    if (error.code === "INVALID_CREDENTIALS") return "login.invalidCredentials"
    if (error.code === "ACCOUNT_NOT_ACTIVE") return "login.accountNotActive"
  }
  return "common.somethingWentWrong"
}

export function LoginPage() {
  const { t } = useTranslation()
  const { signIn } = useSession()
  const notice = (useLocation().state as LoginLocationState)?.notice
  const [errors, setErrors] = useState<FieldErrors<"email" | "password">>({})
  const [formError, setFormError] = useState<MessageKey>()
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const email = String(form.get("email"))
    const password = String(form.get("password"))

    const nextErrors = {
      email: validateEmail(email),
      password: password ? undefined : message("validation.passwordRequired"),
    }
    setErrors(nextErrors)
    setFormError(undefined)
    if (hasErrors(nextErrors)) return

    setPending(true)
    try {
      // GuestRoute redirects once the session exists.
      await signIn(email, password)
    } catch (error) {
      setFormError(errorMessage(error))
      setPending(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("login.title")}</CardTitle>
        <CardDescription>{t("login.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form noValidate onSubmit={handleSubmit} className="grid gap-4">
          {notice && !formError && <FormAlert variant="success">{t(notice)}</FormAlert>}
          {formError && <FormAlert>{t(formError)}</FormAlert>}
          <FormField
            name="email"
            label={t("fields.email")}
            type="email"
            autoComplete="email"
            error={errors.email}
          />
          <div className="grid gap-2">
            <FormField
              name="password"
              label={t("fields.password")}
              type="password"
              autoComplete="current-password"
              error={errors.password}
            />
            <Link
              to="/forgot-password"
              className="justify-self-end text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              {t("login.forgotPassword")}
            </Link>
          </div>
          <SubmitButton pending={pending}>{t("login.submit")}</SubmitButton>
        </form>
      </CardContent>
      <CardFooter className="justify-center text-muted-foreground">
        <span>
          {t("login.noAccount")}{" "}
          <Link to="/register" className="text-foreground underline underline-offset-4">
            {t("login.createAccount")}
          </Link>
        </span>
      </CardFooter>
    </Card>
  )
}
