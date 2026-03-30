import Link from "next/link";

import { getDictionary } from "@/lib/dictionaries";
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
};

const placeholderVillas: Array<{
  name: string;
  slug: { current: string };
  typicalBedrooms: number;
  areaRange: string;
  staticImage: string;
}> = [
  {
    name: "Villa Tai",
    slug: { current: "tai" },
    typicalBedrooms: 2,
    areaRange: "52–67",
    staticImage: "/assets/pdf/villas/tai-hero.png",
  },
  {
    name: "Villa Yehonatan",
    slug: { current: "yehonatan" },
    typicalBedrooms: 3,
    areaRange: "80–95",
    staticImage: "/assets/pdf/villas/yehonatan-hero.png",
  },
  {
    name: "Villa Green",
    slug: { current: "green" },
    typicalBedrooms: 3,
    areaRange: "100–120",
    staticImage: "/assets/pdf/villas/green-hero.png",
  },
];

export function ResidencesPreviewSection({ villas, locale, title, description }: ResidencesPreviewSectionProps) {
  const dict = getDictionary(locale);
  const hasVillas = villas && villas.length > 0;

  return (
    <section className="bg-[var(--color-cream)] py-24 sm:py-32">
      <div className="section-shell">
        <ScrollReveal>
          <SectionHeading
            eyebrow={dict.sections.residences}
            title={title || "Designed for the discerning few"}
            description={description || "Each residence is a unique expression of modern Mediterranean architecture, thoughtfully positioned for maximum privacy and views."}
            align="center"
          />
        </ScrollReveal>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {hasVillas
            ? villas.map((villa, i) => (
                <ScrollReveal key={villa._id} delay={i * 0.1}>
                  <VillaCard villa={villa} locale={locale} />
                </ScrollReveal>
              ))
            : placeholderVillas.map((villa, i) => (
                <ScrollReveal key={villa.slug.current} delay={i * 0.1}>
                  <VillaCard
                    villa={villa}
                    locale={locale}
                    staticImageSrc={villa.staticImage}
                  />
                </ScrollReveal>
              ))}
        </div>

        <ScrollReveal className="mt-12 text-center">
          <Link href={`/${locale}/residences`} className="btn btn-outline">
            {dict.cta.viewAll} &rarr;
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
