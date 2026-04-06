import Link from "next/link";

import { getLocalizedValue, type Locale } from "@/lib/i18n";
import type { HomePage } from "@/lib/sanity/types";
import { ScrollReveal } from "@/components/scroll-reveal";

type CtaSectionProps = {
  data: HomePage | null;
  locale: Locale;
  ctaLabel?: string;
};

export function CtaSection({ data, locale, ctaLabel }: CtaSectionProps) {
  const title = getLocalizedValue(data?.ctaTitle, locale);
  const subtitle = getLocalizedValue(data?.ctaSubtitle, locale);

  if (!title) return null;

  return (
    <section className="bg-[var(--color-night)] py-16 sm:py-20 lg:py-24">
      <div className="section-shell text-center">
        <ScrollReveal>
          <h2 className="text-display text-white">{title}</h2>
          {subtitle && (
            <p className="mx-auto mt-4 max-w-lg text-lg text-white/60">
              {subtitle}
            </p>
          )}
          {ctaLabel && (
            <div className="mt-10">
              <Link href={`/${locale}/contact`} className="btn btn-primary">
                {ctaLabel}
              </Link>
            </div>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
}
