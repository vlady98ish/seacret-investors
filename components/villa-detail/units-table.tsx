"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, ChevronDown, Minus } from "lucide-react";

import { cn } from "@/lib/cn";
import type { Locale } from "@/lib/i18n";
import type { UnitWithRefs } from "@/lib/sanity/types";
import { StatusBadge } from "@/components/sections/status-badge";
import { UnitDetailPanel } from "@/components/shared/unit-detail-panel";

type UnitsTableProps = {
  units: UnitWithRefs[];
  locale: Locale;
  headerUnit?: string;
  headerPlot?: string;
  headerArea?: string;
  headerBeds?: string;
  headerPool?: string;
  headerStatus?: string;
  labelStatusAvailable?: string;
  labelStatusReserved?: string;
  labelStatusSold?: string;
  villaSlug?: string;
  labelViewInventory?: string;
  detailLabels?: {
    groundFloor: string;
    upperFloor: string;
    attic: string;
    balcony: string;
    roofTerrace: string;
    outdoorArea: string;
    propertySize: string;
    bathrooms: string;
    pool: string;
    parking: string;
    yes: string;
    no: string;
  };
};

const DEFAULT_DETAIL_LABELS = {
  groundFloor: "Ground Floor",
  upperFloor: "Upper Floor",
  attic: "Attic",
  balcony: "Balcony",
  roofTerrace: "Roof Terrace",
  outdoorArea: "Outdoor Area",
  propertySize: "Property Size",
  bathrooms: "Bathrooms",
  pool: "Pool",
  parking: "Parking",
  yes: "Yes",
  no: "No",
};

export function UnitsTable({ units, locale, headerUnit, headerPlot, headerArea, headerBeds, headerPool, headerStatus, labelStatusAvailable, labelStatusReserved, labelStatusSold, villaSlug, labelViewInventory, detailLabels }: UnitsTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const labels = detailLabels ?? DEFAULT_DETAIL_LABELS;

  if (units.length === 0) {
    return (
      <div className="tile py-10 text-center text-[var(--color-muted)]">
        Unit availability coming soon
      </div>
    );
  }

  const sorted = [...units].sort((a, b) => a.unitNumber.localeCompare(b.unitNumber));

  return (
    <div className="tile overflow-hidden p-0">
      {/* Desktop table */}
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
      <div className="hidden overflow-x-auto sm:block" role="region" aria-label="Units table" tabIndex={0}>
        <table className="w-full text-sm">
          <caption className="sr-only">Available units</caption>
          <thead>
            <tr className="border-b border-[var(--color-deep-teal)]/10 text-left">
              <th scope="col" className="px-5 py-4 font-semibold uppercase tracking-widest text-[var(--color-muted)] text-xs">
                {headerUnit || "Unit #"}
              </th>
              <th scope="col" className="px-5 py-4 font-semibold uppercase tracking-widest text-[var(--color-muted)] text-xs">
                {headerPlot || "Plot"}
              </th>
              <th scope="col" className="px-5 py-4 font-semibold uppercase tracking-widest text-[var(--color-muted)] text-xs">
                {headerArea || "Area m²"}
              </th>
              <th scope="col" className="px-5 py-4 font-semibold uppercase tracking-widest text-[var(--color-muted)] text-xs">
                {headerBeds || "Beds"}
              </th>
              <th scope="col" className="px-5 py-4 font-semibold uppercase tracking-widest text-[var(--color-muted)] text-xs">
                {headerPool || "Pool"}
              </th>
              <th scope="col" className="px-5 py-4 font-semibold uppercase tracking-widest text-[var(--color-muted)] text-xs">
                {headerStatus || "Status"}
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((unit, i) => {
              const isExpanded = expandedId === unit._id;
              return (
                <React.Fragment key={unit._id}>
                  <tr
                    className={cn(
                      "border-b border-[var(--color-deep-teal)]/5 cursor-pointer transition-colors hover:bg-[var(--color-deep-teal)]/5",
                      i % 2 === 0 ? "bg-transparent" : "bg-[var(--color-sand)]/30",
                      isExpanded && "bg-[var(--color-deep-teal)]/5"
                    )}
                    onClick={() => setExpandedId(isExpanded ? null : unit._id)}
                  >
                    <td className="px-5 py-4 font-medium text-[var(--color-ink)]">
                      {unit.unitNumber}
                    </td>
                    <td className="px-5 py-4 text-[var(--color-muted)]">
                      {unit.plotName ?? "—"}
                    </td>
                    <td className="px-5 py-4 text-[var(--color-ink)]">{unit.totalArea}</td>
                    <td className="px-5 py-4 text-[var(--color-ink)]">{unit.bedrooms}</td>
                    <td className="px-5 py-4">
                      {unit.hasPool ? (
                        <Check className="h-4 w-4 text-[var(--color-deep-teal)]" aria-hidden="true" />
                      ) : (
                        <Minus className="h-4 w-4 text-[var(--color-muted)]" aria-hidden="true" />
                      )}
                      <span className="sr-only">{unit.hasPool ? "Yes" : "No"}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-between gap-2">
                        <StatusBadge status={unit.status} labelAvailable={labelStatusAvailable} labelReserved={labelStatusReserved} labelSold={labelStatusSold} />
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 text-[var(--color-muted)] transition-transform duration-200",
                            isExpanded && "rotate-180"
                          )}
                        />
                      </div>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr>
                      <td colSpan={6} className="bg-[var(--color-sand)]/30 border-b border-[var(--color-deep-teal)]/5">
                        <UnitDetailPanel
                          groundFloor={unit.groundFloor}
                          upperFloor={unit.upperFloor}
                          attic={unit.attic}
                          balcony={unit.balcony}
                          roofTerrace={unit.roofTerrace}
                          outdoorArea={unit.outdoorArea}
                          propertySize={unit.totalArea}
                          bathrooms={unit.bathrooms}
                          hasPool={unit.hasPool}
                          hasParking={unit.hasParking}
                          labels={labels}
                        />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile card layout */}
      <div className="divide-y divide-[var(--color-deep-teal)]/10 sm:hidden">
        {sorted.map((unit) => {
          const isExpanded = expandedId === unit._id;
          return (
            <div key={unit._id}>
              <div
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => setExpandedId(isExpanded ? null : unit._id)}
              >
                <div className="space-y-0.5">
                  <p className="font-medium text-[var(--color-ink)]">{headerUnit || "Unit"} {unit.unitNumber}</p>
                  <p className="text-xs text-[var(--color-muted)]">
                    {unit.totalArea} m² · {unit.bedrooms} {headerBeds || "bed"}
                    {unit.hasPool ? ` · ${headerPool || "Pool"}` : ""}
                  </p>
                  {unit.plotName && (
                    <p className="text-xs text-[var(--color-muted)]">{unit.plotName}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={unit.status} labelAvailable={labelStatusAvailable} labelReserved={labelStatusReserved} labelSold={labelStatusSold} />
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-[var(--color-muted)] transition-transform duration-200",
                      isExpanded && "rotate-180"
                    )}
                  />
                </div>
              </div>
              {isExpanded && (
                <div className="border-t border-[var(--color-deep-teal)]/5 bg-[var(--color-sand)]/30">
                  <UnitDetailPanel
                    groundFloor={unit.groundFloor}
                    upperFloor={unit.upperFloor}
                    attic={unit.attic}
                    balcony={unit.balcony}
                    roofTerrace={unit.roofTerrace}
                    outdoorArea={unit.outdoorArea}
                    propertySize={unit.totalArea}
                    bathrooms={unit.bathrooms}
                    hasPool={unit.hasPool}
                    hasParking={unit.hasParking}
                    labels={labels}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {villaSlug && (
        <div className="mt-6 text-center">
          <Link
            href={`/${locale}/masterplan?type=${villaSlug}`}
            className="text-sm font-medium text-[var(--color-deep-teal)] underline decoration-[var(--color-deep-teal)]/30 underline-offset-4 transition-colors hover:text-[var(--color-ink)]"
          >
            {labelViewInventory || "View full inventory"} →
          </Link>
        </div>
      )}
    </div>
  );
}
