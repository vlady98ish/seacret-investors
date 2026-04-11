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
  position: { x: number; y: number; width: number; height: number };
  index: number;
  locale: string;
  editMode?: boolean;
  onPositionChange?: (unitId: string, pos: { x: number; y: number; width: number; height: number }) => void;
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

const statusStyles: Record<UnitStatus, { border: string; bg: string; text: string; badge: string; glow: string }> = {
  available: {
    border: "border-emerald-500/40",
    bg: "bg-emerald-500/[0.06]",
    text: "text-emerald-400",
    badge: "bg-emerald-500/15 text-emerald-400",
    glow: "hover:shadow-[0_0_24px_rgba(16,185,129,0.2)] hover:border-emerald-500/70",
  },
  reserved: {
    border: "border-amber-500/30",
    bg: "bg-amber-500/[0.04]",
    text: "text-amber-400",
    badge: "bg-amber-500/15 text-amber-400",
    glow: "hover:shadow-[0_0_24px_rgba(245,158,11,0.2)] hover:border-amber-500/60",
  },
  sold: {
    border: "border-red-500/20",
    bg: "bg-red-500/[0.03]",
    text: "text-red-400/50",
    badge: "bg-red-500/10 text-red-400",
    glow: "",
  },
};

export function UnitHotspot({
  unit,
  position,
  index,
  locale,
  editMode,
  onPositionChange,
  labels,
}: UnitHotspotProps) {
  const [hovered, setHovered] = useState(false);
  const [tapped, setTapped] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const s = statusStyles[unit.status];
  const isSold = unit.status === "sold";
  const statusLabel = labels[unit.status];

  const handleTap = useCallback(() => {
    if (isSold) return;
    setTapped((v) => !v);
  }, [isSold]);

  const showTooltip = hovered || tapped;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.3, y: 20 }}
      animate={{ opacity: isSold ? 0.5 : 1, scale: 1, y: 0 }}
      transition={{
        delay: 0.8 + index * 0.1,
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
      className={cn(
        "absolute flex flex-col items-center justify-center rounded-md border-[1.5px] cursor-pointer transition-all duration-300",
        s.border,
        s.bg,
        !isSold && s.glow,
        isSold && "cursor-default",
        editMode && "cursor-grab active:cursor-grabbing",
      )}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        width: `${position.width}%`,
        height: `${position.height}%`,
      }}
      onMouseEnter={() => !isSold && setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTapped(false); }}
      onClick={handleTap}
      drag={editMode}
      dragMomentum={false}
      onDragEnd={(_e, info) => {
        if (!editMode || !ref.current || !onPositionChange) return;
        const parent = ref.current.parentElement;
        if (!parent) return;
        const parentRect = parent.getBoundingClientRect();
        const newX = position.x + (info.offset.x / parentRect.width) * 100;
        const newY = position.y + (info.offset.y / parentRect.height) * 100;
        onPositionChange(unit._id, {
          ...position,
          x: Math.max(0, Math.min(100 - position.width, newX)),
          y: Math.max(0, Math.min(100 - position.height, newY)),
        });
      }}
    >
      <span className={cn("text-base font-extrabold sm:text-lg", s.text)}>
        {unit.unitNumber}
      </span>
      <span className={cn("text-[9px] font-semibold uppercase tracking-wide sm:text-[10px]", s.text, "opacity-70")}>
        {unit.villaTypeName}
      </span>
      <span className={cn("mt-1 rounded px-1.5 py-0.5 text-[8px] font-semibold", s.badge)}>
        {statusLabel}
      </span>

      {/* Tooltip — desktop hover / mobile tap */}
      <AnimatePresence>
        {showTooltip && !isSold && !editMode && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={cn(
              "absolute z-50 min-w-[180px] rounded-lg border border-[var(--color-gold-sun)]/25",
              "bg-[var(--color-night)]/95 p-3 shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl",
              "bottom-full left-1/2 -translate-x-1/2 mb-2",
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="text-xs font-bold text-[var(--color-gold-sun)]">
              #{unit.unitNumber} &middot; {unit.villaTypeName}
            </h4>
            <div className="mt-2 space-y-0.5 text-[10px]">
              <Row label="Total" value={`${unit.totalArea} m²`} />
              <Row label={labels.bedrooms} value={String(unit.bedrooms)} />
              <Row label={labels.bathrooms} value={String(unit.bathrooms)} />
              {unit.hasPool && <Row label={labels.pool} value="Yes" valueColor="text-emerald-400" />}
            </div>
            <Link
              href={`/${locale}/villas/${unit.villaTypeSlug}`}
              className={cn(
                "mt-2.5 block rounded-md py-1.5 text-center text-[10px] font-bold uppercase tracking-wider",
                "bg-gradient-to-r from-[var(--color-gold-sun)] to-[#d4912e] text-[var(--color-night)]",
                "transition-opacity hover:opacity-90",
              )}
            >
              {labels.viewVilla} &rarr;
            </Link>
            {/* Tooltip arrow */}
            <div className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b border-r border-[var(--color-gold-sun)]/25 bg-[var(--color-night)]/95" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Row({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-white/35">{label}</span>
      <span className={cn("font-semibold text-white/80", valueColor)}>{value}</span>
    </div>
  );
}
