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
  statPlotsLabel?: string;
  statAvailableLabel?: string;
  eyebrowLabel?: string;
  ctaLabel?: string;
};

export function MasterplanTeaserSection({ data, stats, locale, title, description, statTotalLabel, statPlotsLabel, statAvailableLabel, eyebrowLabel, ctaLabel }: MasterplanTeaserSectionProps) {
  const imageUrl = getSanityImageUrl(data?.masterplanImage, 1200) ?? "/assets/pdf/masterplan-aerial.jpg";

  const totalUnits = stats?.total || 39;
  const availableUnits = stats?.available || 39;
  const plots = 6;

  return (
    <section className="bg-[var(--color-sand)] py-24 sm:py-32">
      <div className="section-shell">
        <ScrollReveal>
          <SectionHeading
            eyebrow={eyebrowLabel || "Masterplan"}
            title={title || "The master plan"}
            description={description || "Six private plots along the coastline, each carefully positioned for privacy, views, and natural ventilation."}
            align="center"
          />
        </ScrollReveal>

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

        <ScrollReveal className="mt-12" delay={0.2}>
          <StatsBar
            stats={[
              { label: statTotalLabel || "Total Residences", value: totalUnits },
              { label: statPlotsLabel || "Plots", value: plots },
              { label: statAvailableLabel || "Available", value: availableUnits },
            ]}
          />
        </ScrollReveal>

        <ScrollReveal className="mt-12 text-center" delay={0.25}>
          <Link href={`/${locale}/masterplan`} className="btn btn-outline">
            {ctaLabel || "Explore the Masterplan"} &rarr;
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
