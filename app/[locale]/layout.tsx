import { notFound } from "next/navigation";

import { AccessibilityWidget } from "@/components/accessibility-widget";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StickyCTA } from "@/components/sticky-cta";
import { getLocalizedValue, isRtl, isValidLocale, type Locale } from "@/lib/i18n";
import { getUiStrings, getSiteSettings } from "@/lib/sanity/ui-strings";
import { UiStringsProvider } from "@/lib/ui-strings-context";

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const typedLocale = locale as Locale;
  const rtl = isRtl(typedLocale);

  const [uiStrings, siteSettings] = await Promise.all([getUiStrings(), getSiteSettings()]);

  return (
    <UiStringsProvider uiStrings={uiStrings} locale={typedLocale}>
      <div lang={locale} dir={rtl ? "rtl" : "ltr"}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-[var(--color-gold-sun)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[var(--color-night)]"
        >
          {getLocalizedValue(
            { en: "Skip to main content", he: "דלג לתוכן הראשי", ru: "Перейти к основному содержанию", el: "Μετάβαση στο κύριο περιεχόμενο" },
            typedLocale
          )}
        </a>
        <SiteHeader locale={typedLocale} uiStrings={uiStrings} siteSettings={siteSettings} />
        <main id="main-content" className="min-h-screen">{children}</main>
        <SiteFooter locale={typedLocale} uiStrings={uiStrings} siteSettings={siteSettings} />
        <AccessibilityWidget locale={typedLocale} />
        <StickyCTA
          locale={typedLocale}
          labelTitle={getLocalizedValue(uiStrings?.ctaRequestInfo, typedLocale)}
          labelFullName={getLocalizedValue(uiStrings?.formFullName, typedLocale)}
          labelEmail={getLocalizedValue(uiStrings?.formEmail, typedLocale)}
          labelPhone={getLocalizedValue(uiStrings?.formPhone, typedLocale)}
          labelSubmit={getLocalizedValue(uiStrings?.ctaSendRequest, typedLocale)}
        />
      </div>
    </UiStringsProvider>
  );
}
