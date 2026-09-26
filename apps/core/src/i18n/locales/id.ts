import type { Messages } from "./en"

/** Indonesian copy. Typed against the English shape, so a missing key fails the build. */
const id: Messages = {
  common: {
    somethingWentWrong: "Terjadi kesalahan. Silakan coba lagi.",
    backToSignIn: "Kembali ke halaman masuk",
    goToSignIn: "Ke halaman masuk",
  },
  language: {
    label: "Bahasa",
    en: "English",
    id: "Bahasa Indonesia",
  },
  fields: {
    email: "Email",
    password: "Kata sandi",
    confirmPassword: "Konfirmasi kata sandi",
    currentPassword: "Kata sandi saat ini",
    newPassword: "Kata sandi baru",
    confirmNewPassword: "Konfirmasi kata sandi baru",
  },
  validation: {
    emailRequired: "Masukkan email Anda.",
    emailTooLong: "Email maksimal {{max}} karakter.",
    emailInvalid: "Masukkan email yang valid.",
    passwordRequired: "Masukkan kata sandi.",
    passwordTooShort: "Kata sandi minimal {{min}} karakter.",
    passwordTooLong: "Kata sandi maksimal {{max}} karakter.",
    confirmPasswordRequired: "Konfirmasi kata sandi Anda.",
    passwordMismatch: "Kata sandi tidak cocok.",
    currentPasswordRequired: "Masukkan kata sandi saat ini.",
    newPasswordSameAsCurrent: "Kata sandi baru harus berbeda dari kata sandi saat ini.",
  },
  login: {
    title: "Masuk",
    description: "Masukkan email dan kata sandi untuk melanjutkan.",
    forgotPassword: "Lupa kata sandi?",
    submit: "Masuk",
    noAccount: "Belum punya akun?",
    createAccount: "Daftar",
    invalidCredentials: "Email atau kata sandi salah.",
    accountNotActive:
      "Akun Anda belum aktif. Buka tautan verifikasi yang kami kirim ke email Anda, lalu masuk kembali.",
  },
  register: {
    title: "Buat akun",
    description: "Kami akan mengirim tautan verifikasi ke email Anda.",
    submit: "Buat akun",
    haveAccount: "Sudah punya akun?",
    signIn: "Masuk",
    emailTaken:
      "Email ini sudah terdaftar. Silakan masuk, atau atur ulang kata sandi Anda.",
  },
  registerSuccess: {
    title: "Periksa email Anda",
    description:
      "Kami telah mengirim tautan verifikasi ke <strong>{{email}}</strong>. Buka dalam 24 jam untuk mengaktifkan akun Anda.",
  },
  verifyEmail: {
    loadingTitle: "Memverifikasi email Anda",
    loadingDescription: "Mohon tunggu sebentar.",
    successTitle: "Email terverifikasi",
    successDescription: "Akun Anda sudah aktif. Silakan masuk.",
    invalidTitle: "Tautan tidak valid",
    invalidDescription:
      "Tautan verifikasi ini tidak valid. Pastikan Anda membuka tautan lengkap dari email.",
    expiredTitle: "Tautan kedaluwarsa",
    expiredDescription:
      "Tautan verifikasi berlaku selama 24 jam. Hubungi tim dukungan untuk mendapatkan tautan baru.",
  },
  forgotPassword: {
    title: "Lupa kata sandi",
    description: "Masukkan email Anda dan kami akan mengirim tautan untuk mengatur ulang kata sandi.",
    submit: "Kirim tautan",
    sentTitle: "Periksa email Anda",
    sentDescription:
      "Jika email tersebut terdaftar, kami telah mengirim tautan untuk mengatur ulang kata sandi. Tautan berlaku selama 30 menit.",
  },
  resetPassword: {
    title: "Atur ulang kata sandi",
    description: "Buat kata sandi baru untuk akun Anda.",
    submit: "Simpan kata sandi",
    invalidLink: "Tautan ini tidak valid.",
    expiredLink: "Tautan ini sudah kedaluwarsa. Tautan berlaku selama 30 menit.",
    requestNewLink: "Minta tautan baru",
    success: "Kata sandi Anda sudah diatur ulang. Silakan masuk dengan kata sandi baru.",
  },
  changePassword: {
    title: "Ubah kata sandi",
    description: "Anda akan keluar dari semua perangkat setelah mengubah kata sandi.",
    submit: "Ubah kata sandi",
    currentPasswordIncorrect: "Kata sandi saat ini salah.",
    success: "Kata sandi Anda sudah diubah. Silakan masuk dengan kata sandi baru.",
  },
  dashboard: {
    title: "Dasbor",
    signedInAs: "Masuk sebagai {{email}}.",
  },
  userMenu: {
    changePassword: "Ubah kata sandi",
    signOut: "Keluar",
  },
  notFound: {
    title: "Halaman tidak ditemukan",
    description: "Halaman yang Anda cari tidak ada.",
    goHome: "Ke beranda",
  },
}

export default id
