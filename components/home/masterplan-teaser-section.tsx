import Image from "next/image";
import Link from "next/link";

import { type Locale } from "@/lib/i18n";
import { getSanityImageUrl } from "@/lib/sanity/image";
import type { HomePage } from "@/lib/sanity/types";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/sections/section-heading";
import { StatsBar } from "@/components/sections/stats-bar";

type MasterplanTeaserSectionProps = {
  data: HomePage | null;
  stats: { total: number; available: number; reserved: number; sold: number } | null;
  locale: Locale;
  title?: string;
  description?: string;
  statTotalLabel?: string;
  /** @deprecated no longer rendered — plots count is not in the stats query */
  statPlotsLabel?: string;
  statAvailableLabel?: string;
  eyebrowLabel?: string;
  ctaLabel?: string;
};

export function MasterplanTeaserSection({ data, stats, locale, title, description, statTotalLabel, statPlotsLabel, statAvailableLabel, eyebrowLabel, ctaLabel }: MasterplanTeaserSectionProps) {
  const imageUrl = getSanityImageUrl(data?.masterplanImage, 1200);

  if (!imageUrl && !stats) return null;

  return (
    <section className="bg-[var(--color-sand)] py-24 sm:py-32">
      <div className="section-shell">
        <ScrollReveal>
          <SectionHeading
            eyebrow={eyebrowLabel}
            title={title}
            description={description}
            align="center"
          />
        </ScrollReveal>

        {imageUrl && (
          <ScrollReveal className="mt-12" delay={0.1}>
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
              <Image
                src={imageUrl}
                alt="Masterplan aerial view"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 80vw"
              />
            </div>
          </ScrollReveal>
        )}

        {stats && (
          <ScrollReveal className="mt-12" delay={0.2}>
            <StatsBar
              stats={[
                { label: statTotalLabel, value: stats.total },
                { label: statPlotsLabel, value: 6 },
                { label: statAvailableLabel, value: stats.available },
              ]}
            />
          </ScrollReveal>
        )}

        {ctaLabel && (
          <ScrollReveal className="mt-12 text-center" delay={0.25}>
            <Link href={`/${locale}/masterplan`} className="btn btn-outline">
              {ctaLabel} &rarr;
            </Link>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
