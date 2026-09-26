import { useState, type ReactNode } from "react"

import * as api from "./api"
import { SessionContext, type SignOutExit } from "./session-context"
import { clearSession, readSession, writeSession } from "./session-storage"

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState(readSession)
  const [exit, setExit] = useState<SignOutExit | null>(null)

  async function signIn(email: string, password: string) {
    const tokens = await api.login(email, password)
    const next = { tokens, email: email.trim().toLowerCase() }
    writeSession(next)
    setSession(next)
    setExit(null)
  }

  function clearLocalSession(nextExit: SignOutExit = {}) {
    clearSession()
    setSession(null)
    setExit(nextExit)
  }

  async function signOut() {
    if (session) await api.logout(session.tokens.refreshToken)
    clearLocalSession()
  }

  return (
    <SessionContext value={{ session, exit, signIn, signOut, clearLocalSession }}>
      {children}
    </SessionContext>
  )
}
