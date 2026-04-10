import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ScrollReveal } from "@/components/scroll-reveal";
import { getLocalizedValue, isValidLocale, type Locale } from "@/lib/i18n";
import { sanityClient } from "@/lib/sanity/client";
import { uiStringsQuery } from "@/lib/sanity/queries";
import type { UiStrings } from "@/lib/sanity/types";

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return ["en", "he", "ru", "el"].map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "ru" ? "Спасибо" : locale === "he" ? "תודה" : locale === "el" ? "Ευχαριστούμε" : "Thank You",
    robots: { index: false, follow: false },
  };
}

export default async function ThankYouPage({ params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const typedLocale = locale as Locale;

  let uiStrings: UiStrings | null = null;
  try {
    uiStrings = await sanityClient.fetch<UiStrings | null>(uiStringsQuery);
  } catch {
    // CMS unavailable — use fallbacks
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = (field: any, fallback = ""): string =>
    field ? (getLocalizedValue(field, typedLocale) as string) || fallback : fallback;

  const heading = t(uiStrings?.formThankYou, "Thank you!");
  const message = t(uiStrings?.formThankYouMessage, "We have received your enquiry and will be in touch shortly.");
  const nextStepsEyebrow = t(uiStrings?.formThankYouNextSteps, "What happens next");

  const steps = [
    {
      title: t(uiStrings?.formThankYouStep1Title, "A personal manager will contact you"),
      desc: t(uiStrings?.formThankYouStep1Desc, "Via the email or phone you provided"),
    },
    {
      title: t(uiStrings?.formThankYouStep2Title, "We'll prepare a personalized offer"),
      desc: t(uiStrings?.formThankYouStep2Desc, "Based on your preferences and budget"),
    },
    {
      title: t(uiStrings?.formThankYouStep3Title, "We'll arrange a virtual or in-person tour"),
      desc: t(uiStrings?.formThankYouStep3Desc, "At your convenience"),
    },
  ];

  const ctaResidences = t(uiStrings?.ctaExploreResidences, "Explore Residences");
  const ctaMasterplan = t(uiStrings?.ctaExploreMasterplan, "Explore the Masterplan");

  return (
    <>
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center bg-[var(--color-night)] px-4 py-24 text-center sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-night)] to-[#1a3a3e]" />

        <div className="relative z-10 flex flex-col items-center gap-6 animate-fade-in">
          {/* Checkmark */}
          <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[var(--color-deep-teal)]/15">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-deep-teal)]">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <h1 className="text-display text-white">{heading}</h1>
          <p className="mx-auto max-w-md text-lg text-white/60">{message}</p>
        </div>
      </section>

      {/* ── Next steps ───────────────────────────────── */}
      <section className="bg-[var(--color-sand)] py-16 sm:py-20">
        <div className="section-shell flex flex-col items-center">
          <ScrollReveal>
            <p className="eyebrow mb-8 text-center text-[var(--color-deep-teal)]">
              {nextStepsEyebrow}
            </p>
          </ScrollReveal>

          <div className="flex w-full max-w-xl flex-col gap-5">
            {steps.map((step, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-deep-teal)]/10 text-sm font-semibold text-[var(--color-deep-teal)]">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-ink)]">{step.title}</p>
                    <p className="mt-0.5 text-sm text-[var(--color-muted)]">{step.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* CTAs */}
          <ScrollReveal delay={0.3}>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link href={`/${locale}/residences`} className="btn btn-primary">
                {ctaResidences}
              </Link>
              <Link href={`/${locale}/masterplan`} className="btn btn-outline">
                {ctaMasterplan}
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
