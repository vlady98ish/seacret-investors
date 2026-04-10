"use client";

import React, { createContext, useContext } from "react";
import { getLocalizedValue, pluralize, type Locale } from "@/lib/i18n";
import type { UiStrings } from "@/lib/sanity/types";

type UiStringsContextValue = {
  uiStrings: UiStrings | null;
  locale: Locale;
};

const UiStringsContext = createContext<UiStringsContextValue>({
  uiStrings: null,
  locale: "en",
});

export function UiStringsProvider({
  uiStrings,
  locale,
  children,
}: {
  uiStrings: UiStrings | null;
  locale: Locale;
  children: React.ReactNode;
}) {
  return (
    <UiStringsContext.Provider value={{ uiStrings, locale }}>
      {children}
    </UiStringsContext.Provider>
  );
}

/**
 * Hook to get a localized UI string by key.
 * Returns the translated string or the fallback.
 *
 * Usage: const label = useT("ctaExploreResidences", "Explore Residences");
 */
export function useT(key: keyof UiStrings, fallback: string = ""): string {
  const { uiStrings, locale } = useContext(UiStringsContext);
  if (!uiStrings) return fallback;
  const field = uiStrings[key];
  if (!field) return fallback;
  return (getLocalizedValue(field as Record<string, string>, locale) as string) || fallback;
}

/**
 * Hook to get the full context (for components that need multiple strings at once).
 */
export function useUiStrings() {
  return useContext(UiStringsContext);
}

/**
 * Returns "N спальня / спальни / спален" with correct Russian declension.
 * For other locales: "N Bed / Beds".
 */
export function useBedLabel(n: number): string {
  const { uiStrings, locale } = useContext(UiStringsContext);
  const one = (getLocalizedValue(uiStrings?.miscBed as Record<string, string>, locale) as string) || "Bed";
  const few = (getLocalizedValue(uiStrings?.miscBedsFew as Record<string, string>, locale) as string) || one;
  const many = (getLocalizedValue(uiStrings?.miscBeds as Record<string, string>, locale) as string) || "Beds";
  return pluralize(n, locale, one, few, many);
}
