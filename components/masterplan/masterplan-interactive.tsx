"use client";

import { useState } from "react";

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
};

export function MasterplanInteractive({
  plots,
  locale,
  legendLabels,
  panelLabels,
}: MasterplanInteractiveProps) {
  const [selectedPlotId, setSelectedPlotId] = useState<string | null>(null);

  const selectedPlot = plots.find((p) => p._id === selectedPlotId) ?? null;

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      {/* Visual explorer — 60% on desktop, full width on mobile */}
      <div className="w-full lg:w-[60%]">
        <VisualExplorer
          plots={plots}
          selectedPlotId={selectedPlotId}
          onPlotSelect={(id) =>
            setSelectedPlotId((prev) => (prev === id ? null : id))
          }
          legendLabels={legendLabels}
        />
      </div>

      {/* Detail panel — 40% on desktop (inline), bottom sheet on mobile (handled inside) */}
      <div className="w-full lg:w-[40%]">
        <PlotDetailPanel
          plot={selectedPlot}
          locale={locale}
          onClose={() => setSelectedPlotId(null)}
          labels={panelLabels}
        />
      </div>
    </div>
  );
}
