"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn";
import { type Locale, localeLabels, localeNames, locales } from "@/lib/i18n";

type LocaleSwitcherProps = {
  locale: Locale;
  className?: string;
};

export function LocaleSwitcher({ locale, className }: LocaleSwitcherProps) {
  const pathname = usePathname();

  function getLocalizedPath(targetLocale: Locale): string {
    const segments = pathname.split("/");
    if (segments.length > 1 && locales.includes(segments[1] as Locale)) {
      segments[1] = targetLocale;
    }
    return segments.join("/") || `/${targetLocale}`;
  }

  return (
    <div className={cn("flex items-center gap-1", className)} role="group" aria-label="Choose language">
      {locales.map((loc) => (
        <Link
          key={loc}
          href={getLocalizedPath(loc)}
          aria-label={localeNames[loc]}
          aria-current={loc === locale ? "true" : undefined}
          className={cn(
            "rounded-sm px-2.5 py-1.5 text-xs font-semibold tracking-widest transition-colors",
            loc === locale
              ? "bg-[var(--color-gold-sun)] text-[var(--color-night)]"
              : "text-current opacity-60 hover:opacity-100"
          )}
        >
          {localeLabels[loc]}
        </Link>
      ))}
    </div>
  );
}
