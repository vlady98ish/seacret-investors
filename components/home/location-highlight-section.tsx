import Link from "next/link";
import { Clock, MapPin, Shield, Sun } from "lucide-react";

import { type Locale } from "@/lib/i18n";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/sections/section-heading";

type HighlightItem = {
  title: string;
  description: string;
};

type LocationHighlightSectionProps = {
  locale: Locale;
  title?: string;
  description?: string;
  highlights?: HighlightItem[];
  eyebrowLabel?: string;
  ctaLabel?: string;
};

const ICONS = [Sun, Clock, MapPin, Shield];

export function LocationHighlightSection({ locale, title, description, highlights, eyebrowLabel, ctaLabel }: LocationHighlightSectionProps) {
  if (!highlights?.length) return null;

  return (
    <section className="bg-[var(--color-cream)] py-16 sm:py-20 lg:py-24">
      <div className="section-shell">
        <ScrollReveal>
          <SectionHeading
            eyebrow={eyebrowLabel}
            title={title}
            description={description}
            align="center"
          />
        </ScrollReveal>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
            <ScrollReveal key={item.title} delay={i * 0.1}>
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-deep-teal)]/10">
                  <Icon className="h-6 w-6 text-[var(--color-deep-teal)]" />
                </div>
                <h3 className="text-h3 mt-5">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">{item.description}</p>
              </div>
            </ScrollReveal>
            );
          })}
        </div>

        {ctaLabel && (
          <ScrollReveal className="mt-12 text-center">
            <Link href={`/${locale}/location`} className="btn btn-outline">
              {ctaLabel}
            </Link>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
