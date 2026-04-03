import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AboutCtaSection } from "@/components/about/about-cta-section";
import { FoundersSection } from "@/components/about/founders-section";
import { OurStorySection } from "@/components/about/our-story-section";
import { StatsBar } from "@/components/about/stats-bar";
import { ValuesSection } from "@/components/about/values-section";
import { InlineContactSection } from "@/components/inline-contact-section";
import { PageHero } from "@/components/sections/page-hero";
import { getLocalizedValue, isValidLocale, type Locale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/metadata";
import { sanityClient } from "@/lib/sanity/client";
import { getSanityImageUrl } from "@/lib/sanity/image";
import { aboutPageQuery } from "@/lib/sanity/queries";
import type { AboutPage } from "@/lib/sanity/types";
import { getUiStrings, getSiteSettings } from "@/lib/sanity/ui-strings";

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return ["en", "he", "ru", "el"].map((locale) => ({ locale }));
}

async function fetchAboutPage(): Promise<AboutPage | null> {
  try {
    return await sanityClient.fetch<AboutPage>(aboutPageQuery);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};

  const data = await fetchAboutPage();

  return buildPageMetadata(data, locale as Locale, "/about", {
    title: "About Live Better Group | Sea'cret Residences Chiliadou",
    description:
      "Meet the team behind Sea'cret Residences. Live Better Group — 12+ completed projects, 80+ units delivered, €10M+ invested capital. Real estate expertise since 2020.",
  });
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const typedLocale = locale as Locale;

  const [data, uiStrings, siteSettings] = await Promise.all([
    fetchAboutPage(),
    getUiStrings(),
    getSiteSettings(),
  ]);

  const heroTitle = getLocalizedValue(data?.heroTitle, typedLocale) ?? "";
  const heroSubtitle = getLocalizedValue(data?.heroSubtitle, typedLocale) ?? undefined;

  // Resolve story strings
  const storyEyebrow = getLocalizedValue(data?.storyEyebrow, typedLocale);
  const storyTitle = getLocalizedValue(data?.storyTitle, typedLocale);
  const storyContent = getLocalizedValue(data?.storyContent, typedLocale);

  // Resolve stats: value is a plain string, label is localized
  const stats = data?.stats?.map((stat) => ({
    value: stat.value,
    label: getLocalizedValue(stat.label, typedLocale) || stat.value,
  }));

  // Resolve values: icon is a plain string, title and description are localized
  const values = data?.values?.map((v) => ({
    icon: v.icon,
    title: getLocalizedValue(v.title, typedLocale) || "",
    description: getLocalizedValue(v.description, typedLocale) || "",
  }));

  const valuesEyebrow = getLocalizedValue(data?.valuesEyebrow, typedLocale);
  const valuesTitle = getLocalizedValue(data?.valuesTitle, typedLocale);

  // Resolve founders: name is plain string, role and bio are localized
  const founders = data?.founders?.map((f) => ({
    name: f.name,
    role: getLocalizedValue(f.role, typedLocale) || "",
    bio: getLocalizedValue(f.bio, typedLocale) || "",
    photo: f.photo,
  }));

  const foundersEyebrow = getLocalizedValue(data?.foundersEyebrow, typedLocale);

  // Resolve CTA strings
  const ctaTitle = getLocalizedValue(data?.ctaTitle, typedLocale);
  const ctaSubtitle = getLocalizedValue(data?.ctaSubtitle, typedLocale);
  const ctaButton = getLocalizedValue(data?.ctaButton, typedLocale);

  return (
    <>
      <PageHero
        title={heroTitle}
        subtitle={heroSubtitle}
        backgroundImage={data?.heroImage ? getSanityImageUrl(data.heroImage) : undefined}
        compact
      />
      <StatsBar stats={stats} />
      <OurStorySection
        eyebrow={storyEyebrow}
        title={storyTitle}
        content={storyContent}
      />
      <FoundersSection
        eyebrow={foundersEyebrow}
        founders={founders}
      />
      <ValuesSection
        eyebrow={valuesEyebrow}
        title={valuesTitle}
        values={values}
      />
      <AboutCtaSection
        locale={typedLocale}
        title={ctaTitle}
        subtitle={ctaSubtitle}
        buttonText={ctaButton}
      />
      <InlineContactSection
        locale={typedLocale}
        whatsappUrl={siteSettings?.whatsappNumber ? `https://wa.me/${siteSettings.whatsappNumber.replace(/\D/g, "")}` : undefined}
        strings={{
          eyebrow: getLocalizedValue(uiStrings?.miscGetInTouch, typedLocale),
          title: getLocalizedValue(uiStrings?.miscReadyToDiscover, typedLocale),
          description: getLocalizedValue(uiStrings?.miscContactPromise, typedLocale),
          whatsappUs: getLocalizedValue(uiStrings?.ctaWhatsappUs, typedLocale),
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
