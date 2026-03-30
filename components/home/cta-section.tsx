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
  const title = getLocalizedValue(data?.ctaTitle, locale) ?? "Ready to invest in your future?";
  const subtitle = getLocalizedValue(data?.ctaSubtitle, locale) ?? "Join a select group of investors in one of Greece's most promising coastal locations.";

  return (
    <section className="bg-[var(--color-night)] py-24 sm:py-32">
      <div className="section-shell text-center">
        <ScrollReveal>
          <h2 className="text-display text-white">{title}</h2>
          <p className="mx-auto mt-4 max-w-lg text-lg text-white/60">
            {subtitle}
          </p>
          <div className="mt-10">
            <Link href={`/${locale}/contact`} className="btn btn-primary">
              {ctaLabel || "Request Information"}
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
