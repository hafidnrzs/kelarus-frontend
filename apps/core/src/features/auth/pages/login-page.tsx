import { useState, type FormEvent } from "react"
import { Link, useLocation } from "react-router"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { FormAlert } from "../components/form-alert"
import { FormField } from "../components/form-field"
import type { LoginLocationState } from "../components/route-guards"
import { SubmitButton } from "../components/submit-button"
import { useSession } from "../session-context"
import { ApiError } from "../types"
import { hasErrors, validateEmail, type FieldErrors } from "../validation"

function errorMessage(error: unknown) {
  if (error instanceof ApiError) {
    if (error.code === "INVALID_CREDENTIALS") return "Wrong email or password."
    if (error.code === "ACCOUNT_NOT_ACTIVE") {
      return "Your account is not active yet. Open the verification link we sent to your email, then sign in again."
    }
  }
  return "Something went wrong. Please try again."
}

export function LoginPage() {
  const { signIn } = useSession()
  const notice = (useLocation().state as LoginLocationState)?.notice
  const [errors, setErrors] = useState<FieldErrors<"email" | "password">>({})
  const [formError, setFormError] = useState<string>()
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const email = String(form.get("email"))
    const password = String(form.get("password"))

    const nextErrors = {
      email: validateEmail(email),
      password: password ? undefined : "Enter your password.",
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
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Enter your email and password to continue.</CardDescription>
      </CardHeader>
      <CardContent>
        <form noValidate onSubmit={handleSubmit} className="grid gap-4">
          {notice && !formError && <FormAlert variant="success">{notice}</FormAlert>}
          {formError && <FormAlert>{formError}</FormAlert>}
          <FormField
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
            error={errors.email}
          />
          <div className="grid gap-2">
            <FormField
              name="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              error={errors.password}
            />
            <Link
              to="/forgot-password"
              className="justify-self-end text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <SubmitButton pending={pending}>Sign in</SubmitButton>
        </form>
      </CardContent>
      <CardFooter className="justify-center text-muted-foreground">
        <span>
          No account yet?{" "}
          <Link to="/register" className="text-foreground underline underline-offset-4">
            Create one
          </Link>
        </span>
      </CardFooter>
    </Card>
  )
}
