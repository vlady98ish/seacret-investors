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
  allFaqsQuery,
  allUnitsQuery,
  allUpgradesQuery,
  allVillasQuery,
  residencesPageQuery,
  uiStringsQuery,
} from "@/lib/sanity/queries";
import { getSanityImageUrl } from "@/lib/sanity/image";
import type { FAQ, ResidencesPage, UiStrings, UnitFlat, Upgrade, Villa } from "@/lib/sanity/types";
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = (field: any): string | undefined =>
    field ? (getLocalizedValue(field, typedLocale) as string | undefined) : undefined;

  // Fetch all data with graceful fallbacks to local seed data
  let page: ResidencesPage | null = null;
  let villas: Villa[] = [];
  let units: UnitFlat[] = [];
  let upgrades: Upgrade[] | null = null;
  let faqs: FAQ[] = [];
  let uiStrings: UiStrings | null = null;

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

  try {
    const result = await sanityClient.fetch<FAQ[]>(allFaqsQuery);
    if (result?.length) faqs = result;
  } catch {
    // use fallback FAQs in component
  }

  try {
    const result = await sanityClient.fetch<UiStrings>(uiStringsQuery);
    if (result) uiStrings = result;
  } catch {
    // use English fallbacks in components
  }

  const heroTitle = t(page?.heroTitle) ?? "The Residences";
  const heroImageUrl = page?.heroImage ? getSanityImageUrl(page.heroImage, 1920) : null;
  const introCopy = t(page?.introCopy);

  // Resolve FAQ items
  const faqItems = faqs.map((faq) => ({
    question: t(faq.question) ?? "",
    answer: t(faq.answer) ?? "",
  }));

  // Resolve filter / table labels from uiStrings
  const filterLabels = {
    bedrooms: t(uiStrings?.filterBedrooms) || "Bedrooms",
    availableOnly: t(uiStrings?.filterAvailableOnly) || "Available only",
    sort: t(uiStrings?.filterSort) || "Sort",
    sortName: t(uiStrings?.filterSortName) || "Name",
    sortPriceLowHigh: t(uiStrings?.filterPriceLowHigh) || "Price: Low to High",
    sortSizeSmallLarge: t(uiStrings?.filterSizeSmallLarge) || "Size: Small to Large",
    noResults: t(uiStrings?.filterNoResults) || "No villas match your criteria",
    all: t(uiStrings?.filterAll) || "All",
  };

  const tableHeaders = {
    villaType: t(uiStrings?.tableVillaType) || "Villa Type",
    bedrooms: t(uiStrings?.specBedrooms) || "Bedrooms",
    bathrooms: t(uiStrings?.specBathrooms) || "Bathrooms",
    areaRange: t(uiStrings?.tableAreaM2) || "Area Range",
    priceFrom: t(uiStrings?.tablePriceFrom) || "Price From",
    availability: t(uiStrings?.tableStatus) || "Availability",
    contactUs: t(uiStrings?.ctaContactUs) || "Contact us",
    soldOut: t(uiStrings?.statusSoldOut) || "Sold Out",
    available: t(uiStrings?.statusAvailable) || "Available",
    fromLabel: t(uiStrings?.pricingFrom) || "From",
  };

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
            eyebrow={t(page?.collectionEyebrow) || "Our Collection"}
            title={t(page?.collectionTitle) || "Choose Your Villa"}
            description={
              t(page?.collectionDescription) ||
              "Filter and sort all six villa types to find the one that fits your vision."
            }
          />
          <div className="mt-12">
            <VillaFilters
              villas={villas}
              units={units}
              locale={typedLocale}
              labels={filterLabels}
            />
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="bg-[var(--color-cream)] py-20 lg:py-28">
        <div className="section-shell">
          <SectionHeading
            eyebrow={t(page?.compareEyebrow) || "Side by Side"}
            title={t(page?.compareTitle) || "Compare Villa Types"}
            description={
              t(page?.compareDescription) ||
              "A quick reference for all specifications and pricing across our collection."
            }
          />
          <div className="mt-12">
            <ComparisonTable
              villas={villas}
              units={units}
              locale={typedLocale}
              headers={tableHeaders}
            />
          </div>
        </div>
      </section>

      {/* Upgrades showcase */}
      <section className="py-20 lg:py-28">
        <div className="section-shell">
          <SectionHeading
            eyebrow={t(page?.upgradesEyebrow) || "Personalise Your Home"}
            title={t(page?.upgradesTitle) || "Optional Upgrades"}
            description={
              t(page?.upgradesDescription) ||
              "Elevate your villa with bespoke additions, from private pools to full smart-home automation."
            }
          />
          <div className="mt-12">
            <UpgradesShowcase upgrades={upgrades} locale={typedLocale} />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-shell py-20">
        <SectionHeading
          eyebrow={t(page?.faqEyebrow) || "FAQ"}
          title={t(page?.faqTitle) || "Frequently Asked Questions"}
          align="center"
        />
        <div className="mt-12">
          <FAQAccordion items={faqItems} />
        </div>
      </section>

      {/* Contact */}
      <InlineContactSection locale={typedLocale} preferredOption="Residences Inquiry" />
    </>
  );
}
