/** Shapes from the account service. See docs/reference/authentication.md. */

export type TokenPair = {
  accessToken: string
  refreshToken: string
  tokenType: "Bearer"
  expiresIn: number
}

export type UserStatus =
  | "PENDING_VERIFICATION"
  | "ACTIVE"
  | "LOCKED"
  | "DISABLED"

export type ApiErrorCode =
  | "INVALID_REQUEST"
  | "UNAUTHENTICATED"
  | "ACCESS_DENIED"
  | "EMAIL_ALREADY_REGISTERED"
  | "INVALID_VERIFICATION_TOKEN"
  | "EXPIRED_VERIFICATION_TOKEN"
  | "INVALID_CREDENTIALS"
  | "ACCOUNT_NOT_ACTIVE"
  | "INVALID_REFRESH_TOKEN"
  | "EXPIRED_REFRESH_TOKEN"
  | "INVALID_PASSWORD_RESET_TOKEN"
  | "EXPIRED_PASSWORD_RESET_TOKEN"
  | "CURRENT_PASSWORD_INVALID"
  | "NEW_PASSWORD_SAME_AS_CURRENT"

export class ApiError extends Error {
  readonly code: ApiErrorCode

  constructor(code: ApiErrorCode, message: string) {
    super(message)
    this.name = "ApiError"
    this.code = code
  }
}
