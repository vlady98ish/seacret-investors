import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { InlineContactSection } from "@/components/inline-contact-section";
import { InventoryTable } from "@/components/masterplan/inventory-table";
import { MasterplanInteractive } from "@/components/masterplan/masterplan-interactive";
import { PageHero } from "@/components/sections/page-hero";
import { SectionHeading } from "@/components/sections/section-heading";
import { StatsBar } from "@/components/about/stats-bar";
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
import { getSiteSettings } from "@/lib/sanity/ui-strings";
import type {
  MasterplanPage as MasterplanPageType,
  PlotWithUnits,
  SiteSettings,
  UiStrings,
  UnitFlat,
} from "@/lib/sanity/types";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string }>;
};

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
  return buildPageMetadata(page, locale as Locale, "/masterplan", {
    title: "Masterplan — Sea'cret Residences",
    description:
      "Explore the interactive masterplan. Browse plots, check availability, and find your ideal residence.",
  });
}

export default async function MasterplanPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { type: initialTypeFilter } = await searchParams;
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
  let siteSettings: SiteSettings | null = null;

  try {
    const result = await sanityClient.fetch<MasterplanPageType>(masterplanPageQuery);
    if (result) page = result;
  } catch {
    // CMS unavailable
  }

  try {
    const result = await sanityClient.fetch<PlotWithUnits[]>(allPlotsQuery);
    if (result?.length) plots = result;
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
    const result = await sanityClient.fetch(availabilityStatsQuery);
    if (result) stats = result;
  } catch {
    // CMS unavailable
  }

  try {
    const result = await sanityClient.fetch<UiStrings>(uiStringsQuery);
    if (result) uiStrings = result;
  } catch {
    // use English fallbacks in components
  }

  try {
    siteSettings = await getSiteSettings();
  } catch {
    // CMS unavailable
  }

  const heroTitle =
    getLocalizedValue(page?.heroTitle, typedLocale) ?? "";
  const heroImageUrl = page?.heroImage
    ? getSanityImageUrl(page.heroImage)
    : null;
  const introCopy = getLocalizedValue(page?.introCopy, typedLocale);

  const statTotalLabel = t(page?.statTotalLabel) ?? "";
  const statAvailableLabel = t(page?.statAvailableLabel) ?? "";
  const statReservedLabel = t(page?.statReservedLabel) ?? "";
  const statSoldLabel = t(page?.statSoldLabel) ?? "";

  const statsItems = stats
    ? [
        { label: statTotalLabel, value: String(stats.total) },
        { label: statAvailableLabel, value: String(stats.available) },
        { label: statReservedLabel, value: String(stats.reserved) },
        { label: statSoldLabel, value: String(stats.sold) },
      ]
    : [];

  const legendLabels = {
    available: t(uiStrings?.statusAvailable) ?? "",
    reserved: t(uiStrings?.statusReserved) ?? "",
    sold: t(uiStrings?.statusSold) ?? "",
  };

  const panelLabels = {
    selectPlot: t(uiStrings?.miscSelectPlot) ?? "",
    unitsAvailable: t(uiStrings?.miscAvailable) ?? "",
    of: t(uiStrings?.miscOf) ?? "",
    noUnits: t(uiStrings?.miscDataComing) ?? "",
    unit: t(uiStrings?.miscUnit) ?? "",
    units: t(uiStrings?.miscUnits) ?? "",
  };

  const blueprintLabels = {
    backToMasterplan: "Back to masterplan",
    available: legendLabels.available,
    reserved: legendLabels.reserved,
    sold: legendLabels.sold,
    bedrooms: t(uiStrings?.specBedrooms) ?? "BR",
    bathrooms: t(uiStrings?.specBathrooms) ?? "BA",
    pool: t(uiStrings?.specPool) ?? "Pool",
    viewVilla: t(uiStrings?.ctaExploreResidences) ?? "View Villa",
    of: t(uiStrings?.miscOf) ?? "of",
    unitsAvailable: t(uiStrings?.miscAvailable) ?? "available",
    mountainView: "Mountain view",
    seaView: "Sea view",
  };

  const inventoryLabels = {
    filterPlot: t(uiStrings?.filterPlot) ?? "",
    filterType: t(uiStrings?.filterType) ?? "",
    filterAllTypes: t(uiStrings?.filterAllTypes) ?? "",
    filterAvailableOnly: t(uiStrings?.filterAvailableOnly) ?? "",
    filterShowing: t(uiStrings?.filterShowing) ?? "",
    filterOf: t(uiStrings?.miscOf) ?? "",
    filterNoResults: t(uiStrings?.filterNoResults) ?? "",
    dataComing: t(uiStrings?.miscDataComing) ?? "",
    miscUnits: t(uiStrings?.miscUnits) ?? "",
    tablePlot: t(uiStrings?.tablePlot) ?? "",
    tableUnitNumber: t(uiStrings?.tableUnitNumber) ?? "",
    tableVillaType: t(uiStrings?.tableVillaType) ?? "",
    tableBeds: t(uiStrings?.tableBeds) ?? "",
    tableTotalArea: t(uiStrings?.tableTotalArea) ?? "",
    tablePriceFrom: t(uiStrings?.tablePriceFrom) ?? "",
    tableStatus: t(uiStrings?.tableStatus) ?? "",
    tableBuiltArea: t(uiStrings?.specBuiltArea) ?? "",
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

      {/* Stats bar */}
      <StatsBar stats={statsItems} />

      {/* Interactive masterplan */}
      <section className="py-20 lg:py-28">
        <div className="section-shell">
          <SectionHeading
            eyebrow={t(page?.explorerEyebrow) ?? ""}
            title={t(page?.explorerTitle) ?? ""}
            description={t(page?.explorerDescription) ?? ""}
          />
          <div className="mt-12">
            <MasterplanInteractive
              plots={plots}
              locale={typedLocale}
              legendLabels={legendLabels}
              panelLabels={panelLabels}
              blueprintLabels={blueprintLabels}
              aerialImageUrl={heroImageUrl}
            />
          </div>
        </div>
      </section>

      {/* Full inventory table */}
      <section className="bg-[var(--color-cream)] py-20 lg:py-28">
        <div className="section-shell">
          <SectionHeading
            eyebrow={t(page?.inventoryEyebrow) ?? ""}
            title={t(page?.inventoryTitle) ?? ""}
            description={t(page?.inventoryDescription) ?? ""}
          />
          <div className="mt-12">
            <InventoryTable units={units} locale={typedLocale} labels={inventoryLabels} initialTypeFilter={initialTypeFilter} />
          </div>
        </div>
      </section>

      {/* Contact */}
      <InlineContactSection
        locale={typedLocale}
        preferredOption="Masterplan Inquiry"
        whatsappUrl={siteSettings?.whatsappNumber ? `https://wa.me/${siteSettings.whatsappNumber.replace(/\D/g, "")}` : undefined}
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
