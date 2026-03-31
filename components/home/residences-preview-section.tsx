import Image from "next/image";
import Link from "next/link";

import { getLocalizedValue, type Locale } from "@/lib/i18n";
import { getSanityImageUrl } from "@/lib/sanity/image";
import type { FeaturedVilla } from "@/lib/sanity/types";
import { ScrollReveal } from "@/components/scroll-reveal";

type ResidencesPreviewSectionProps = {
  villas: FeaturedVilla[] | null | undefined;
  locale: Locale;
  title?: string;
  description?: string;
  eyebrowLabel?: string;
  ctaLabel?: string;
  labelBed?: string;
  labelContactForPricing?: string;
};

export function ResidencesPreviewSection({ villas, locale, title, description, eyebrowLabel, ctaLabel, labelBed, labelContactForPricing }: ResidencesPreviewSectionProps) {
  if (!villas?.length) return null;

  return (
    <section className="bg-[var(--color-cream)] py-24 sm:py-32">
      <div className="section-shell">
        {/* Editorial header */}
        <ScrollReveal>
          <div className="mb-16 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              {eyebrowLabel && (
                <p className="eyebrow mb-4">{eyebrowLabel}</p>
              )}
              {title && (
                <h2 className="text-h2">{title}</h2>
              )}
            </div>
          </div>
        </ScrollReveal>

        {/* Luxury portrait cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {villas.map((villa, i) => {
            const imageUrl = villa.heroImage ? getSanityImageUrl(villa.heroImage, 800) : null;
            const label = villa.label
              ? getLocalizedValue(villa.label as Record<string, string>, locale)
              : undefined;

            return (
              <ScrollReveal key={villa._id} delay={i * 0.1}>
                <Link
                  href={`/${locale}/villas/${villa.slug.current}`}
                  className="group relative block overflow-hidden cursor-pointer"
                  style={{ borderRadius: "var(--radius-lg)" }}
                >
                  {/* Portrait image */}
                  <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={villa.name}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div
                        className="h-full w-full"
                        style={{ background: "var(--color-ink)" }}
                      />
                    )}

                    {/* Gradient overlay */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(9,34,42,0.92) 0%, rgba(9,34,42,0.45) 45%, transparent 70%)",
                      }}
                    />

                    {/* Content overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8">
                      {/* Gold accent line */}
                      <div
                        className="mb-4 transition-all duration-300 group-hover:w-12"
                        style={{
                          height: "1px",
                          width: "2rem",
                          background: "var(--color-gold-sun)",
                        }}
                      />

                      <h3
                        className="text-h3"
                        style={{ color: "var(--color-cream)", letterSpacing: "0.05em" }}
                      >
                        {villa.name}
                      </h3>

                      {label && (
                        <p
                          className="mt-1 text-base"
                          style={{ color: "rgba(255,249,240,0.6)" }}
                        >
                          {label}
                        </p>
                      )}

                      <div
                        className="mt-3 flex items-center gap-5 text-sm font-medium tracking-widest uppercase"
                        style={{ color: "rgba(255,249,240,0.5)" }}
                      >
                        {villa.typicalBedrooms && (
                          <span>{villa.typicalBedrooms} {labelBed}</span>
                        )}
                        {villa.areaRange && <span>{villa.areaRange} m²</span>}
                      </div>

                      {/* Reveal on hover */}
                      <div
                        className="mt-4 flex items-center gap-2 text-xs font-semibold tracking-widest uppercase opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0"
                        style={{ color: "var(--color-gold-sun)" }}
                      >
                        <span>Explore</span>
                        <span>→</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>

        {ctaLabel && (
          <ScrollReveal className="mt-14 text-center">
            <Link href={`/${locale}/residences`} className="btn btn-outline">
              {ctaLabel} &rarr;
            </Link>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
