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

export const localeNames: Record<Locale, string> = {
  en: "English",
  he: "עברית",
  ru: "Русский",
  el: "Ελληνικά",
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

/**
 * Russian plural form: 1 спальня, 2 спальни, 5 спален.
 * For other locales falls back to simple singular/plural.
 */
export function pluralize(
  n: number,
  locale: Locale,
  one: string,
  few: string,
  many: string,
): string {
  if (locale !== "ru") {
    return `${n} ${n === 1 ? one : many}`;
  }
  const abs = Math.abs(n) % 100;
  const lastDigit = abs % 10;
  if (abs >= 11 && abs <= 19) return `${n} ${many}`;
  if (lastDigit === 1) return `${n} ${one}`;
  if (lastDigit >= 2 && lastDigit <= 4) return `${n} ${few}`;
  return `${n} ${many}`;
}
