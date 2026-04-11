# Blueprint Reveal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** When a user clicks a plot pin on the masterplan, the aerial view morphs into an interactive architectural blueprint showing the plot's site plan with positioned, hoverable unit hotspots.

**Architecture:** The existing `MasterplanInteractive` component gains a `viewMode` state (`"aerial" | "blueprint"`). Clicking a plot pin transitions to blueprint mode — Framer Motion orchestrates a 3-phase animation (aerial zoom/blur → crossfade → blueprint build with SVG line-draw and cascading unit hotspots). The blueprint uses a real architectural plan image from Sanity as background with positioned interactive unit overlays. The right-side `PlotDetailPanel` animates out during blueprint mode — all information lives inside the blueprint itself.

**Tech Stack:** Next.js 15, React 19, Framer Motion 12, Sanity CMS (GROQ), Tailwind CSS 4, TypeScript

**Spec:** `docs/superpowers/specs/2026-04-11-blueprint-reveal-design.md`

---

## File Structure

### New Files
| File | Responsibility |
|------|---------------|
| `components/masterplan/blueprint-view.tsx` | Main blueprint container: header, plan image, unit hotspots grid, orientation bar, floor tabs |
| `components/masterplan/unit-hotspot.tsx` | Single unit overlay positioned on plan — status color, number, type label, hover tooltip |
| `components/masterplan/floor-tabs.tsx` | Pill-style tab switcher for multi-floor plots (E/F) |
| `app/api/plots/unit-positions/route.ts` | Dev-mode PATCH endpoint for saving unit hotspot positions |

### Modified Files
| File | Changes |
|------|---------|
| `sanity/schemaTypes/plot.ts` | Add `layoutImages` array and `unitPositions` array fields |
| `lib/sanity/types.ts` | Add `LayoutFloor`, `UnitPosition` types; extend `PlotWithUnits` |
| `lib/sanity/queries.ts` | Extend `allPlotsQuery` to fetch `layoutImages` and `unitPositions` |
| `components/masterplan/masterplan-interactive.tsx` | Add `viewMode` state, `AnimatePresence` transition orchestration |
| `components/masterplan/visual-explorer.tsx` | Forward ref to container for transition origin |

---

## Task 1: Sanity Schema — Add Layout Fields to Plot

**Files:**
- Modify: `sanity/schemaTypes/plot.ts`

- [ ] **Step 1: Add `layoutImages` and `unitPositions` fields to plot schema**

In `sanity/schemaTypes/plot.ts`, add a new group and two new fields after the existing `aerialImage` field. Insert inside the `groups` array:

```ts
{ name: "layout", title: "Layout Plan" },
```

Then add these fields after the `aerialImage` field (still inside the `fields` array):

```ts
// Layout Plan
defineField({
  name: "layoutImages",
  title: "Layout Plan Images",
  type: "array",
  group: "layout",
  description: "Architectural site plan images. One per floor (e.g. Ground Floor, 1st Floor).",
  of: [
    {
      type: "object",
      fields: [
        defineField({ name: "label", title: "Floor Label", type: "string", description: 'e.g. "Ground Floor", "1st Floor". Leave empty for single-floor plots.' }),
        defineField({ name: "image", title: "Plan Image", type: "image", options: { hotspot: true }, validation: (r) => r.required() }),
      ],
      preview: {
        select: { title: "label", media: "image" },
        prepare({ title, media }) {
          return { title: title || "Floor plan", media };
        },
      },
    },
  ],
}),
defineField({
  name: "unitPositions",
  title: "Unit Positions on Layout",
  type: "array",
  group: "layout",
  description: "Position and size of each unit hotspot on the layout plan image (percentages).",
  of: [
    {
      type: "object",
      fields: [
        defineField({ name: "unit", title: "Unit", type: "reference", to: [{ type: "unit" }], validation: (r) => r.required() }),
        defineField({ name: "floorIndex", title: "Floor Index", type: "number", description: "0 = first image, 1 = second image, etc.", initialValue: 0 }),
        defineField({ name: "x", title: "X (%)", type: "number", validation: (r) => r.min(0).max(100) }),
        defineField({ name: "y", title: "Y (%)", type: "number", validation: (r) => r.min(0).max(100) }),
        defineField({ name: "width", title: "Width (%)", type: "number", validation: (r) => r.min(1).max(100) }),
        defineField({ name: "height", title: "Height (%)", type: "number", validation: (r) => r.min(1).max(100) }),
      ],
      preview: {
        select: { unitNum: "unit.unitNumber", floorIndex: "floorIndex" },
        prepare({ unitNum, floorIndex }) {
          return { title: `Unit ${unitNum ?? "?"}`, subtitle: `Floor ${floorIndex ?? 0}` };
        },
      },
    },
  ],
}),
```

- [ ] **Step 2: Verify Sanity Studio loads without errors**

Run: `npx sanity dev` (or the project's dev command) and navigate to a Plot document. Confirm the "Layout Plan" tab appears with the two new array fields.

- [ ] **Step 3: Commit**

```bash
git add sanity/schemaTypes/plot.ts
git commit -m "feat(sanity): add layoutImages and unitPositions fields to plot schema"
```

---

## Task 2: TypeScript Types — Extend PlotWithUnits

**Files:**
- Modify: `lib/sanity/types.ts`

- [ ] **Step 1: Add new types and extend PlotWithUnits**

Add these new types right before the existing `PlotWithUnits` interface:

```ts
export interface LayoutFloor {
  label?: string;
  image: SanityImage;
}

export interface UnitPosition {
  unit: { _ref: string };
  floorIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
}
```

Then add two new fields to the existing `PlotWithUnits` interface, after `sortOrder`:

```ts
  layoutImages?: LayoutFloor[];
  unitPositions?: UnitPosition[];
```

- [ ] **Step 2: Commit**

```bash
git add lib/sanity/types.ts
git commit -m "feat(types): add LayoutFloor, UnitPosition types and extend PlotWithUnits"
```

---

## Task 3: GROQ Query — Fetch Layout Data

**Files:**
- Modify: `lib/sanity/queries.ts`

- [ ] **Step 1: Extend `allPlotsQuery` to include layout fields**

Replace the existing `allPlotsQuery` with:

```ts
export const allPlotsQuery = groq`*[_type == "plot"] | order(sortOrder asc){
  _id, name, summary, aerialImage, positionData, sortOrder,
  layoutImages[]{ label, image },
  unitPositions[]{ unit, floorIndex, x, y, width, height },
  "units": *[_type == "unit" && plot._ref == ^._id]{
    _id, unitNumber, status, totalArea, outdoorArea, groundFloor, upperFloor, attic, balcony, roofTerrace, bedrooms, bathrooms, hasPool, hasParking,
    "villaTypeName": villaType->name,
    "villaTypeSlug": villaType->slug.current
  } | order(unitNumber asc)
}`;
```

The only change is adding the two lines: `layoutImages[]{ label, image }` and `unitPositions[]{ unit, floorIndex, x, y, width, height }`.

- [ ] **Step 2: Verify the query returns data**

Run in Sanity Vision (or browser console against the API) to confirm the query doesn't error. Layout fields will be `null`/empty until images are uploaded, which is expected.

- [ ] **Step 3: Commit**

```bash
git add lib/sanity/queries.ts
git commit -m "feat(queries): extend allPlotsQuery with layoutImages and unitPositions"
```

---

## Task 4: FloorTabs Component

**Files:**
- Create: `components/masterplan/floor-tabs.tsx`

- [ ] **Step 1: Create the FloorTabs component**

```tsx
"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/cn";

type FloorTabsProps = {
  floors: { label?: string }[];
  activeIndex: number;
  onSelect: (index: number) => void;
};

export function FloorTabs({ floors, activeIndex, onSelect }: FloorTabsProps) {
  if (floors.length <= 1) return null;

  return (
    <div className="flex items-center rounded-lg bg-[var(--color-night)]/40 p-1 backdrop-blur-sm border border-white/[0.06]">
      {floors.map((floor, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(i)}
          className={cn(
            "relative rounded-md px-4 py-1.5 text-xs font-semibold transition-colors",
            i === activeIndex
              ? "text-[var(--color-deep-teal)]"
              : "text-white/40 hover:text-white/70",
          )}
        >
          {i === activeIndex && (
            <motion.div
              layoutId="floor-tab-bg"
              className="absolute inset-0 rounded-md bg-white/90"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">
            {floor.label || `Floor ${i + 1}`}
          </span>
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/masterplan/floor-tabs.tsx
git commit -m "feat: add FloorTabs component for multi-floor plot switching"
```

---

## Task 5: UnitHotspot Component

**Files:**
- Create: `components/masterplan/unit-hotspot.tsx`

- [ ] **Step 1: Create the UnitHotspot component**

This renders a single positioned unit overlay on the blueprint plan with hover tooltip (desktop) and tap handling (mobile).

```tsx
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
  /** Dev mode: enable dragging to reposition */
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
              // Position above the hotspot
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
```

- [ ] **Step 2: Commit**

```bash
git add components/masterplan/unit-hotspot.tsx
git commit -m "feat: add UnitHotspot component with hover tooltip and status styling"
```

---

## Task 6: BlueprintView Component

**Files:**
- Create: `components/masterplan/blueprint-view.tsx`

- [ ] **Step 1: Create the BlueprintView component**

This is the main blueprint container that renders the architectural plan with all interactive overlays.

```tsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { FloorTabs } from "@/components/masterplan/floor-tabs";
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

async function saveUnitPosition(plotId: string, unitId: string, pos: { x: number; y: number; width: number; height: number }, floorIndex: number) {
  await fetch("/api/plots/unit-positions", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ plotId, unitId, ...pos, floorIndex }),
  });
}

export function BlueprintView({ plot, locale, onBack, labels }: BlueprintViewProps) {
  const [activeFloor, setActiveFloor] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [posOverrides, setPosOverrides] = useState<Record<string, { x: number; y: number; width: number; height: number }>>({});
  const isDev = process.env.NODE_ENV !== "production";
  const planRef = useRef<HTMLDivElement>(null);

  const floors = plot.layoutImages ?? [];
  const currentFloorImage = floors[activeFloor]?.image;
  const currentFloorImageUrl = currentFloorImage ? getSanityImageUrl(currentFloorImage) : null;

  // Build unit-to-position map for current floor
  const unitPositionMap = useMemo(() => {
    const map = new Map<string, { x: number; y: number; width: number; height: number }>();
    for (const pos of plot.unitPositions ?? []) {
      if ((pos.floorIndex ?? 0) === activeFloor) {
        map.set(pos.unit._ref, posOverrides[pos.unit._ref] ?? { x: pos.x, y: pos.y, width: pos.width, height: pos.height });
      }
    }
    return map;
  }, [plot.unitPositions, activeFloor, posOverrides]);

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

  const handlePositionChange = useCallback(
    (unitId: string, pos: { x: number; y: number; width: number; height: number }) => {
      setPosOverrides((prev) => ({ ...prev, [unitId]: pos }));
      saveUnitPosition(plot._id, unitId, pos, activeFloor);
    },
    [plot._id, activeFloor],
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="flex w-full flex-col overflow-hidden rounded-md border border-[rgba(100,180,255,0.08)] bg-[var(--color-night)]"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3 sm:px-7 sm:py-4">
        <div className="flex items-center gap-3">
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
              className={cn(
                "rounded px-3 py-1 text-xs font-medium transition-colors",
                editMode ? "bg-amber-500 text-black" : "bg-white/[0.06] text-white/40 hover:text-white/70",
              )}
            >
              {editMode ? "Editing units" : "Edit units"}
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
          className={cn(
            "relative aspect-[16/11] w-full overflow-hidden",
            editMode && "ring-2 ring-inset ring-amber-500/30",
          )}
        >
          {/* Background grid lines (decorative) */}
          <svg className="pointer-events-none absolute inset-0 z-[1] h-full w-full" aria-hidden>
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
                className="absolute inset-0 z-[2]"
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

          {/* Unit hotspots */}
          <div className="absolute inset-0 z-[3]">
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
                      onPositionChange={handlePositionChange}
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
```

- [ ] **Step 2: Commit**

```bash
git add components/masterplan/blueprint-view.tsx
git commit -m "feat: add BlueprintView component with plan image, unit hotspots, and floor tabs"
```

---

## Task 7: Update MasterplanInteractive — Transition Orchestration

**Files:**
- Modify: `components/masterplan/masterplan-interactive.tsx`

This is the core change — adding the `viewMode` state and the animated transition between aerial and blueprint.

- [ ] **Step 1: Rewrite MasterplanInteractive with viewMode support**

Replace the entire contents of `components/masterplan/masterplan-interactive.tsx`:

```tsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";

import { BlueprintView } from "@/components/masterplan/blueprint-view";
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

  // Has blueprint data?
  const canShowBlueprint = selectedPlot != null && (selectedPlot.layoutImages?.length ?? 0) > 0;

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
    const isNewSelection = selectedPlotId !== id;
    setSelectedPlotId((prev) => (prev === id ? null : id));

    // If re-clicking the same plot that has layout images, enter blueprint
    if (!isNewSelection) {
      const plot = plots.find((p) => p._id === id);
      if (plot && (plot.layoutImages?.length ?? 0) > 0) {
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
          className="flex flex-col gap-6 lg:flex-row lg:items-start"
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
            {/* "View Layout" button when a plot with layout images is selected */}
            {canShowBlueprint && (
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                type="button"
                onClick={handleEnterBlueprint}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-[var(--color-deep-teal)]/20 bg-[var(--color-deep-teal)]/[0.06] px-4 py-2.5 text-sm font-semibold text-[var(--color-deep-teal)] transition-colors hover:bg-[var(--color-deep-teal)]/[0.12]"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="opacity-60"><path d="M2 2h12v12H2z" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 2"/><path d="M5.5 2v12M10.5 2v12M2 5.5h12M2 10.5h12" stroke="currentColor" strokeWidth="0.8" opacity="0.4"/></svg>
                View Plot Layout
              </motion.button>
            )}
          </div>

          {/* Detail panel — 40% on desktop */}
          <div className="w-full min-h-0 lg:w-[40%] lg:self-stretch">
            <PlotDetailPanel
              plot={selectedPlot}
              locale={locale}
              onClose={() => setSelectedPlotId(null)}
              labels={panelLabels}
              desktopMaxHeightPx={explorerHeightPx}
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
```

- [ ] **Step 2: Update the masterplan page to pass blueprint labels**

In `app/[locale]/masterplan/page.tsx`, add the blueprint labels after `panelLabels`. Find where `panelLabels` is defined and add below it:

```tsx
const blueprintLabels = {
  backToMasterplan: t(uiStrings?.miscSelectPlot) ? "← " + t(uiStrings?.miscSelectPlot) : "Back to masterplan",
  available: legendLabels.available,
  reserved: legendLabels.reserved,
  sold: legendLabels.sold,
  bedrooms: t(uiStrings?.specBedrooms) ?? "BR",
  bathrooms: t(uiStrings?.specBathrooms) ?? "BA",
  pool: t(uiStrings?.specPool) ?? "Pool",
  viewVilla: t(uiStrings?.ctaExploreResidences) ?? "View Villa",
  of: t(uiStrings?.miscOf) ?? "of",
  unitsAvailable: t(uiStrings?.miscAvailable) ?? "available",
  mountainView: "Mountain view",
  seaView: "Sea view",
};
```

Then pass it to `MasterplanInteractive`:

```tsx
<MasterplanInteractive
  plots={plots}
  locale={typedLocale}
  legendLabels={legendLabels}
  panelLabels={panelLabels}
  blueprintLabels={blueprintLabels}
  aerialImageUrl={heroImageUrl}
/>
```

- [ ] **Step 3: Verify the app compiles**

Run: `npm run build` or `npm run dev` and navigate to the masterplan page. Confirm no TypeScript errors. The aerial view should work as before. The "View Plot Layout" button should appear when selecting a plot (but blueprint will show "Layout plan image not yet uploaded" until images are added to Sanity).

- [ ] **Step 4: Commit**

```bash
git add components/masterplan/masterplan-interactive.tsx app/[locale]/masterplan/page.tsx
git commit -m "feat: add blueprint/aerial view mode transition to masterplan interactive"
```

---

## Task 8: Unit Position API Endpoint

**Files:**
- Create: `app/api/plots/unit-positions/route.ts`

- [ ] **Step 1: Create the dev-mode API for saving unit positions**

```ts
import { NextResponse } from "next/server";

import { sanityWriteClient } from "@/lib/sanity/client";

export async function PATCH(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not allowed in production" }, { status: 403 });
  }

  const { plotId, unitId, x, y, width, height, floorIndex } = await request.json();

  if (!plotId || !unitId || x == null || y == null || width == null || height == null) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const round = (n: number) => Math.round(n * 10) / 10;

  // Fetch current unitPositions array
  const plot = await sanityWriteClient.fetch<{ unitPositions?: Array<{ _key: string; unit: { _ref: string }; floorIndex: number; x: number; y: number; width: number; height: number }> }>(
    `*[_type == "plot" && _id == $plotId][0]{ unitPositions }`,
    { plotId },
  );

  const positions = plot?.unitPositions ?? [];
  const existingIndex = positions.findIndex(
    (p) => p.unit?._ref === unitId && (p.floorIndex ?? 0) === (floorIndex ?? 0),
  );

  const entry = {
    _key: existingIndex >= 0 ? positions[existingIndex]._key : `${unitId}-${floorIndex ?? 0}`,
    unit: { _type: "reference" as const, _ref: unitId },
    floorIndex: floorIndex ?? 0,
    x: round(x),
    y: round(y),
    width: round(width),
    height: round(height),
  };

  if (existingIndex >= 0) {
    await sanityWriteClient
      .patch(plotId)
      .set({ [`unitPositions[${existingIndex}]`]: entry })
      .commit();
  } else {
    await sanityWriteClient
      .patch(plotId)
      .setIfMissing({ unitPositions: [] })
      .append("unitPositions", [entry])
      .commit();
  }

  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 2: Commit**

```bash
git add app/api/plots/unit-positions/route.ts
git commit -m "feat: add dev-mode API endpoint for saving unit positions on plot layout"
```

---

## Task 9: Upload Layout Images and Test End-to-End

This is a manual task to verify everything works together.

- [ ] **Step 1: Upload layout images to Sanity**

1. Open Sanity Studio (`npx sanity dev` or navigate to the Studio URL)
2. Open Plot A document → "Layout Plan" tab
3. Add one item to "Layout Plan Images" — upload the extracted `slide_30_img_1.png` from `/Users/vladyslavi/Downloads/slides_30_37/`
4. Leave "Floor Label" empty (single-floor plot)
5. Publish

Repeat for Plot B (slide_31_img_1.png), Plot C (slide_32_img_1.png), Plot D (slide_33_img_1.png).

For Plot E:
- Add two items: "Ground Floor" (slide_34_img_1.png) and "1st Floor" (slide_35_img_1.png)

For Plot F:
- Add two items: "Ground Floor" (slide_36_img_1.png) and "1st Floor" (slide_37_img_1.png)

- [ ] **Step 2: Add unit positions via dev editor**

1. Navigate to the masterplan page in the browser
2. Select Plot A → click "View Plot Layout"
3. Click "Edit units" button (dev mode only)
4. Drag unit hotspot rectangles to align with the architectural plan image
5. Positions auto-save to Sanity

- [ ] **Step 3: Verify the complete flow**

1. Masterplan loads with aerial view + plot pins (unchanged)
2. Click a plot pin → right panel shows units (unchanged)
3. Click "View Plot Layout" button → animated transition to blueprint
4. Blueprint shows: header with plot name + availability, architectural plan image, unit hotspots with status colors
5. Hover a unit hotspot → tooltip with specs appears with spring animation
6. Click "View Villa →" in tooltip → navigates to villa page
7. Click "Back to masterplan" or press Escape → reverse transition to aerial
8. For Plot E/F: floor tabs appear and switching triggers crossfade
9. Mobile: test on narrow viewport — blueprint goes fullscreen, tap for specs

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete blueprint reveal — plot layout viewer with animated transitions"
```

---

## Summary

| Task | Description | New Files | Modified Files |
|------|------------|-----------|----------------|
| 1 | Sanity schema — layout fields | — | `sanity/schemaTypes/plot.ts` |
| 2 | TypeScript types | — | `lib/sanity/types.ts` |
| 3 | GROQ query update | — | `lib/sanity/queries.ts` |
| 4 | FloorTabs component | `components/masterplan/floor-tabs.tsx` | — |
| 5 | UnitHotspot component | `components/masterplan/unit-hotspot.tsx` | — |
| 6 | BlueprintView component | `components/masterplan/blueprint-view.tsx` | — |
| 7 | MasterplanInteractive transition | — | `masterplan-interactive.tsx`, `masterplan/page.tsx` |
| 8 | Unit position API | `app/api/plots/unit-positions/route.ts` | — |
| 9 | Upload images + E2E test | — | — (manual) |
