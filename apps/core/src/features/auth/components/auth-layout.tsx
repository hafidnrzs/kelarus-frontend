import { Outlet } from "react-router"

/** Centered shell shared by every public auth page. */
export function AuthLayout() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted/40 p-4">
      <span className="text-lg font-semibold tracking-tight">KELARUS</span>
      <div className="w-full max-w-sm">
        <Outlet />
      </div>
    </main>
  )
}
