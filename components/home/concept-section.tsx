import Image from "next/image";

import { getLocalizedValue, type Locale } from "@/lib/i18n";
import { getSanityImageUrl } from "@/lib/sanity/image";
import type { HomePage } from "@/lib/sanity/types";
import { ScrollReveal } from "@/components/scroll-reveal";

/** Только локальная эмблема (прозрачный PNG). Не путать с `conceptImage` из Sanity — то только фото справа. */
const CONCEPT_EMBLEM = "/images/brand/concept-emblem.png";

type ConceptSectionProps = {
  data: HomePage | null;
  locale: Locale;
};

export function ConceptSection({ data, locale }: ConceptSectionProps) {
  const eyebrow = getLocalizedValue(data?.conceptEyebrow, locale);
  const heading = getLocalizedValue(data?.conceptTitle, locale);
  const copy = getLocalizedValue(data?.conceptCopy, locale);
  const imageUrl = getSanityImageUrl(data?.conceptImage, 1600);

  if (!heading && !copy) return null;

  return (
    <section className="relative overflow-hidden bg-[var(--color-sand)] py-16 sm:py-20 lg:py-24">
      <div
        className="pointer-events-none absolute inset-y-0 z-0 w-[min(86%,33rem)] sm:w-[min(84%,40rem)] lg:w-[min(80%,44rem)] xl:w-[min(76%,48rem)] left-[max(1.25rem,calc((100vw-1440px)/2+1.25rem))] sm:left-[max(2rem,calc((100vw-1440px)/2+2rem))] lg:left-[max(3rem,calc((100vw-1440px)/2+3rem))]"
        aria-hidden
      >
        <div className="relative h-full w-full">
          {/* inset-y-0 + object-position почти не двигают логотип; задаём окно через top + scale для предсказуемого сдвига вниз и размера */}
          <div className="absolute inset-x-0 bottom-0 top-[min(5rem,18vh)]">
            <Image
              src={CONCEPT_EMBLEM}
              alt=""
              fill
              unoptimized
              className="object-contain object-left origin-top-left scale-[0.94] opacity-[0.14]"
              sizes="(max-width: 1024px) 100vw, 58rem"
            />
          </div>
        </div>
      </div>

      <div className="section-shell relative z-10">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
          <div className="relative min-w-0">
            <ScrollReveal direction="left">
              {eyebrow && <p className="eyebrow">{eyebrow}</p>}
              {heading && <h2 className="text-h2 mt-4 max-w-xl">{heading}</h2>}
              {copy && (
                <p className="text-body-muted mt-6 max-w-lg border-s-2 border-[var(--color-deep-teal)]/15 ps-5">
                  {copy}
                </p>
              )}
            </ScrollReveal>
          </div>

          {imageUrl && (
            <ScrollReveal delay={0.15}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-md shadow-[var(--shadow-card)] ring-1 ring-[rgba(13,103,119,0.06)]">
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
