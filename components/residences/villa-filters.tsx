"use client";

import { useState } from "react";

import { VillaCard } from "@/components/sections/villa-card";
import { ScrollReveal } from "@/components/scroll-reveal";
import { cn } from "@/lib/cn";
import type { Locale } from "@/lib/i18n";
import { computePriceFrom } from "@/lib/pricing";
import type { UnitFlat, Villa } from "@/lib/sanity/types";
import { getVillaImages } from "@/lib/villa-images";

type VillaFiltersProps = {
  villas: Villa[];
  units: UnitFlat[];
  locale: Locale;
};

type SortOption = "name" | "price-asc" | "size-asc";

const BEDROOM_OPTIONS = ["All", "1", "2", "3", "5"] as const;

export function VillaFilters({ villas, units, locale }: VillaFiltersProps) {
  const [bedroomFilter, setBedroomFilter] = useState<string>("All");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sort, setSort] = useState<SortOption>("name");

  // Filter
  let filtered = villas.filter((villa) => {
    if (bedroomFilter !== "All" && villa.typicalBedrooms !== Number(bedroomFilter)) {
      return false;
    }

    if (availableOnly) {
      const villaUnits = units.filter(
        (u) => u.villaTypeName === villa.name || u.villaTypeSlug === villa.slug.current
      );
      const hasAvailable = villaUnits.some((u) => u.status === "available");
      if (!hasAvailable) return false;
    }

    return true;
  });

  // Sort
  filtered = [...filtered].sort((a, b) => {
    if (sort === "name") {
      return a.name.localeCompare(b.name);
    }

    if (sort === "price-asc") {
      const getMinPrice = (villa: Villa) => {
        const villaUnits = units.filter(
          (u) =>
            (u.villaTypeName === villa.name || u.villaTypeSlug === villa.slug.current) &&
            u.status === "available"
        );
        if (villaUnits.length === 0) return Infinity;
        const minArea = Math.min(...villaUnits.map((u) => u.totalArea));
        return computePriceFrom(minArea);
      };
      return getMinPrice(a) - getMinPrice(b);
    }

    if (sort === "size-asc") {
      const getMinArea = (villa: Villa) => {
        const areaStr = villa.areaRange?.split("–")[0]?.trim();
        return areaStr ? parseFloat(areaStr) : Infinity;
      };
      return getMinArea(a) - getMinArea(b);
    }

    return 0;
  });

  return (
    <div>
      {/* Filter controls */}
      <div className="mb-8 flex flex-wrap items-center gap-4">
        {/* Bedroom pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">
            Bedrooms
          </span>
          <div className="flex flex-wrap gap-2">
            {BEDROOM_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => setBedroomFilter(opt)}
                className={cn(
                  "rounded-full border px-4 py-1 text-sm font-medium transition-colors",
                  bedroomFilter === opt
                    ? "border-[var(--color-deep-teal)] bg-[var(--color-deep-teal)] text-white"
                    : "border-[rgba(13,103,119,0.2)] bg-transparent text-[var(--color-ink)] hover:border-[var(--color-deep-teal)]"
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Available only toggle */}
        <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--color-ink)]">
          <div
            onClick={() => setAvailableOnly((prev) => !prev)}
            className={cn(
              "relative h-5 w-9 rounded-full transition-colors",
              availableOnly ? "bg-[var(--color-deep-teal)]" : "bg-[rgba(13,103,119,0.2)]"
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform",
                availableOnly ? "translate-x-4" : "translate-x-0.5"
              )}
            />
          </div>
          Available only
        </label>

        {/* Sort dropdown */}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">
            Sort
          </span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="rounded-md border border-[rgba(13,103,119,0.2)] bg-white px-3 py-1.5 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-deep-teal)]"
          >
            <option value="name">Name</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="size-asc">Size: Small to Large</option>
          </select>
        </div>
      </div>

      {/* Villa grid */}
      {filtered.length === 0 ? (
        <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-[rgba(13,103,119,0.12)] bg-white/60 text-[var(--color-muted)]">
          No villas match your criteria
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((villa, i) => {
            const villaUnits = units.filter(
              (u) =>
                u.villaTypeName === villa.name ||
                u.villaTypeSlug === villa.slug.current
            );
            return (
              <ScrollReveal key={villa._id} delay={i * 0.08}>
                <VillaCard
                  villa={villa}
                  locale={locale}
                  units={villaUnits.map((u) => ({ totalArea: u.totalArea, status: u.status }))}
                  staticImageSrc={getVillaImages(villa.slug.current).hero}
                />
              </ScrollReveal>
            );
          })}
        </div>
      )}
    </div>
  );
}
