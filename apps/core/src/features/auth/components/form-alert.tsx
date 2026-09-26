import { CircleAlertIcon, CircleCheckIcon } from "lucide-react"
import type { ReactNode } from "react"

import { Alert, AlertDescription } from "@/components/ui/alert"

/** Form-level message for API errors or success notices. */
export function FormAlert({
  variant = "error",
  children,
}: {
  variant?: "error" | "success"
  children: ReactNode
}) {
  const Icon = variant === "error" ? CircleAlertIcon : CircleCheckIcon
  return (
    <Alert variant={variant === "error" ? "destructive" : "default"}>
      <Icon />
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  )
}
