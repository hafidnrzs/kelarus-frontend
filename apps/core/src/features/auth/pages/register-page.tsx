import { useState, type FormEvent } from "react"
import { useTranslation } from "react-i18next"
import { Link, useNavigate } from "react-router"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { MessageKey } from "@/i18n"

import * as api from "../api"
import { FormAlert } from "../components/form-alert"
import { FormField } from "../components/form-field"
import { SubmitButton } from "../components/submit-button"
import { ApiError } from "../types"
import {
  hasErrors,
  validateConfirmPassword,
  validateEmail,
  validatePassword,
  type FieldErrors,
} from "../validation"

export type RegisterSuccessState = { email: string }

function errorMessage(error: unknown): MessageKey {
  if (error instanceof ApiError && error.code === "EMAIL_ALREADY_REGISTERED") {
    return "register.emailTaken"
  }
  return "common.somethingWentWrong"
}

export function RegisterPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [errors, setErrors] = useState<
    FieldErrors<"email" | "password" | "confirmPassword">
  >({})
  const [formError, setFormError] = useState<MessageKey>()
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const email = String(form.get("email"))
    const password = String(form.get("password"))
    const confirmPassword = String(form.get("confirmPassword"))

    const nextErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(password, confirmPassword),
    }
    setErrors(nextErrors)
    setFormError(undefined)
    if (hasErrors(nextErrors)) return

    setPending(true)
    try {
      const result = await api.register(email, password)
      const state: RegisterSuccessState = { email: result.email }
      navigate("/register/success", { state })
    } catch (error) {
      setFormError(errorMessage(error))
      setPending(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("register.title")}</CardTitle>
        <CardDescription>{t("register.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form noValidate onSubmit={handleSubmit} className="grid gap-4">
          {formError && <FormAlert>{t(formError)}</FormAlert>}
          <FormField
            name="email"
            label={t("fields.email")}
            type="email"
            autoComplete="email"
            error={errors.email}
          />
          <FormField
            name="password"
            label={t("fields.password")}
            type="password"
            autoComplete="new-password"
            error={errors.password}
          />
          <FormField
            name="confirmPassword"
            label={t("fields.confirmPassword")}
            type="password"
            autoComplete="new-password"
            error={errors.confirmPassword}
          />
          <SubmitButton pending={pending}>{t("register.submit")}</SubmitButton>
        </form>
      </CardContent>
      <CardFooter className="justify-center text-muted-foreground">
        <span>
          {t("register.haveAccount")}{" "}
          <Link to="/login" className="text-foreground underline underline-offset-4">
            {t("register.signIn")}
          </Link>
        </span>
      </CardFooter>
    </Card>
  )
}
