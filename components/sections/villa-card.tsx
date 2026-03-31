import Image from "next/image";
import Link from "next/link";

import { getLocalizedValue, type Locale } from "@/lib/i18n";
import { formatPriceFrom } from "@/lib/pricing";
import { getSanityImageUrl } from "@/lib/sanity/image";
import type { SanityImage, UnitStatus } from "@/lib/sanity/types";

type VillaCardProps = {
  villa: {
    name: string;
    slug: { current: string };
    label?: Record<string, string>;
    heroImage?: SanityImage;
    typicalBedrooms?: number;
    areaRange?: string;
  };
  locale: Locale;
  units?: Array<{ totalArea: number; status: UnitStatus }>;
  staticImageSrc?: string;
  labelSoldOut?: string;
  labelBed?: string;
  labelContactForPricing?: string;
  labelAvailable?: string;
  labelFrom?: string;
  labelSimilarOptions?: string;
  luxury?: boolean;
};

export function VillaCard({ villa, locale, units, staticImageSrc, labelSoldOut, labelBed, labelContactForPricing, labelAvailable, labelFrom, labelSimilarOptions, luxury }: VillaCardProps) {
  const imageUrl = villa.heroImage ? getSanityImageUrl(villa.heroImage, 800) : null;
  const imageSrc = imageUrl ?? staticImageSrc;

  const availableUnits = units?.filter((u) => u.status === "available") ?? [];
  const allSold = units && units.length > 0 && availableUnits.length === 0;
  const minArea = availableUnits.length > 0
    ? Math.min(...availableUnits.map((u) => u.totalArea))
    : null;

  const label = villa.label ? getLocalizedValue(villa.label as Record<string, string>, locale) : undefined;

  if (luxury) {
    return (
      <Link
        href={`/${locale}/villas/${villa.slug.current}`}
        className="group relative block overflow-hidden cursor-pointer"
        style={{ borderRadius: "var(--radius-lg)" }}
      >
        <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={villa.name}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="h-full w-full" style={{ background: "var(--color-ink)" }} />
          )}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(9,34,42,0.92) 0%, rgba(9,34,42,0.45) 45%, transparent 70%)" }}
          />
          {allSold && (
            <div className="absolute inset-x-0 top-4 flex justify-center">
              <span className="badge badge-sold">{labelSoldOut}</span>
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8">
            <div
              className="mb-4 transition-all duration-300 group-hover:w-12"
              style={{ height: "1px", width: "2rem", background: "var(--color-gold-sun)" }}
            />
            <h3 className="text-h3" style={{ color: "var(--color-cream)", letterSpacing: "0.05em" }}>{villa.name}</h3>
            {label && <p className="mt-1 text-base" style={{ color: "rgba(255,249,240,0.6)" }}>{label}</p>}
            <div className="mt-3 flex items-center gap-5 text-sm font-medium tracking-widest uppercase" style={{ color: "rgba(255,249,240,0.5)" }}>
              {villa.typicalBedrooms && <span>{villa.typicalBedrooms} {labelBed}</span>}
              {villa.areaRange && <span>{villa.areaRange} m²</span>}
            </div>
            {!allSold && minArea && (
              <p className="mt-2 text-sm font-semibold" style={{ color: "var(--color-gold-sun)" }}>
                {formatPriceFrom(minArea, labelFrom)}
              </p>
            )}
            {availableUnits.length > 0 && (
              <p className="mt-1 text-xs" style={{ color: "rgba(255,249,240,0.4)" }}>
                {availableUnits.length} {labelAvailable}
              </p>
            )}
            <div
              className="mt-4 flex items-center gap-2 text-xs font-semibold tracking-widest uppercase opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0"
              style={{ color: "var(--color-gold-sun)" }}
            >
              <span>Explore</span><span>→</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/${locale}/villas/${villa.slug.current}`}
      className="tile group block overflow-hidden transition-transform hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[var(--color-stone)]">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={villa.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[var(--color-muted)]">
            <span className="text-sm">Image coming soon</span>
          </div>
        )}
        {allSold && (
          <div className="absolute inset-x-0 top-3 flex justify-center">
            <span className="badge badge-sold">{labelSoldOut}</span>
          </div>
        )}
      </div>

      <div className="mt-4">
        <h3 className="text-h3">{villa.name}</h3>
        {label && <p className="text-body-muted mt-1">{label}</p>}

        <div className="mt-3 flex items-center gap-4 text-sm text-[var(--color-muted)]">
          {villa.typicalBedrooms && <span>{villa.typicalBedrooms} {labelBed}</span>}
          {villa.areaRange && <span>{villa.areaRange} m²</span>}
        </div>

        {!allSold && minArea && (
          <p className="mt-2 text-sm font-semibold text-[var(--color-deep-teal)]">
            {formatPriceFrom(minArea, labelFrom)}
          </p>
        )}
        {allSold && (
          <p className="mt-2 text-sm text-[var(--color-muted)]">{labelSoldOut} {labelSimilarOptions}</p>
        )}
        {!units && (
          <p className="mt-2 text-sm text-[var(--color-muted)]">{labelContactForPricing}</p>
        )}

        {availableUnits.length > 0 && (
          <p className="mt-1 text-xs text-[var(--color-muted)]">
            {availableUnits.length} {labelAvailable}
          </p>
        )}
      </div>
    </Link>
  );
}
