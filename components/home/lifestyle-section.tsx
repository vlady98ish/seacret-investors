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
};

const fallbackMoments = [
  {
    period: "Morning",
    copy: "Wake to the sound of gentle waves. Coffee on your private terrace. The gulf stretching to the horizon.",
    image: "/assets/pdf/lifestyle-morning.jpg",
  },
  {
    period: "Day",
    copy: "Explore ancient Delphi. Swim in crystal-clear waters. Discover charming Galaxidi.",
    image: "/assets/pdf/lifestyle-day.jpg",
  },
  {
    period: "Evening",
    copy: "Sunset from your private pool. Local wine and fresh seafood. Stars reflecting on the water.",
    image: "/assets/pdf/page-02-hero.jpg",
  },
];

export function LifestyleSection({ data, locale, title }: LifestyleSectionProps) {
  const staticImages: Record<string, string> = {
    Morning: "/assets/pdf/lifestyle-morning.jpg",
    Day: "/assets/pdf/lifestyle-day.jpg",
    Evening: "/assets/pdf/page-02-hero.jpg",
  };

  const moments = data?.lifestyleMoments?.length
    ? data.lifestyleMoments.map((m) => ({
        period: m.period,
        copy: getLocalizedValue(m.copy, locale) ?? "",
        image: getSanityImageUrl(m.image, 800) ?? staticImages[m.period] ?? fallbackMoments[0].image,
      }))
    : fallbackMoments;

  return (
    <section className="bg-[var(--color-sand)] py-24 sm:py-32">
      <div className="section-shell">
        <ScrollReveal>
          <SectionHeading
            eyebrow="Lifestyle"
            title={title || "A day at Sea'cret"}
            align="center"
          />
        </ScrollReveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {moments.map((moment, i) => (
            <ScrollReveal key={moment.period} delay={i * 0.1}>
              <div className="group relative aspect-[3/4] overflow-hidden rounded-2xl">
                <Image
                  src={moment.image}
                  alt={moment.period}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-night)] via-[var(--color-night)]/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-gold-sun)]">
                    {moment.period}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-white/80">
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
