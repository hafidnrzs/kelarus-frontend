import {
  CircleCheckIcon,
  CircleXIcon,
  ClockAlertIcon,
  Loader2Icon,
} from "lucide-react"
import { useEffect, useRef, useState, type ReactNode } from "react"
import { Link, useSearchParams } from "react-router"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import * as api from "../api"
import { ApiError } from "../types"

type Status = "loading" | "success" | "invalid" | "expired"

const CONTENT = {
  loading: {
    icon: <Loader2Icon className="mb-2 size-8 animate-spin text-muted-foreground" />,
    title: "Verifying your email",
    description: "This only takes a moment.",
  },
  success: {
    icon: <CircleCheckIcon className="mb-2 size-8 text-primary" />,
    title: "Email verified",
    description: "Your account is active. You can sign in now.",
  },
  invalid: {
    icon: <CircleXIcon className="mb-2 size-8 text-destructive" />,
    title: "Invalid link",
    description:
      "This verification link is not valid. Make sure you opened the full link from your email.",
  },
  expired: {
    icon: <ClockAlertIcon className="mb-2 size-8 text-destructive" />,
    title: "Link expired",
    description:
      "Verification links are valid for 24 hours. Contact support to get a new one.",
  },
} satisfies Record<Status, { icon: ReactNode; title: string; description: string }>

export function VerifyEmailPage() {
  const token = useSearchParams()[0].get("token") ?? ""
  // Remount per token so a new link never inherits the previous link's state.
  return <VerifyEmailStatus key={token} token={token} />
}

function VerifyEmailStatus({ token }: { token: string }) {
  const [status, setStatus] = useState<Status>("loading")
  const submittedToken = useRef<string | null>(null)

  useEffect(() => {
    // Tokens are single use, so never submit the same one twice (StrictMode re-runs effects).
    if (submittedToken.current === token) return
    submittedToken.current = token

    api
      .verifyEmail(token)
      .then(() => setStatus("success"))
      .catch((error: unknown) => {
        const expired =
          error instanceof ApiError && error.code === "EXPIRED_VERIFICATION_TOKEN"
        setStatus(expired ? "expired" : "invalid")
      })
  }, [token])

  const content = CONTENT[status]
  return (
    <Card>
      <CardHeader className="justify-items-center text-center">
        {content.icon}
        <CardTitle>{content.title}</CardTitle>
        <CardDescription>{content.description}</CardDescription>
      </CardHeader>
      {status !== "loading" && (
        <CardContent>
          <Button
            variant={status === "success" ? "default" : "outline"}
            size="lg"
            className="w-full"
            nativeButton={false}
            render={<Link to="/login" />}
          >
            Go to sign in
          </Button>
        </CardContent>
      )}
    </Card>
  )
}
