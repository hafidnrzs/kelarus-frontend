import { useTranslation } from "react-i18next"
import { Link } from "react-router"

import { Button } from "@/components/ui/button"

export function NotFoundPage() {
  const { t } = useTranslation()
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 p-4 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">{t("notFound.title")}</h1>
      <p className="text-muted-foreground">{t("notFound.description")}</p>
      <Button nativeButton={false} render={<Link to="/" />}>
        {t("notFound.goHome")}
      </Button>
    </main>
  )
}
