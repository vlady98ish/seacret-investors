"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";

import { StatusBadge } from "@/components/sections/status-badge";
import { cn } from "@/lib/cn";
import { getLocalizedValue, type Locale } from "@/lib/i18n";
import { formatPriceFrom } from "@/lib/pricing";
import type { PlotWithUnits } from "@/lib/sanity/types";

type PlotDetailPanelProps = {
  plot: PlotWithUnits | null;
  locale: Locale;
  onClose: () => void;
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
}: PlotDetailPanelProps) {
  return (
    <>
      {/* Desktop panel — inline in the grid */}
      <div className="hidden lg:block">
        <AnimatePresence mode="wait">
          {!plot ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex min-h-[300px] items-center justify-center rounded-2xl border border-[rgba(13,103,119,0.08)] bg-white/60 p-6"
            >
              <p className="text-center text-sm text-[var(--color-muted)]">
                Select a plot on the map to see details
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={plot._id}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ duration: 0.3, ease: [0.2, 1, 0.22, 1] }}
              className="tile relative overflow-y-auto"
            >
              <PanelContent plot={plot} locale={locale} onClose={onClose} />
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
}: {
  plot: PlotWithUnits;
  locale: Locale;
  onClose: () => void;
}) {
  const summary = getLocalizedValue(plot.summary, locale);
  const villaGroups = groupUnitsByType(plot.units);

  const available = plot.units.filter((u) => u.status === "available").length;
  const total = plot.units.length;

  return (
    <>
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-h3 text-[var(--color-ink)]">{plot.name}</h3>
          <p className="mt-1 text-xs font-medium text-[var(--color-deep-teal)]">
            {available} of {total} units available
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
        <p className="mb-5 text-sm leading-relaxed text-[var(--color-muted)]">
          {summary}
        </p>
      )}

      {/* Unit breakdown by villa type */}
      {villaGroups.length === 0 ? (
        <p className="text-sm text-[var(--color-muted)]">
          No units assigned to this plot yet.
        </p>
      ) : (
        <div className="space-y-4">
          {villaGroups.map((group) => (
            <div
              key={group.villaTypeSlug}
              className="rounded-xl border border-[rgba(13,103,119,0.08)] bg-white/50 p-4"
            >
              <div className="mb-2 flex items-center justify-between">
                <Link
                  href={`/${locale}/villas/${group.villaTypeSlug}`}
                  className="text-sm font-semibold text-[var(--color-deep-teal)] underline decoration-[var(--color-deep-teal)]/30 underline-offset-2 transition-colors hover:text-[var(--color-ink)]"
                >
                  {group.villaTypeName}
                </Link>
                <span className="text-xs text-[var(--color-muted)]">
                  {group.units.length} unit
                  {group.units.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="space-y-2">
                {group.units.map((unit) => (
                  <div
                    key={unit._id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-[var(--color-ink)]">
                      #{unit.unitNumber}
                      <span className="ml-2 text-xs text-[var(--color-muted)]">
                        {unit.totalArea}m&sup2; &middot; {unit.bedrooms}BR
                        {unit.hasPool && " \u00B7 Pool"}
                      </span>
                    </span>
                    <StatusBadge status={unit.status} />
                  </div>
                ))}
              </div>

              {/* Price range for available units */}
              {group.units.some((u) => u.status === "available") && (
                <p className="mt-2 text-xs font-medium text-[var(--color-deep-teal)]">
                  {formatPriceFrom(
                    Math.min(
                      ...group.units
                        .filter((u) => u.status === "available")
                        .map((u) => u.totalArea)
                    )
                  )}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
