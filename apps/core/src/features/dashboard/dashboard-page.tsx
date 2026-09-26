import { useTranslation } from "react-i18next"

import { useSession } from "@/features/auth/session-context"

/** Placeholder landing page for signed-in users. */
export function DashboardPage() {
  const { t } = useTranslation()
  const { session } = useSession()
  return (
    <div className="grid gap-1">
      <h1 className="text-2xl font-semibold tracking-tight">{t("dashboard.title")}</h1>
      <p className="text-muted-foreground">
        {t("dashboard.signedInAs", { email: session?.email })}
      </p>
    </div>
  )
}
