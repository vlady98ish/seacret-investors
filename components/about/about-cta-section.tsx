import Link from "next/link";

import type { Locale } from "@/lib/i18n";
import { ScrollReveal } from "@/components/scroll-reveal";

type AboutCtaSectionProps = {
  locale: Locale;
};

export function AboutCtaSection({ locale }: AboutCtaSectionProps) {
  return (
    <section className="bg-[var(--color-night)] py-24 sm:py-32">
      <div className="section-shell text-center">
        <ScrollReveal>
          <h2 className="text-display text-white">
            Ready to invest with confidence?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-lg text-white/60">
            Join dozens of investors already building wealth with Live Better Group
          </p>
          <div className="mt-10">
            <Link href={`/${locale}/contact`} className="btn btn-primary">
              Schedule a Consultation
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
