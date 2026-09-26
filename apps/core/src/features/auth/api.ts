import { ApiError, type TokenPair } from "./types"

/**
 * Simulated account service, following the contract in
 * docs/reference/authentication.md. Replace each body with a real request
 * when the backend is ready; callers already handle `ApiError`.
 *
 * Magic inputs to reach error states:
 * - Login: `wrong@...` gives INVALID_CREDENTIALS, `pending@...` gives ACCOUNT_NOT_ACTIVE
 * - Register: `taken@...` gives EMAIL_ALREADY_REGISTERED
 * - Verify and reset tokens: `expired` or `invalid`
 * - Change password: current password `wrongpass` gives CURRENT_PASSWORD_INVALID
 */

const DELAY_MS = 600

function delay() {
  return new Promise((resolve) => setTimeout(resolve, DELAY_MS))
}

function localPart(email: string) {
  return email.trim().toLowerCase().split("@")[0]
}

function fakeTokenPair(): TokenPair {
  return {
    accessToken: "mock-access-token",
    refreshToken: "mock-refresh-token",
    tokenType: "Bearer",
    expiresIn: 900,
  }
}

export async function login(email: string, _password: string): Promise<TokenPair> {
  await delay()
  if (localPart(email) === "wrong") {
    throw new ApiError("INVALID_CREDENTIALS", "Invalid email or password")
  }
  if (localPart(email) === "pending") {
    throw new ApiError("ACCOUNT_NOT_ACTIVE", "Account is not active")
  }
  return fakeTokenPair()
}

export async function register(email: string, _password: string) {
  await delay()
  if (localPart(email) === "taken") {
    throw new ApiError("EMAIL_ALREADY_REGISTERED", "Email is already registered")
  }
  return {
    userId: crypto.randomUUID(),
    email: email.trim().toLowerCase(),
    status: "PENDING_VERIFICATION" as const,
    verificationRequired: true,
  }
}

export async function verifyEmail(token: string) {
  await delay()
  if (token === "expired") {
    throw new ApiError("EXPIRED_VERIFICATION_TOKEN", "Verification token expired")
  }
  if (!token || token === "invalid") {
    throw new ApiError("INVALID_VERIFICATION_TOKEN", "Verification token invalid")
  }
  return { message: "Email verified" }
}

export async function forgotPassword(_email: string) {
  await delay()
  return { message: "If the email is registered, a reset link has been sent" }
}

export async function resetPassword(token: string, _newPassword: string) {
  await delay()
  if (token === "expired") {
    throw new ApiError("EXPIRED_PASSWORD_RESET_TOKEN", "Reset token expired")
  }
  if (!token || token === "invalid") {
    throw new ApiError("INVALID_PASSWORD_RESET_TOKEN", "Reset token invalid")
  }
  return { message: "Password reset" }
}

export async function changePassword(currentPassword: string, newPassword: string) {
  await delay()
  if (currentPassword === "wrongpass") {
    throw new ApiError("CURRENT_PASSWORD_INVALID", "Current password is invalid")
  }
  if (currentPassword === newPassword) {
    throw new ApiError(
      "NEW_PASSWORD_SAME_AS_CURRENT",
      "New password must differ from the current one"
    )
  }
  return { message: "Password changed" }
}

export async function logout(_refreshToken: string) {
  await delay()
  return { message: "Logged out" }
}
