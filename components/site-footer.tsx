import Link from "next/link";

import { LocaleSwitcher } from "@/components/locale-switcher";
import type { Locale } from "@/lib/i18n";

type SiteFooterProps = {
  locale: Locale;
};

export function SiteFooter({ locale }: SiteFooterProps) {
  return (
    <footer className="bg-[var(--color-night)] px-4 py-16 text-white/60 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-3">
        <div>
          <Link href={`/${locale}`} className="font-serif text-2xl tracking-[0.06em] text-white">
            Sea&apos;cret
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-relaxed">
            The Sea&apos;cret Residences Chiliadou — Luxury coastal living on Greece&apos;s Corinthian Gulf.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 text-sm">
          <div>
            <p className="eyebrow mb-4 text-white/40">Navigate</p>
            <nav className="flex flex-col gap-2">
              <Link href={`/${locale}`} className="transition hover:text-white">Home</Link>
              <Link href={`/${locale}/residences`} className="transition hover:text-white">Residences</Link>
              <Link href={`/${locale}/masterplan`} className="transition hover:text-white">Masterplan</Link>
              <Link href={`/${locale}/location`} className="transition hover:text-white">Location</Link>
              <Link href={`/${locale}/contact`} className="transition hover:text-white">Contact</Link>
            </nav>
          </div>
          <div>
            <p className="eyebrow mb-4 text-white/40">Legal</p>
            <nav className="flex flex-col gap-2">
              <span className="cursor-default">Privacy Policy</span>
              <span className="cursor-default">Terms &amp; Conditions</span>
              <span className="cursor-default">Cookie Policy</span>
            </nav>
          </div>
        </div>

        <div className="flex flex-col items-start gap-4 lg:items-end">
          <LocaleSwitcher locale={locale} className="text-white" />
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} Sea&apos;cret Residences. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
