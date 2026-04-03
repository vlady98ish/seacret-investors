import Image from "next/image";
import Link from "next/link";

import { LocaleSwitcher } from "@/components/locale-switcher";
import { getLocalizedValue } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import type { UiStrings, SiteSettings } from "@/lib/sanity/types";

/** Official site of the producing company (Live Better Group). */
const LIVEBETTER_URL = "https://livebettergr.com/";

type SiteFooterProps = {
  locale: Locale;
  uiStrings?: UiStrings | null;
  siteSettings?: SiteSettings | null;
};

export function SiteFooter({ locale, uiStrings, siteSettings: _siteSettings }: SiteFooterProps) {
  const t = (field: Record<string, string> | undefined | null): string =>
    getLocalizedValue(field as Record<"en" | "he" | "ru" | "el", string> | undefined, locale) ?? "";

  const navLabel = (key: string): string => {
    if (!uiStrings) return key;
    const map: Record<string, any> = {
      home: uiStrings.navHome,
      residences: uiStrings.navResidences,
      masterplan: uiStrings.navMasterplan,
      location: uiStrings.navLocation,
      contact: uiStrings.navContact,
    };
    return getLocalizedValue(map[key], locale) ?? key;
  };

  return (
    <footer className="bg-[var(--color-night)] px-4 py-16 text-[#94a3ab] sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-3">
        <div>
          <Link href={`/${locale}`} className="inline-block">
            <Image
              src="/logos/sr-letters.png"
              alt="The Sea'cret Residences Chiliadou"
              width={80}
              height={70}
              className="h-16 w-auto sm:h-20"
            />
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-relaxed">
            {t(uiStrings?.footerTagline) || "The Sea\u2019cret Residences Chiliadou \u2014 Luxury coastal living on Greece\u2019s Corinthian Gulf."}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 text-sm">
          <div>
            <p className="eyebrow mb-4 text-[#7a8f96]">{t(uiStrings?.footerNavigate) || "Navigate"}</p>
            <nav aria-label="Footer navigation" className="flex flex-col gap-2">
              <Link href={`/${locale}`} className="transition hover:text-white focus-visible:text-white focus-visible:outline-none">{navLabel("home")}</Link>
              <Link href={`/${locale}/residences`} className="transition hover:text-white focus-visible:text-white focus-visible:outline-none">{navLabel("residences")}</Link>
              <Link href={`/${locale}/masterplan`} className="transition hover:text-white focus-visible:text-white focus-visible:outline-none">{navLabel("masterplan")}</Link>
              <Link href={`/${locale}/location`} className="transition hover:text-white focus-visible:text-white focus-visible:outline-none">{navLabel("location")}</Link>
              <Link href={`/${locale}/contact`} className="transition hover:text-white focus-visible:text-white focus-visible:outline-none">{navLabel("contact")}</Link>
            </nav>
          </div>
          <div>
            <p className="eyebrow mb-4 text-[#7a8f96]">{t(uiStrings?.footerLegal) || "Legal"}</p>
            <nav aria-label="Legal" className="flex flex-col gap-2">
              <Link href={`/${locale}/privacy-policy`} className="transition hover:text-white focus-visible:text-white focus-visible:outline-none">{t(uiStrings?.footerPrivacyPolicy) || "Privacy Policy"}</Link>
              <Link href={`/${locale}/terms`} className="transition hover:text-white focus-visible:text-white focus-visible:outline-none">{t(uiStrings?.footerTerms) || "Terms & Conditions"}</Link>
              <span className="cursor-default">{t(uiStrings?.footerCookiePolicy) || "Cookie Policy"}</span>
            </nav>
          </div>
        </div>

        <div className="flex flex-col items-start gap-4 lg:items-end">
          <LocaleSwitcher locale={locale} className="text-white" />
          <p className="text-xs text-[#7a8f96]">
            &copy; {new Date().getFullYear()} Sea&apos;cret Residences. {t(uiStrings?.footerAllRights) || "All rights reserved."}
          </p>
          <a
            href={LIVEBETTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-white/25 underline-offset-2 transition hover:text-white/45 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold-sun)]"
          >
            {t(uiStrings?.footerProducedBy) || "Produced by LiveBetter"}
          </a>
        </div>
      </div>
    </footer>
  );
}
