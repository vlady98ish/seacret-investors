import Image from "next/image";

import { getLocalizedValue, type Locale } from "@/lib/i18n";
import { getSanityImageUrl } from "@/lib/sanity/image";
import type { HomePage } from "@/lib/sanity/types";
import { ScrollReveal } from "@/components/scroll-reveal";

type ConceptSectionProps = {
  data: HomePage | null;
  locale: Locale;
};

export function ConceptSection({ data, locale }: ConceptSectionProps) {
  const eyebrow = getLocalizedValue(data?.conceptEyebrow, locale);
  const heading = getLocalizedValue(data?.conceptTitle, locale);
  const copy = getLocalizedValue(data?.conceptCopy, locale);
  const imageUrl = getSanityImageUrl(data?.conceptImage, 800);

  if (!heading && !copy) return null;

  return (
    <section className="bg-[var(--color-sand)] py-24 sm:py-32">
      <div className="section-shell">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <ScrollReveal direction="left">
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            {heading && (
              <h2 className="text-h2 mt-4">
                {heading}
              </h2>
            )}
            {copy && (
              <p className="text-body-muted mt-6 max-w-lg leading-relaxed">
                {copy}
              </p>
            )}
          </ScrollReveal>

          {imageUrl && (
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
          )}
        </div>
      </div>
    </section>
  );
}
