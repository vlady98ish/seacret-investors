"use client";

import { useState } from "react";

import { VillaCard } from "@/components/sections/villa-card";
import { ScrollReveal } from "@/components/scroll-reveal";
import { cn } from "@/lib/cn";
import type { Locale } from "@/lib/i18n";
import { computePriceFrom } from "@/lib/pricing";
import type { UnitFlat, Villa } from "@/lib/sanity/types";
import { useT } from "@/lib/ui-strings-context";

type FilterLabels = {
  bedrooms?: string;
  availableOnly?: string;
  sort?: string;
  sortName?: string;
  sortPriceLowHigh?: string;
  sortSizeSmallLarge?: string;
  noResults?: string;
  all?: string;
};

type VillaFiltersProps = {
  villas: Villa[];
  units: UnitFlat[];
  locale: Locale;
  labels?: FilterLabels;
};

type SortOption = "name" | "price-asc" | "size-asc";

const BEDROOM_COUNTS = ["1", "2", "3", "5"] as const;

export function VillaFilters({ villas, units, locale, labels }: VillaFiltersProps) {
  const allLabel = labels?.all || useT("filterAll");
  const bedroomsLabel = labels?.bedrooms || useT("filterBedrooms");
  const availableOnlyLabel = labels?.availableOnly || useT("filterAvailableOnly");
  const sortLabel = labels?.sort || useT("filterSort");
  const sortNameLabel = labels?.sortName || useT("filterSortName");
  const sortPriceLowHighLabel = labels?.sortPriceLowHigh || useT("filterPriceLowHigh");
  const sortSizeSmallLargeLabel = labels?.sortSizeSmallLarge || useT("filterSizeSmallLarge");
  const noResultsLabel = labels?.noResults || useT("filterNoResults");

  // null means "All" (no bedroom filter)
  const [bedroomFilter, setBedroomFilter] = useState<string | null>(null);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sort, setSort] = useState<SortOption>("name");

  // Filter
  let filtered = villas.filter((villa) => {
    if (bedroomFilter !== null && villa.typicalBedrooms !== Number(bedroomFilter)) {
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
            {bedroomsLabel}
          </span>
          <div className="flex flex-wrap gap-2">
            {/* "All" pill */}
            <button
              onClick={() => setBedroomFilter(null)}
              className={cn(
                "rounded-full border px-4 py-1 text-sm font-medium transition-colors",
                bedroomFilter === null
                  ? "border-[var(--color-deep-teal)] bg-[var(--color-deep-teal)] text-white"
                  : "border-[rgba(13,103,119,0.2)] bg-transparent text-[var(--color-ink)] hover:border-[var(--color-deep-teal)]"
              )}
            >
              {allLabel}
            </button>
            {BEDROOM_COUNTS.map((opt) => (
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
          {availableOnlyLabel}
        </label>

        {/* Sort dropdown */}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">
            {sortLabel}
          </span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="rounded-md border border-[rgba(13,103,119,0.2)] bg-white px-3 py-1.5 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-deep-teal)]"
          >
            <option value="name">{sortNameLabel}</option>
            <option value="price-asc">{sortPriceLowHighLabel}</option>
            <option value="size-asc">{sortSizeSmallLargeLabel}</option>
          </select>
        </div>
      </div>

      {/* Villa grid */}
      {filtered.length === 0 ? (
        <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-[rgba(13,103,119,0.12)] bg-white/60 text-[var(--color-muted)]">
          {noResultsLabel}
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
                  labelBed={useT("miscBed")}
                  labelSoldOut={useT("statusSoldOut")}
                  labelContactForPricing={useT("pricingContactFor")}
                  labelAvailable={useT("miscAvailable")}
                  labelFrom={useT("pricingFrom")}
                  labelSimilarOptions={useT("miscSimilarOptions")}
                />
              </ScrollReveal>
            );
          })}
        </div>
      )}
    </div>
  );
}
