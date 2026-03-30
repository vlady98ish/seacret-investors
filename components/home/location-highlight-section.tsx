import Link from "next/link";
import { Clock, MapPin, Shield, Sun } from "lucide-react";

import { getDictionary } from "@/lib/dictionaries";
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
};

const FALLBACK_ICONS = [Sun, Clock, MapPin, Shield];

const fallbackHighlights: HighlightItem[] = [
  {
    title: "Blue Flag Beach",
    description: "Chiliadou — pristine, uncrowded, award-winning coastline.",
  },
  {
    title: "30 min from Patras",
    description: "Quick access to Greece's third-largest city and its port.",
  },
  {
    title: "2.5 h from Athens",
    description: "An easy drive from the capital, via the scenic Rio-Antirrio bridge.",
  },
  {
    title: "No crowds",
    description: "A hidden cove away from mass tourism — serenity guaranteed.",
  },
];

export function LocationHighlightSection({ locale, title, description, highlights }: LocationHighlightSectionProps) {
  const dict = getDictionary(locale);
  const resolvedHighlights = highlights && highlights.length > 0 ? highlights : fallbackHighlights;

  return (
    <section className="bg-[var(--color-cream)] py-24 sm:py-32">
      <div className="section-shell">
        <ScrollReveal>
          <SectionHeading
            eyebrow={dict.sections.location}
            title={title || "Greece's best-kept secret"}
            description={description || "Nestled on the northern shore of the Gulf of Corinth, Chiliadou offers untouched beauty just hours from Athens."}
            align="center"
          />
        </ScrollReveal>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {resolvedHighlights.map((item, i) => {
            const Icon = FALLBACK_ICONS[i % FALLBACK_ICONS.length];
            return (
            <ScrollReveal key={item.title} delay={i * 0.1}>
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-deep-teal)]/10">
                  <Icon className="h-6 w-6 text-[var(--color-deep-teal)]" />
                </div>
                <h3 className="text-h3 mt-5">{item.title}</h3>
                <p className="text-body-muted mt-2 text-sm">{item.description}</p>
              </div>
            </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal className="mt-12 text-center">
          <Link href={`/${locale}/location`} className="btn btn-outline">
            {dict.cta.exploreLocation}
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
