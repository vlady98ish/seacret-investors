"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useCallback, useState } from "react";

import { cn } from "@/lib/cn";
import type { UnitStatus } from "@/lib/sanity/types";

type UnitData = {
  _id: string;
  unitNumber: string;
  status: UnitStatus;
  totalArea: number;
  outdoorArea?: number;
  bedrooms: number;
  bathrooms: number;
  hasPool: boolean;
  hasParking: boolean;
  villaTypeName: string;
  villaTypeSlug: string;
};

type UnitHotspotProps = {
  unit: UnitData;
  position: { x: number; y: number };
  index: number;
  locale: string;
  editMode?: boolean;
  onPointerDown?: (e: React.PointerEvent, unitId: string) => void;
  labels: {
    available: string;
    reserved: string;
    sold: string;
    bedrooms: string;
    bathrooms: string;
    pool: string;
    viewVilla: string;
  };
};

const statusColors: Record<UnitStatus, { bg: string; border: string; glow: string; pulse: string }> = {
  available: {
    bg: "bg-emerald-600",
    border: "border-emerald-700",
    glow: "shadow-[0_0_16px_rgba(16,185,129,0.5)]",
    pulse: "bg-emerald-400",
  },
  reserved: {
    bg: "bg-amber-500",
    border: "border-amber-600",
    glow: "shadow-[0_0_16px_rgba(245,158,11,0.5)]",
    pulse: "bg-amber-400",
  },
  sold: {
    bg: "bg-red-600",
    border: "border-red-700",
    glow: "shadow-[0_0_16px_rgba(239,68,68,0.4)]",
    pulse: "bg-red-400",
  },
};

export function UnitHotspot({
  unit,
  position,
  index,
  locale,
  editMode,
  onPointerDown,
  labels,
}: UnitHotspotProps) {
  const [hovered, setHovered] = useState(false);
  const [tapped, setTapped] = useState(false);

  const colors = statusColors[unit.status];
  const isSold = unit.status === "sold";
  const statusLabel = labels[unit.status];
  const showTooltip = (hovered || tapped) && !editMode;

  const handleTap = useCallback(() => {
    if (!editMode) setTapped((v) => !v);
  }, [editMode]);

  const displayNum = unit.unitNumber.replace(/^[A-F]/i, "");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: 0.5 + index * 0.12,
        type: "spring",
        stiffness: 350,
        damping: 20,
      }}
      className={cn(
        "absolute -translate-x-1/2 -translate-y-1/2",
        showTooltip ? "z-50" : "z-10",
        editMode && "cursor-grab active:cursor-grabbing",
      )}
      style={{ left: `${position.x}%`, top: `${position.y}%` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTapped(false); }}
      onClick={handleTap}
      onPointerDown={(e) => editMode && onPointerDown?.(e, unit._id)}
    >
      {/* Pulse ring for available units */}
      {!isSold && !editMode && (
        <span
          className={cn("absolute inset-0 -m-1 rounded-full opacity-40", colors.pulse, "animate-ping")}
          style={{ animationDuration: "2.5s" }}
        />
      )}

      {/* Pin circle */}
      <button
        type="button"
        className={cn(
          "relative flex h-10 w-10 items-center justify-center rounded-full border-[3px] text-sm font-bold text-white",
          "transition-all duration-300 cursor-pointer",
          "hover:scale-125 hover:z-20",
          colors.bg,
          colors.border,
          colors.glow,
          showTooltip && "scale-125 z-20 ring-2 ring-white/40",
          editMode && "hover:ring-2 hover:ring-amber-400/60",
        )}
        aria-label={`Unit ${unit.unitNumber} — ${unit.villaTypeName} — ${statusLabel}`}
      >
        {displayNum}
      </button>

      {/* Edit mode coordinate label */}
      {editMode && (
        <div className="pointer-events-none absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black/80 px-1.5 py-0.5 text-[9px] font-mono text-amber-300">
          {position.x.toFixed(1)}, {position.y.toFixed(1)}
        </div>
      )}

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={cn(
              "absolute z-50 w-[260px] rounded-2xl",
              "bg-white p-5 shadow-[0_16px_48px_rgba(0,0,0,0.18),0_0_0_1px_rgba(0,0,0,0.04)]",
              "bottom-full left-1/2 -translate-x-1/2 mb-4",
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-base font-bold text-[var(--color-ink)]">
                  {unit.villaTypeName}
                </h4>
                <p className="mt-0.5 text-sm text-[var(--color-muted)]">
                  Unit #{unit.unitNumber}
                </p>
              </div>
              <span className={cn(
                "shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold",
                unit.status === "available" && "bg-emerald-50 text-emerald-700",
                unit.status === "reserved" && "bg-amber-50 text-amber-700",
                unit.status === "sold" && "bg-red-50 text-red-700",
              )}>
                {statusLabel}
              </span>
            </div>

            {/* Divider */}
            <div className="my-3 h-px bg-[var(--color-ink)]/[0.06]" />

            {/* Specs */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              <SpecRow label="Total" value={`${unit.totalArea} m²`} bold />
              <SpecRow label={labels.bedrooms} value={String(unit.bedrooms)} />
              <SpecRow label={labels.bathrooms} value={String(unit.bathrooms)} />
              {unit.hasPool && <SpecRow label={labels.pool} value="Yes" highlight />}
            </div>

            {/* CTA */}
            {!isSold && (
              <Link
                href={`/${locale}/villas/${unit.villaTypeSlug}`}
                className={cn(
                  "mt-4 flex h-11 items-center justify-center rounded-xl text-sm font-semibold",
                  "bg-[var(--color-gold-sun)] text-[var(--color-night)]",
                  "transition-all hover:brightness-105 active:scale-[0.98]",
                )}
              >
                {labels.viewVilla} &rarr;
              </Link>
            )}

            {/* Arrow */}
            <div className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-white shadow-[2px_2px_4px_rgba(0,0,0,0.06)]" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SpecRow({ label, value, highlight, bold }: { label: string; value: string; highlight?: boolean; bold?: boolean }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-[var(--color-muted)]">{label}</span>
      <span className={cn(
        "text-[var(--color-ink)]",
        (bold || highlight) ? "font-bold" : "font-semibold",
        highlight && "text-emerald-600",
      )}>{value}</span>
    </div>
  );
}
