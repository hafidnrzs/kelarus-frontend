import { Outlet } from "react-router"

import { LanguageSwitcher } from "@/components/language-switcher"

/** Centered shell shared by every public auth page. */
export function AuthLayout() {
  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center gap-6 bg-muted/40 p-4">
      <div className="absolute top-3 right-3">
        <LanguageSwitcher />
      </div>
      <span className="text-lg font-semibold tracking-tight">KELARUS</span>
      <div className="w-full max-w-sm">
        <Outlet />
      </div>
    </main>
  )
}
