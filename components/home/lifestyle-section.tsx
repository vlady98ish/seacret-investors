import Image from "next/image";

import { getLocalizedValue, type Locale } from "@/lib/i18n";
import { getSanityImageUrl } from "@/lib/sanity/image";
import type { HomePage } from "@/lib/sanity/types";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/sections/section-heading";

type LifestyleSectionProps = {
  data: HomePage | null;
  locale: Locale;
  title?: string;
  eyebrowLabel?: string;
  periodLabels?: Record<string, string>;
};

export function LifestyleSection({ data, locale, title, eyebrowLabel, periodLabels }: LifestyleSectionProps) {
  const moments = data?.lifestyleMoments;

  if (!moments?.length) return null;

  const resolvedMoments = moments.map((m) => ({
    period: m.period,
    copy: getLocalizedValue(m.copy, locale) ?? "",
    imageUrl: getSanityImageUrl(m.image, 800),
  }));

  return (
    <section className="bg-[var(--color-sand)] py-16 sm:py-20 lg:py-24">
      <div className="section-shell">
        <ScrollReveal>
          <SectionHeading
            eyebrow={eyebrowLabel}
            title={title}
            align="center"
          />
        </ScrollReveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {resolvedMoments.map((moment, i) => (
            <ScrollReveal key={moment.period} delay={i * 0.1}>
              <div className="group relative aspect-[4/3] sm:aspect-[3/4] overflow-hidden rounded-2xl">
                {moment.imageUrl && (
                  <Image
                    src={moment.imageUrl}
                    alt={moment.period}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-night)] via-[var(--color-night)]/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-gold-sun)]">
                    {periodLabels?.[moment.period] || moment.period}
                  </p>
                  <p className="mt-2 text-base leading-relaxed text-white/80">
                    {moment.copy}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
