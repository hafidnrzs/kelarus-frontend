# Authentication

Reference for building the authentication feature against the backend
account service (`kelarus-platform/component/account`).

Source of truth: `component/account/README.md` in `kelarus-platform`,
checked at commit `524784e`. Re-check it when the backend changes.

## API contract

Base URL through the API Gateway: `http://localhost:50002/account-component`

All endpoints are `POST` with a JSON body. Endpoints marked 🔒 require
`Authorization: Bearer <accessToken>`.

| Endpoint                          | Body                                | Success                                                   | Errors                                                                 |
| --------------------------------- | ----------------------------------- | --------------------------------------------------------- | ---------------------------------------------------------------------- |
| `/v1/public/auth/register`        | `email`, `password`                 | 201: `userId`, `email`, `status`, `verificationRequired` | 409 `EMAIL_ALREADY_REGISTERED`                                         |
| `/v1/public/auth/verify-email`    | `token`                             | 200: `message`                                            | 400 `INVALID_VERIFICATION_TOKEN`, `EXPIRED_VERIFICATION_TOKEN`         |
| `/v1/public/auth/login`           | `email`, `password`                 | 200: token pair                                           | 401 `INVALID_CREDENTIALS`, 403 `ACCOUNT_NOT_ACTIVE`                    |
| `/v1/public/auth/refresh`         | `refreshToken`                      | 200: new token pair (rotated)                             | 401 `INVALID_REFRESH_TOKEN`, `EXPIRED_REFRESH_TOKEN`                   |
| `/v1/public/auth/forgot-password` | `email`                             | 200: generic message, same for every email                | none                                                                   |
| `/v1/public/auth/reset-password`  | `token`, `newPassword`              | 200: `message`                                            | 400 `INVALID_PASSWORD_RESET_TOKEN`, `EXPIRED_PASSWORD_RESET_TOKEN`     |
| `/v1/auth/change-password` 🔒     | `currentPassword`, `newPassword`    | 200: `message`                                            | 400 `CURRENT_PASSWORD_INVALID`, `NEW_PASSWORD_SAME_AS_CURRENT`         |
| `/v1/auth/logout` 🔒              | `refreshToken`                      | 200: `message`, idempotent                                | none                                                                   |

### Shapes

```ts
type TokenPair = {
  accessToken: string;
  refreshToken: string;
  tokenType: "Bearer";
  expiresIn: number; // access token lifetime in seconds
};

type ApiError = { code: string; message: string };

type UserStatus = "PENDING_VERIFICATION" | "ACTIVE" | "LOCKED" | "DISABLED";
```

### Common errors

| Status | Code               | Meaning                                         |
| ------ | ------------------ | ----------------------------------------------- |
| 400    | `INVALID_REQUEST`  | Validation failed. No per-field detail returned |
| 401    | `UNAUTHENTICATED`  | Missing, invalid, or expired access token       |
| 403    | `ACCESS_DENIED`    | Authenticated but not allowed                   |

### Validation rules

The backend returns no per-field errors, so the frontend must validate
before submitting.

- Email: valid format, max 254 characters. Backend trims and lowercases it.
- Password: 8–128 characters, no complexity rules.

### Token facts

| Item                   | Lifetime | Notes                                               |
| ---------------------- | -------- | --------------------------------------------------- |
| Access token (JWT)     | 15 min   | Claims: `sub` (user UUID), `email`, `iat`, `exp`    |
| Refresh token          | 30 days  | Rotated on every refresh; the old one stops working |
| Email verification link | 24 h    | Token arrives as a query parameter                  |
| Password reset link    | 30 min   | Token arrives as a query parameter                  |

- There is no `/me` endpoint. Read `sub` and `email` by decoding the JWT.
- Tokens travel in the request body, not cookies. The backend has an empty
  `RefreshTokenCookieFactory`, so this may move to an httpOnly cookie.
- Changing or resetting the password revokes every refresh token. Access
  tokens already issued stay valid until they expire.

## Flows

```text
Register ─► PENDING_VERIFICATION ─► "Check your email"
                                           │
                               email link (?token=...)
                                           ▼
                                     Verify email ─► ACTIVE ─► Login

Login ─► store token pair ─► Dashboard
  ├─ 401 INVALID_CREDENTIALS ─► "Wrong email or password"
  └─ 403 ACCOUNT_NOT_ACTIVE  ─► explain verification status

Protected request ─► 401 ─► refresh ─► store new pair ─► retry request
                                └─ fails ─► clear tokens ─► Login

Forgot password ─► generic message ─► email link (?token=...)
                                             ▼
                                      Reset password ─► Login

Change password ─► success ─► clear tokens ─► Login
Logout ─► send refreshToken ─► clear tokens ─► Login
```

Frontend obligations:

- Run only one refresh request at a time. Parallel refreshes with a rotated
  token invalidate each other and log the user out.
- After change password or reset password, log out locally and redirect to
  Login.
- Keep token storage behind one module so the cookie migration stays local.

## Pages

### Public (guest only, redirect to Dashboard when signed in)

| Page              | Route                      | Endpoint                          | Notes                                                                                   |
| ----------------- | -------------------------- | --------------------------------- | --------------------------------------------------------------------------------------- |
| Login             | `/login`                   | `login`                           | Links to Register and Forgot password. Handle 401 and 403 differently                    |
| Register          | `/register`                | `register`                        | Email, password, confirm password. Confirm is frontend only                             |
| Check your email  | `/register/success`        | none                              | Show the registered email. No resend button: the backend has no resend endpoint         |
| Verify email      | `/verify-email?token=...`  | `verify-email`                    | Submit on load. States: loading, success, invalid, expired. CTA to Login                |
| Forgot password   | `/forgot-password`         | `forgot-password`                 | Always show the same message after submit                                               |
| Reset password    | `/reset-password?token=...` | `reset-password`                 | New password and confirm. On expired token, link back to Forgot password                |

### Protected (signed in only, redirect to Login otherwise)

| Page                 | Route                         | Endpoint          | Notes                                                        |
| -------------------- | ----------------------------- | ----------------- | ------------------------------------------------------------ |
| Dashboard            | `/`                           | none              | Placeholder. Show the email from the JWT                     |
| Change password      | `/settings/password`          | `change-password` | Current, new, confirm. On success, log out and go to Login   |

Logout is an action in the user menu, not a page.

Routes are suggestions. Finalize them in the spec.

### Later

- **OTP login**: `POST /auth/request-otp` with `identifier`, `loginTypeEnum`
  (`ADMIN` or `USER`), and `deliveryType` (`SMS`, `EMAIL`, `WHATSAPP`).
  The response includes `expiresAt` and `resendAfter` for a countdown.
  Not implemented in the backend yet.

## Backend status

Known issues at commit `524784e` that block end-to-end testing:

- Controllers do not compile: `AccountController` declares no service
  fields, `AuthController` calls an undefined `authentication` field, and
  `requestOtp`/`verifyOtp` are missing from `AuthenticationService`.
- Controller prefixes `/auth` and `/account` do not match the security
  rules, which only allow `/v1/public/auth/**` and `/v1/auth/**`.
- No email delivery: verification and reset tokens are created but never
  sent.
- No CORS configuration.

Until these are fixed, build against a mock that follows the contract above.
