import { useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router"

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
import { ApiError } from "../types"
import {
  hasErrors,
  validateConfirmPassword,
  validateEmail,
  validatePassword,
  type FieldErrors,
} from "../validation"

export type RegisterSuccessState = { email: string }

function errorMessage(error: unknown) {
  if (error instanceof ApiError && error.code === "EMAIL_ALREADY_REGISTERED") {
    return "This email is already registered. Sign in instead, or reset your password."
  }
  return "Something went wrong. Please try again."
}

export function RegisterPage() {
  const navigate = useNavigate()
  const [errors, setErrors] = useState<
    FieldErrors<"email" | "password" | "confirmPassword">
  >({})
  const [formError, setFormError] = useState<string>()
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
        <CardTitle>Create an account</CardTitle>
        <CardDescription>We will send a verification link to your email.</CardDescription>
      </CardHeader>
      <CardContent>
        <form noValidate onSubmit={handleSubmit} className="grid gap-4">
          {formError && <FormAlert>{formError}</FormAlert>}
          <FormField
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
            error={errors.email}
          />
          <FormField
            name="password"
            label="Password"
            type="password"
            autoComplete="new-password"
            error={errors.password}
          />
          <FormField
            name="confirmPassword"
            label="Confirm password"
            type="password"
            autoComplete="new-password"
            error={errors.confirmPassword}
          />
          <SubmitButton pending={pending}>Create account</SubmitButton>
        </form>
      </CardContent>
      <CardFooter className="justify-center text-muted-foreground">
        <span>
          Already have an account?{" "}
          <Link to="/login" className="text-foreground underline underline-offset-4">
            Sign in
          </Link>
        </span>
      </CardFooter>
    </Card>
  )
}
