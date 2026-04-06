"use client";

import { Fragment, type CSSProperties } from "react";
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

/** Длина стержня: заметная, но не доминирует; слегка разная по участкам */
function pinStemHeightPx(plotId: string, x: number, y: number, isSelected: boolean): number {
  let n = 0;
  const s = `${plotId}:${x.toFixed(2)}:${y.toFixed(2)}`;
  for (let i = 0; i < s.length; i++) n = (n * 31 + s.charCodeAt(i)) >>> 0;
  // ~24–42 px; выбранный чуть выше
  const base = 24 + (n % 19);
  return base + (isSelected ? 3 : 0);
}

/** Лёгкий наклон к центру кадра — ножка визуально «садится» на виллу, метка чуть уводит к центру участка */
function pinLeanDegrees(x: number, y: number): number {
  const dx = x - 50;
  const dy = y - 50;
  const raw = dx * 0.12 + dy * 0.06;
  return Math.max(-10, Math.min(10, raw));
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

/** Смещение маркера по горизонтали в % ширины (вправо — положительное). */
function plotPinOffsetXPercent(plotName: string): number {
  if (getPlotLetter(plotName) === "F") return 2.5;
  return 0;
}

/** Длина стержня относительно базовой (только для отдельных букв на карте). */
function pinStemLengthMultiplier(plotName: string): number {
  switch (getPlotLetter(plotName)) {
    case "C":
      return 2;
    case "D":
      return 2.5;
    case "E":
      return 3;
    default:
      return 1;
  }
}

/** Стержень + точка под кружком; центр кружка остаётся в (x,y). */
function MapPinStem({
  x,
  y,
  plotId,
  plotName,
  isSelected,
}: {
  x: number;
  y: number;
  plotId: string;
  plotName: string;
  isSelected: boolean;
}) {
  const mult = pinStemLengthMultiplier(plotName);
  const stemH = Math.round(pinStemHeightPx(plotId, x, y, isSelected) * mult);
  const leanDeg = pinLeanDegrees(x, y);
  const stemW = isSelected ? 4 : 3;
  const stemStyle: CSSProperties = isSelected
    ? {
        width: stemW,
        boxShadow:
          "0 0 22px rgba(232, 163, 64, 0.65), inset 0 0 8px rgba(255, 255, 255, 0.35)",
        background:
          "linear-gradient(90deg, rgba(255,213,140,0.5) 0%, rgba(232,163,64,0.98) 50%, rgba(160,100,30,0.9) 100%), linear-gradient(180deg, #fde68a 0%, var(--color-gold-sun) 50%, rgba(232,163,64,0.45) 100%)",
      }
    : {
        width: stemW,
        boxShadow:
          "0 0 14px rgba(255, 255, 255, 0.4), inset -1px 0 5px rgba(255,255,255,0.5), inset 1px 0 5px rgba(0,0,0,0.15)",
        background:
          "linear-gradient(90deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.98) 50%, rgba(255,255,255,0.35) 100%), linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.5) 65%, rgba(255,255,255,0.15) 100%)",
      };

  return (
    <div
      className={cn(
        "pointer-events-none absolute z-[5] flex -translate-x-1/2 flex-col items-center",
        isSelected && "z-[6]",
      )}
      style={{
        left: `${x}%`,
        top: `calc(${y}% + 1.25rem)`,
      }}
      aria-hidden
    >
      <div
        className="flex flex-col items-center"
        style={{
          transform: `rotate(${leanDeg}deg)`,
          transformOrigin: "top center",
        }}
      >
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
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-[var(--color-night)]">
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
          const pos = { x: plot.positionData.x, y: plot.positionData.y };
          const pinX = pos.x + plotPinOffsetXPercent(plot.name);
          const letter = getPlotLetter(plot.name);
          const colors = getPlotColor(plot.units);
          const isSelected = plot._id === selectedPlotId;

          return (
            <Fragment key={plot._id}>
              <MapPinStem
                plotId={plot._id}
                plotName={plot.name}
                x={pinX}
                y={pos.y}
                isSelected={isSelected}
              />
              <button
                type="button"
                onClick={() => onPlotSelect(plot._id)}
                className={cn(
                  "absolute z-20 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center",
                  "rounded-full border-2 text-sm font-bold text-white",
                  "transition-all duration-300 hover:scale-110 hover:shadow-xl",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
                  colors.border,
                  colors.bg + "/85",
                  "backdrop-blur-[2px]",
                  "shadow-[0_4px_16px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.25)]",
                  isSelected && [
                    "z-30 scale-110 ring-4 ring-[var(--color-gold-sun)]/55",
                    "shadow-[0_6px_28px_rgba(0,0,0,0.5),0_0_24px_rgba(232,163,64,0.55)]",
                    colors.glow,
                  ],
                )}
                style={{
                  left: `${pinX}%`,
                  top: `${pos.y}%`,
                }}
                aria-label={`Select ${plot.name}`}
              >
                {letter}
              </button>
            </Fragment>
          );
        })
      )}

      <div className="absolute bottom-3 left-3 z-20 flex items-center gap-3 rounded-lg bg-black/50 px-3 py-2 backdrop-blur-sm">
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
