import Image from "next/image";

import { getLocalizedValue, type Locale } from "@/lib/i18n";
import { getSanityImageUrl } from "@/lib/sanity/image";
import type { HomePage } from "@/lib/sanity/types";
import { ScrollReveal } from "@/components/scroll-reveal";

type ConceptSectionProps = {
  data: HomePage | null;
  locale: Locale;
  heading?: string;
  copy?: string;
};

const FALLBACK_HEADING = "A new standard of coastal living";
const FALLBACK_COPY =
  "In a world of crowded destinations and standard offerings, we create something different. Sea'cret Residences Chiliadou — modern coastal living in Greece's hidden gem.";

export function ConceptSection({ data, locale, heading, copy: copyProp }: ConceptSectionProps) {
  const eyebrow = getLocalizedValue(data?.conceptEyebrow, locale) ?? "The Concept";
  const copy = copyProp || (getLocalizedValue(data?.conceptCopy, locale) ?? FALLBACK_COPY);
  const imageUrl = getSanityImageUrl(data?.conceptImage, 800) ?? "/assets/pdf/page-04-location.jpg";

  return (
    <section className="bg-[var(--color-sand)] py-24 sm:py-32">
      <div className="section-shell">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <ScrollReveal direction="left">
            <p className="eyebrow">{eyebrow}</p>
            <h2 className="text-h2 mt-4">
              {heading || FALLBACK_HEADING}
            </h2>
            <p className="text-body-muted mt-6 max-w-lg leading-relaxed">
              {copy}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
              <Image
                src={imageUrl}
                alt="The concept — Sea'cret Residences"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
