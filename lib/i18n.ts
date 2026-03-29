export const locales = ["en", "he", "ru", "el"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";
export const rtlLocales: Locale[] = ["he"];

export const localeLabels: Record<Locale, string> = {
  en: "EN",
  he: "HE",
  ru: "RU",
  el: "GR",
};

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export function isRtl(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}

export function getLocalizedValue<T>(obj: Record<Locale, T> | undefined | null, locale: Locale): T | undefined {
  if (!obj) return undefined;
  return obj[locale] ?? obj[defaultLocale];
}
