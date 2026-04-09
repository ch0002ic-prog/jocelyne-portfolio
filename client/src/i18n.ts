import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en";
import zhCN from "./locales/zh-CN";

export type SupportedLanguage = "en" | "zh-CN";

export const DEFAULT_LANGUAGE: SupportedLanguage = "en";

export const supportedLanguages: Array<{
  code: SupportedLanguage;
  shortLabel: string;
}> = [
  { code: DEFAULT_LANGUAGE, shortLabel: "EN" },
  { code: "zh-CN", shortLabel: "简中" },
];

const STORAGE_KEY = "portfolio-language";

const resources = {
  en: {
    translation: en,
  },
  "zh-CN": {
    translation: zhCN,
  },
} as const;

export function isSupportedLanguage(
  value: string | null | undefined
): value is SupportedLanguage {
  return value === DEFAULT_LANGUAGE || value === "zh-CN";
}

export function getLanguagePath(
  language: SupportedLanguage,
  suffix = ""
): string {
  if (!suffix || suffix === "/") {
    return `/${language}`;
  }

  return `/${language}${suffix.startsWith("/") ? suffix : `/${suffix}`}`;
}

export function getLanguageFromPath(path: string): SupportedLanguage | null {
  if (path === "/zh-CN" || path.startsWith("/zh-CN/")) {
    return "zh-CN";
  }

  if (path === "/en" || path.startsWith("/en/")) {
    return DEFAULT_LANGUAGE;
  }

  return null;
}

export function resolvePreferredLanguage(): SupportedLanguage {
  if (typeof window === "undefined") {
    return DEFAULT_LANGUAGE;
  }

  const savedLanguage = window.localStorage.getItem(STORAGE_KEY);
  if (isSupportedLanguage(savedLanguage)) {
    return savedLanguage;
  }

  return window.navigator.language.toLowerCase().startsWith("zh")
    ? "zh-CN"
    : DEFAULT_LANGUAGE;
}

export async function syncLanguage(language: SupportedLanguage) {
  if (i18n.resolvedLanguage !== language) {
    await i18n.changeLanguage(language);
    return;
  }

  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, language);
  }

  if (typeof document !== "undefined") {
    document.documentElement.lang = language;
  }
}

void i18n.use(initReactI18next).init({
  resources,
  lng: resolvePreferredLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  supportedLngs: [DEFAULT_LANGUAGE, "zh-CN"],
  interpolation: {
    escapeValue: false,
  },
  returnNull: false,
});

i18n.on("languageChanged", language => {
  if (isSupportedLanguage(language)) {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, language);
    }

    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
    }
  }
});

if (typeof document !== "undefined") {
  document.documentElement.lang = i18n.language;
}

export default i18n;
