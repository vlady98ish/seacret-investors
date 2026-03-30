import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getLocalizedValue, isValidLocale, locales, type Locale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/metadata";
import { formatPriceFrom } from "@/lib/pricing";
import { sanityClient } from "@/lib/sanity/client";
import { getSanityImageUrl } from "@/lib/sanity/image";
import { allVillasQuery, uiStringsQuery, villaBySlugQuery } from "@/lib/sanity/queries";
import type { UiStrings, UnitWithRefs, Villa } from "@/lib/sanity/types";
import { fallbackVillas, getFallbackVillaWithUnits } from "@/lib/fallback-data";
import { getVillaImages } from "@/lib/villa-images";

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

const villaSlugs = ["lola", "mikka", "tai", "michal", "yair", "yehonatan"];

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    villaSlugs.map((slug) => ({ locale, slug }))
  );
}

type VillaWithUnits = Villa & { units: UnitWithRefs[] };

async function fetchData(slug: string): Promise<{
  villa: VillaWithUnits | null;
  allVillas: Villa[];
  uiStrings: UiStrings | null;
}> {
  let villa: VillaWithUnits | null = null;
  let allVillas: Villa[] = [];
  let uiStrings: UiStrings | null = null;

  try {
    const [villaResult, villasResult, uiStringsResult] = await Promise.all([
      sanityClient.fetch<VillaWithUnits | null>(villaBySlugQuery, { slug }),
      sanityClient.fetch<Villa[]>(allVillasQuery),
      sanityClient.fetch<UiStrings>(uiStringsQuery),
    ]);
    if (villaResult) villa = villaResult;
    if (villasResult?.length) allVillas = villasResult;
    if (uiStringsResult) uiStrings = uiStringsResult;
  } catch {
    // CMS unavailable — use fallback data
  }

  if (!villa) villa = getFallbackVillaWithUnits(slug);
  if (!allVillas.length) allVillas = fallbackVillas;

  return { villa, allVillas, uiStrings };
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

  const { villa, allVillas, uiStrings } = await fetchData(slug);

  const typedLocale = locale as Locale;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = (field: any): string | undefined =>
    field ? (getLocalizedValue(field, typedLocale) as string | undefined) : undefined;

  // Fallback: if slug doesn't match any known villa and CMS has no data
  const isKnownSlug = villaSlugs.includes(slug);
  if (!villa && !isKnownSlug) notFound();

  const units: UnitWithRefs[] = villa?.units ?? [];
  const staticImages = getVillaImages(slug);

  // Resolve hero image — Sanity first, then static fallback
  const heroImageUrl = villa?.heroImage
    ? getSanityImageUrl(villa.heroImage, 1600)
    : staticImages.hero;

  // Resolve gallery images — Sanity first, then static fallback
  const sanityGallery = (villa?.galleryImages ?? [])
    .map((img) => getSanityImageUrl(img, 800))
    .filter((u): u is string => Boolean(u));
  const galleryImages = sanityGallery.length > 0 ? sanityGallery : staticImages.gallery;

  // Resolve floor plan images — Sanity first, then static fallback
  const sanityPlans = (villa?.floorPlanImages ?? [])
    .map((img) => getSanityImageUrl(img, 1200))
    .filter((u): u is string => Boolean(u));
  const floorPlanImages = sanityPlans.length > 0 ? sanityPlans : staticImages.plans;

  // Compute price from min available unit area
  const availableUnits = units.filter((u) => u.status === "available");
  const minArea =
    availableUnits.length > 0
      ? Math.min(...availableUnits.map((u) => u.totalArea))
      : null;

  const villaName = villa?.name ?? slug.charAt(0).toUpperCase() + slug.slice(1);
  const villaLabel = villa?.label
    ? getLocalizedValue(villa.label, typedLocale)
    : undefined;
  const villaSummary = villa?.summary
    ? getLocalizedValue(villa.summary, typedLocale)
    : undefined;

  // Resolve CMS labels — fall back to English in JSX with ||
  const labelGallery = t(uiStrings?.miscGallery) || "Gallery";
  const labelFloorPlans = t(uiStrings?.miscFloorPlans) || "Floor Plans";
  const labelPricing = t(uiStrings?.miscPricing) || "Pricing";
  const labelAvailableUnits = t(uiStrings?.miscAvailableUnits) || "Available Units";
  const label3dTour = t(uiStrings?.misc3dTour) || "3D Virtual Tour";
  const labelContactForPricing = t(uiStrings?.pricingContactFor) || "Contact for pricing";
  const labelPricingDesc = t(uiStrings?.miscContactPromise) || "Pre-sale pricing for qualified buyers. Contact us for a personalised proposal.";

  // Specs labels
  const labelVillaSpecs = t(uiStrings?.miscVillaSpecs) || "Villa Specifications";
  const labelDetailsComing = t(uiStrings?.miscDetailsComing) || "Details coming soon";
  const labelBedrooms = t(uiStrings?.specBedrooms) || "Bedrooms";
  const labelBathrooms = t(uiStrings?.specBathrooms) || "Bathrooms";
  const labelTotalArea = t(uiStrings?.specTotalArea) || "Total Area";
  const labelOutdoorArea = t(uiStrings?.specOutdoorArea) || "Outdoor Area";
  const labelPool = t(uiStrings?.specPool) || "Swimming Pool";
  const labelParking = t(uiStrings?.specParking) || "Parking";
  const labelYes = t(uiStrings?.specYes) || "Yes";
  const labelNo = t(uiStrings?.specNo) || "No";

  // Units table labels
  const labelUnitNumber = t(uiStrings?.tableUnitNumber) || "Unit #";
  const labelPlot = t(uiStrings?.tablePlot) || "Plot";
  const labelAreaM2 = t(uiStrings?.tableAreaM2) || "Area m²";
  const labelBeds = t(uiStrings?.tableBeds) || "Beds";
  const labelPoolHeader = t(uiStrings?.tablePool) || "Pool";
  const labelStatus = t(uiStrings?.tableStatus) || "Status";
  const labelStatusAvailable = t(uiStrings?.statusAvailable) || "Available";
  const labelStatusReserved = t(uiStrings?.statusReserved) || "Reserved";
  const labelStatusSold = t(uiStrings?.statusSold) || "Sold";

  // Floor plans labels
  const labelGroundFloor = t(uiStrings?.miscGroundFloor) || "Ground Floor";
  const labelUpperFloor = t(uiStrings?.miscUpperFloor) || "Upper Floor";
  const labelAttic = t(uiStrings?.miscAttic) || "Attic";
  const labelComingSoon = t(uiStrings?.miscComingSoon) || "Coming soon";

  // Related villas labels
  const labelExploreMore = t(uiStrings?.miscExploreMore) || "EXPLORE MORE";
  const labelYouMightLike = t(uiStrings?.miscYouMightLike) || "You Might Also Like";
  const labelYouMightLikeDesc = t(uiStrings?.miscYouMightLikeDesc) || "Discover our other exclusive villa types at Sea'cret Residences.";
  const labelSoldOut = t(uiStrings?.statusSoldOut) || "Sold Out";
  const labelBed = t(uiStrings?.miscBed) || "bed";

  return (
    <>
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
            villa={villa ?? null}
            units={units}
            locale={typedLocale}
            labelEyebrow={labelVillaSpecs}
            labelBedrooms={labelBedrooms}
            labelBathrooms={labelBathrooms}
            labelTotalArea={labelTotalArea}
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
      {(galleryImages.length > 0 || !villa) && (
        <section className="section-shell pb-16">
          <p className="eyebrow mb-6">{labelGallery}</p>
          <ScrollReveal>
            <ImageGallery images={galleryImages} villaName={villaName} emptyText={labelComingSoon} />
          </ScrollReveal>
        </section>
      )}

      {/* Floor Plans */}
      {(floorPlanImages.length > 0 || !villa) && (
        <section className="bg-[var(--color-cream)] py-16">
          <div className="section-shell">
            <p className="eyebrow mb-6">{labelFloorPlans}</p>
            <ScrollReveal>
              <FloorPlans
                images={floorPlanImages}
                labels={[labelGroundFloor, labelUpperFloor, labelAttic]}
                comingSoonText={labelComingSoon}
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
      <InlineContactSection locale={typedLocale} preferredOption={villaName} />
    </>
  );
}
