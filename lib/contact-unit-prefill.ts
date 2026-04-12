import type { Locale } from "@/lib/i18n";

/** Query string for /contact deep-link from unit rows. */
export function buildUnitContactHref(
  locale: Locale,
  villaTypeName: string,
  unitNumber: string,
  plotName?: string
): string {
  const q = new URLSearchParams();
  q.set("villa", villaTypeName.trim());
  q.set("unit", unitNumber.trim());
  const plot = plotName?.trim();
  if (plot) q.set("plot", plot);
  return `/${locale}/contact?${q.toString()}`;
}

export function buildUnitInquiryMessage(
  locale: Locale,
  villaTypeName: string,
  unitNumber: string,
  plotName?: string
): string {
  const plot = plotName?.trim();
  const villa = villaTypeName.trim();
  const unit = unitNumber.trim();

  const plotPhrase =
    locale === "ru"
      ? plot
        ? ` на участке ${plot}`
        : ""
      : locale === "he"
        ? plot
          ? ` במגרש ${plot}`
          : ""
        : locale === "el"
          ? plot
            ? ` στο οικόπεδο ${plot}`
            : ""
          : plot
            ? ` on plot ${plot}`
            : "";

  const messages: Record<Locale, string> = {
    en: `I'm interested in unit ${unit}${plotPhrase} (${villa}). Please share availability and next steps.`,
    ru: `Меня интересует юнит ${unit}${plotPhrase} (${villa}). Пожалуйста, сообщите о наличии и дальнейших шагах.`,
    he: `אני מתעניין ביחידה ${unit}${plotPhrase} (${villa}). נא לעדכן לגבי זמינות והמשך.`,
    el: `Ενδιαφέρομαι για το unit ${unit}${plotPhrase} (${villa}). Παρακαλώ ενημερώστε με για διαθεσιμότητα και επόμενα βήματα.`,
  };

  return messages[locale] ?? messages.en;
}
