"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";

import { BlueprintView } from "@/components/masterplan/blueprint-view";
import { PlotDetailPanel } from "@/components/masterplan/plot-detail-panel";
import { VisualExplorer } from "@/components/masterplan/visual-explorer";
import type { Locale } from "@/lib/i18n";
import type { PlotWithUnits } from "@/lib/sanity/types";

type LegendLabels = {
  available: string;
  reserved: string;
  sold: string;
};

type PanelLabels = {
  selectPlot: string;
  unitsAvailable: string;
  of: string;
  noUnits: string;
  unit: string;
  units: string;
};

type BlueprintLabels = {
  backToMasterplan: string;
  available: string;
  reserved: string;
  sold: string;
  bedrooms: string;
  bathrooms: string;
  pool: string;
  viewVilla: string;
  of: string;
  unitsAvailable: string;
  mountainView: string;
  seaView: string;
};

type MasterplanInteractiveProps = {
  plots: PlotWithUnits[];
  locale: Locale;
  legendLabels?: LegendLabels;
  panelLabels?: PanelLabels;
  blueprintLabels?: BlueprintLabels;
  aerialImageUrl?: string | null;
};

type ViewMode = "aerial" | "blueprint";

export function MasterplanInteractive({
  plots,
  locale,
  legendLabels,
  panelLabels,
  blueprintLabels,
  aerialImageUrl,
}: MasterplanInteractiveProps) {
  const [selectedPlotId, setSelectedPlotId] = useState<string | null>(plots[0]?._id ?? null);
  const [viewMode, setViewMode] = useState<ViewMode>("aerial");
  const explorerWrapRef = useRef<HTMLDivElement>(null);
  const [explorerHeightPx, setExplorerHeightPx] = useState<number | null>(null);

  const selectedPlot = plots.find((p) => p._id === selectedPlotId) ?? null;

  // Has blueprint data?
  const canShowBlueprint = selectedPlot != null && (selectedPlot.layoutImages?.length ?? 0) > 0;

  useLayoutEffect(() => {
    const el = explorerWrapRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;

    const update = () => setExplorerHeightPx(el.offsetHeight);
    update();

    const ro = new ResizeObserver(() => update());
    ro.observe(el);
    return () => ro.disconnect();
  }, [aerialImageUrl, plots.length]);

  const handlePlotSelect = (id: string) => {
    const isNewSelection = selectedPlotId !== id;
    setSelectedPlotId((prev) => (prev === id ? null : id));

    // If re-clicking the same plot that has layout images, enter blueprint
    if (!isNewSelection) {
      const plot = plots.find((p) => p._id === id);
      if (plot && (plot.layoutImages?.length ?? 0) > 0) {
        setViewMode("blueprint");
      }
    }
  };

  const handleEnterBlueprint = () => {
    if (canShowBlueprint) setViewMode("blueprint");
  };

  const handleBackToAerial = () => {
    setViewMode("aerial");
  };

  const defaultBlueprintLabels: BlueprintLabels = {
    backToMasterplan: blueprintLabels?.backToMasterplan ?? "Back to masterplan",
    available: blueprintLabels?.available ?? legendLabels?.available ?? "Available",
    reserved: blueprintLabels?.reserved ?? legendLabels?.reserved ?? "Reserved",
    sold: blueprintLabels?.sold ?? legendLabels?.sold ?? "Sold",
    bedrooms: blueprintLabels?.bedrooms ?? "BR",
    bathrooms: blueprintLabels?.bathrooms ?? "BA",
    pool: blueprintLabels?.pool ?? "Pool",
    viewVilla: blueprintLabels?.viewVilla ?? "View Villa",
    of: blueprintLabels?.of ?? panelLabels?.of ?? "of",
    unitsAvailable: blueprintLabels?.unitsAvailable ?? panelLabels?.unitsAvailable ?? "available",
    mountainView: blueprintLabels?.mountainView ?? "Mountain view",
    seaView: blueprintLabels?.seaView ?? "Sea view",
  };

  return (
    <AnimatePresence mode="wait">
      {viewMode === "aerial" ? (
        <motion.div
          key="aerial-mode"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.97, filter: "blur(6px)" }}
          transition={{ duration: 0.4, ease: [0.2, 1, 0.22, 1] }}
          className="flex flex-col gap-6 lg:flex-row lg:items-start"
        >
          {/* Visual explorer — 60% on desktop */}
          <div ref={explorerWrapRef} className="w-full shrink-0 lg:w-[60%]">
            <VisualExplorer
              plots={plots}
              selectedPlotId={selectedPlotId}
              onPlotSelect={handlePlotSelect}
              legendLabels={legendLabels}
              aerialImageUrl={aerialImageUrl}
            />
            {/* "View Layout" button when a plot with layout images is selected */}
            {canShowBlueprint && (
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                type="button"
                onClick={handleEnterBlueprint}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-[var(--color-deep-teal)]/20 bg-[var(--color-deep-teal)]/[0.06] px-4 py-2.5 text-sm font-semibold text-[var(--color-deep-teal)] transition-colors hover:bg-[var(--color-deep-teal)]/[0.12]"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="opacity-60"><path d="M2 2h12v12H2z" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 2"/><path d="M5.5 2v12M10.5 2v12M2 5.5h12M2 10.5h12" stroke="currentColor" strokeWidth="0.8" opacity="0.4"/></svg>
                View Plot Layout
              </motion.button>
            )}
          </div>

          {/* Detail panel — 40% on desktop */}
          <div className="w-full min-h-0 lg:w-[40%] lg:self-stretch">
            <PlotDetailPanel
              plot={selectedPlot}
              locale={locale}
              onClose={() => setSelectedPlotId(null)}
              labels={panelLabels}
              desktopMaxHeightPx={explorerHeightPx}
            />
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="blueprint-mode"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5, ease: [0.2, 1, 0.22, 1] }}
        >
          {selectedPlot && (
            <BlueprintView
              plot={selectedPlot}
              locale={locale}
              onBack={handleBackToAerial}
              labels={defaultBlueprintLabels}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
