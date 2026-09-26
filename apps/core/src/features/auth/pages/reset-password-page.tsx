import { useState, type FormEvent } from "react"
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

function RequestNewLink() {
  return (
    <Link to="/forgot-password" className="font-medium">
      Request a new link
    </Link>
  )
}

export function ResetPasswordPage() {
  const token = useSearchParams()[0].get("token") ?? ""
  // Remount per token so a new link never inherits the previous link's state.
  return <ResetPasswordForm key={token} token={token} />
}

function ResetPasswordForm({ token }: { token: string }) {
  const navigate = useNavigate()
  const [errors, setErrors] = useState<FieldErrors<"newPassword" | "confirmPassword">>({})
  const [formError, setFormError] = useState<string>()
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
    setFormError(undefined)
    if (hasErrors(nextErrors)) return

    setPending(true)
    try {
      await api.resetPassword(token, newPassword)
      const state: LoginLocationState = {
        notice: "Your password has been reset. Sign in with your new password.",
      }
      navigate("/login", { replace: true, state })
    } catch (error) {
      if (error instanceof ApiError && error.code === "EXPIRED_PASSWORD_RESET_TOKEN") {
        setTokenProblem("expired")
      } else if (error instanceof ApiError && error.code === "INVALID_PASSWORD_RESET_TOKEN") {
        setTokenProblem("invalid")
      } else {
        setFormError("Something went wrong. Please try again.")
      }
      setPending(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reset password</CardTitle>
        <CardDescription>Choose a new password for your account.</CardDescription>
      </CardHeader>
      <CardContent>
        {tokenProblem ? (
          <FormAlert>
            {tokenProblem === "expired"
              ? "This reset link has expired. Links are valid for 30 minutes. "
              : "This reset link is not valid. "}
            <RequestNewLink />
          </FormAlert>
        ) : (
          <form noValidate onSubmit={handleSubmit} className="grid gap-4">
            {formError && <FormAlert>{formError}</FormAlert>}
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
            <SubmitButton pending={pending}>Reset password</SubmitButton>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
