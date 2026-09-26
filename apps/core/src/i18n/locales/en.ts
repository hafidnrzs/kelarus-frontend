/** English copy. Its shape is the source of truth for every other locale. */
const en = {
  common: {
    somethingWentWrong: "Something went wrong. Please try again.",
    backToSignIn: "Back to sign in",
    goToSignIn: "Go to sign in",
  },
  language: {
    label: "Language",
    en: "English",
    id: "Bahasa Indonesia",
  },
  fields: {
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm password",
    currentPassword: "Current password",
    newPassword: "New password",
    confirmNewPassword: "Confirm new password",
  },
  validation: {
    emailRequired: "Enter your email.",
    emailTooLong: "Email must be at most {{max}} characters.",
    emailInvalid: "Enter a valid email.",
    passwordRequired: "Enter a password.",
    passwordTooShort: "Password must be at least {{min}} characters.",
    passwordTooLong: "Password must be at most {{max}} characters.",
    confirmPasswordRequired: "Confirm your password.",
    passwordMismatch: "Passwords do not match.",
    currentPasswordRequired: "Enter your current password.",
    newPasswordSameAsCurrent: "New password must be different from the current one.",
  },
  login: {
    title: "Sign in",
    description: "Enter your email and password to continue.",
    forgotPassword: "Forgot password?",
    submit: "Sign in",
    noAccount: "No account yet?",
    createAccount: "Create one",
    invalidCredentials: "Wrong email or password.",
    accountNotActive:
      "Your account is not active yet. Open the verification link we sent to your email, then sign in again.",
  },
  register: {
    title: "Create an account",
    description: "We will send a verification link to your email.",
    submit: "Create account",
    haveAccount: "Already have an account?",
    signIn: "Sign in",
    emailTaken:
      "This email is already registered. Sign in instead, or reset your password.",
  },
  registerSuccess: {
    title: "Check your email",
    description:
      "We sent a verification link to <strong>{{email}}</strong>. Open it within 24 hours to activate your account.",
  },
  verifyEmail: {
    loadingTitle: "Verifying your email",
    loadingDescription: "This only takes a moment.",
    successTitle: "Email verified",
    successDescription: "Your account is active. You can sign in now.",
    invalidTitle: "Invalid link",
    invalidDescription:
      "This verification link is not valid. Make sure you opened the full link from your email.",
    expiredTitle: "Link expired",
    expiredDescription:
      "Verification links are valid for 24 hours. Contact support to get a new one.",
  },
  forgotPassword: {
    title: "Forgot password",
    description: "Enter your email and we will send you a link to reset your password.",
    submit: "Send reset link",
    sentTitle: "Check your email",
    sentDescription:
      "If an account exists for that email, we sent a link to reset your password. The link is valid for 30 minutes.",
  },
  resetPassword: {
    title: "Reset password",
    description: "Choose a new password for your account.",
    submit: "Reset password",
    invalidLink: "This reset link is not valid.",
    expiredLink: "This reset link has expired. Links are valid for 30 minutes.",
    requestNewLink: "Request a new link",
    success: "Your password has been reset. Sign in with your new password.",
  },
  changePassword: {
    title: "Change password",
    description: "You will be signed out on every device after changing your password.",
    submit: "Change password",
    currentPasswordIncorrect: "Current password is incorrect.",
    success: "Your password has been changed. Sign in with your new password.",
  },
  dashboard: {
    title: "Dashboard",
    signedInAs: "Signed in as {{email}}.",
  },
  userMenu: {
    changePassword: "Change password",
    signOut: "Sign out",
  },
  notFound: {
    title: "Page not found",
    description: "The page you are looking for does not exist.",
    goHome: "Go home",
  },
}

export type Messages = typeof en

export default en
