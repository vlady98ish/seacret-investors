import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { InlineContactSection } from "@/components/inline-contact-section";
import { InventoryTable } from "@/components/masterplan/inventory-table";
import { MasterplanInteractive } from "@/components/masterplan/masterplan-interactive";
import { PageHero } from "@/components/sections/page-hero";
import { SectionHeading } from "@/components/sections/section-heading";
import { StatsBar } from "@/components/sections/stats-bar";
import { getLocalizedValue, isValidLocale, type Locale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/metadata";
import { sanityClient } from "@/lib/sanity/client";
import { getSanityImageUrl } from "@/lib/sanity/image";
import {
  allPlotsQuery,
  allUnitsQuery,
  availabilityStatsQuery,
  masterplanPageQuery,
} from "@/lib/sanity/queries";
import type {
  MasterplanPage as MasterplanPageType,
  PlotWithUnits,
  UnitFlat,
} from "@/lib/sanity/types";
import {
  fallbackPlots,
  fallbackUnitsFlat,
  fallbackStats,
  getFallbackMasterplanPage,
} from "@/lib/fallback-data";

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return ["en", "he", "ru", "el"].map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};

  let page: MasterplanPageType | null = null;
  try {
    const result = await sanityClient.fetch<MasterplanPageType>(masterplanPageQuery);
    if (result) page = result;
  } catch {
    // fallback metadata
  }
  if (!page) page = getFallbackMasterplanPage();

  return buildPageMetadata(page, locale as Locale, "/masterplan", {
    title: "Masterplan — Sea'cret Residences",
    description:
      "Explore the interactive masterplan. Browse plots, check availability, and find your ideal residence.",
  });
}

export default async function MasterplanPage({ params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const typedLocale = locale as Locale;

  // Fetch all data with graceful fallbacks to local seed data
  let page: MasterplanPageType | null = null;
  let plots: PlotWithUnits[] = [];
  let units: UnitFlat[] = [];
  let stats: { total: number; available: number; reserved: number; sold: number } | null = null;

  try {
    const result = await sanityClient.fetch<MasterplanPageType>(masterplanPageQuery);
    if (result) page = result;
  } catch {
    // page hero uses fallbacks
  }
  if (!page) page = getFallbackMasterplanPage();

  try {
    const result = await sanityClient.fetch<PlotWithUnits[]>(allPlotsQuery);
    if (result?.length) plots = result;
  } catch {
    // use fallback below
  }
  if (!plots.length) plots = fallbackPlots;

  try {
    const result = await sanityClient.fetch<UnitFlat[]>(allUnitsQuery);
    if (result?.length) units = result;
  } catch {
    // use fallback below
  }
  if (!units.length) units = fallbackUnitsFlat;

  try {
    const result = await sanityClient.fetch(availabilityStatsQuery);
    if (result) stats = result;
  } catch {
    // use fallback below
  }
  if (!stats || stats.total === 0) stats = fallbackStats;

  const heroTitle =
    getLocalizedValue(page?.heroTitle, typedLocale) ?? "The Masterplan";
  const heroImageUrl = page?.heroImage
    ? getSanityImageUrl(page.heroImage, 1920)
    : null;
  const introCopy = getLocalizedValue(page?.introCopy, typedLocale);

  const statsItems = stats
    ? [
        { label: "Total Residences", value: stats.total },
        { label: "Available", value: stats.available },
        { label: "Reserved", value: stats.reserved },
        { label: "Sold", value: stats.sold },
      ]
    : [
        { label: "Total Residences", value: 39 },
        { label: "Plots", value: 6 },
      ];

  return (
    <>
      {/* Hero */}
      <PageHero
        title={heroTitle}
        backgroundImage={heroImageUrl}
        compact
        subtitle={
          introCopy ??
          "6 residential plots. 39 exclusive villas. Explore the layout."
        }
      />

      {/* Stats bar */}
      <section className="bg-[var(--color-cream)] py-10">
        <div className="section-shell">
          <StatsBar stats={statsItems} />
        </div>
      </section>

      {/* Interactive masterplan */}
      <section className="py-20 lg:py-28">
        <div className="section-shell">
          <SectionHeading
            eyebrow="Explore"
            title="Interactive Masterplan"
            description="Click on a plot to view its residences, availability, and pricing."
          />
          <div className="mt-12">
            <MasterplanInteractive plots={plots} locale={typedLocale} />
          </div>
        </div>
      </section>

      {/* Full inventory table */}
      <section className="bg-[var(--color-cream)] py-20 lg:py-28">
        <div className="section-shell">
          <SectionHeading
            eyebrow="Full Inventory"
            title="All Residences"
            description="Filter, sort, and browse every available unit across all plots."
          />
          <div className="mt-12">
            <InventoryTable units={units} locale={typedLocale} />
          </div>
        </div>
      </section>

      {/* Contact */}
      <InlineContactSection
        locale={typedLocale}
        preferredOption="Masterplan Inquiry"
      />
    </>
  );
}
