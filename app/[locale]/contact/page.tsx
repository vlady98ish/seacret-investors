import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DirectContactSection } from "@/components/contact/direct-contact-section";
import { MultiStepForm } from "@/components/contact/multi-step-form";
import { PageHero } from "@/components/sections/page-hero";
import { isValidLocale, type Locale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/metadata";
import { sanityClient } from "@/lib/sanity/client";
import { allVillasQuery, contactPageQuery, siteSettingsQuery } from "@/lib/sanity/queries";
import type { ContactPage as CmsContactPage, SiteSettings, Villa } from "@/lib/sanity/types";

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return ["en", "he", "ru", "el"].map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};

  return buildPageMetadata(null, locale as Locale, "/contact", {
    title: "Contact Us",
    description:
      "Get in touch with The Sea'cret Residences team. Inquire about villa types, pricing, and availability. We respond within 24 hours.",
  });
}

export default async function CmsContactPageRoute({ params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const typedLocale = locale as Locale;

  /* ── Fetch CMS data (try/catch — CMS may be empty) ───────── */
  let contactPage: CmsContactPage | null = null;
  let siteSettings: SiteSettings | null = null;
  let villas: Villa[] = [];

  try {
    [contactPage, siteSettings, villas] = await Promise.all([
      sanityClient.fetch<CmsContactPage | null>(contactPageQuery),
      sanityClient.fetch<SiteSettings | null>(siteSettingsQuery),
      sanityClient.fetch<Villa[]>(allVillasQuery),
    ]);
  } catch {
    // CMS unavailable — proceed with fallbacks
  }

  /* ── Extract villa names for step 1 ─────────────────────── */
  const villaNames = villas.length > 0 ? villas.map((v) => v.name) : undefined;

  /* ── Hero copy ───────────────────────────────────────────── */
  const heroTitle =
    contactPage?.heroTitle?.[typedLocale] ??
    contactPage?.heroTitle?.en ??
    "Get in Touch";

  const heroSubtitle = "Our team is here to guide you through every step.";

  return (
    <>
      {/* ── Hero ─────────────────────────────────────── */}
      <PageHero
        title={heroTitle}
        subtitle={heroSubtitle}
        compact
      />

      {/* ── Split layout: form left, direct contact right ── */}
      <section className="section-shell py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:gap-16 xl:grid-cols-[1fr_360px]">
          {/* Multi-step form */}
          <div>
            <MultiStepForm locale={typedLocale} villaNames={villaNames} />
          </div>

          {/* Direct contact */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <DirectContactSection locale={typedLocale} settings={siteSettings} />
          </div>
        </div>
      </section>
    </>
  );
}
