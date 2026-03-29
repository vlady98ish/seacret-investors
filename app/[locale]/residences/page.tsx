import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { InlineContactSection } from "@/components/inline-contact-section";
import { ComparisonTable } from "@/components/residences/comparison-table";
import { UpgradesShowcase } from "@/components/residences/upgrades-showcase";
import { VillaFilters } from "@/components/residences/villa-filters";
import { FAQAccordion } from "@/components/sections/faq-accordion";
import { PageHero } from "@/components/sections/page-hero";
import { SectionHeading } from "@/components/sections/section-heading";
import { getLocalizedValue, isValidLocale, type Locale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/metadata";
import { sanityClient } from "@/lib/sanity/client";
import {
  allUnitsQuery,
  allUpgradesQuery,
  allVillasQuery,
  residencesPageQuery,
} from "@/lib/sanity/queries";
import { getSanityImageUrl } from "@/lib/sanity/image";
import type { ResidencesPage, UnitFlat, Upgrade, Villa } from "@/lib/sanity/types";
import {
  fallbackVillas,
  fallbackUnitsFlat,
  fallbackUpgrades,
  getFallbackResidencesPage,
} from "@/lib/fallback-data";

type Props = { params: Promise<{ locale: string }> };

export async function generateStaticParams() {
  return ["en", "he", "ru", "el"].map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};

  let page: ResidencesPage | null = null;
  try {
    const result = await sanityClient.fetch<ResidencesPage>(residencesPageQuery);
    if (result) page = result;
  } catch {
    // fallback metadata used below
  }
  if (!page) page = getFallbackResidencesPage();

  return buildPageMetadata(page, locale as Locale, "/residences", {
    title: "Residences — Sea'cret Residences",
    description: "Discover all 6 villa types. Filter, compare, and find the perfect private retreat.",
  });
}

export default async function ResidencesPage({ params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const typedLocale = locale as Locale;

  // Fetch all data with graceful fallbacks to local seed data
  let page: ResidencesPage | null = null;
  let villas: Villa[] = [];
  let units: UnitFlat[] = [];
  let upgrades: Upgrade[] | null = null;

  try {
    const result = await sanityClient.fetch<ResidencesPage>(residencesPageQuery);
    if (result) page = result;
  } catch {
    // page hero will use fallbacks
  }
  if (!page) page = getFallbackResidencesPage();

  try {
    const result = await sanityClient.fetch<Villa[]>(allVillasQuery);
    if (result?.length) villas = result;
  } catch {
    // use fallback below
  }
  if (!villas.length) villas = fallbackVillas;

  try {
    const result = await sanityClient.fetch<UnitFlat[]>(allUnitsQuery);
    if (result?.length) units = result;
  } catch {
    // use fallback below
  }
  if (!units.length) units = fallbackUnitsFlat;

  try {
    const result = await sanityClient.fetch<Upgrade[]>(allUpgradesQuery);
    if (result) upgrades = result;
  } catch {
    // use fallback below
  }
  if (!upgrades) upgrades = fallbackUpgrades as unknown as Upgrade[];

  const heroTitle =
    getLocalizedValue(page?.heroTitle, typedLocale) ?? "The Residences";
  const heroImageUrl = page?.heroImage
    ? getSanityImageUrl(page.heroImage, 1920)
    : null;
  const introCopy = getLocalizedValue(page?.introCopy, typedLocale);

  return (
    <>
      {/* Hero */}
      <PageHero
        title={heroTitle}
        backgroundImage={heroImageUrl}
        compact
        subtitle={introCopy ?? "Six distinct villa types. Each a private world."}
      />

      {/* Villa grid with filters */}
      <section className="py-20 lg:py-28">
        <div className="section-shell">
          <SectionHeading
            eyebrow="Our Collection"
            title="Choose Your Villa"
            description="Filter and sort all six villa types to find the one that fits your vision."
          />
          <div className="mt-12">
            <VillaFilters villas={villas} units={units} locale={typedLocale} />
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="bg-[var(--color-cream)] py-20 lg:py-28">
        <div className="section-shell">
          <SectionHeading
            eyebrow="Side by Side"
            title="Compare Villa Types"
            description="A quick reference for all specifications and pricing across our collection."
          />
          <div className="mt-12">
            <ComparisonTable villas={villas} units={units} locale={typedLocale} />
          </div>
        </div>
      </section>

      {/* Upgrades showcase */}
      <section className="py-20 lg:py-28">
        <div className="section-shell">
          <SectionHeading
            eyebrow="Personalise Your Home"
            title="Optional Upgrades"
            description="Elevate your villa with bespoke additions, from private pools to full smart-home automation."
          />
          <div className="mt-12">
            <UpgradesShowcase upgrades={upgrades} locale={typedLocale} />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-shell py-20">
        <SectionHeading
          eyebrow="FAQ"
          title="Frequently Asked Questions"
          align="center"
        />
        <div className="mt-12">
          <FAQAccordion items={[]} />
        </div>
      </section>

      {/* Contact */}
      <InlineContactSection locale={typedLocale} preferredOption="Residences Inquiry" />
    </>
  );
}
