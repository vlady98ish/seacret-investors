"use client";

import { Fragment, useCallback, useRef, useState, type CSSProperties } from "react";
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
  const match = name.match(/[A-F]/i);
  return match ? match[0].toUpperCase() : name.charAt(0).toUpperCase();
}

/** Stem height: subtle variation per plot */
function pinStemHeightPx(plotId: string, x: number, y: number, isSelected: boolean): number {
  let n = 0;
  const s = `${plotId}:${x.toFixed(2)}:${y.toFixed(2)}`;
  for (let i = 0; i < s.length; i++) n = (n * 31 + s.charCodeAt(i)) >>> 0;
  const base = 24 + (n % 19);
  return base + (isSelected ? 3 : 0);
}

/** Slight lean toward center for visual depth */
function pinLeanDegrees(x: number, y: number): number {
  const dx = x - 50;
  const dy = y - 50;
  const raw = dx * 0.12 + dy * 0.06;
  return Math.max(-10, Math.min(10, raw));
}

function MapPinStem({ x, y, plotId, isSelected }: { x: number; y: number; plotId: string; isSelected: boolean }) {
  const stemH = pinStemHeightPx(plotId, x, y, isSelected);
  const leanDeg = pinLeanDegrees(x, y);
  const stemW = isSelected ? 4 : 3;
  const stemStyle: CSSProperties = isSelected
    ? {
        width: stemW,
        boxShadow: "0 0 22px rgba(232,163,64,0.65), inset 0 0 8px rgba(255,255,255,0.35)",
        background: "linear-gradient(90deg, rgba(255,213,140,0.5) 0%, rgba(232,163,64,0.98) 50%, rgba(160,100,30,0.9) 100%)",
      }
    : {
        width: stemW,
        boxShadow: "0 0 14px rgba(255,255,255,0.4), inset -1px 0 5px rgba(255,255,255,0.5), inset 1px 0 5px rgba(0,0,0,0.15)",
        background: "linear-gradient(90deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.98) 50%, rgba(255,255,255,0.35) 100%)",
      };

  return (
    <div
      className={cn(
        "pointer-events-none absolute z-[5] flex -translate-x-1/2 flex-col items-center",
        "hidden sm:flex",
        isSelected && "!flex z-[6]",
      )}
      style={{ left: `${x}%`, top: `calc(${y}% + 1.25rem)` }}
      aria-hidden
    >
      <div className="flex flex-col items-center" style={{ transform: `rotate(${leanDeg}deg)`, transformOrigin: "top center" }}>
        <div className="shrink-0 rounded-full" style={{ ...stemStyle, height: stemH }} />
        <div className="relative mt-0 flex shrink-0 justify-center">
          <div
            className={cn(
              "pointer-events-none absolute left-1/2 top-1/2 h-[26px] w-[26px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/25 opacity-[0.55]",
              isSelected && "h-[30px] w-[30px] border-[var(--color-gold-sun)]/45 opacity-90",
            )}
          />
          <div
            className={cn(
              "relative z-[1] h-2.5 w-2.5 rounded-full border-[2.5px] shadow-lg",
              isSelected
                ? "border-[var(--color-gold-sun)] bg-[var(--color-gold-sun)]/35 shadow-[0_0_18px_rgba(232,163,64,0.9)] ring-2 ring-[var(--color-gold-sun)]/40"
                : "border-white bg-white/50 shadow-[0_4px_14px_rgba(0,0,0,0.55)] ring-1 ring-black/30",
            )}
          />
        </div>
      </div>
    </div>
  );
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
  return {
    border: "border-amber-500",
    bg: "bg-amber-500",
    glow: "shadow-[0_0_20px_rgba(245,158,11,0.5)]",
  };
}

async function savePlotPosition(plotId: string, x: number, y: number) {
  await fetch("/api/plots/position", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ plotId, x, y }),
  });
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

  const isDev = process.env.NODE_ENV !== "production";
  const [editMode, setEditMode] = useState(false);
  const [dragOverrides, setDragOverrides] = useState<Record<string, { x: number; y: number }>>({});
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const toPercent = useCallback((clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent, plotId: string) => {
      if (!editMode) return;
      e.preventDefault();
      e.stopPropagation();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      setDraggingId(plotId);
    },
    [editMode],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!draggingId) return;
      const pos = toPercent(e.clientX, e.clientY);
      if (!pos) return;
      setDragOverrides((prev) => ({ ...prev, [draggingId]: pos }));
    },
    [draggingId, toPercent],
  );

  const handlePointerUp = useCallback(() => {
    if (!draggingId) return;
    const pos = dragOverrides[draggingId];
    if (pos) {
      savePlotPosition(draggingId, pos.x, pos.y);
    }
    setDraggingId(null);
  }, [draggingId, dragOverrides]);

  return (
    <div className="relative">
      {isDev && (
        <button
          type="button"
          onClick={() => setEditMode((v) => !v)}
          className={cn(
            "absolute -top-10 right-0 z-30 rounded px-3 py-1 text-xs font-medium transition-colors",
            editMode
              ? "bg-amber-500 text-black"
              : "bg-black/40 text-white/60 hover:text-white",
          )}
        >
          {editMode ? "Editing pins — drag to move" : "Edit pins"}
        </button>
      )}

      <div
        ref={containerRef}
        className={cn(
          "relative aspect-[16/11] w-full overflow-hidden rounded-md bg-[var(--color-night)]",
          editMode && "ring-2 ring-amber-500/50",
        )}
        onPointerMove={editMode ? handlePointerMove : undefined}
        onPointerUp={editMode ? handlePointerUp : undefined}
      >
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
          plots.map((plot) => {
            if (plot.positionData?.x == null || plot.positionData?.y == null) {
              return null;
            }
            const override = dragOverrides[plot._id];
            const pos = override ?? { x: plot.positionData.x, y: plot.positionData.y };
            const letter = getPlotLetter(plot.name);
            const colors = getPlotColor(plot.units);
            const isSelected = plot._id === selectedPlotId;
            const isDragging = draggingId === plot._id;

            return (
              <Fragment key={plot._id}>
                {!editMode && (
                  <MapPinStem
                    plotId={plot._id}
                    x={pos.x}
                    y={pos.y}
                    isSelected={isSelected}
                  />
                )}
                <button
                  type="button"
                  onClick={() => !editMode && onPlotSelect(plot._id)}
                  onPointerDown={(e) => handlePointerDown(e, plot._id)}
                  className={cn(
                    "absolute z-20 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center",
                    "h-7 w-7 text-[11px] sm:h-10 sm:w-10 sm:text-sm",
                    "rounded-full border-[1.5px] sm:border-2 font-bold text-white",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
                    colors.border,
                    colors.bg + "/85",
                    "backdrop-blur-[2px]",
                    "shadow-[0_4px_16px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.25)]",
                    !editMode && "transition-all duration-300 hover:scale-110 hover:shadow-xl",
                    editMode && "cursor-grab active:cursor-grabbing",
                    isDragging && "z-50 scale-125 ring-4 ring-amber-400/80",
                    isSelected && !editMode && [
                      "z-30 scale-110 ring-4 ring-[var(--color-gold-sun)]/55",
                      "shadow-[0_6px_28px_rgba(0,0,0,0.5),0_0_24px_rgba(232,163,64,0.55)]",
                      colors.glow,
                    ],
                  )}
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                  }}
                  aria-label={`Select ${plot.name}`}
                >
                  {letter}
                </button>

                {editMode && (
                  <div
                    className="pointer-events-none absolute z-40 -translate-x-1/2 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-mono text-amber-300"
                    style={{
                      left: `${pos.x}%`,
                      top: `calc(${pos.y}% + 1.5rem)`,
                    }}
                  >
                    {pos.x.toFixed(1)}, {pos.y.toFixed(1)}
                  </div>
                )}
              </Fragment>
            );
          })
        )}

        <div className="absolute bottom-2 left-2 z-20 flex items-center gap-2 rounded-md bg-black/50 px-2 py-1.5 backdrop-blur-sm sm:bottom-3 sm:left-3 sm:gap-3 sm:rounded-lg sm:px-3 sm:py-2">
          <span className="flex items-center gap-1 text-[10px] text-white/80 sm:gap-1.5 sm:text-xs">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 sm:h-2.5 sm:w-2.5" />
            {legend.available}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-white/80 sm:gap-1.5 sm:text-xs">
            <span className="inline-block h-2 w-2 rounded-full bg-red-500 sm:h-2.5 sm:w-2.5" />
            {legend.sold}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-white/80 sm:gap-1.5 sm:text-xs">
            <span className="inline-block h-2 w-2 rounded-full bg-amber-500 sm:h-2.5 sm:w-2.5" />
            {legend.reserved}
          </span>
        </div>
      </div>
    </div>
  );
}
