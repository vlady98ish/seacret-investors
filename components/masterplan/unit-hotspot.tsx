"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";

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
  /** x/y are percentage positions for the pin center */
  position: { x: number; y: number };
  index: number;
  locale: string;
  editMode?: boolean;
  onDragEnd?: (unitId: string, x: number, y: number) => void;
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
  onDragEnd,
  labels,
}: UnitHotspotProps) {
  const [hovered, setHovered] = useState(false);
  const [tapped, setTapped] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const colors = statusColors[unit.status];
  const isSold = unit.status === "sold";
  const statusLabel = labels[unit.status];
  const showTooltip = (hovered || tapped) && !editMode;

  const handleTap = useCallback(() => {
    if (!editMode) setTapped((v) => !v);
  }, [editMode]);

  // Extract just the number from unitNumber (e.g. "A1" -> "1")
  const displayNum = unit.unitNumber.replace(/^[A-F]/i, "");

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: 0.5 + index * 0.12,
        type: "spring",
        stiffness: 350,
        damping: 20,
      }}
      className={cn("absolute z-10 -translate-x-1/2 -translate-y-1/2", editMode && "cursor-grab active:cursor-grabbing")}
      style={{ left: `${position.x}%`, top: `${position.y}%` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTapped(false); }}
      onClick={handleTap}
      drag={editMode}
      dragMomentum={false}
      onDragEnd={(_e, info) => {
        if (!editMode || !ref.current || !onDragEnd) return;
        const parent = ref.current.parentElement;
        if (!parent) return;
        const rect = parent.getBoundingClientRect();
        const newX = position.x + (info.offset.x / rect.width) * 100;
        const newY = position.y + (info.offset.y / rect.height) * 100;
        onDragEnd(unit._id, Math.round(newX * 10) / 10, Math.round(newY * 10) / 10);
      }}
    >
      {/* Pulse ring for available units */}
      {!isSold && (
        <span className={cn(
          "absolute inset-0 -m-1 rounded-full opacity-40",
          colors.pulse,
          "animate-ping",
        )} style={{ animationDuration: "2.5s" }} />
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
        )}
        aria-label={`Unit ${unit.unitNumber} — ${unit.villaTypeName} — ${statusLabel}`}
      >
        {displayNum}
      </button>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={cn(
              "absolute z-50 min-w-[200px] rounded-xl",
              "bg-white p-4 shadow-[0_12px_40px_rgba(0,0,0,0.15)]",
              "bottom-full left-1/2 -translate-x-1/2 mb-3",
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Unit header */}
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-[var(--color-ink)]">
                {unit.villaTypeName}
              </h4>
              <span className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                unit.status === "available" && "bg-emerald-50 text-emerald-600",
                unit.status === "reserved" && "bg-amber-50 text-amber-600",
                unit.status === "sold" && "bg-red-50 text-red-600",
              )}>
                {statusLabel}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-[var(--color-muted)]">
              Unit #{unit.unitNumber}
            </p>

            {/* Specs grid */}
            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
              <SpecRow label="Total" value={`${unit.totalArea} m²`} />
              <SpecRow label={labels.bedrooms} value={String(unit.bedrooms)} />
              <SpecRow label={labels.bathrooms} value={String(unit.bathrooms)} />
              {unit.hasPool && <SpecRow label={labels.pool} value="Yes" highlight />}
            </div>

            {/* CTA */}
            {!isSold && (
              <Link
                href={`/${locale}/villas/${unit.villaTypeSlug}`}
                className={cn(
                  "mt-3 block rounded-lg py-2 text-center text-xs font-semibold",
                  "bg-[var(--color-deep-teal)] text-white",
                  "transition-colors hover:bg-[var(--color-deep-teal)]/90",
                )}
              >
                {labels.viewVilla} &rarr;
              </Link>
            )}

            {/* Arrow */}
            <div className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-white shadow-[2px_2px_4px_rgba(0,0,0,0.05)]" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SpecRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-[var(--color-muted)]">{label}</span>
      <span className={cn("font-semibold text-[var(--color-ink)]", highlight && "text-emerald-600")}>{value}</span>
    </div>
  );
}
