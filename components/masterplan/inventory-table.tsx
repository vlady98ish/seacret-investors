"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { StatusBadge } from "@/components/sections/status-badge";
import { cn } from "@/lib/cn";
import type { Locale } from "@/lib/i18n";
import { computePriceFrom, formatPriceFrom } from "@/lib/pricing";
import type { UnitFlat } from "@/lib/sanity/types";
import { useT } from "@/lib/ui-strings-context";

type InventoryTableLabels = {
  filterPlot: string;
  filterType: string;
  filterAllTypes: string;
  filterAvailableOnly: string;
  filterShowing: string;
  filterOf: string;
  filterNoResults: string;
  dataComing: string;
  miscUnits: string;
  tablePlot: string;
  tableUnitNumber: string;
  tableVillaType: string;
  tableBeds: string;
  tableTotalArea: string;
  tablePriceFrom: string;
  tableStatus: string;
};

type InventoryTableProps = {
  units: UnitFlat[];
  locale: Locale;
  labels?: InventoryTableLabels;
};

type SortKey = "plot" | "price" | "area";
type SortDir = "asc" | "desc";

const PLOT_OPTIONS = ["All", "A", "B", "C", "D", "E", "F"] as const;

function getPlotLetter(plotName: string): string {
  const match = plotName.match(/[A-F]/i);
  return match ? match[0].toUpperCase() : plotName;
}

export function InventoryTable({ units, locale, labels }: InventoryTableProps) {
  const statusAvailable = useT("statusAvailable", "Available");
  const statusReserved = useT("statusReserved", "Reserved");
  const statusSold = useT("statusSold", "Sold");
  const bedLabel = useT("miscBed", "Bed");
  const bedsLabel = useT("miscBeds", "Beds");
  const fromLabel = useT("pricingFrom", "From");

  const lbl = {
    filterPlot: labels?.filterPlot || "Plot",
    filterType: labels?.filterType || "Type",
    filterAllTypes: labels?.filterAllTypes || "All Types",
    filterAvailableOnly: labels?.filterAvailableOnly || "Available only",
    filterShowing: labels?.filterShowing || "Showing",
    filterOf: labels?.filterOf || "of",
    filterNoResults: labels?.filterNoResults || "No units match your filters",
    dataComing: labels?.dataComing || "Inventory data coming soon",
    miscUnits: labels?.miscUnits || "units",
    tablePlot: labels?.tablePlot || "Plot",
    tableUnitNumber: labels?.tableUnitNumber || "Unit #",
    tableVillaType: labels?.tableVillaType || "Villa Type",
    tableBeds: labels?.tableBeds || "Beds",
    tableTotalArea: labels?.tableTotalArea || "Total Area",
    tablePriceFrom: labels?.tablePriceFrom || "Price From",
    tableStatus: labels?.tableStatus || "Status",
  };
  const [plotFilter, setPlotFilter] = useState<string>("All");
  const [villaTypeFilter, setVillaTypeFilter] = useState<string>("All");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("plot");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  // Get unique villa types for dropdown
  const villaTypes = useMemo(() => {
    const set = new Set<string>();
    for (const u of units) {
      if (u.villaTypeName) set.add(u.villaTypeName);
    }
    return Array.from(set).sort();
  }, [units]);

  // Filter
  const filtered = useMemo(() => {
    let result = units;

    if (plotFilter !== "All") {
      result = result.filter(
        (u) => getPlotLetter(u.plotName) === plotFilter
      );
    }

    if (villaTypeFilter !== "All") {
      result = result.filter((u) => u.villaTypeName === villaTypeFilter);
    }

    if (availableOnly) {
      result = result.filter((u) => u.status === "available");
    }

    return result;
  }, [units, plotFilter, villaTypeFilter, availableOnly]);

  // Sort
  const sorted = useMemo(() => {
    const arr = [...filtered];

    arr.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "plot") {
        cmp = getPlotLetter(a.plotName).localeCompare(getPlotLetter(b.plotName));
        if (cmp === 0) cmp = a.unitNumber.localeCompare(b.unitNumber);
      } else if (sortKey === "price") {
        cmp = computePriceFrom(a.totalArea) - computePriceFrom(b.totalArea);
      } else if (sortKey === "area") {
        cmp = a.totalArea - b.totalArea;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return arr;
  }, [filtered, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const sortIndicator = (key: SortKey) => {
    if (sortKey !== key) return "";
    return sortDir === "asc" ? " \u2191" : " \u2193";
  };

  if (units.length === 0) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-[rgba(13,103,119,0.12)] bg-white/60 text-[var(--color-muted)]">
        {lbl.dataComing}
      </div>
    );
  }

  return (
    <div>
      {/* Filters */}
      <div className="tile mb-8 flex flex-wrap items-center gap-6" style={{ padding: "1.25rem 1.5rem" }}>
        {/* Plot pills */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-muted)]">
            {lbl.filterPlot}
          </span>
          <div className="flex gap-1">
            {PLOT_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => setPlotFilter(opt)}
                aria-pressed={plotFilter === opt}
                className={cn(
                  "min-w-[2.25rem] rounded-md px-2.5 py-1.5 text-sm font-medium transition-all duration-200 cursor-pointer",
                  plotFilter === opt
                    ? "bg-[var(--color-deep-teal)] text-white shadow-sm"
                    : "bg-transparent text-[var(--color-ink)] hover:bg-[rgba(13,103,119,0.06)]"
                )}
              >
                {opt === "All" ? useT("filterAll", "All") : opt}
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: "1px", height: "1.5rem", background: "rgba(13,103,119,0.12)" }} />

        {/* Villa type dropdown */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-muted)]">
            {lbl.filterType}
          </span>
          <select
            value={villaTypeFilter}
            onChange={(e) => setVillaTypeFilter(e.target.value)}
            className="rounded-md border border-[rgba(13,103,119,0.12)] bg-transparent px-3 py-1.5 text-sm text-[var(--color-ink)] outline-none transition-colors focus:border-[var(--color-deep-teal)]"
          >
            <option value="All">{lbl.filterAllTypes}</option>
            {villaTypes.map((vt) => (
              <option key={vt} value={vt}>
                {vt}
              </option>
            ))}
          </select>
        </div>

        {/* Divider */}
        <div style={{ width: "1px", height: "1.5rem", background: "rgba(13,103,119,0.12)" }} />

        {/* Available only toggle */}
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-[var(--color-ink)]">
          <div
            role="switch"
            aria-checked={availableOnly}
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setAvailableOnly((prev) => !prev); } }}
            onClick={() => setAvailableOnly((prev) => !prev)}
            className={cn(
              "relative h-[1.375rem] w-10 cursor-pointer rounded-full transition-colors duration-200",
              availableOnly
                ? "bg-[var(--color-deep-teal)]"
                : "bg-[rgba(13,103,119,0.15)]"
            )}
          >
            <span
              className={cn(
                "absolute top-[3px] h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200",
                availableOnly ? "translate-x-[1.125rem]" : "translate-x-[3px]"
              )}
            />
          </div>
          {lbl.filterAvailableOnly}
        </label>
      </div>

      {/* Results count */}
      <p className="mb-4 text-xs text-[var(--color-muted)]" aria-live="polite">
        {lbl.filterShowing} {sorted.length} {lbl.filterOf} {units.length} {lbl.miscUnits}
      </p>

      {sorted.length === 0 ? (
        <div className="flex min-h-[160px] items-center justify-center rounded-2xl border border-[rgba(13,103,119,0.12)] bg-white/60 text-[var(--color-muted)]">
          {lbl.filterNoResults}
        </div>
      ) : (
        <>
          {/* Desktop table */}
          {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
          {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
          <div className="tile hidden overflow-x-auto md:block" role="region" aria-label="Unit inventory table" tabIndex={0} style={{ padding: "1.5rem 2rem" }}>
            <table className="w-full border-collapse text-sm">
              <caption className="sr-only">Unit inventory</caption>
              <thead>
                <tr className="text-left text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-muted)]" style={{ borderBottom: "2px solid var(--color-deep-teal)" }}>
                  <th
                    scope="col"
                    className="cursor-pointer pb-3 pr-4 transition-colors hover:text-[var(--color-deep-teal)]"
                    onClick={() => handleSort("plot")}
                  >
                    {lbl.tablePlot}{sortIndicator("plot")}
                  </th>
                  <th scope="col" className="pb-3 px-4">{lbl.tableUnitNumber}</th>
                  <th scope="col" className="pb-3 px-4">{lbl.tableVillaType}</th>
                  <th scope="col" className="pb-3 px-4">{lbl.tableBeds}</th>
                  <th
                    scope="col"
                    className="cursor-pointer pb-3 px-4 transition-colors hover:text-[var(--color-deep-teal)]"
                    onClick={() => handleSort("area")}
                  >
                    {lbl.tableTotalArea}{sortIndicator("area")}
                  </th>
                  <th
                    scope="col"
                    className="cursor-pointer pb-3 px-4 transition-colors hover:text-[var(--color-deep-teal)]"
                    onClick={() => handleSort("price")}
                  >
                    {lbl.tablePriceFrom}{sortIndicator("price")}
                  </th>
                  <th scope="col" className="pb-3 pl-4 text-right">{lbl.tableStatus}</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((unit, index) => (
                  <tr
                    key={unit._id}
                    className="transition-colors hover:bg-[rgba(13,103,119,0.03)]"
                    style={{ borderBottom: index === sorted.length - 1 ? "none" : "1px solid rgba(13,103,119,0.08)" }}
                  >
                    <td className="py-4 pr-4 font-medium">
                      {getPlotLetter(unit.plotName)}
                    </td>
                    <td className="px-4 py-4">{unit.unitNumber}</td>
                    <td className="px-4 py-4">
                      <Link
                        href={`/${locale}/villas/${unit.villaTypeSlug}`}
                        className="text-[var(--color-deep-teal)] underline decoration-[var(--color-deep-teal)]/30 underline-offset-2 transition-colors hover:text-[var(--color-ink)]"
                      >
                        {unit.villaTypeName}
                      </Link>
                    </td>
                    <td className="px-4 py-4">{unit.bedrooms}</td>
                    <td className="px-4 py-4">{unit.totalArea} m&sup2;</td>
                    <td className="px-4 py-4 font-semibold text-[var(--color-deep-teal)]">
                      {formatPriceFrom(unit.totalArea, fromLabel)}
                    </td>
                    <td className="pl-4 py-4 text-right">
                      <StatusBadge status={unit.status} labelAvailable={statusAvailable} labelReserved={statusReserved} labelSold={statusSold} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile card list */}
          <div className="grid gap-3 md:hidden">
            {sorted.map((unit) => (
              <div
                key={unit._id}
                className="rounded-xl border border-[rgba(13,103,119,0.08)] bg-white/80 p-4"
              >
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-ink)]">
                      {lbl.tablePlot} {getPlotLetter(unit.plotName)} &middot; #{unit.unitNumber}
                    </p>
                    <Link
                      href={`/${locale}/villas/${unit.villaTypeSlug}`}
                      className="text-xs text-[var(--color-deep-teal)] underline decoration-[var(--color-deep-teal)]/30 underline-offset-2"
                    >
                      {unit.villaTypeName}
                    </Link>
                  </div>
                  <StatusBadge status={unit.status} labelAvailable={statusAvailable} labelReserved={statusReserved} labelSold={statusSold} />
                </div>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--color-muted)]">
                  <span>{unit.bedrooms} {unit.bedrooms !== 1 ? bedsLabel : bedLabel}</span>
                  <span>{unit.totalArea} m&sup2;</span>
                  <span className="font-medium text-[var(--color-deep-teal)]">
                    {formatPriceFrom(unit.totalArea, fromLabel)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
