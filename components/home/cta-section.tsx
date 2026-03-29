import Link from "next/link";

import { getDictionary } from "@/lib/dictionaries";
import { getLocalizedValue, type Locale } from "@/lib/i18n";
import type { HomePage } from "@/lib/sanity/types";
import { ScrollReveal } from "@/components/scroll-reveal";

type CtaSectionProps = {
  data: HomePage | null;
  locale: Locale;
};

export function CtaSection({ data, locale }: CtaSectionProps) {
  const dict = getDictionary(locale);
  const title = getLocalizedValue(data?.ctaTitle, locale) ?? dict.cta.title;
  const subtitle = getLocalizedValue(data?.ctaSubtitle, locale) ?? dict.cta.subtitle;

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
              {dict.cta.button}
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
