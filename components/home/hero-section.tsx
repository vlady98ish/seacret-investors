import { getLocalizedValue, type Locale } from "@/lib/i18n";
import { getSanityImageUrl } from "@/lib/sanity/image";
import type { HomePage } from "@/lib/sanity/types";
import { PageHero } from "@/components/sections/page-hero";

type HeroSectionProps = {
  data: HomePage | null;
  locale: Locale;
  ctaExplore?: string;
  ctaBrochure?: string;
};

export function HeroSection({ data, locale, ctaExplore, ctaBrochure }: HeroSectionProps) {
  const title = getLocalizedValue(data?.heroTagline, locale) ?? "Where the sea meets serenity";
  const subtitle = getLocalizedValue(data?.heroSubtitle, locale) ?? "Exclusive coastal residences on the Gulf of Corinth, Greece.";
  const imageUrl = getSanityImageUrl(data?.heroImage, 1920) ?? "/assets/pdf/page-02-hero.jpg";

  return (
    <PageHero backgroundImage={imageUrl} title={title} subtitle={subtitle}>
      <a href={`/${locale}/residences`} className="btn btn-primary">
        {ctaExplore || "Explore Residences"}
      </a>
      <a href={`/${locale}/contact`} className="btn btn-secondary">
        {ctaBrochure || "Request a Brochure"}
      </a>
    </PageHero>
  );
}
