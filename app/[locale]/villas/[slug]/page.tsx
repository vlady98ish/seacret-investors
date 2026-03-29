import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getLocalizedValue, isValidLocale, locales, type Locale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/metadata";
import { formatPriceFrom } from "@/lib/pricing";
import { sanityClient } from "@/lib/sanity/client";
import { getSanityImageUrl } from "@/lib/sanity/image";
import { allVillasQuery, villaBySlugQuery } from "@/lib/sanity/queries";
import type { UnitWithRefs, Villa } from "@/lib/sanity/types";
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
}> {
  let villa: VillaWithUnits | null = null;
  let allVillas: Villa[] = [];

  try {
    const [villaResult, villasResult] = await Promise.all([
      sanityClient.fetch<VillaWithUnits | null>(villaBySlugQuery, { slug }),
      sanityClient.fetch<Villa[]>(allVillasQuery),
    ]);
    if (villaResult) villa = villaResult;
    if (villasResult?.length) allVillas = villasResult;
  } catch {
    // CMS unavailable — use fallback data
  }

  if (!villa) villa = getFallbackVillaWithUnits(slug);
  if (!allVillas.length) allVillas = fallbackVillas;

  return { villa, allVillas };
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

  const { villa, allVillas } = await fetchData(slug);

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
    ? getLocalizedValue(villa.label, locale as Locale)
    : undefined;
  const villaSummary = villa?.summary
    ? getLocalizedValue(villa.summary, locale as Locale)
    : undefined;

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
            3D Virtual Tour
          </a>
        )}
      </PageHero>

      {/* Specs */}
      <section className="section-shell py-16">
        <ScrollReveal>
          <SpecsPanel villa={villa ?? null} units={units} locale={locale as Locale} />
        </ScrollReveal>
      </section>

      {/* Gallery */}
      {(galleryImages.length > 0 || !villa) && (
        <section className="section-shell pb-16">
          <p className="eyebrow mb-6">Gallery</p>
          <ScrollReveal>
            <ImageGallery images={galleryImages} villaName={villaName} />
          </ScrollReveal>
        </section>
      )}

      {/* Floor Plans */}
      {(floorPlanImages.length > 0 || !villa) && (
        <section className="bg-[var(--color-cream)] py-16">
          <div className="section-shell">
            <p className="eyebrow mb-6">Floor Plans</p>
            <ScrollReveal>
              <FloorPlans images={floorPlanImages} />
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* Pricing */}
      <section className="bg-[var(--color-night)] py-20">
        <div className="section-shell">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow text-[var(--color-gold-sun)]">Pricing</p>
              <p className="mt-3 text-white/70 max-w-md">
                Pre-sale pricing for qualified buyers. Contact us for a personalised proposal.
              </p>
            </div>
            <div className="shrink-0 text-right">
              {minArea ? (
                <p className="text-display font-semibold text-[var(--color-gold-sun)]">
                  {formatPriceFrom(minArea)}
                </p>
              ) : (
                <p className="text-h2 text-white/60">Contact for pricing</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Units Table */}
      <section className="section-shell py-16">
        <p className="eyebrow mb-6">Available Units</p>
        <ScrollReveal>
          <UnitsTable units={units} locale={locale as Locale} />
        </ScrollReveal>
      </section>

      {/* Related Villas */}
      <div className="bg-[var(--color-cream)]">
        <RelatedVillas
          allVillas={allVillas}
          currentSlug={slug}
          locale={locale as Locale}
        />
      </div>

      {/* Contact */}
      <InlineContactSection locale={locale as Locale} preferredOption={villaName} />
    </>
  );
}
