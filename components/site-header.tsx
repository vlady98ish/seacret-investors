"use client";

import { Download, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { LocaleSwitcher } from "@/components/locale-switcher";
import { cn } from "@/lib/cn";
import type { Locale } from "@/lib/i18n";

type SiteHeaderProps = {
  locale: Locale;
};

const navItems = [
  { key: "home", href: "" },
  { key: "residences", href: "/residences" },
  { key: "masterplan", href: "/masterplan" },
  { key: "location", href: "/location" },
  { key: "about", href: "/about" },
  { key: "contact", href: "/contact" },
];

export function SiteHeader({ locale }: SiteHeaderProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function isActive(href: string): boolean {
    const fullHref = `/${locale}${href}`;
    if (href === "") return pathname === `/${locale}` || pathname === `/${locale}/`;
    return pathname.startsWith(fullHref);
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-4 py-3 sm:px-6 lg:px-8">
        <div
          className={cn(
            "mx-auto flex max-w-[1440px] items-center justify-between rounded-lg px-5 py-3 text-white transition-all duration-300",
            scrolled
              ? "border border-white/10 bg-[rgba(9,34,42,0.6)] shadow-[0_16px_48px_rgba(7,22,28,0.3)] backdrop-blur-xl"
              : "border border-transparent bg-[rgba(9,34,42,0.15)] backdrop-blur-sm"
          )}
        >
          <Link href={`/${locale}`} className="font-serif text-xl tracking-[0.06em] sm:text-2xl">
            Sea&apos;cret
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={`/${locale}${item.href}`}
                className={cn(
                  "relative py-1 text-xs font-medium tracking-[0.2em] uppercase transition-colors",
                  isActive(item.href)
                    ? "text-white after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-[var(--color-gold-sun)]"
                    : "text-white/60 hover:text-white"
                )}
              >
                {item.key}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <a
              href="/brochure/seacret-residences-brochure.pdf"
              download
              className="flex h-9 w-9 items-center justify-center rounded-md text-white/60 transition hover:text-white"
              aria-label="Download brochure"
            >
              <Download className="h-4 w-4" />
            </a>
            <LocaleSwitcher locale={locale} />
          </div>

          <button
            className="flex h-10 w-10 items-center justify-center lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-[var(--color-night)] text-white lg:hidden">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={`/${locale}${item.href}`}
              onClick={() => setMenuOpen(false)}
              className={cn(
                "text-2xl font-light tracking-[0.15em] uppercase",
                isActive(item.href) ? "text-[var(--color-gold-sun)]" : "text-white/70"
              )}
            >
              {item.key}
            </Link>
          ))}
          <div className="mt-4">
            <LocaleSwitcher locale={locale} />
          </div>
        </div>
      )}
    </>
  );
}
