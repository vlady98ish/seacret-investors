import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StickyCTA } from "@/components/sticky-cta";
import { isRtl, isValidLocale, type Locale } from "@/lib/i18n";
import { getUiStrings, getSiteSettings } from "@/lib/sanity/ui-strings";

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
    <div lang={locale} dir={rtl ? "rtl" : "ltr"}>
      <SiteHeader locale={typedLocale} uiStrings={uiStrings} siteSettings={siteSettings} />
      <main className="min-h-screen">{children}</main>
      <SiteFooter locale={typedLocale} uiStrings={uiStrings} siteSettings={siteSettings} />
      <StickyCTA locale={typedLocale} />
    </div>
  );
}
