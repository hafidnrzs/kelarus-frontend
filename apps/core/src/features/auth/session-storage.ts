import type { TokenPair } from "./types"

/**
 * The only module that touches persisted auth state, so a later move to an
 * httpOnly refresh cookie stays local.
 */

const KEY = "kelarus.session"

export type StoredSession = {
  tokens: TokenPair
  // Mock only: the real app decodes `email` from the access token JWT.
  email: string
}

export function readSession(): StoredSession | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as StoredSession) : null
  } catch {
    return null
  }
}

export function writeSession(session: StoredSession) {
  localStorage.setItem(KEY, JSON.stringify(session))
}

export function clearSession() {
  localStorage.removeItem(KEY)
}
