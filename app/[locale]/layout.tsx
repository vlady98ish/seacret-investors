import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StickyCTA } from "@/components/sticky-cta";
import { isRtl, isValidLocale, type Locale } from "@/lib/i18n";

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

  return (
    <div lang={locale} dir={rtl ? "rtl" : "ltr"}>
      <SiteHeader locale={typedLocale} />
      <main className="min-h-screen">{children}</main>
      <SiteFooter locale={typedLocale} />
      <StickyCTA locale={typedLocale} />
    </div>
  );
}
