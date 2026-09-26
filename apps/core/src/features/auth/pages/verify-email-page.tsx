import {
  CircleCheckIcon,
  CircleXIcon,
  ClockAlertIcon,
  Loader2Icon,
} from "lucide-react"
import { useEffect, useRef, useState, type ReactNode } from "react"
import { useTranslation } from "react-i18next"
import { Link, useSearchParams } from "react-router"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { MessageKey } from "@/i18n"

import * as api from "../api"
import { ApiError } from "../types"

type Status = "loading" | "success" | "invalid" | "expired"

const CONTENT = {
  loading: {
    icon: <Loader2Icon className="mb-2 size-8 animate-spin text-muted-foreground" />,
    title: "verifyEmail.loadingTitle",
    description: "verifyEmail.loadingDescription",
  },
  success: {
    icon: <CircleCheckIcon className="mb-2 size-8 text-primary" />,
    title: "verifyEmail.successTitle",
    description: "verifyEmail.successDescription",
  },
  invalid: {
    icon: <CircleXIcon className="mb-2 size-8 text-destructive" />,
    title: "verifyEmail.invalidTitle",
    description: "verifyEmail.invalidDescription",
  },
  expired: {
    icon: <ClockAlertIcon className="mb-2 size-8 text-destructive" />,
    title: "verifyEmail.expiredTitle",
    description: "verifyEmail.expiredDescription",
  },
} satisfies Record<Status, { icon: ReactNode; title: MessageKey; description: MessageKey }>

export function VerifyEmailPage() {
  const token = useSearchParams()[0].get("token") ?? ""
  // Remount per token so a new link never inherits the previous link's state.
  return <VerifyEmailStatus key={token} token={token} />
}

function VerifyEmailStatus({ token }: { token: string }) {
  const { t } = useTranslation()
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
        <CardTitle>{t(content.title)}</CardTitle>
        <CardDescription>{t(content.description)}</CardDescription>
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
            {t("common.goToSignIn")}
          </Button>
        </CardContent>
      )}
    </Card>
  )
}
