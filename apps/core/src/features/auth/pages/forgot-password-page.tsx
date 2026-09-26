import { MailCheckIcon } from "lucide-react"
import { useState, type FormEvent } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import * as api from "../api"
import { FormAlert } from "../components/form-alert"
import { FormField } from "../components/form-field"
import { SubmitButton } from "../components/submit-button"
import { validateEmail, type Message } from "../validation"

export function ForgotPasswordPage() {
  const { t } = useTranslation()
  const [emailError, setEmailError] = useState<Message>()
  const [failed, setFailed] = useState(false)
  const [pending, setPending] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const email = String(new FormData(event.currentTarget).get("email"))

    const error = validateEmail(email)
    setEmailError(error)
    setFailed(false)
    if (error) return

    setPending(true)
    try {
      await api.forgotPassword(email)
      setSubmitted(true)
    } catch {
      setFailed(true)
    } finally {
      setPending(false)
    }
  }

  if (submitted) {
    // Same message for every email, so the page never reveals who has an account.
    return (
      <Card>
        <CardHeader className="justify-items-center text-center">
          <MailCheckIcon className="mb-2 size-8 text-primary" />
          <CardTitle>{t("forgotPassword.sentTitle")}</CardTitle>
          <CardDescription>{t("forgotPassword.sentDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            nativeButton={false}
            render={<Link to="/login" />}
          >
            {t("common.backToSignIn")}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("forgotPassword.title")}</CardTitle>
        <CardDescription>{t("forgotPassword.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form noValidate onSubmit={handleSubmit} className="grid gap-4">
          {failed && <FormAlert>{t("common.somethingWentWrong")}</FormAlert>}
          <FormField
            name="email"
            label={t("fields.email")}
            type="email"
            autoComplete="email"
            error={emailError}
          />
          <SubmitButton pending={pending}>{t("forgotPassword.submit")}</SubmitButton>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <Link
          to="/login"
          className="text-muted-foreground underline-offset-4 hover:underline"
        >
          {t("common.backToSignIn")}
        </Link>
      </CardFooter>
    </Card>
  )
}
