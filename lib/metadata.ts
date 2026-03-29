import type { Metadata } from "next";

import { getLocalizedValue, type Locale, locales } from "@/lib/i18n";
import type { LocalizedString, LocalizedText } from "@/lib/sanity/types";

interface PageSEO {
  seoTitle?: LocalizedString;
  seoDescription?: LocalizedText;
}

export function buildPageMetadata(
  page: PageSEO | null | undefined,
  locale: Locale,
  pathname: string,
  fallback: { title: string; description: string }
): Metadata {
  const title = getLocalizedValue(page?.seoTitle, locale) ?? fallback.title;
  const description = getLocalizedValue(page?.seoDescription, locale) ?? fallback.description;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://seacret-residences.com";

  const alternates: Record<string, string> = {};
  for (const loc of locales) {
    alternates[loc] = `${baseUrl}/${loc}${pathname}`;
  }
  alternates["x-default"] = `${baseUrl}/en${pathname}`;

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/${locale}${pathname}`,
      languages: alternates,
    },
    openGraph: {
      title,
      description,
      locale,
      type: "website",
    },
  };
}
