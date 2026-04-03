import type { Rule } from "sanity";

const LANGUAGES = ["en", "he", "ru", "el"] as const;

const LANG_LABEL: Record<(typeof LANGUAGES)[number], string> = {
  en: "English",
  he: "Hebrew",
  ru: "Russian",
  el: "Greek (Ελληνικά)",
};

/**
 * Validation rule that requires all 4 language translations to be present.
 * Use on critical fields: hero titles, nav labels, CTAs, SEO, status badges.
 */
export const requireAllTranslations = (rule: Rule) =>
  rule.custom((value: Record<string, string> | undefined) => {
    if (!value) return "Required";
    const missing = LANGUAGES.filter((lang) => !value[lang]?.trim());
    if (missing.length > 0) {
      const labels = missing.map((k) => `${k} (${LANG_LABEL[k]})`).join(", ");
      return `Fill all languages before publishing — empty: ${labels}`;
    }
    return true;
  });

/**
 * For homepage-style fields: only **English** is required to publish.
 * Other locales (HE, RU, EL) can be filled later — site falls back via i18n.
 */
export const requireEnglishLocale = (rule: Rule) =>
  rule.custom((value: Record<string, string> | undefined) => {
    if (!value?.en?.trim()) return "Add English text to publish (other languages optional).";
    return true;
  });
