"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";

import { BlueprintView } from "@/components/masterplan/blueprint-view";
import { getFallbackLayout } from "@/components/masterplan/layout-fallback-data";
import { PlotDetailPanel } from "@/components/masterplan/plot-detail-panel";
import { VisualExplorer } from "@/components/masterplan/visual-explorer";
import { trackEvent } from "@/lib/analytics";
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

  // Has blueprint data? (Sanity layout images OR hardcoded fallback)
  const canShowBlueprint = selectedPlot != null && (
    (selectedPlot.layoutImages?.length ?? 0) > 0 || getFallbackLayout(selectedPlot.name) != null
  );

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
    const plot = plots.find((p) => p._id === id);
    trackEvent("masterplan_click", {
      plot_id: id,
      plot_name: plot?.name ?? id,
    });

    const isNewSelection = selectedPlotId !== id;
    setSelectedPlotId((prev) => (prev === id ? null : id));

    // If re-clicking the same plot that has layout data, enter blueprint
    if (!isNewSelection) {
      if (plot && ((plot.layoutImages?.length ?? 0) > 0 || getFallbackLayout(plot.name) != null)) {
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
          className="flex flex-col gap-6 lg:flex-row lg:items-stretch"
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
          </div>

          {/* Detail panel — 40% on desktop */}
          <div className="w-full min-h-0 lg:w-[40%] lg:self-stretch">
            <PlotDetailPanel
              plot={selectedPlot}
              locale={locale}
              onClose={() => setSelectedPlotId(null)}
              labels={panelLabels}
              desktopMaxHeightPx={explorerHeightPx}
              canShowBlueprint={canShowBlueprint}
              onEnterBlueprint={handleEnterBlueprint}
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
