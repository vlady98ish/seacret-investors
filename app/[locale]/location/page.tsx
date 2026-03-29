import { type Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/sections/page-hero";
import { WhyChiliadouSection } from "@/components/location/why-chiliadou-section";
import { DistanceMapSection } from "@/components/location/distance-map-section";
import { AirportConnectivitySection } from "@/components/location/airport-connectivity-section";
import { ExperiencesSection } from "@/components/location/experiences-section";
import { InlineContactSection } from "@/components/inline-contact-section";
import { isValidLocale, type Locale } from "@/lib/i18n";
import { sanityClient } from "@/lib/sanity/client";
import { locationPageQuery, allExperiencesQuery } from "@/lib/sanity/queries";
import type { LocationPage, Experience } from "@/lib/sanity/types";

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return ["en", "he", "ru", "el"].map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};

  let page: LocationPage | null = null;
  try {
    page = await sanityClient.fetch<LocationPage>(locationPageQuery);
  } catch {
    // Sanity not configured — use defaults
  }

  const title =
    page?.seoTitle?.[locale as Locale] ??
    "Location & Connectivity | The Sea'cret Residences Chiliadou";
  const description =
    page?.seoDescription?.[locale as Locale] ??
    "Discover Chiliadou — a hidden Blue Flag beach on the Corinthian Gulf. Easily reached from Athens, Patras, and major European airports.";

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/location`,
      languages: {
        en: "/en/location",
        he: "/he/location",
        ru: "/ru/location",
        el: "/el/location",
      },
    },
  };
}

export default async function LocationPage({ params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const typedLocale = locale as Locale;

  // Fetch CMS data with graceful fallbacks
  let page: LocationPage | null = null;
  let experiences: Experience[] = [];

  try {
    page = await sanityClient.fetch<LocationPage>(locationPageQuery);
  } catch {
    // Sanity not configured — use hardcoded fallbacks
  }

  try {
    experiences = await sanityClient.fetch<Experience[]>(allExperiencesQuery) ?? [];
  } catch {
    // Use hardcoded fallbacks in ExperiencesSection
  }

  const heroTitle =
    page?.heroTitle?.[typedLocale] ?? "Your Secret Escape";
  const heroSubtitle =
    "Chiliadou — a Blue Flag beach on the Corinthian Gulf, hidden from the world and waiting for you.";

  return (
    <>
      <PageHero
        title={heroTitle}
        subtitle={heroSubtitle}
        backgroundImage="/assets/pdf/page-04-location.jpg"
        compact
      />

      <WhyChiliadouSection
        locale={typedLocale}
        content={page?.whySection?.[typedLocale]}
      />

      <DistanceMapSection />

      <AirportConnectivitySection />

      <ExperiencesSection
        locale={typedLocale}
        experiences={experiences.length > 0 ? experiences : undefined}
      />

      <InlineContactSection locale={typedLocale} />
    </>
  );
}
