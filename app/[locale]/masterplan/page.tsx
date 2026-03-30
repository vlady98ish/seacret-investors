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
  uiStringsQuery,
} from "@/lib/sanity/queries";
import type {
  MasterplanPage as MasterplanPageType,
  PlotWithUnits,
  UiStrings,
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = (field: any): string | undefined =>
    field ? (getLocalizedValue(field, typedLocale) as string | undefined) : undefined;

  // Fetch all data with graceful fallbacks to local seed data
  let page: MasterplanPageType | null = null;
  let plots: PlotWithUnits[] = [];
  let units: UnitFlat[] = [];
  let stats: { total: number; available: number; reserved: number; sold: number } | null = null;
  let uiStrings: UiStrings | null = null;

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

  try {
    const result = await sanityClient.fetch<UiStrings>(uiStringsQuery);
    if (result) uiStrings = result;
  } catch {
    // use English fallbacks in components
  }

  const heroTitle =
    getLocalizedValue(page?.heroTitle, typedLocale) ?? "The Masterplan";
  const heroImageUrl = page?.heroImage
    ? getSanityImageUrl(page.heroImage, 1920)
    : null;
  const introCopy = getLocalizedValue(page?.introCopy, typedLocale);

  // Stat labels from CMS with English fallbacks
  const statTotalLabel = t(page?.statTotalLabel) || "Total Residences";
  const statAvailableLabel = t(page?.statAvailableLabel) || "Available";
  const statReservedLabel = t(page?.statReservedLabel) || "Reserved";
  const statSoldLabel = t(page?.statSoldLabel) || "Sold";

  const statsItems = stats
    ? [
        { label: statTotalLabel, value: stats.total },
        { label: statAvailableLabel, value: stats.available },
        { label: statReservedLabel, value: stats.reserved },
        { label: statSoldLabel, value: stats.sold },
      ]
    : [
        { label: statTotalLabel, value: 39 },
        { label: t(page?.statPlotsLabel) || "Plots", value: 6 },
      ];

  // Legend labels for the visual explorer
  const legendLabels = {
    available: t(uiStrings?.statusAvailable) || "Available",
    reserved: t(uiStrings?.statusReserved) || "Reserved",
    sold: t(uiStrings?.statusSold) || "Sold",
  };

  // Panel labels for plot detail panel
  const panelLabels = {
    selectPlot: t(uiStrings?.miscSelectPlot) || "Select a plot on the map to see details",
    unitsAvailable: t(uiStrings?.miscAvailable) || "available",
    of: t(uiStrings?.miscOf) || "of",
    noUnits: t(uiStrings?.miscDataComing) || "No units assigned to this plot yet.",
    unit: t(uiStrings?.miscUnit) || "unit",
    units: t(uiStrings?.miscUnits) || "units",
  };

  // Inventory table labels
  const inventoryLabels = {
    filterPlot: t(uiStrings?.filterPlot) || "Plot",
    filterType: t(uiStrings?.filterType) || "Type",
    filterAllTypes: t(uiStrings?.filterAllTypes) || "All Types",
    filterAvailableOnly: t(uiStrings?.filterAvailableOnly) || "Available only",
    filterShowing: t(uiStrings?.filterShowing) || "Showing",
    filterOf: t(uiStrings?.miscOf) || "of",
    filterNoResults: t(uiStrings?.filterNoResults) || "No units match your filters",
    dataComing: t(uiStrings?.miscDataComing) || "Inventory data coming soon",
    miscUnits: t(uiStrings?.miscUnits) || "units",
    tablePlot: t(uiStrings?.tablePlot) || "Plot",
    tableUnitNumber: t(uiStrings?.tableUnitNumber) || "Unit #",
    tableVillaType: t(uiStrings?.tableVillaType) || "Villa Type",
    tableBeds: t(uiStrings?.tableBeds) || "Beds",
    tableTotalArea: t(uiStrings?.tableTotalArea) || "Total Area",
    tablePriceFrom: t(uiStrings?.tablePriceFrom) || "Price From",
    tableStatus: t(uiStrings?.tableStatus) || "Status",
  };

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
            eyebrow={t(page?.explorerEyebrow) || "Explore"}
            title={t(page?.explorerTitle) || "Interactive Masterplan"}
            description={
              t(page?.explorerDescription) ||
              "Click on a plot to view its residences, availability, and pricing."
            }
          />
          <div className="mt-12">
            <MasterplanInteractive
              plots={plots}
              locale={typedLocale}
              legendLabels={legendLabels}
              panelLabels={panelLabels}
            />
          </div>
        </div>
      </section>

      {/* Full inventory table */}
      <section className="bg-[var(--color-cream)] py-20 lg:py-28">
        <div className="section-shell">
          <SectionHeading
            eyebrow={t(page?.inventoryEyebrow) || "Full Inventory"}
            title={t(page?.inventoryTitle) || "All Residences"}
            description={
              t(page?.inventoryDescription) ||
              "Filter, sort, and browse every available unit across all plots."
            }
          />
          <div className="mt-12">
            <InventoryTable units={units} locale={typedLocale} labels={inventoryLabels} />
          </div>
        </div>
      </section>

      {/* Contact */}
      <InlineContactSection
        locale={typedLocale}
        preferredOption="Masterplan Inquiry"
        strings={{
          eyebrow: t(uiStrings?.miscGetInTouch),
          title: t(uiStrings?.miscReadyToDiscover),
          description: t(uiStrings?.miscContactPromise),
          whatsappUs: t(uiStrings?.ctaWhatsappUs),
          formFullName: t(uiStrings?.formFullName),
          formEmail: t(uiStrings?.formEmail),
          formPhone: t(uiStrings?.formPhone),
          formMessage: t(uiStrings?.formMessage),
          formGdpr: t(uiStrings?.formGdpr),
          formSubmit: t(uiStrings?.ctaSendRequest),
        }}
      />
    </>
  );
}
