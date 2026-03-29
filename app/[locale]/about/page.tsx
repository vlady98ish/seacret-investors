import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AboutCtaSection } from "@/components/about/about-cta-section";
import { FoundersSection } from "@/components/about/founders-section";
import { OurStorySection } from "@/components/about/our-story-section";
import { StatsBar } from "@/components/about/stats-bar";
import { ValuesSection } from "@/components/about/values-section";
import { InlineContactSection } from "@/components/inline-contact-section";
import { PageHero } from "@/components/sections/page-hero";
import { isValidLocale, type Locale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return ["en", "he", "ru", "el"].map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};

  return buildPageMetadata(null, locale as Locale, "/about", {
    title: "About Live Better Group | Sea'cret Residences Chiliadou",
    description:
      "Meet the team behind Sea'cret Residences. Live Better Group — 12+ completed projects, 80+ units delivered, €10M+ invested capital. Real estate expertise since 2020.",
  });
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const typedLocale = locale as Locale;

  return (
    <>
      <PageHero
        title="Building the Future of Greek Living"
        subtitle="Live Better Group — Transforming real estate since 2020"
        backgroundImage="/assets/team/about-hero.jpg"
        compact
      />
      <StatsBar />
      <OurStorySection />
      <FoundersSection />
      <ValuesSection />
      <AboutCtaSection locale={typedLocale} />
      <InlineContactSection locale={typedLocale} />
    </>
  );
}
