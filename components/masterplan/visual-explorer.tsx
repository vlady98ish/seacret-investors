"use client";

import Image from "next/image";

import { cn } from "@/lib/cn";
import type { PlotWithUnits, UnitStatus } from "@/lib/sanity/types";

type LegendLabels = {
  available: string;
  reserved: string;
  sold: string;
};

type VisualExplorerProps = {
  plots: PlotWithUnits[];
  selectedPlotId: string | null;
  onPlotSelect: (id: string) => void;
  legendLabels?: LegendLabels;
  aerialImageUrl?: string | null;
};

function getPlotLetter(name: string): string {
  // Parse letter from names like "Plot A", "A", "plot-a"
  const match = name.match(/[A-F]/i);
  return match ? match[0].toUpperCase() : name.charAt(0).toUpperCase();
}

function getPlotColor(units: PlotWithUnits["units"]): {
  border: string;
  bg: string;
  glow: string;
} {
  if (units.length === 0) {
    return {
      border: "border-[var(--color-muted)]",
      bg: "bg-[var(--color-muted)]",
      glow: "shadow-[0_0_20px_rgba(94,109,112,0.5)]",
    };
  }

  const statuses = units.map((u) => u.status);
  const allSold = statuses.every((s: UnitStatus) => s === "sold");
  const hasAvailable = statuses.some((s: UnitStatus) => s === "available");

  if (allSold) {
    return {
      border: "border-red-500",
      bg: "bg-red-500",
      glow: "shadow-[0_0_20px_rgba(239,68,68,0.5)]",
    };
  }
  if (hasAvailable) {
    return {
      border: "border-emerald-500",
      bg: "bg-emerald-500",
      glow: "shadow-[0_0_20px_rgba(16,185,129,0.5)]",
    };
  }
  // Mixed — reserved + sold, no available
  return {
    border: "border-amber-500",
    bg: "bg-amber-500",
    glow: "shadow-[0_0_20px_rgba(245,158,11,0.5)]",
  };
}

export function VisualExplorer({
  plots,
  selectedPlotId,
  onPlotSelect,
  legendLabels,
  aerialImageUrl,
}: VisualExplorerProps) {
  const legend = {
    available: legendLabels?.available ?? "",
    reserved: legendLabels?.reserved ?? "",
    sold: legendLabels?.sold ?? "",
  };

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[var(--color-night)]">
      {aerialImageUrl && (
        <Image
          src={aerialImageUrl}
          alt="Aerial masterplan view"
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 60vw"
          priority
        />
      )}

      {/* Overlay for contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-night)]/40 to-transparent" />

      {plots.length === 0 ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="glass-panel text-center">
            <p className="text-sm font-medium text-white/80">
              Interactive masterplan — data loading
            </p>
          </div>
        </div>
      ) : (
        plots.flatMap((plot) => {
          if (plot.positionData?.x == null || plot.positionData?.y == null) {
            return [];
          }
          const pos = { x: plot.positionData.x, y: plot.positionData.y };
          const letter = getPlotLetter(plot.name);
          const colors = getPlotColor(plot.units);
          const isSelected = plot._id === selectedPlotId;

          return (
            <button
              key={plot._id}
              onClick={() => onPlotSelect(plot._id)}
              className={cn(
                "absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center",
                "rounded-full border-2 text-sm font-bold text-white",
                "transition-all duration-300 hover:scale-110",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
                colors.border,
                colors.bg + "/80",
                "backdrop-blur-sm",
                isSelected && [
                  "scale-125 ring-4 ring-white/40",
                  colors.glow,
                ]
              )}
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
              }}
              aria-label={`Select ${plot.name}`}
            >
              {letter}
            </button>
          );
        })
      )}

      {/* Legend */}
      <div className="absolute bottom-3 left-3 flex items-center gap-3 rounded-lg bg-black/50 px-3 py-2 backdrop-blur-sm">
        <span className="flex items-center gap-1.5 text-xs text-white/80">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" />
          {legend.available}
        </span>
        <span className="flex items-center gap-1.5 text-xs text-white/80">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-500" />
          {legend.reserved}
        </span>
        <span className="flex items-center gap-1.5 text-xs text-white/80">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-500" />
          {legend.sold}
        </span>
      </div>
    </div>
  );
}
