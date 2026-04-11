"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { FloorTabs } from "@/components/masterplan/floor-tabs";
import { getFallbackLayout } from "@/components/masterplan/layout-fallback-data";
import { UnitHotspot } from "@/components/masterplan/unit-hotspot";
import { cn } from "@/lib/cn";
import { getSanityImageUrl } from "@/lib/sanity/image";
import type { Locale } from "@/lib/i18n";
import type { PlotWithUnits } from "@/lib/sanity/types";

type BlueprintViewProps = {
  plot: PlotWithUnits;
  locale: Locale;
  onBack: () => void;
  labels: {
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
};

export function BlueprintView({ plot, locale, onBack, labels }: BlueprintViewProps) {
  const [activeFloor, setActiveFloor] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [dragOverrides, setDragOverrides] = useState<Record<string, { x: number; y: number }>>({});
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const isDev = process.env.NODE_ENV !== "production";
  const planRef = useRef<HTMLDivElement>(null);

  const toPercent = useCallback((clientX: number, clientY: number) => {
    const rect = planRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent, unitId: string) => {
      if (!editMode) return;
      e.preventDefault();
      e.stopPropagation();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      setDraggingId(unitId);
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
      fetch("/api/plots/unit-positions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plotId: plot._id,
          unitId: draggingId,
          x: Math.round(pos.x * 10) / 10,
          y: Math.round(pos.y * 10) / 10,
          width: 10,
          height: 10,
          floorIndex: activeFloor,
        }),
      });
    }
    setDraggingId(null);
  }, [draggingId, dragOverrides, plot._id, activeFloor]);

  // Sanity data or hardcoded fallback
  const fallback = useMemo(() => getFallbackLayout(plot.name), [plot.name]);
  const hasSanityLayout = (plot.layoutImages?.length ?? 0) > 0;

  const floors = useMemo(() => {
    if (hasSanityLayout) {
      return (plot.layoutImages ?? []).map((f) => ({
        label: f.label,
        imageUrl: getSanityImageUrl(f.image),
      }));
    }
    if (fallback) {
      return fallback.floors.map((f) => ({
        label: f.label,
        imageUrl: f.imagePath,
      }));
    }
    return [];
  }, [hasSanityLayout, plot.layoutImages, fallback]);

  const currentFloorImageUrl = floors[activeFloor]?.imageUrl ?? null;

  // Build unit-to-position map for current floor (pin x/y center)
  const unitPositionMap = useMemo(() => {
    const map = new Map<string, { x: number; y: number }>();

    if (hasSanityLayout) {
      for (const pos of plot.unitPositions ?? []) {
        if ((pos.floorIndex ?? 0) === activeFloor) {
          map.set(pos.unit._ref, dragOverrides[pos.unit._ref] ?? { x: pos.x, y: pos.y });
        }
      }
    } else if (fallback) {
      const fallbackPins = fallback.unitPins.filter((p) => p.floorIndex === activeFloor);
      for (const fp of fallbackPins) {
        const unit = plot.units.find((u) => u.unitNumber === fp.unitNumber);
        if (unit) {
          map.set(unit._id, dragOverrides[unit._id] ?? { x: fp.x, y: fp.y });
        }
      }
    }

    return map;
  }, [hasSanityLayout, plot.unitPositions, plot.units, fallback, activeFloor, dragOverrides]);

  // Filter units that have positions on current floor
  const visibleUnits = useMemo(
    () => plot.units.filter((u) => unitPositionMap.has(u._id)),
    [plot.units, unitPositionMap],
  );

  const availableCount = plot.units.filter((u) => u.status === "available").length;
  const totalCount = plot.units.length;

  // Escape key handler
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onBack();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onBack]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="flex w-full flex-col overflow-hidden rounded-md border border-[rgba(100,180,255,0.08)] bg-[var(--color-night)]"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-5 py-3 sm:px-7 sm:py-4">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-lg font-bold text-white">{plot.name}</h3>
          <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-0.5 text-[11px] font-medium text-emerald-400">
            {availableCount} {labels.of} {totalCount} {labels.unitsAvailable}
          </span>
          {floors.length > 1 && (
            <FloorTabs
              floors={floors}
              activeIndex={activeFloor}
              onSelect={setActiveFloor}
            />
          )}
        </div>
        <div className="flex items-center gap-2">
          {isDev && (
            <button
              type="button"
              onClick={() => setEditMode((v) => !v)}
              className={editMode
                ? "rounded bg-amber-500 px-3 py-1 text-xs font-medium text-black"
                : "rounded bg-white/[0.06] px-3 py-1 text-xs font-medium text-white/40 hover:text-white/70"
              }
            >
              {editMode ? "Done editing" : "Edit pins"}
            </button>
          )}
          <kbd className="hidden rounded border border-white/10 px-2 py-0.5 text-[10px] text-white/25 sm:inline">Esc</kbd>
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 rounded-md border border-white/10 px-3 py-1.5 text-xs text-white/50 transition-colors hover:border-white/25 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {labels.backToMasterplan}
          </button>
        </div>
      </div>

      {/* Plan image + unit hotspots */}
      <div className="relative flex-1">
        <div
          ref={planRef}
          className={cn("relative aspect-[3/4] w-full max-h-[75vh]", editMode && "ring-2 ring-inset ring-amber-500/30")}
          onPointerMove={editMode ? handlePointerMove : undefined}
          onPointerUp={editMode ? handlePointerUp : undefined}
        >
          {/* Background grid lines (decorative) — clipped layer */}
          <svg className="pointer-events-none absolute inset-0 z-[1] h-full w-full overflow-hidden" aria-hidden>
            {[20, 40, 60, 80].map((pct) => (
              <motion.line
                key={`h-${pct}`}
                x1="0%" y1={`${pct}%`} x2="100%" y2={`${pct}%`}
                stroke="rgba(100,180,255,0.06)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 0.2 + pct * 0.003 }}
              />
            ))}
            {[20, 40, 60, 80].map((pct) => (
              <motion.line
                key={`v-${pct}`}
                x1={`${pct}%`} y1="0%" x2={`${pct}%`} y2="100%"
                stroke="rgba(100,180,255,0.06)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 0.25 + pct * 0.003 }}
              />
            ))}
          </svg>

          {/* Architectural plan image */}
          <AnimatePresence mode="wait">
            {currentFloorImageUrl && (
              <motion.div
                key={`floor-${activeFloor}`}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 z-[2] overflow-hidden"
              >
                <Image
                  src={currentFloorImageUrl}
                  alt={`${plot.name} layout plan${floors[activeFloor]?.label ? ` — ${floors[activeFloor].label}` : ""}`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Unit hotspots — overflow visible so tooltips aren't clipped */}
          <div className="absolute inset-0 z-[3] overflow-visible">
            <AnimatePresence mode="wait">
              <motion.div
                key={`hotspots-${activeFloor}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative h-full w-full"
              >
                {visibleUnits.map((unit, i) => {
                  const pos = unitPositionMap.get(unit._id);
                  if (!pos) return null;
                  return (
                    <UnitHotspot
                      key={unit._id}
                      unit={unit}
                      position={pos}
                      index={i}
                      locale={locale}
                      editMode={editMode}
                      onPointerDown={handlePointerDown}
                      labels={{
                        available: labels.available,
                        reserved: labels.reserved,
                        sold: labels.sold,
                        bedrooms: labels.bedrooms,
                        bathrooms: labels.bathrooms,
                        pool: labels.pool,
                        viewVilla: labels.viewVilla,
                      }}
                    />
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Fallback when no layout images uploaded */}
          {!currentFloorImageUrl && (
            <div className="absolute inset-0 z-[1] flex items-center justify-center">
              <p className="text-sm text-white/20">Layout plan image not yet uploaded</p>
            </div>
          )}
        </div>
      </div>

      {/* Orientation bar */}
      <div className="flex items-center justify-between border-t border-white/[0.04] px-5 py-2 text-[10px] text-white/20">
        <span>{labels.mountainView}</span>
        <span>{labels.seaView}</span>
      </div>
    </motion.div>
  );
}
