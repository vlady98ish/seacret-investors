import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { isValidLocale, getLocalizedValue, type Locale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/metadata";
import { sanityClient } from "@/lib/sanity/client";
import { homePageQuery, availabilityStatsQuery } from "@/lib/sanity/queries";
import type { HomePage as HomePageData } from "@/lib/sanity/types";
import { getUiStrings, getSiteSettings } from "@/lib/sanity/ui-strings";

import { HeroSection } from "@/components/home/hero-section";
import { ConceptSection } from "@/components/home/concept-section";
import { JsonLd } from "@/components/json-ld";
import { LocationHighlightSection } from "@/components/home/location-highlight-section";
import { LifestyleSection } from "@/components/home/lifestyle-section";
import { ResidencesPreviewSection } from "@/components/home/residences-preview-section";
import { MasterplanTeaserSection } from "@/components/home/masterplan-teaser-section";
import { CtaSection } from "@/components/home/cta-section";
import { InlineContactSection } from "@/components/inline-contact-section";

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return ["en", "he", "ru", "el"].map((locale) => ({ locale }));
}

async function fetchHomePage(): Promise<HomePageData | null> {
  try {
    return await sanityClient.fetch<HomePageData | null>(homePageQuery);
  } catch {
    return null;
  }
}

async function fetchStats(): Promise<{
  total: number;
  available: number;
  reserved: number;
  sold: number;
} | null> {
  try {
    return await sanityClient.fetch<{
      total: number;
      available: number;
      reserved: number;
      sold: number;
    } | null>(availabilityStatsQuery);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};

  const data = await fetchHomePage();
  return buildPageMetadata(data, locale as Locale, "", {
    title: "Sea'cret Residences Chiliadou — Luxury Coastal Living in Greece",
    description:
      "Discover 39 exclusive beachfront residences in Chiliadou, Greece. Modern architecture, pristine coastline, from €150K.",
  });
}

export default async function HomePageRoute({ params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const typedLocale = locale as Locale;

  const [data, stats, uiStrings, siteSettings] = await Promise.all([
    fetchHomePage(),
    fetchStats(),
    getUiStrings(),
    getSiteSettings(),
  ]);

  // Resolve location highlights from CMS
  const locationHighlights = data?.locationHighlights?.map((h) => ({
    title: getLocalizedValue(h.title, typedLocale) ?? "",
    description: getLocalizedValue(h.description, typedLocale) ?? "",
  }));

  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "RealEstateAgent",
        name: "The Sea'cret Residences Chiliadou",
        description: "Exclusive beachfront residences in Chiliadou, Greece",
        url: `https://seacret-residences.com/${locale}`,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Chiliadou",
          addressRegion: "Fokida",
          addressCountry: "GR",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 38.3647,
          longitude: 21.8892,
        },
      }} />
      <HeroSection
        data={data}
        locale={typedLocale}
        ctaExplore={getLocalizedValue(uiStrings?.ctaExploreResidences, typedLocale)}
        ctaBrochure={getLocalizedValue(uiStrings?.ctaDownloadBrochure, typedLocale)}
      />
      <ConceptSection data={data} locale={typedLocale} />
      <LocationHighlightSection
        locale={typedLocale}
        title={getLocalizedValue(data?.locationTitle, typedLocale)}
        description={getLocalizedValue(data?.locationDescription, typedLocale)}
        highlights={locationHighlights}
        eyebrowLabel={getLocalizedValue(uiStrings?.sectionLocation, typedLocale)}
        ctaLabel={getLocalizedValue(uiStrings?.ctaExploreLocation, typedLocale)}
      />
      <LifestyleSection
        data={data}
        locale={typedLocale}
        title={getLocalizedValue(data?.lifestyleTitle, typedLocale)}
        eyebrowLabel={getLocalizedValue(uiStrings?.sectionLifestyle, typedLocale)}
        periodLabels={{
          Morning: getLocalizedValue(uiStrings?.miscMorning, typedLocale) ?? "",
          Day: getLocalizedValue(uiStrings?.miscDay, typedLocale) ?? "",
          Evening: getLocalizedValue(uiStrings?.miscEvening, typedLocale) ?? "",
        }}
      />
      <ResidencesPreviewSection
        villas={data?.featuredVillas}
        locale={typedLocale}
        title={getLocalizedValue(data?.residencesTitle, typedLocale)}
        description={getLocalizedValue(data?.residencesDescription, typedLocale)}
        eyebrowLabel={getLocalizedValue(uiStrings?.sectionResidences, typedLocale)}
        ctaLabel={getLocalizedValue(uiStrings?.ctaViewAll, typedLocale)}
        labelBed={getLocalizedValue(uiStrings?.miscBed, typedLocale)}
        labelContactForPricing={getLocalizedValue(uiStrings?.pricingContactFor, typedLocale)}
      />
      <MasterplanTeaserSection
        data={data}
        stats={stats}
        locale={typedLocale}
        title={getLocalizedValue(data?.masterplanTitle, typedLocale)}
        description={getLocalizedValue(data?.masterplanDescription, typedLocale)}
        statTotalLabel={getLocalizedValue(uiStrings?.miscAvailableUnits, typedLocale)}
        statPlotsLabel={getLocalizedValue(uiStrings?.filterPlot, typedLocale)}
        statAvailableLabel={getLocalizedValue(uiStrings?.miscAvailable, typedLocale)}
        eyebrowLabel={getLocalizedValue(uiStrings?.sectionMasterplan, typedLocale)}
        ctaLabel={getLocalizedValue(uiStrings?.ctaExploreMasterplan, typedLocale)}
      />
      <CtaSection data={data} locale={typedLocale} ctaLabel={getLocalizedValue(uiStrings?.ctaRequestInfo, typedLocale)} />
      <InlineContactSection
        locale={typedLocale}
        whatsappUrl={siteSettings?.whatsappNumber ? `https://wa.me/${siteSettings.whatsappNumber.replace(/\D/g, "")}` : undefined}
        viberUrl={siteSettings?.viberNumber ? `viber://chat?number=%2B${siteSettings.viberNumber.replace(/\D/g, "")}` : undefined}
        strings={{
          eyebrow: getLocalizedValue(data?.inlineContactEyebrow, typedLocale) || getLocalizedValue(uiStrings?.miscGetInTouch, typedLocale),
          title: getLocalizedValue(data?.inlineContactTitle, typedLocale) || getLocalizedValue(uiStrings?.miscReadyToDiscover, typedLocale),
          description: getLocalizedValue(data?.inlineContactDescription, typedLocale) || getLocalizedValue(uiStrings?.miscContactPromise, typedLocale),
          whatsappUs: getLocalizedValue(uiStrings?.ctaWhatsappUs, typedLocale),
          viberUs: getLocalizedValue(uiStrings?.ctaViberUs, typedLocale),
          formFullName: getLocalizedValue(uiStrings?.formFullName, typedLocale),
          formEmail: getLocalizedValue(uiStrings?.formEmail, typedLocale),
          formPhone: getLocalizedValue(uiStrings?.formPhone, typedLocale),
          formMessage: getLocalizedValue(uiStrings?.formMessage, typedLocale),
          formGdpr: getLocalizedValue(uiStrings?.formGdpr, typedLocale),
          formSubmit: getLocalizedValue(uiStrings?.ctaSendRequest, typedLocale),
        }}
      />
    </>
  );
}
