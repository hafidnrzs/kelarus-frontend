import { Loader2Icon } from "lucide-react"
import type { ReactNode } from "react"

import { Button } from "@/components/ui/button"

/** Full-width submit button that shows a spinner while the request runs. */
export function SubmitButton({
  pending,
  children,
}: {
  pending: boolean
  children: ReactNode
}) {
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending && <Loader2Icon className="animate-spin" />}
      {children}
    </Button>
  )
}
