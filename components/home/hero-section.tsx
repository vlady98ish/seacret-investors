import { getLocalizedValue, type Locale } from "@/lib/i18n";
import { getSanityImageUrl } from "@/lib/sanity/image";
import type { HomePage } from "@/lib/sanity/types";
import { PageHero } from "@/components/sections/page-hero";

type HeroSectionProps = {
  data: HomePage | null;
  locale: Locale;
  ctaExplore?: string;
  ctaBrochure?: string;
  brochureHref?: string;
};

export function HeroSection({ data, locale, ctaExplore, ctaBrochure, brochureHref }: HeroSectionProps) {
  const title = getLocalizedValue(data?.heroTagline, locale);
  const subtitle = getLocalizedValue(data?.heroSubtitle, locale);
  const imageUrl = getSanityImageUrl(data?.heroImage);

  return (
    <PageHero backgroundImage={imageUrl} title={title} subtitle={subtitle} largeSubtitle={true}>
      {ctaExplore && (
        <a href={`/${locale}/residences`} className="btn btn-primary">
          {ctaExplore}
        </a>
      )}
      {ctaBrochure && (
        <a
          href={brochureHref ?? `/${locale}/contact`}
          target={brochureHref ? "_blank" : undefined}
          rel={brochureHref ? "noopener noreferrer" : undefined}
          className="btn btn-secondary"
        >
          {ctaBrochure}
        </a>
      )}
    </PageHero>
  );
}
