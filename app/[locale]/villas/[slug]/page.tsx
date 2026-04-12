import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { groq } from "next-sanity";

import { getLocalizedValue, isValidLocale, locales, type Locale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/metadata";
import { getBuiltAreaM2 } from "@/lib/built-area";
import { formatPriceFrom } from "@/lib/pricing";
import { sanityClient } from "@/lib/sanity/client";
import { getDevFloorPlanUrls } from "@/lib/local-floor-plans";
import { getSanityImageUrl } from "@/lib/sanity/image";
import { allVillasQuery, uiStringsQuery, villaBySlugQuery } from "@/lib/sanity/queries";
import { getSiteSettings } from "@/lib/sanity/ui-strings";
import type { SiteSettings, UiStrings, UnitWithRefs, Villa } from "@/lib/sanity/types";

import { VillaViewTracker } from "@/components/analytics/villa-view-tracker";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/sections/page-hero";
import { InlineContactSection } from "@/components/inline-contact-section";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SpecsPanel } from "@/components/villa-detail/specs-panel";
import { ImageGallery } from "@/components/villa-detail/image-gallery";
import { FloorPlans } from "@/components/villa-detail/floor-plans";
import { UnitsTable } from "@/components/villa-detail/units-table";
import { RelatedVillas } from "@/components/villa-detail/related-villas";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  try {
    const villas = await sanityClient.fetch<Array<{ slug: { current: string } }>>(
      groq`*[_type == "villa"]{ slug }`
    );
    return locales.flatMap((locale) =>
      villas.map((v) => ({ locale, slug: v.slug.current }))
    );
  } catch {
    return [];
  }
}

type VillaWithUnits = Villa & { units: UnitWithRefs[] };

async function fetchData(slug: string): Promise<{
  villa: VillaWithUnits | null;
  allVillas: Villa[];
  uiStrings: UiStrings | null;
  siteSettings: SiteSettings | null;
}> {
  let villa: VillaWithUnits | null = null;
  let allVillas: Villa[] = [];
  let uiStrings: UiStrings | null = null;
  let siteSettings: SiteSettings | null = null;

  try {
    const [villaResult, villasResult, uiStringsResult, settingsResult] = await Promise.all([
      sanityClient.fetch<VillaWithUnits | null>(villaBySlugQuery, { slug }),
      sanityClient.fetch<Villa[]>(allVillasQuery),
      sanityClient.fetch<UiStrings>(uiStringsQuery),
      getSiteSettings(),
    ]);
    if (villaResult) villa = villaResult;
    if (villasResult?.length) allVillas = villasResult;
    if (uiStringsResult) uiStrings = uiStringsResult;
    if (settingsResult) siteSettings = settingsResult;
  } catch {
    // CMS unavailable
  }

  return { villa, allVillas, uiStrings, siteSettings };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) return {};

  const { villa } = await fetchData(slug);

  const label = villa?.label ? getLocalizedValue(villa.label, locale as Locale) : undefined;
  const summary = villa?.summary ? getLocalizedValue(villa.summary, locale as Locale) : undefined;

  return buildPageMetadata(
    villa
      ? {
          seoTitle: villa.label,
          seoDescription: villa.summary,
        }
      : null,
    locale as Locale,
    `/villas/${slug}`,
    {
      title: label ?? `Villa ${slug} — Sea'cret Residences`,
      description:
        summary ?? `Discover ${slug} villa at Sea'cret Residences, a luxury development in Cyprus.`,
    }
  );
}

export default async function VillaDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) notFound();

  const { villa, allVillas, uiStrings, siteSettings } = await fetchData(slug);

  const typedLocale = locale as Locale;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = (field: any): string | undefined =>
    field ? (getLocalizedValue(field, typedLocale) as string | undefined) : undefined;

  if (!villa) notFound();

  const units: UnitWithRefs[] = villa?.units ?? [];

  const heroImageUrl = getSanityImageUrl(villa.heroImage);
  const galleryImages = (villa.galleryImages ?? [])
    .map((img) => getSanityImageUrl(img))
    .filter((u): u is string => Boolean(u));
  const devFloorPlans = getDevFloorPlanUrls(slug);
  const floorPlanImages =
    devFloorPlans && devFloorPlans.length > 0
      ? devFloorPlans
      : (villa.floorPlanImages ?? [])
          .map((img) => getSanityImageUrl(img, 1200))
          .filter((u): u is string => Boolean(u));

  // Pricing: €3500 × built area (m²); min across all units
  const minArea =
    units.length > 0
      ? Math.min(...units.map((u) => getBuiltAreaM2(u)))
      : null;

  const villaName = villa?.name ?? slug.charAt(0).toUpperCase() + slug.slice(1);
  const villaLabel = villa?.label
    ? getLocalizedValue(villa.label, typedLocale)
    : undefined;
  const villaSummary = villa?.summary
    ? getLocalizedValue(villa.summary, typedLocale)
    : undefined;

  const labelGallery = t(uiStrings?.miscGallery) ?? "";
  const labelFloorPlans = t(uiStrings?.miscFloorPlans) ?? "";
  const labelPricing = t(uiStrings?.miscPricing) ?? "";
  const labelAvailableUnits = t(uiStrings?.miscAvailableUnits) ?? "";
  const label3dTour = t(uiStrings?.misc3dTour) ?? "";
  const labelContactForPricing = t(uiStrings?.pricingContactFor) ?? "";
  const labelPricingDesc = t(uiStrings?.miscContactPromise) ?? "";

  const labelVillaSpecs = t(uiStrings?.miscVillaSpecs) ?? "";
  const labelDetailsComing = t(uiStrings?.miscDetailsComing) ?? "";
  const labelBedrooms = t(uiStrings?.specBedrooms) ?? "";
  const labelBathrooms = t(uiStrings?.specBathrooms) ?? "";
  const labelBuiltArea = t(uiStrings?.specBuiltArea) ?? "";
  const labelOutdoorArea = t(uiStrings?.specOutdoorArea) ?? "";
  const labelPool = t(uiStrings?.specPool) ?? "";
  const labelParking = t(uiStrings?.specParking) ?? "";
  const labelYes = t(uiStrings?.specYes) ?? "";
  const labelNo = t(uiStrings?.specNo) ?? "";

  const labelUnitNumber = t(uiStrings?.tableUnitNumber) ?? "";
  const labelPlot = t(uiStrings?.tablePlot) ?? "";
  const labelAreaM2 = t(uiStrings?.tableAreaM2) ?? "";
  const labelBeds = t(uiStrings?.tableBeds) ?? "";
  const labelPoolHeader = t(uiStrings?.tablePool) ?? "";
  const labelStatus = t(uiStrings?.tableStatus) ?? "";
  const labelStatusAvailable = t(uiStrings?.statusAvailable) ?? "";
  const labelStatusReserved = t(uiStrings?.statusReserved) ?? "";
  const labelStatusSold = t(uiStrings?.statusSold) ?? "";
  const labelViewInventory = t(uiStrings?.ctaViewAll) ?? "View full inventory";
  const labelContactUs = t(uiStrings?.ctaContactUs) ?? "Contact us";

  const unitDetailLabels = {
    groundFloor: t(uiStrings?.specGroundFloor) ?? "Ground Floor",
    upperFloor: t(uiStrings?.specUpperFloor) ?? "Upper Floor",
    attic: t(uiStrings?.specAttic) ?? "Attic",
    balcony: t(uiStrings?.specBalcony) ?? "Balcony",
    roofTerrace: t(uiStrings?.specRoofTerrace) ?? "Roof Terrace",
    outdoorArea: t(uiStrings?.specOutdoorArea) ?? "Outdoor Area",
    propertySize: t(uiStrings?.specPropertySize) ?? "Property Size",
    bathrooms: t(uiStrings?.specBathrooms) ?? "Bathrooms",
    pool: t(uiStrings?.specPool) ?? "Pool",
    parking: t(uiStrings?.specParking) ?? "Parking",
    yes: t(uiStrings?.specYes) ?? "Yes",
    no: t(uiStrings?.specNo) ?? "No",
  };

  const labelGroundFloor = t(uiStrings?.miscGroundFloor) ?? "";
  const labelUpperFloor = t(uiStrings?.miscUpperFloor) ?? "";
  const labelAttic = t(uiStrings?.miscAttic) ?? "";
  const labelComingSoon = t(uiStrings?.miscComingSoon) ?? "";

  const labelExploreMore = t(uiStrings?.miscExploreMore) ?? "";
  const labelYouMightLike = t(uiStrings?.miscYouMightLike) ?? "";
  const labelYouMightLikeDesc = t(uiStrings?.miscYouMightLikeDesc) ?? "";
  const labelSoldOut = t(uiStrings?.statusSoldOut) ?? "";
  const labelBed = t(uiStrings?.miscBed) ?? "";

  return (
    <>
      <VillaViewTracker villaName={villaName} villaSlug={slug} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Apartment",
        name: `Villa ${villa?.name ?? slug}`,
        description: `Luxury villa in Chiliadou, Greece`,
        numberOfRooms: villa?.typicalBedrooms ?? 2,
        floorSize: {
          "@type": "QuantitativeValue",
          value: villa?.areaRange ?? "85",
          unitCode: "MTK",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 38.3647,
          longitude: 21.8892,
        },
      }} />

      {/* Hero */}
      <PageHero
        backgroundImage={heroImageUrl}
        title={villaName}
        subtitle={villaLabel ?? villaSummary}
        compact={false}
      >
        {villa?.tourUrl && (
          <a
            href={villa.tourUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            {label3dTour}
          </a>
        )}
      </PageHero>

      {/* Specs */}
      <section className="section-shell py-16">
        <ScrollReveal>
          <SpecsPanel
            villa={villa}
            units={units}
            locale={typedLocale}
            labelEyebrow={labelVillaSpecs}
            labelBedrooms={labelBedrooms}
            labelBathrooms={labelBathrooms}
            labelBuiltArea={labelBuiltArea}
            labelOutdoorArea={labelOutdoorArea}
            labelPool={labelPool}
            labelParking={labelParking}
            labelYes={labelYes}
            labelNo={labelNo}
            labelDetailsComing={labelDetailsComing}
          />
        </ScrollReveal>
      </section>

      {/* Gallery */}
      {galleryImages.length > 0 && (
        <section className="section-shell pb-16">
          <p className="eyebrow mb-6">{labelGallery}</p>
          <ScrollReveal>
            <ImageGallery images={galleryImages} villaName={villaName} emptyText={labelComingSoon} />
          </ScrollReveal>
        </section>
      )}

      {/* Floor Plans */}
      {floorPlanImages.length > 0 && (
        <section className="bg-[var(--color-cream)] py-16">
          <div className="section-shell">
            <p className="eyebrow mb-6">{labelFloorPlans}</p>
            <ScrollReveal>
              <FloorPlans
                images={floorPlanImages}
                labels={[labelGroundFloor, labelUpperFloor, labelAttic]}
                comingSoonText={labelComingSoon}
                minTabCount={slug === "yair" ? 2 : undefined}
              />
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* Pricing */}
      <section className="bg-[var(--color-night)] py-20">
        <div className="section-shell">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow text-[var(--color-gold-sun)]">{labelPricing}</p>
              <p className="mt-3 text-white/70 max-w-md">
                {labelPricingDesc}
              </p>
            </div>
            <div className="shrink-0 text-right">
              {minArea ? (
                <p className="text-display font-semibold text-[var(--color-gold-sun)]">
                  {formatPriceFrom(minArea)}
                </p>
              ) : (
                <p className="text-h2 text-white/60">{labelContactForPricing}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Units Table */}
      <section className="section-shell py-16">
        <p className="eyebrow mb-6">{labelAvailableUnits}</p>
        <ScrollReveal>
          <UnitsTable
            units={units}
            locale={typedLocale}
            headerUnit={labelUnitNumber}
            headerPlot={labelPlot}
            headerArea={labelAreaM2}
            headerBeds={labelBeds}
            headerPool={labelPoolHeader}
            headerStatus={labelStatus}
            labelStatusAvailable={labelStatusAvailable}
            labelStatusReserved={labelStatusReserved}
            labelStatusSold={labelStatusSold}
            villaSlug={slug}
            labelViewInventory={labelViewInventory}
            villaName={villaName}
            labelContactUs={labelContactUs}
            detailLabels={unitDetailLabels}
          />
        </ScrollReveal>
      </section>

      {/* Related Villas */}
      <div className="bg-[var(--color-cream)]">
        <RelatedVillas
          allVillas={allVillas}
          currentSlug={slug}
          locale={typedLocale}
          labelEyebrow={labelExploreMore}
          labelTitle={labelYouMightLike}
          labelDescription={labelYouMightLikeDesc}
          labelSoldOut={labelSoldOut}
          labelBed={labelBed}
          labelContactForPricing={labelContactForPricing}
          labelAvailable={labelStatusAvailable}
        />
      </div>

      {/* Contact */}
      <InlineContactSection
        locale={typedLocale}
        preferredOption={villaName}
        whatsappUrl={siteSettings?.whatsappNumber ? `https://wa.me/${siteSettings.whatsappNumber.replace(/\D/g, "")}` : undefined}
      />
    </>
  );
}
