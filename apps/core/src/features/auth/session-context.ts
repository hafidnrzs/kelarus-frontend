import { createContext, use } from "react"

import type { MessageKey } from "@/i18n"

import type { StoredSession } from "./session-storage"

/** Why the user left the protected area; the guard turns it into a Login notice. */
export type SignOutExit = { notice?: MessageKey }

type SessionContextValue = {
  session: StoredSession | null
  exit: SignOutExit | null
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  /** Drops tokens without calling the backend, e.g. after a password change. */
  clearLocalSession: (exit?: SignOutExit) => void
}

export const SessionContext = createContext<SessionContextValue | null>(null)

export function useSession() {
  const value = use(SessionContext)
  if (!value) throw new Error("useSession must be used inside SessionProvider")
  return value
}
