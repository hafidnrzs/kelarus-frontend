import { Navigate, Outlet, useLocation } from "react-router"

import { useSession } from "../session-context"

export type LoginLocationState = { from?: string; notice?: string } | null

/** Renders child routes only for signed-out users; others go back where they came from. */
export function GuestRoute() {
  const { session } = useSession()
  const state = useLocation().state as LoginLocationState
  return session ? <Navigate to={state?.from ?? "/"} replace /> : <Outlet />
}

/**
 * Renders child routes only for signed-in users. A deliberate sign-out carries
 * its notice to Login; an expired visit remembers the page to return to.
 */
export function ProtectedRoute() {
  const { session, exit } = useSession()
  const location = useLocation()
  if (!session) {
    const state: LoginLocationState = exit
      ? { notice: exit.notice }
      : { from: location.pathname }
    return <Navigate to="/login" replace state={state} />
  }
  return <Outlet />
}
