import type { DocumentBadgeComponent } from "sanity";

const LANGUAGES = ["en", "he", "ru", "el"];
const SKIP_TYPES = new Set(["leadSubmission"]);

function countLocaleFields(obj: unknown, filled: number[], total: number[]): void {
  if (!obj || typeof obj !== "object") return;

  if (Array.isArray(obj)) {
    for (const item of obj) countLocaleFields(item, filled, total);
    return;
  }

  const record = obj as Record<string, unknown>;

  // Detect locale object: has `en` key with string value
  if (typeof record.en === "string") {
    total[0]++;
    const allFilled = LANGUAGES.every(
      (lang) => typeof record[lang] === "string" && (record[lang] as string).trim().length > 0,
    );
    if (allFilled) filled[0]++;
    return;
  }

  for (const key of Object.keys(record)) {
    if (key.startsWith("_")) continue;
    countLocaleFields(record[key], filled, total);
  }
}

export const TranslationBadge: DocumentBadgeComponent = (props) => {
  if (SKIP_TYPES.has(props.type)) return null;

  const filled = [0];
  const total = [0];
  countLocaleFields(props.published || props.draft, filled, total);

  if (total[0] === 0) return null;

  const pct = Math.round((filled[0] / total[0]) * 100);

  if (pct === 100) {
    return { label: "Translated", color: "success" as const };
  }
  if (pct > 0) {
    return { label: `${pct}% translated`, color: "warning" as const };
  }
  return { label: "EN only", color: "danger" as const };
};
