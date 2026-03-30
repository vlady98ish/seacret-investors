import { type Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/sections/page-hero";
import { WhyChiliadouSection } from "@/components/location/why-chiliadou-section";
import { DistanceMapSection } from "@/components/location/distance-map-section";
import { AirportConnectivitySection } from "@/components/location/airport-connectivity-section";
import { ExperiencesSection } from "@/components/location/experiences-section";
import { InlineContactSection } from "@/components/inline-contact-section";
import { isValidLocale, getLocalizedValue, type Locale } from "@/lib/i18n";
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = (field: any): string | undefined =>
    field ? (getLocalizedValue(field, typedLocale) as string | undefined) : undefined;

  const heroTitle: string = t(page?.heroTitle) ?? "Your Secret Escape";
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
        eyebrow={t(page?.whyEyebrow) || undefined}
        title={t(page?.whyTitle) || undefined}
        description={t(page?.whySection) || undefined}
        features={
          page?.whyFeatures?.map((f) => ({
            heading: t(f.heading) || "",
            description: t(f.description) || "",
            icon: f.icon,
          }))
        }
      />

      <DistanceMapSection
        eyebrow={t(page?.distanceEyebrow) || undefined}
        title={t(page?.distanceTitle) || undefined}
        description={t(page?.distanceDescription) || undefined}
        markers={
          page?.distanceMarkers?.map((m) => ({
            place: t(m.place) || "",
            time: t(m.time) || "",
            detail: t(m.detail) || "",
          }))
        }
      />

      <AirportConnectivitySection
        eyebrow={t(page?.airportEyebrow) || undefined}
        title={t(page?.airportTitle) || undefined}
        description={t(page?.airportDescription) || undefined}
        airports={
          page?.airports?.map((a) => ({
            code: a.code,
            name: t(a.name) || "",
            city: t(a.city) || "",
            travelTime: t(a.travelTime) || "",
            destinations: a.destinations,
            countries: a.countries ?? null,
            note: t(a.note) || "",
            isNearest: a.isNearest,
          }))
        }
      />

      <ExperiencesSection
        locale={typedLocale}
        experiences={experiences.length > 0 ? experiences : undefined}
        eyebrow={t(page?.experiencesEyebrow) || undefined}
        title={t(page?.experiencesTitle) || undefined}
        description={t(page?.experiencesDescription) || undefined}
      />

      <InlineContactSection locale={typedLocale} />
    </>
  );
}
