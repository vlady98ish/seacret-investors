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
    // CMS unavailable
  }

  try {
    const result = await sanityClient.fetch<Villa[]>(allVillasQuery);
    if (result?.length) villas = result;
  } catch {
    // CMS unavailable
  }

  try {
    const result = await sanityClient.fetch<UnitFlat[]>(allUnitsQuery);
    if (result?.length) units = result;
  } catch {
    // CMS unavailable
  }

  try {
    const result = await sanityClient.fetch<Upgrade[]>(allUpgradesQuery);
    if (result) upgrades = result;
  } catch {
    // CMS unavailable
  }

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

  const heroTitle = t(page?.heroTitle) ?? "";
  const heroImageUrl = page?.heroImage ? getSanityImageUrl(page.heroImage, 1920) : null;
  const introCopy = t(page?.introCopy);

  // Resolve FAQ items
  const faqItems = faqs.map((faq) => ({
    question: t(faq.question) ?? "",
    answer: t(faq.answer) ?? "",
  }));

  const filterLabels = {
    bedrooms: t(uiStrings?.filterBedrooms) ?? "",
    availableOnly: t(uiStrings?.filterAvailableOnly) ?? "",
    sort: t(uiStrings?.filterSort) ?? "",
    sortName: t(uiStrings?.filterSortName) ?? "",
    sortPriceLowHigh: t(uiStrings?.filterPriceLowHigh) ?? "",
    sortSizeSmallLarge: t(uiStrings?.filterSizeSmallLarge) ?? "",
    noResults: t(uiStrings?.filterNoResults) ?? "",
    all: t(uiStrings?.filterAll) ?? "",
  };

  const tableHeaders = {
    villaType: t(uiStrings?.tableVillaType) ?? "",
    bedrooms: t(uiStrings?.specBedrooms) ?? "",
    bathrooms: t(uiStrings?.specBathrooms) ?? "",
    areaRange: t(uiStrings?.tableAreaM2) ?? "",
    priceFrom: t(uiStrings?.tablePriceFrom) ?? "",
    availability: t(uiStrings?.tableStatus) ?? "",
    contactUs: t(uiStrings?.ctaContactUs) ?? "",
    soldOut: t(uiStrings?.statusSoldOut) ?? "",
    available: t(uiStrings?.statusAvailable) ?? "",
    fromLabel: t(uiStrings?.pricingFrom) ?? "",
  };

  return (
    <>
      {/* Hero */}
      <PageHero
        title={heroTitle}
        backgroundImage={heroImageUrl}
        compact
        subtitle={introCopy}
      />

      {/* Villa grid with filters */}
      <section className="py-20 lg:py-28">
        <div className="section-shell">
          <SectionHeading
            eyebrow={t(page?.collectionEyebrow) ?? ""}
            title={t(page?.collectionTitle) ?? ""}
            description={t(page?.collectionDescription) ?? ""}
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
            eyebrow={t(page?.compareEyebrow) ?? ""}
            title={t(page?.compareTitle) ?? ""}
            description={t(page?.compareDescription) ?? ""}
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
            eyebrow={t(page?.upgradesEyebrow) ?? ""}
            title={t(page?.upgradesTitle) ?? ""}
            description={t(page?.upgradesDescription) ?? ""}
          />
          <div className="mt-12">
            <UpgradesShowcase upgrades={upgrades} locale={typedLocale} />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-shell py-20">
        <SectionHeading
          eyebrow={t(page?.faqEyebrow) ?? ""}
          title={t(page?.faqTitle) ?? ""}
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
