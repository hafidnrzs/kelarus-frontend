import { MailCheckIcon } from "lucide-react"
import { Trans, useTranslation } from "react-i18next"
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
  const { t } = useTranslation()
  const email = (useLocation().state as RegisterSuccessState | null)?.email

  // Only reachable right after registering; a direct visit has no email to show.
  if (!email) return <Navigate to="/register" replace />

  return (
    <Card>
      <CardHeader className="justify-items-center text-center">
        <MailCheckIcon className="mb-2 size-8 text-primary" />
        <CardTitle>{t("registerSuccess.title")}</CardTitle>
        <CardDescription>
          <Trans
            i18nKey="registerSuccess.description"
            values={{ email }}
            components={{ strong: <span className="font-medium text-foreground" /> }}
          />
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
          {t("common.backToSignIn")}
        </Button>
      </CardContent>
    </Card>
  )
}
