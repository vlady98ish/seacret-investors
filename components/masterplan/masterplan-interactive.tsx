"use client";

import { useLayoutEffect, useRef, useState } from "react";

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

type MasterplanInteractiveProps = {
  plots: PlotWithUnits[];
  locale: Locale;
  legendLabels?: LegendLabels;
  panelLabels?: PanelLabels;
  aerialImageUrl?: string | null;
};

export function MasterplanInteractive({
  plots,
  locale,
  legendLabels,
  panelLabels,
  aerialImageUrl,
}: MasterplanInteractiveProps) {
  const [selectedPlotId, setSelectedPlotId] = useState<string | null>(plots[0]?._id ?? null);
  const explorerWrapRef = useRef<HTMLDivElement>(null);
  const [explorerHeightPx, setExplorerHeightPx] = useState<number | null>(null);

  const selectedPlot = plots.find((p) => p._id === selectedPlotId) ?? null;

  useLayoutEffect(() => {
    const el = explorerWrapRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;

    const update = () => setExplorerHeightPx(el.offsetHeight);
    update();

    const ro = new ResizeObserver(() => update());
    ro.observe(el);
    return () => ro.disconnect();
  }, [aerialImageUrl, plots.length]);

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      {/* Visual explorer — 60% on desktop; height drives the right column max-height */}
      <div ref={explorerWrapRef} className="w-full shrink-0 lg:w-[60%]">
        <VisualExplorer
          plots={plots}
          selectedPlotId={selectedPlotId}
          onPlotSelect={(id) =>
            setSelectedPlotId((prev) => (prev === id ? null : id))
          }
          legendLabels={legendLabels}
          aerialImageUrl={aerialImageUrl}
        />
      </div>

      {/* Detail panel — capped to image height on desktop; scroll inside */}
      <div className="w-full min-h-0 lg:w-[40%] lg:self-stretch">
        <PlotDetailPanel
          plot={selectedPlot}
          locale={locale}
          onClose={() => setSelectedPlotId(null)}
          labels={panelLabels}
          desktopMaxHeightPx={explorerHeightPx}
        />
      </div>
    </div>
  );
}
