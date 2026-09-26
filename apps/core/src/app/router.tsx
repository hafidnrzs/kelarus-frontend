import { createBrowserRouter } from "react-router"

import { AppLayout } from "@/components/app-layout"
import { AuthLayout } from "@/features/auth/components/auth-layout"
import { GuestRoute, ProtectedRoute } from "@/features/auth/components/route-guards"
import { ChangePasswordPage } from "@/features/auth/pages/change-password-page"
import { ForgotPasswordPage } from "@/features/auth/pages/forgot-password-page"
import { LoginPage } from "@/features/auth/pages/login-page"
import { RegisterPage } from "@/features/auth/pages/register-page"
import { RegisterSuccessPage } from "@/features/auth/pages/register-success-page"
import { ResetPasswordPage } from "@/features/auth/pages/reset-password-page"
import { VerifyEmailPage } from "@/features/auth/pages/verify-email-page"
import { DashboardPage } from "@/features/dashboard/dashboard-page"

import { NotFoundPage } from "./not-found-page"

/** Routes follow docs/reference/authentication.md. */
export const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: "login", element: <LoginPage /> },
          { path: "register", element: <RegisterPage /> },
          { path: "register/success", element: <RegisterSuccessPage /> },
          { path: "verify-email", element: <VerifyEmailPage /> },
          { path: "forgot-password", element: <ForgotPasswordPage /> },
          { path: "reset-password", element: <ResetPasswordPage /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: "settings/password", element: <ChangePasswordPage /> },
        ],
      },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
])
