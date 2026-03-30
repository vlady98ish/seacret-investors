import Link from "next/link";

import { type Locale } from "@/lib/i18n";
import type { FeaturedVilla } from "@/lib/sanity/types";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/sections/section-heading";
import { VillaCard } from "@/components/sections/villa-card";

type ResidencesPreviewSectionProps = {
  villas: FeaturedVilla[] | null | undefined;
  locale: Locale;
  title?: string;
  description?: string;
  eyebrowLabel?: string;
  ctaLabel?: string;
  labelBed?: string;
  labelContactForPricing?: string;
};

export function ResidencesPreviewSection({ villas, locale, title, description, eyebrowLabel, ctaLabel, labelBed, labelContactForPricing }: ResidencesPreviewSectionProps) {
  if (!villas?.length) return null;

  return (
    <section className="bg-[var(--color-cream)] py-24 sm:py-32">
      <div className="section-shell">
        <ScrollReveal>
          <SectionHeading
            eyebrow={eyebrowLabel}
            title={title}
            description={description}
            align="center"
          />
        </ScrollReveal>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {villas.map((villa, i) => (
            <ScrollReveal key={villa._id} delay={i * 0.1}>
              <VillaCard villa={villa} locale={locale} labelBed={labelBed} labelContactForPricing={labelContactForPricing} />
            </ScrollReveal>
          ))}
        </div>

        {ctaLabel && (
          <ScrollReveal className="mt-12 text-center">
            <Link href={`/${locale}/residences`} className="btn btn-outline">
              {ctaLabel} &rarr;
            </Link>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
