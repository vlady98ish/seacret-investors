import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DirectContactSection } from "@/components/contact/direct-contact-section";
import { MultiStepForm } from "@/components/contact/multi-step-form";
import { PageHero } from "@/components/sections/page-hero";
import { getLocalizedValue, isValidLocale, type Locale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/metadata";
import { sanityClient } from "@/lib/sanity/client";
import { allVillasQuery, contactPageQuery, siteSettingsQuery, uiStringsQuery } from "@/lib/sanity/queries";
import type { ContactPage as CmsContactPage, SiteSettings, UiStrings, Villa } from "@/lib/sanity/types";

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return ["en", "he", "ru", "el"].map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};

  let page: CmsContactPage | null = null;
  try {
    page = await sanityClient.fetch<CmsContactPage | null>(contactPageQuery);
  } catch {
    // fallback metadata
  }

  return buildPageMetadata(page, locale as Locale, "/contact", {
    title: "Contact Us",
    description:
      "Get in touch with The Sea'cret Residences team. Inquire about villa types, pricing, and availability. We respond within 24 hours.",
  });
}

export default async function CmsContactPageRoute({ params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const typedLocale = locale as Locale;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = (field: any): string | undefined =>
    field ? (getLocalizedValue(field, typedLocale) as string | undefined) : undefined;

  /* ── Fetch CMS data (try/catch — CMS may be empty) ───────── */
  let contactPage: CmsContactPage | null = null;
  let siteSettings: SiteSettings | null = null;
  let villas: Villa[] = [];
  let uiStrings: UiStrings | null = null;

  try {
    [contactPage, siteSettings, villas, uiStrings] = await Promise.all([
      sanityClient.fetch<CmsContactPage | null>(contactPageQuery),
      sanityClient.fetch<SiteSettings | null>(siteSettingsQuery),
      sanityClient.fetch<Villa[]>(allVillasQuery),
      sanityClient.fetch<UiStrings | null>(uiStringsQuery),
    ]);
  } catch {
    // CMS unavailable — proceed with fallbacks
  }

  /* ── Extract villa names for step 1 ─────────────────────── */
  const villaNames = villas.length > 0 ? villas.map((v) => v.name) : undefined;

  /* ── Hero copy ───────────────────────────────────────────── */
  const heroTitle =
    t(contactPage?.heroTitle) ?? "Get in Touch";

  const heroSubtitle =
    t(contactPage?.heroSubtitle) || "Our team is here to guide you through every step.";

  /* ── Direct contact section strings ─────────────────────── */
  const directEyebrow = t(contactPage?.directEyebrow) || undefined;
  const directTitle = t(contactPage?.directTitle) || undefined;
  const directDescription = t(contactPage?.directDescription) || undefined;
  const labelEmail = t(contactPage?.labelEmail) || undefined;
  const labelPhone = t(contactPage?.labelPhone) || undefined;
  const labelOfficeHours = t(contactPage?.labelOfficeHours) || undefined;
  const responsePromise = t(contactPage?.responsePromise) || undefined;

  /* ── Multi-step form strings (uiStrings + contactPage) ───── */
  const labelFullName = t(uiStrings?.formFullName) || undefined;
  const labelEmailForm = t(uiStrings?.formEmail) || undefined;
  const labelPhoneForm = t(uiStrings?.formPhone) || undefined;
  const labelMessage = t(uiStrings?.formMessage) || undefined;
  const labelSubmit = t(uiStrings?.formSubmit) || undefined;
  const labelSending = t(uiStrings?.formSending) || undefined;
  const labelSuccess = t(uiStrings?.formSuccess) || undefined;
  const labelError = t(uiStrings?.formError) || undefined;
  const labelGdpr = t(uiStrings?.formGdpr) || undefined;
  const labelBack = t(uiStrings?.formBack) || undefined;
  const labelNext = t(uiStrings?.formNext) || undefined;

  /* ── Budget / timeline options from CMS ──────────────────── */
  const budgetOptions = contactPage?.budgetOptions
    ?.map((opt) => t(opt))
    .filter((s): s is string => Boolean(s));

  const timelineOptions = contactPage?.timelineOptions
    ?.map((opt) => t(opt))
    .filter((s): s is string => Boolean(s));

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
            <MultiStepForm
              locale={typedLocale}
              villaNames={villaNames}
              labelFullName={labelFullName}
              labelEmail={labelEmailForm}
              labelPhone={labelPhoneForm}
              labelMessage={labelMessage}
              labelSubmit={labelSubmit}
              labelSending={labelSending}
              labelSuccess={labelSuccess}
              labelError={labelError}
              labelGdpr={labelGdpr}
              labelBack={labelBack}
              labelNext={labelNext}
              budgetOptions={budgetOptions}
              timelineOptions={timelineOptions}
            />
          </div>

          {/* Direct contact */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <DirectContactSection
              locale={typedLocale}
              settings={siteSettings}
              eyebrow={directEyebrow}
              title={directTitle}
              description={directDescription}
              labelEmail={labelEmail}
              labelPhone={labelPhone}
              labelOfficeHours={labelOfficeHours}
              responsePromise={responsePromise}
            />
          </div>
        </div>
      </section>
    </>
  );
}
