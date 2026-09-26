import { MailCheckIcon } from "lucide-react"
import { useState, type FormEvent } from "react"
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
import { validateEmail } from "../validation"

export function ForgotPasswordPage() {
  const [emailError, setEmailError] = useState<string>()
  const [formError, setFormError] = useState<string>()
  const [pending, setPending] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const email = String(new FormData(event.currentTarget).get("email"))

    const error = validateEmail(email)
    setEmailError(error)
    setFormError(undefined)
    if (error) return

    setPending(true)
    try {
      await api.forgotPassword(email)
      setSubmitted(true)
    } catch {
      setFormError("Something went wrong. Please try again.")
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
          <CardTitle>Check your email</CardTitle>
          <CardDescription>
            If an account exists for that email, we sent a link to reset your
            password. The link is valid for 30 minutes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            nativeButton={false}
            render={<Link to="/login" />}
          >
            Back to sign in
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Forgot password</CardTitle>
        <CardDescription>
          Enter your email and we will send you a link to reset your password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form noValidate onSubmit={handleSubmit} className="grid gap-4">
          {formError && <FormAlert>{formError}</FormAlert>}
          <FormField
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
            error={emailError}
          />
          <SubmitButton pending={pending}>Send reset link</SubmitButton>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <Link
          to="/login"
          className="text-muted-foreground underline-offset-4 hover:underline"
        >
          Back to sign in
        </Link>
      </CardFooter>
    </Card>
  )
}
