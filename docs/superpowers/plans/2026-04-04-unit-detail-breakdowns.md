# Unit Detail Breakdowns Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add expandable detail rows to the masterplan inventory table showing per-unit floor breakdowns, rename Mikka→Mika, fix D4/D5 bedrooms, and populate data from Excel via migration script.

**Architecture:** GROQ queries and TS types are extended with floor breakdown fields. A shared `UnitDetailPanel` renders the expandable content. The inventory table on `/masterplan` gets accordion expand/collapse behavior. Villa detail page gets a link to masterplan. A one-time migration script populates Sanity from the Excel MASTER tab.

**Tech Stack:** Next.js 15, React 19, Sanity CMS, GROQ, TypeScript, Tailwind CSS, lucide-react icons.

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Modify | `lib/sanity/queries.ts` | Add floor fields to GROQ projections |
| Modify | `lib/sanity/types.ts` | Add optional floor fields to TS types |
| Modify | `sanity/schemaTypes/uiStrings.ts` | Add spec label fields for new terms |
| Create | `components/shared/unit-detail-panel.tsx` | Reusable detail panel component |
| Modify | `components/masterplan/inventory-table.tsx` | Expandable rows + built area column |
| Modify | `components/villa-detail/units-table.tsx` | Add "View full inventory" link |
| Modify | `app/[locale]/masterplan/page.tsx` | Accept `?type=` search param, pass labels |
| Create | `sanity/seed/migrate-unit-details.ts` | One-time migration from Excel |
| Modify | `sanity/seed/seed-data.ts` | Rename Mikka→Mika, fix D4/D5 bedrooms |

---

### Task 1: Extend TypeScript Types

**Files:**
- Modify: `lib/sanity/types.ts:454-465` (UnitWithRefs)
- Modify: `lib/sanity/types.ts:486-497` (UnitFlat)
- Modify: `lib/sanity/types.ts:467-484` (PlotWithUnits)

- [ ] **Step 1: Add floor fields to UnitWithRefs**

In `lib/sanity/types.ts`, find the `UnitWithRefs` interface and add the optional fields before the closing brace:

```typescript
export interface UnitWithRefs {
  _id: string;
  unitNumber: string;
  status: UnitStatus;
  totalArea: number;
  outdoorArea: number;
  groundFloor?: number;
  upperFloor?: number;
  attic?: number;
  balcony?: number;
  roofTerrace?: number;
  bedrooms: number;
  bathrooms: number;
  hasPool: boolean;
  hasParking: boolean;
  plotName: string;
}
```

- [ ] **Step 2: Add floor fields to UnitFlat**

Replace the existing `UnitFlat` interface:

```typescript
export interface UnitFlat {
  _id: string;
  unitNumber: string;
  status: UnitStatus;
  totalArea: number;
  outdoorArea?: number;
  groundFloor?: number;
  upperFloor?: number;
  attic?: number;
  balcony?: number;
  roofTerrace?: number;
  bedrooms: number;
  bathrooms: number;
  hasPool: boolean;
  hasParking: boolean;
  plotName: string;
  villaTypeName: string;
  villaTypeSlug: string;
}
```

- [ ] **Step 3: Add floor fields to PlotWithUnits.units[]**

In the `PlotWithUnits` interface, extend the `units` array item type:

```typescript
export interface PlotWithUnits {
  _id: string;
  name: string;
  summary: LocalizedText;
  aerialImage: SanityImage;
  positionData: { x: number; y: number };
  sortOrder: number;
  units: Array<{
    _id: string;
    unitNumber: string;
    status: UnitStatus;
    totalArea: number;
    outdoorArea?: number;
    groundFloor?: number;
    upperFloor?: number;
    attic?: number;
    balcony?: number;
    roofTerrace?: number;
    bedrooms: number;
    bathrooms: number;
    hasPool: boolean;
    hasParking: boolean;
    villaTypeName: string;
    villaTypeSlug: string;
  }>;
}
```

- [ ] **Step 4: Verify build**

Run: `npx next build --no-lint 2>&1 | head -20`
Expected: No type errors from the changes (fields are optional, existing code unaffected).

- [ ] **Step 5: Commit**

```bash
git add lib/sanity/types.ts
git commit -m "feat: add floor breakdown fields to unit TypeScript types"
```

---

### Task 2: Extend GROQ Queries

**Files:**
- Modify: `lib/sanity/queries.ts:14-20` (villaBySlugQuery)
- Modify: `lib/sanity/queries.ts:22-29` (allPlotsQuery)
- Modify: `lib/sanity/queries.ts:31-36` (allUnitsQuery)

- [ ] **Step 1: Update villaBySlugQuery**

In `lib/sanity/queries.ts`, update the units projection inside `villaBySlugQuery`:

```typescript
export const villaBySlugQuery = groq`*[_type == "villa" && slug.current == $slug][0]{
  ...,
  "units": *[_type == "unit" && villaType._ref == ^._id]{
    _id, unitNumber, status, totalArea, outdoorArea, groundFloor, upperFloor, attic, balcony, roofTerrace, bedrooms, bathrooms, hasPool, hasParking,
    "plotName": plot->name
  } | order(unitNumber asc)
}`;
```

- [ ] **Step 2: Update allPlotsQuery**

```typescript
export const allPlotsQuery = groq`*[_type == "plot"] | order(sortOrder asc){
  _id, name, summary, aerialImage, positionData, sortOrder,
  "units": *[_type == "unit" && plot._ref == ^._id]{
    _id, unitNumber, status, totalArea, outdoorArea, groundFloor, upperFloor, attic, balcony, roofTerrace, bedrooms, bathrooms, hasPool, hasParking,
    "villaTypeName": villaType->name,
    "villaTypeSlug": villaType->slug.current
  } | order(unitNumber asc)
}`;
```

- [ ] **Step 3: Update allUnitsQuery**

```typescript
export const allUnitsQuery = groq`*[_type == "unit"] | order(unitNumber asc){
  _id, unitNumber, status, totalArea, outdoorArea, groundFloor, upperFloor, attic, balcony, roofTerrace, bedrooms, bathrooms, hasPool, hasParking,
  "plotName": plot->name,
  "villaTypeName": villaType->name,
  "villaTypeSlug": villaType->slug.current
}`;
```

- [ ] **Step 4: Commit**

```bash
git add lib/sanity/queries.ts
git commit -m "feat: add floor breakdown fields to GROQ queries"
```

---

### Task 3: Add UI String Fields to Sanity Schema

**Files:**
- Modify: `sanity/schemaTypes/uiStrings.ts:52-60` (specs group)
- Modify: `lib/sanity/types.ts:85-120` (UiStrings interface)

- [ ] **Step 1: Add spec fields to uiStrings schema**

In `sanity/schemaTypes/uiStrings.ts`, after the existing specs fields (after `specNo` line ~60), add:

```typescript
    { ...ls("specGroundFloor", "Spec: Ground Floor"), group: "specs" },
    { ...ls("specUpperFloor", "Spec: Upper Floor"), group: "specs" },
    { ...ls("specAttic", "Spec: Attic"), group: "specs" },
    { ...ls("specBalcony", "Spec: Balcony"), group: "specs" },
    { ...ls("specRoofTerrace", "Spec: Roof Terrace"), group: "specs" },
    { ...ls("specPropertySize", "Spec: Property Size"), group: "specs" },
    { ...ls("specBuiltArea", "Spec: Built Area"), group: "specs" },
```

- [ ] **Step 2: Add to UiStrings TypeScript interface**

In `lib/sanity/types.ts`, inside the `UiStrings` interface after `specNo`, add:

```typescript
  specGroundFloor: LocalizedString;
  specUpperFloor: LocalizedString;
  specAttic: LocalizedString;
  specBalcony: LocalizedString;
  specRoofTerrace: LocalizedString;
  specPropertySize: LocalizedString;
  specBuiltArea: LocalizedString;
```

- [ ] **Step 3: Commit**

```bash
git add sanity/schemaTypes/uiStrings.ts lib/sanity/types.ts
git commit -m "feat: add UI string fields for floor breakdown labels"
```

---

### Task 4: Create UnitDetailPanel Component

**Files:**
- Create: `components/shared/unit-detail-panel.tsx`

- [ ] **Step 1: Create the component**

```typescript
import type { LocalizedString } from "@/lib/sanity/types";

type DetailItem = {
  label: string;
  value: string;
};

type UnitDetailPanelProps = {
  groundFloor?: number;
  upperFloor?: number;
  attic?: number;
  balcony?: number;
  roofTerrace?: number;
  outdoorArea?: number;
  propertySize?: number;
  bathrooms?: number;
  hasPool?: boolean;
  hasParking?: boolean;
  labels: {
    groundFloor: string;
    upperFloor: string;
    attic: string;
    balcony: string;
    roofTerrace: string;
    outdoorArea: string;
    propertySize: string;
    bathrooms: string;
    pool: string;
    parking: string;
    yes: string;
    no: string;
  };
};

export function UnitDetailPanel({
  groundFloor,
  upperFloor,
  attic,
  balcony,
  roofTerrace,
  outdoorArea,
  propertySize,
  bathrooms,
  hasPool,
  hasParking,
  labels,
}: UnitDetailPanelProps) {
  const items: DetailItem[] = [];

  if (groundFloor && groundFloor > 0) items.push({ label: labels.groundFloor, value: `${groundFloor} m²` });
  if (upperFloor && upperFloor > 0) items.push({ label: labels.upperFloor, value: `${upperFloor} m²` });
  if (attic && attic > 0) items.push({ label: labels.attic, value: `${attic} m²` });
  if (balcony && balcony > 0) items.push({ label: labels.balcony, value: `${balcony} m²` });
  if (roofTerrace && roofTerrace > 0) items.push({ label: labels.roofTerrace, value: `${roofTerrace} m²` });
  if (outdoorArea && outdoorArea > 0) items.push({ label: labels.outdoorArea, value: `${outdoorArea} m²` });
  if (propertySize && propertySize > 0) items.push({ label: labels.propertySize, value: `${propertySize} m²` });
  if (bathrooms && bathrooms > 0) items.push({ label: labels.bathrooms, value: String(bathrooms) });
  if (hasPool !== undefined) items.push({ label: labels.pool, value: hasPool ? labels.yes : labels.no });
  if (hasParking !== undefined) items.push({ label: labels.parking, value: hasParking ? labels.yes : labels.no });

  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-2 px-4 py-4 sm:grid-cols-2 sm:px-8">
      {items.map((item) => (
        <div key={item.label} className="flex justify-between border-b border-[rgba(13,103,119,0.06)] py-1.5">
          <span className="text-xs text-[var(--color-muted)]">{item.label}</span>
          <span className="text-xs font-medium text-[var(--color-ink)]">{item.value}</span>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Verify no build errors**

Run: `npx next build --no-lint 2>&1 | head -20`

- [ ] **Step 3: Commit**

```bash
git add components/shared/unit-detail-panel.tsx
git commit -m "feat: create UnitDetailPanel shared component"
```

---

### Task 5: Add Expandable Rows to Inventory Table

**Files:**
- Modify: `components/masterplan/inventory-table.tsx`

This is the largest change. The inventory table gets:
- A `builtArea` computed column replacing "Total Area"
- Expandable rows with `UnitDetailPanel`
- Chevron indicator
- Accordion behavior (one row at a time)

- [ ] **Step 1: Add imports and expand state**

At the top of `inventory-table.tsx`, add the import:

```typescript
import { ChevronDown } from "lucide-react";
import { UnitDetailPanel } from "@/components/shared/unit-detail-panel";
```

- [ ] **Step 2: Add helper function for built area**

Below the `getPlotLetter` function, add:

```typescript
function getBuiltArea(unit: UnitFlat): number {
  const g = unit.groundFloor ?? 0;
  const u = unit.upperFloor ?? 0;
  const a = unit.attic ?? 0;
  const sum = g + u + a;
  return sum > 0 ? sum : unit.totalArea;
}
```

- [ ] **Step 3: Add expand state and detail labels**

Inside the `InventoryTable` component, after the existing `useState` declarations, add:

```typescript
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const detailLabels = {
    groundFloor: useT("specGroundFloor", "Ground Floor"),
    upperFloor: useT("specUpperFloor", "Upper Floor"),
    attic: useT("specAttic", "Attic"),
    balcony: useT("specBalcony", "Balcony"),
    roofTerrace: useT("specRoofTerrace", "Roof Terrace"),
    outdoorArea: useT("specOutdoorArea", "Outdoor Area"),
    propertySize: useT("specPropertySize", "Property Size"),
    bathrooms: useT("specBathrooms", "Bathrooms"),
    pool: useT("specPool", "Pool"),
    parking: useT("specParking", "Parking"),
    yes: useT("specYes", "Yes"),
    no: useT("specNo", "No"),
  };

  const builtAreaLabel = useT("specBuiltArea", "Built Area");
```

- [ ] **Step 4: Update desktop table header — replace "Total Area" with "Built Area"**

In the desktop `<thead>`, change the "Total Area" header. Find:

```typescript
                  <th
                    scope="col"
                    className="cursor-pointer pb-3 px-4 transition-colors hover:text-[var(--color-deep-teal)]"
                    onClick={() => handleSort("area")}
                  >
                    {lbl.tableTotalArea}{sortIndicator("area")}
                  </th>
```

Replace with:

```typescript
                  <th
                    scope="col"
                    className="cursor-pointer pb-3 px-4 transition-colors hover:text-[var(--color-deep-teal)]"
                    onClick={() => handleSort("area")}
                  >
                    {builtAreaLabel}{sortIndicator("area")}
                  </th>
```

- [ ] **Step 5: Update sort logic to use builtArea**

In the `sorted` useMemo, update the area sort to use built area. Replace:

```typescript
        cmp = a.totalArea - b.totalArea;
```

With:

```typescript
        cmp = getBuiltArea(a) - getBuiltArea(b);
```

Note: The price sort stays unchanged (`computePriceFrom(a.totalArea) - computePriceFrom(b.totalArea)`) since pricing uses property size.

- [ ] **Step 6: Update desktop table rows — add click handler, chevron, built area, and expandable panel**

Replace the desktop `<tbody>` section. Find the existing `{sorted.map((unit, index) => (` block inside the desktop table `<tbody>` and replace the entire map callback:

```typescript
                {sorted.map((unit, index) => {
                  const isExpanded = expandedId === unit._id;
                  const builtArea = getBuiltArea(unit);
                  return (
                    <React.Fragment key={unit._id}>
                      <tr
                        className={cn(
                          "cursor-pointer transition-colors hover:bg-[rgba(13,103,119,0.03)]",
                          isExpanded && "bg-[rgba(13,103,119,0.03)]"
                        )}
                        style={{ borderBottom: isExpanded ? "none" : index === sorted.length - 1 ? "none" : "1px solid rgba(13,103,119,0.08)" }}
                        onClick={() => setExpandedId(isExpanded ? null : unit._id)}
                      >
                        <td className="py-4 pr-4 font-medium">
                          {getPlotLetter(unit.plotName)}
                        </td>
                        <td className="px-4 py-4">{unit.unitNumber}</td>
                        <td className="px-4 py-4">
                          <Link
                            href={`/${locale}/villas/${unit.villaTypeSlug}`}
                            className="text-[var(--color-deep-teal)] underline decoration-[var(--color-deep-teal)]/30 underline-offset-2 transition-colors hover:text-[var(--color-ink)]"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {unit.villaTypeName}
                          </Link>
                        </td>
                        <td className="px-4 py-4">{unit.bedrooms}</td>
                        <td className="px-4 py-4">{builtArea} m&sup2;</td>
                        <td className="px-4 py-4 font-semibold text-[var(--color-deep-teal)]">
                          {formatPriceFrom(unit.totalArea, fromLabel)}
                        </td>
                        <td className="pl-4 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <StatusBadge status={unit.status} labelAvailable={statusAvailable} labelReserved={statusReserved} labelSold={statusSold} />
                            <ChevronDown
                              className={cn(
                                "h-4 w-4 text-[var(--color-muted)] transition-transform duration-200",
                                isExpanded && "rotate-180"
                              )}
                            />
                          </div>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr>
                          <td colSpan={7} className="bg-[var(--color-sand)]/30" style={{ borderBottom: index === sorted.length - 1 ? "none" : "1px solid rgba(13,103,119,0.08)" }}>
                            <UnitDetailPanel
                              groundFloor={unit.groundFloor}
                              upperFloor={unit.upperFloor}
                              attic={unit.attic}
                              balcony={unit.balcony}
                              roofTerrace={unit.roofTerrace}
                              outdoorArea={unit.outdoorArea}
                              propertySize={unit.totalArea}
                              bathrooms={unit.bathrooms}
                              hasPool={unit.hasPool}
                              hasParking={unit.hasParking}
                              labels={detailLabels}
                            />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
```

Add `import React from "react";` at the top if not already imported (check — it may already be there from the `useState` import).

- [ ] **Step 7: Update mobile cards — add expand toggle and detail panel**

Replace the mobile card list section. Find `<div className="grid gap-3 md:hidden">` and replace the entire block:

```typescript
          <div className="grid gap-3 md:hidden">
            {sorted.map((unit) => {
              const isExpanded = expandedId === unit._id;
              const builtArea = getBuiltArea(unit);
              return (
                <div
                  key={unit._id}
                  className="rounded-xl border border-[rgba(13,103,119,0.08)] bg-white/80 overflow-hidden"
                >
                  <div
                    className="flex items-start justify-between p-4 cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : unit._id)}
                  >
                    <div>
                      <p className="text-sm font-semibold text-[var(--color-ink)]">
                        {lbl.tablePlot} {getPlotLetter(unit.plotName)} &middot; #{unit.unitNumber}
                      </p>
                      <Link
                        href={`/${locale}/villas/${unit.villaTypeSlug}`}
                        className="text-xs text-[var(--color-deep-teal)] underline decoration-[var(--color-deep-teal)]/30 underline-offset-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {unit.villaTypeName}
                      </Link>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--color-muted)]">
                        <span>{unit.bedrooms} {unit.bedrooms !== 1 ? bedsLabel : bedLabel}</span>
                        <span>{builtArea} m&sup2;</span>
                        <span className="font-medium text-[var(--color-deep-teal)]">
                          {formatPriceFrom(unit.totalArea, fromLabel)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={unit.status} labelAvailable={statusAvailable} labelReserved={statusReserved} labelSold={statusSold} />
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 text-[var(--color-muted)] transition-transform duration-200",
                          isExpanded && "rotate-180"
                        )}
                      />
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="border-t border-[rgba(13,103,119,0.08)] bg-[var(--color-sand)]/30">
                      <UnitDetailPanel
                        groundFloor={unit.groundFloor}
                        upperFloor={unit.upperFloor}
                        attic={unit.attic}
                        balcony={unit.balcony}
                        roofTerrace={unit.roofTerrace}
                        outdoorArea={unit.outdoorArea}
                        propertySize={unit.totalArea}
                        bathrooms={unit.bathrooms}
                        hasPool={unit.hasPool}
                        hasParking={unit.hasParking}
                        labels={detailLabels}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
```

- [ ] **Step 8: Verify build**

Run: `npx next build --no-lint 2>&1 | head -30`

- [ ] **Step 9: Commit**

```bash
git add components/masterplan/inventory-table.tsx
git commit -m "feat: add expandable detail rows to masterplan inventory table"
```

---

### Task 6: Add "View Full Inventory" Link to Villa Units Table

**Files:**
- Modify: `components/villa-detail/units-table.tsx`

- [ ] **Step 1: Add props for link**

In `units-table.tsx`, extend `UnitsTableProps`:

```typescript
type UnitsTableProps = {
  units: UnitWithRefs[];
  locale: Locale;
  villaSlug?: string;
  labelViewInventory?: string;
  headerUnit?: string;
  headerPlot?: string;
  headerArea?: string;
  headerBeds?: string;
  headerPool?: string;
  headerStatus?: string;
  labelStatusAvailable?: string;
  labelStatusReserved?: string;
  labelStatusSold?: string;
};
```

Update the destructuring in the function signature to include `villaSlug` and `labelViewInventory`.

- [ ] **Step 2: Add Link import and render link after the table**

Add import at the top:

```typescript
import Link from "next/link";
```

After the closing `</div>` of the mobile card layout (before the final `</div>` of the component), add:

```typescript
      {villaSlug && (
        <div className="mt-6 text-center">
          <Link
            href={`/${locale}/masterplan?type=${villaSlug}`}
            className="text-sm font-medium text-[var(--color-deep-teal)] underline decoration-[var(--color-deep-teal)]/30 underline-offset-4 transition-colors hover:text-[var(--color-ink)]"
          >
            {labelViewInventory || "View full inventory"} →
          </Link>
        </div>
      )}
```

- [ ] **Step 3: Pass villaSlug from villa detail page**

In `app/[locale]/villas/[slug]/page.tsx`, find the `<UnitsTable` usage (~line 288) and add the `villaSlug` prop:

```typescript
          <UnitsTable
            units={units}
            locale={typedLocale}
            villaSlug={slug}
            headerUnit={labelUnitNumber}
            ...
```

Also add a UI string for the link label. After `labelStatus` declarations (~line 162), add:

```typescript
  const labelViewInventory = t(uiStrings?.ctaViewAll) ?? "View full inventory";
```

And pass it: `labelViewInventory={labelViewInventory}`.

- [ ] **Step 4: Commit**

```bash
git add components/villa-detail/units-table.tsx app/[locale]/villas/[slug]/page.tsx
git commit -m "feat: add 'view full inventory' link to villa units table"
```

---

### Task 7: Accept ?type= Filter on Masterplan Page

**Files:**
- Modify: `app/[locale]/masterplan/page.tsx`
- Modify: `components/masterplan/inventory-table.tsx`

- [ ] **Step 1: Read searchParams in masterplan page**

In `app/[locale]/masterplan/page.tsx`, update the `Props` type:

```typescript
type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string }>;
};
```

Update the function signature and destructure:

```typescript
export default async function MasterplanPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { type: initialTypeFilter } = await searchParams;
```

- [ ] **Step 2: Pass initialTypeFilter to InventoryTable**

Find `<InventoryTable` and add the prop:

```typescript
            <InventoryTable
              units={units}
              locale={typedLocale}
              labels={inventoryLabels}
              initialTypeFilter={initialTypeFilter}
            />
```

- [ ] **Step 3: Accept initialTypeFilter in InventoryTable**

In `components/masterplan/inventory-table.tsx`, add to props type:

```typescript
type InventoryTableProps = {
  units: UnitFlat[];
  locale: Locale;
  labels?: InventoryTableLabels;
  initialTypeFilter?: string;
};
```

Update destructuring:

```typescript
export function InventoryTable({ units, locale, labels, initialTypeFilter }: InventoryTableProps) {
```

Change the `villaTypeFilter` initial state:

```typescript
  const [villaTypeFilter, setVillaTypeFilter] = useState<string>(initialTypeFilter || "All");
```

- [ ] **Step 4: Commit**

```bash
git add app/[locale]/masterplan/page.tsx components/masterplan/inventory-table.tsx
git commit -m "feat: support ?type= filter param on masterplan page"
```

---

### Task 8: Pass Detail Labels from Masterplan Page

**Files:**
- Modify: `app/[locale]/masterplan/page.tsx:149-166` (inventoryLabels)

- [ ] **Step 1: Add detail labels to inventoryLabels**

The `UnitDetailPanel` labels are consumed via `useT` inside the inventory table component, so they come from the `UiStringsProvider` context already in the layout. No extra prop passing is needed — the `useT` calls in Task 5 Step 3 handle this.

However, we need to add the new `specBuiltArea` label to the existing `inventoryLabels` for the column header. Add to the `inventoryLabels` object:

```typescript
  const inventoryLabels = {
    ...existing labels...,
    tableBuiltArea: t(uiStrings?.specBuiltArea) ?? "",
  };
```

Update the `InventoryTableLabels` type in `inventory-table.tsx` to include:

```typescript
  tableBuiltArea?: string;
```

And update the `lbl` object:

```typescript
    tableBuiltArea: labels?.tableBuiltArea || "Built Area",
```

Replace the usage of `builtAreaLabel` (from Task 5 Step 4) with `lbl.tableBuiltArea` so the label comes from the page props rather than `useT` (keeping consistency with how other table headers work).

- [ ] **Step 2: Commit**

```bash
git add app/[locale]/masterplan/page.tsx components/masterplan/inventory-table.tsx
git commit -m "feat: pass built area label to inventory table"
```

---

### Task 9: Update Seed Data (Mikka→Mika, D4/D5 Bedrooms)

**Files:**
- Modify: `sanity/seed/seed-data.ts:98-114` (villa-mikka definition)
- Modify: `sanity/seed/seed-data.ts:324-325` (D4, D5 units)

- [ ] **Step 1: Rename Mikka to Mika in seed data**

In `sanity/seed/seed-data.ts`, find the `villa-mikka` entry and update:

```typescript
  {
    _id: "villa-mika",
    _type: "villa",
    name: "Mika",
    slug: { _type: "slug", current: "mika" },
    typicalBedrooms: 1,
    typicalBathrooms: 1,
    areaRange: "59-63",
    sortOrder: 2,
    label: { en: "The Cozy Apartment", he: "הדירה הנעימה", ru: "Уютная квартира", el: "Το Άνετο Διαμέρισμα" },
    summary: {
      en: "Upper floor apartment with roof terrace and balcony. Sea and mountain views.",
      he: "דירת קומה עליונה עם מרפסת גג",
      ru: "Квартира на верхнем этаже с террасой на крыше",
      el: "Διαμέρισμα ορόφου με βεράντα στην οροφή",
    },
  },
```

- [ ] **Step 2: Update all unit references from villa-mikka to villa-mika**

Find all `ref("villa-mikka")` and replace with `ref("villa-mika")` (lines ~333-349 in the units array for E6-E10 and F6-F10).

- [ ] **Step 3: Fix D4 and D5 bedrooms**

Find the D4 and D5 unit entries and change `bedrooms: 2` to `bedrooms: 3`:

```typescript
  { _id: "unit-d4", _type: "unit", unitNumber: "D4", plot: ref("plot-d"), villaType: ref("villa-michal"), status: "available", totalArea: 133.00, outdoorArea: 70.69,  bedrooms: 3, bathrooms: 2, hasPool: true,  hasParking: true },
  { _id: "unit-d5", _type: "unit", unitNumber: "D5", plot: ref("plot-d"), villaType: ref("villa-michal"), status: "available", totalArea: 160.05, outdoorArea: 97.74,  bedrooms: 3, bathrooms: 2, hasPool: true,  hasParking: true },
```

- [ ] **Step 4: Commit**

```bash
git add sanity/seed/seed-data.ts
git commit -m "fix: rename Mikka→Mika, fix D4/D5 bedrooms to 3"
```

---

### Task 10: Create Migration Script

**Files:**
- Create: `sanity/seed/migrate-unit-details.ts`

This script reads the Excel MASTER tab and patches each unit in Sanity with floor breakdown fields.

- [ ] **Step 1: Install xlsx dependency**

Run: `npm install --save-dev xlsx`

- [ ] **Step 2: Create migration script**

```typescript
/**
 * One-time migration: populate unit floor breakdowns from Excel MASTER tab.
 * Also renames Mikka→Mika and fixes D4/D5 bedrooms.
 *
 * Run: npx tsx sanity/seed/migrate-unit-details.ts
 */

import { createClient } from "@sanity/client";
import * as XLSX from "xlsx";
import fs from "fs";
import path from "path";

// ---------------------------------------------------------------------------
// 1. Load env
// ---------------------------------------------------------------------------

function loadEnv(): Record<string, string> {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) {
    throw new Error(`.env.local not found at ${envPath}`);
  }
  const raw = fs.readFileSync(envPath, "utf-8");
  const vars: Record<string, string> = {};
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
    vars[key] = value;
  }
  return vars;
}

const env = loadEnv();
const projectId = env["NEXT_PUBLIC_SANITY_PROJECT_ID"];
const dataset = env["NEXT_PUBLIC_SANITY_DATASET"] ?? "production";
const token = env["SANITY_WRITE_TOKEN"];

if (!projectId || !token) {
  throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_WRITE_TOKEN in .env.local");
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-01-01",
  useCdn: false,
});

// ---------------------------------------------------------------------------
// 2. Read Excel
// ---------------------------------------------------------------------------

const EXCEL_PATH = path.resolve(
  process.env.HOME || "~",
  "Downloads/YAIR villa_system_22_03_26.xlsx"
);

if (!fs.existsSync(EXCEL_PATH)) {
  throw new Error(`Excel file not found at ${EXCEL_PATH}`);
}

const wb = XLSX.readFile(EXCEL_PATH);
const ws = wb.Sheets["MASTER"];
if (!ws) throw new Error("MASTER sheet not found in Excel");

const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { header: 1 }) as unknown[][];

// Find header row (contains "Villa ID")
let headerIdx = -1;
for (let i = 0; i < rows.length; i++) {
  const row = rows[i] as string[];
  if (row && row.some((cell) => String(cell).includes("Villa ID"))) {
    headerIdx = i;
    break;
  }
}

if (headerIdx === -1) throw new Error("Could not find header row in MASTER sheet");

const headers = (rows[headerIdx] as string[]).map((h) => String(h).trim());
const dataRows = rows.slice(headerIdx + 1).filter((row) => {
  const r = row as unknown[];
  return r[0] && r[1]; // has Plot and Villa ID
});

// Column indices
const col = (name: string) => headers.indexOf(name);
const COL_PLOT = col("Plot");
const COL_ID = col("Villa ID");
const COL_GROUND = col("ground floor");
const COL_FIRST = col("first floor");
const COL_SECOND = col("second floor");
const COL_BALCONY = col("Balcony m²");
const COL_ROOF = col("Roof terassa m²");
const COL_BEDROOMS = col("Bedrooms");

console.log("Column mapping:", { COL_PLOT, COL_ID, COL_GROUND, COL_FIRST, COL_SECOND, COL_BALCONY, COL_ROOF, COL_BEDROOMS });

// ---------------------------------------------------------------------------
// 3. Build patches
// ---------------------------------------------------------------------------

type Patch = {
  unitId: string;
  fields: Record<string, number | undefined>;
};

const patches: Patch[] = [];

for (const row of dataRows) {
  const r = row as unknown[];
  const villaId = String(r[COL_ID]).trim(); // e.g. "A1", "B2"
  if (!villaId || villaId === "undefined") continue;

  const unitId = `unit-${villaId.toLowerCase()}`; // e.g. "unit-a1"

  const num = (idx: number): number | undefined => {
    const val = Number(r[idx]);
    return isNaN(val) || val === 0 ? undefined : Math.round(val * 100) / 100;
  };

  const fields: Record<string, number | undefined> = {
    groundFloor: num(COL_GROUND),
    upperFloor: num(COL_FIRST),
    attic: num(COL_SECOND),
    balcony: num(COL_BALCONY),
    roofTerrace: num(COL_ROOF),
  };

  // Fix D4/D5 bedrooms
  if (villaId === "D4" || villaId === "D5") {
    (fields as Record<string, number | undefined>).bedrooms = 3;
  }

  patches.push({ unitId, fields });
}

console.log(`\nFound ${patches.length} units to patch.\n`);

// ---------------------------------------------------------------------------
// 4. Apply patches
// ---------------------------------------------------------------------------

async function run() {
  // Patch units
  for (const { unitId, fields } of patches) {
    // Remove undefined values
    const cleanFields: Record<string, number> = {};
    for (const [k, v] of Object.entries(fields)) {
      if (v !== undefined) cleanFields[k] = v;
    }

    if (Object.keys(cleanFields).length === 0) {
      console.log(`  ⏭ ${unitId} — no fields to update`);
      continue;
    }

    try {
      // Try published doc first, then draft
      try {
        await client.patch(unitId).set(cleanFields).commit();
        console.log(`  ✓ ${unitId} (published)`, cleanFields);
      } catch {
        await client.patch(`drafts.${unitId}`).set(cleanFields).commit();
        console.log(`  ✓ ${unitId} (draft)`, cleanFields);
      }
    } catch (err) {
      console.error(`  ✗ ${unitId}`, err);
    }
  }

  // Rename Mikka → Mika
  console.log("\nRenaming Mikka → Mika...");
  const mikaFields = { name: "Mika", slug: { _type: "slug", current: "mika" } };
  try {
    await client.patch("villa-mikka").set(mikaFields).commit();
    console.log("  ✓ villa-mikka → Mika (published)");
  } catch {
    try {
      await client.patch("drafts.villa-mikka").set(mikaFields).commit();
      console.log("  ✓ villa-mikka → Mika (draft)");
    } catch (err) {
      console.error("  ✗ rename failed:", err);
    }
  }

  console.log("\nDone!");
}

run().catch(console.error);
```

- [ ] **Step 3: Run the migration**

Run: `npx tsx sanity/seed/migrate-unit-details.ts`
Expected: Each unit prints `✓` with the patched fields.

- [ ] **Step 4: Verify in Sanity Studio**

Open Sanity Studio and check a few units (A1, B1, E6) to confirm floor fields are populated.

- [ ] **Step 5: Commit**

```bash
git add sanity/seed/migrate-unit-details.ts package.json package-lock.json
git commit -m "feat: add migration script for unit floor breakdowns"
```

---

### Task 11: Populate UI Strings in Sanity

**Files:** No code changes — manual Sanity Studio updates via the migration script extension or manual entry.

- [ ] **Step 1: Add UI strings to the seed data or manually in Studio**

Add these localized values to the uiStrings document in Sanity Studio:

| Field | EN | HE | RU | EL |
|-------|----|----|----|----|
| specGroundFloor | Ground Floor | קומת קרקע | Первый этаж | Ισόγειο |
| specUpperFloor | Upper Floor | קומה עליונה | Верхний этаж | Όροφος |
| specAttic | Attic | עליית גג | Мансарда | Σοφίτα |
| specBalcony | Balcony | מרפסת | Балкон | Μπαλκόνι |
| specRoofTerrace | Roof Terrace | מרפסת גג | Терраса на крыше | Βεράντα οροφής |
| specPropertySize | Property Size | שטח הנכס | Площадь собственности | Μέγεθος ακινήτου |
| specBuiltArea | Built Area | שטח בנוי | Площадь застройки | Δομημένη επιφάνεια |

These can be entered manually in Sanity Studio → UI Strings → Specs group, or appended to the seed-data script's UI strings section.

- [ ] **Step 2: Done**

No commit needed for manual Studio edits.

---

### Task 12: Final Verification

- [ ] **Step 1: Build the project**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 2: Run dev server and test**

Run: `npm run dev`

Test checklist:
1. Go to `/en/masterplan` — inventory table loads with "Built Area" column
2. Click a row — detail panel expands with floor breakdown
3. Click another row — first collapses, second expands (accordion)
4. Mobile view — cards have expand toggle
5. Fields with 0/null are hidden (e.g., Lola has no upper floor)
6. Go to `/en/villas/tai` — "View full inventory →" link appears
7. Click it — navigates to `/en/masterplan?type=tai` — table pre-filtered to Tai
8. Mika name appears correctly (not Mikka)

- [ ] **Step 3: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix: final adjustments for unit detail breakdowns"
```
