import Link from "next/link";

import type { Locale } from "@/lib/i18n";
import { ScrollReveal } from "@/components/scroll-reveal";

type AboutCtaSectionProps = {
  locale: Locale;
  title?: string;
  subtitle?: string;
  buttonText?: string;
};

export function AboutCtaSection({ locale, title, subtitle, buttonText }: AboutCtaSectionProps) {
  if (!title) return null;

  return (
    <section className="bg-[var(--color-night)] py-24 sm:py-32">
      <div className="section-shell text-center">
        <ScrollReveal>
          <h2 className="text-display text-white">
            {title}
          </h2>
          {subtitle && (
            <p className="mx-auto mt-4 max-w-lg text-lg text-white/60">
              {subtitle}
            </p>
          )}
          <div className="mt-10">
            <Link href={`/${locale}/contact`} className="btn btn-primary">
              {buttonText}
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
