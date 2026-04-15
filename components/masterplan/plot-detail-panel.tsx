"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";

import { StatusBadge } from "@/components/sections/status-badge";
import { cn } from "@/lib/cn";
import { getLocalizedValue, pluralize, type Locale } from "@/lib/i18n";
import { getBuiltAreaM2 } from "@/lib/built-area";
import { formatPriceFrom } from "@/lib/pricing";
import type { PlotWithUnits } from "@/lib/sanity/types";
import { useT, useBedLabel } from "@/lib/ui-strings-context";

type PanelLabels = {
  selectPlot: string;
  unitsAvailable: string;
  of: string;
  noUnits: string;
  unit: string;
  unitsFew: string;
  units: string;
};

type PlotDetailPanelProps = {
  plot: PlotWithUnits | null;
  locale: Locale;
  onClose: () => void;
  labels?: PanelLabels;
  desktopMaxHeightPx?: number | null;
  canShowBlueprint?: boolean;
  onEnterBlueprint?: () => void;
};

function groupUnitsByType(units: PlotWithUnits["units"]) {
  const groups: Record<
    string,
    {
      villaTypeName: string;
      villaTypeSlug: string;
      units: PlotWithUnits["units"];
    }
  > = {};

  for (const unit of units) {
    const key = unit.villaTypeSlug || unit.villaTypeName;
    if (!groups[key]) {
      groups[key] = {
        villaTypeName: unit.villaTypeName,
        villaTypeSlug: unit.villaTypeSlug,
        units: [],
      };
    }
    groups[key].units.push(unit);
  }

  return Object.values(groups);
}

export function PlotDetailPanel({
  plot,
  locale,
  onClose,
  labels,
  desktopMaxHeightPx,
  canShowBlueprint,
  onEnterBlueprint,
}: PlotDetailPanelProps) {
  const resolved = {
    selectPlot: labels?.selectPlot || "Select a plot on the map to see details",
    unitsAvailable: labels?.unitsAvailable || "units available",
    of: labels?.of || "of",
    noUnits: labels?.noUnits || "No units assigned to this plot yet.",
    unit: labels?.unit || "unit",
    unitsFew: labels?.unitsFew || labels?.units || "units",
    units: labels?.units || "units",
  };

  return (
    <>
      {/* Desktop panel — exact height matching the explorer */}
      <div
        className="hidden min-h-0 flex-col lg:flex"
        style={
          desktopMaxHeightPx != null && desktopMaxHeightPx > 0
            ? { height: desktopMaxHeightPx }
            : undefined
        }
      >
        <AnimatePresence mode="wait">
          {!plot ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex min-h-[240px] flex-1 items-center justify-center overflow-hidden rounded-md border border-[rgba(13,103,119,0.08)] bg-white/60 p-6"
            >
              <p className="text-center text-sm text-[var(--color-muted)]">
                {resolved.selectPlot}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={plot._id}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ duration: 0.3, ease: [0.2, 1, 0.22, 1] }}
              className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border border-[rgba(13,103,119,0.08)] bg-[rgba(255,250,241,0.92)] shadow-[var(--shadow-soft)]"
            >
              {/* Scrollable content */}
              <div
                className={cn(
                  "masterplan-panel-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain",
                  "py-7 pl-7 pr-2 sm:pl-8 sm:pr-3",
                )}
              >
                <PanelContent plot={plot} locale={locale} onClose={onClose} labels={resolved} canShowBlueprint={false} />
              </div>

              {/* Sticky bottom button */}
              {canShowBlueprint && onEnterBlueprint && (
                <div className="shrink-0 border-t border-[rgba(13,103,119,0.08)] px-7 py-4 sm:px-8">
                  <button
                    type="button"
                    onClick={onEnterBlueprint}
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-[var(--color-deep-teal)] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-deep-teal)]/90"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="opacity-80"><path d="M2 2h12v12H2z" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 2"/><path d="M5.5 2v12M10.5 2v12M2 5.5h12M2 10.5h12" stroke="currentColor" strokeWidth="0.8" opacity="0.4"/></svg>
                    View Plot Layout
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile bottom sheet — fixed positioned */}
      <div className="lg:hidden">
        <AnimatePresence>
          {plot && (
            <>
              {/* Backdrop */}
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 z-40 bg-black/30"
              />

              {/* Sheet */}
              <motion.div
                key={`mobile-${plot._id}`}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ duration: 0.35, ease: [0.2, 1, 0.22, 1] }}
                className={cn(
                  "fixed inset-x-0 bottom-0 z-50",
                  "max-h-[60vh] overflow-y-auto rounded-t-3xl",
                  "border-t border-[rgba(13,103,119,0.08)] bg-[var(--color-sand)] shadow-2xl"
                )}
              >
                {/* Drag handle */}
                <div className="sticky top-0 z-10 flex justify-center bg-[var(--color-sand)] pb-2 pt-3">
                  <span className="h-1 w-10 rounded-full bg-[var(--color-muted)]/30" />
                </div>
                <div className="px-5 pb-8">
                  <PanelContent
                    plot={plot}
                    locale={locale}
                    onClose={onClose}
                    labels={resolved}
                    canShowBlueprint={canShowBlueprint}
                    onEnterBlueprint={onEnterBlueprint}
                  />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

function PanelContent({
  plot,
  locale,
  onClose,
  labels,
  canShowBlueprint,
  onEnterBlueprint,
}: {
  plot: PlotWithUnits;
  locale: Locale;
  onClose: () => void;
  labels: {
    unitsAvailable: string;
    of: string;
    noUnits: string;
    unit: string;
    unitsFew: string;
    units: string;
  };
  canShowBlueprint?: boolean;
  onEnterBlueprint?: () => void;
}) {
  // Note: on desktop, the View Layout button is rendered in the sticky footer
  // of PlotDetailPanel. The canShowBlueprint/onEnterBlueprint props are used
  // only in the mobile bottom sheet version.
  const summary = getLocalizedValue(plot.summary, locale);
  const villaGroups = groupUnitsByType(plot.units);

  const available = plot.units.filter((u) => u.status === "available").length;
  const total = plot.units.length;

  const statusAvailable = useT("statusAvailable", "Available");
  const statusReserved = useT("statusReserved", "Reserved");
  const statusSold = useT("statusSold", "Sold");
  const bedOne = useT("miscBed", "Bed");
  const bedFew = useT("miscBedsFew", bedOne);
  const bedMany = useT("miscBeds", "Beds");
  const bedText = (n: number) => pluralize(n, locale, bedOne, bedFew, bedMany);
  const specPool = useT("specPool", "Pool");
  const fromLabel = useT("pricingFrom", "From");

  return (
    <>
      {/* Header */}
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h3 className="text-2xl font-bold text-[var(--color-ink)]">{plot.name}</h3>
          <p className="mt-1 text-sm font-medium text-[var(--color-deep-teal)]">
            {available} {labels.of} {total} {labels.unitsAvailable}
          </p>
        </div>
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-stone)] text-[var(--color-ink)] transition-colors hover:bg-[var(--color-deep-teal)] hover:text-white"
          aria-label="Close panel"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Summary */}
      {summary && (
        <p className="mb-5 text-base leading-relaxed text-[var(--color-muted)]">
          {summary}
        </p>
      )}

      {/* Unit breakdown by villa type */}
      {villaGroups.length === 0 ? (
        <p className="text-sm text-[var(--color-muted)]">
          {labels.noUnits}
        </p>
      ) : (
        <div className="space-y-4">
          {villaGroups.map((group) => (
            <div
              key={group.villaTypeSlug}
              className="rounded-md border border-[rgba(13,103,119,0.08)] bg-white/50 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <Link
                  href={`/${locale}/villas/${group.villaTypeSlug}`}
                  className="text-base font-semibold text-[var(--color-deep-teal)] underline decoration-[var(--color-deep-teal)]/30 underline-offset-2 transition-colors hover:text-[var(--color-ink)]"
                >
                  {group.villaTypeName}
                </Link>
                <span className="text-sm text-[var(--color-muted)]">
                  {pluralize(group.units.length, locale, labels.unit, labels.unitsFew, labels.units)}
                </span>
              </div>

              <div className="space-y-2.5">
                {group.units.map((unit) => (
                  <div
                    key={unit._id}
                    className="flex items-center justify-between text-base"
                  >
                    <span className="text-[var(--color-ink)]">
                      #{unit.unitNumber}
                      <span className="ml-2 text-sm text-[var(--color-muted)]">
                        {unit.totalArea}m&sup2; &middot; {bedText(unit.bedrooms)}
                        {unit.hasPool && ` \u00B7 ${specPool}`}
                      </span>
                    </span>
                    <StatusBadge
                      status={unit.status}
                      labelAvailable={statusAvailable}
                      labelReserved={statusReserved}
                      labelSold={statusSold}
                    />
                  </div>
                ))}
              </div>

              {/* Price range for available units */}
              {group.units.some((u) => u.status === "available") && (
                <p className="mt-2 text-sm font-medium text-[var(--color-deep-teal)]">
                  {formatPriceFrom(
                    Math.min(
                      ...group.units
                        .filter((u) => u.status === "available")
                        .map((u) => getBuiltAreaM2(u))
                    ),
                    fromLabel
                  )}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* View Layout button — mobile only (desktop uses sticky footer in PlotDetailPanel) */}
      {canShowBlueprint && onEnterBlueprint && (
        <button
          type="button"
          onClick={onEnterBlueprint}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-[var(--color-deep-teal)] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-deep-teal)]/90 lg:hidden"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="opacity-80"><path d="M2 2h12v12H2z" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 2"/><path d="M5.5 2v12M10.5 2v12M2 5.5h12M2 10.5h12" stroke="currentColor" strokeWidth="0.8" opacity="0.4"/></svg>
          View Plot Layout
        </button>
      )}
    </>
  );
}
