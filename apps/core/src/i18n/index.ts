import i18n, { type ParseKeys } from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import { initReactI18next } from "react-i18next"

import en from "./locales/en"
import id from "./locales/id"

export const LANGUAGES = ["id", "en"] as const
export type Language = (typeof LANGUAGES)[number]

/** A translation key, for code that stores copy to render later (errors, notices). */
export type MessageKey = ParseKeys

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en }, id: { translation: id } },
    supportedLngs: LANGUAGES,
    fallbackLng: "id",
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: "kelarus.language",
      caches: ["localStorage"],
      // Store "en" rather than "en-US" so the saved choice matches LANGUAGES.
      convertDetectedLanguage: (language) => language.split("-")[0],
    },
  })

function syncDocumentLanguage(language: string) {
  document.documentElement.lang = language
}

syncDocumentLanguage(i18n.resolvedLanguage ?? "id")
i18n.on("languageChanged", syncDocumentLanguage)

export default i18n
