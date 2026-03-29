import { getDictionary } from "@/lib/dictionaries";
import { getLocalizedValue, type Locale } from "@/lib/i18n";
import { getSanityImageUrl } from "@/lib/sanity/image";
import type { HomePage } from "@/lib/sanity/types";
import { PageHero } from "@/components/sections/page-hero";

type HeroSectionProps = {
  data: HomePage | null;
  locale: Locale;
};

export function HeroSection({ data, locale }: HeroSectionProps) {
  const dict = getDictionary(locale);
  const title = getLocalizedValue(data?.heroTagline, locale) ?? dict.hero.tagline;
  const subtitle = getLocalizedValue(data?.heroSubtitle, locale) ?? dict.hero.subtitle;
  const imageUrl = getSanityImageUrl(data?.heroImage, 1920) ?? "/assets/pdf/page-02-hero.jpg";

  return (
    <PageHero backgroundImage={imageUrl} title={title} subtitle={subtitle}>
      <a href={`/${locale}/residences`} className="btn btn-primary">
        {dict.hero.cta}
      </a>
      <a href={`/${locale}/contact`} className="btn btn-secondary">
        {dict.hero.ctaSecondary}
      </a>
    </PageHero>
  );
}
