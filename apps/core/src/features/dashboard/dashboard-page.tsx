import { useSession } from "@/features/auth/session-context"

/** Placeholder landing page for signed-in users. */
export function DashboardPage() {
  const { session } = useSession()
  return (
    <div className="grid gap-1">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="text-muted-foreground">Signed in as {session?.email}.</p>
    </div>
  )
}
