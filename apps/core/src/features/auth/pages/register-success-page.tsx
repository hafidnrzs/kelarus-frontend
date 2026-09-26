import { MailCheckIcon } from "lucide-react"
import { Link, Navigate, useLocation } from "react-router"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import type { RegisterSuccessState } from "./register-page"

export function RegisterSuccessPage() {
  const email = (useLocation().state as RegisterSuccessState | null)?.email

  // Only reachable right after registering; a direct visit has no email to show.
  if (!email) return <Navigate to="/register" replace />

  return (
    <Card>
      <CardHeader className="justify-items-center text-center">
        <MailCheckIcon className="mb-2 size-8 text-primary" />
        <CardTitle>Check your email</CardTitle>
        <CardDescription>
          We sent a verification link to{" "}
          <span className="font-medium text-foreground">{email}</span>. Open it
          within 24 hours to activate your account.
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
