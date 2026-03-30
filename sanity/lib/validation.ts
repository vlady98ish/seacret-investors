import type { Rule } from "sanity";

const LANGUAGES = ["en", "he", "ru", "el"] as const;

/**
 * Validation rule that requires all 4 language translations to be present.
 * Use on critical fields: hero titles, nav labels, CTAs, SEO, status badges.
 */
export const requireAllTranslations = (rule: Rule) =>
  rule.custom((value: Record<string, string> | undefined) => {
    if (!value) return "Required";
    const missing = LANGUAGES.filter((lang) => !value[lang]?.trim());
    if (missing.length > 0) return `Missing translations: ${missing.join(", ")}`;
    return true;
  });
