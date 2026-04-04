# Unit Detail Breakdowns — Design Spec

## Goal

Show detailed per-unit area breakdowns (ground floor, upper floor, attic, balcony, roof terrace) on the website, matching the data from the investor presentation PDF. The audience is investors who want full data access.

## Data Source

- **Source of truth:** Sanity Studio (manual edits)
- **Initial population:** One-time migration script using data from `YAIR villa_system_22_03_26.xlsx` MASTER tab
- **Fields to add per unit:** `groundFloor`, `upperFloor`, `attic`, `balcony`, `roofTerrace` (all in m², all optional — schema already supports them)

## Data Fixes (apply during migration)

| Fix | Details |
|-----|---------|
| Rename Mikka → Mika | Villa name, slug `mikka` → `mika`, all references |
| D4 bedrooms | 2 → 3 |
| D5 bedrooms | 2 → 3 |
| Statuses confirmed | A1=sold, E3=sold, F1=sold, D5=available (match current seed except D4/D5 bedrooms) |

## Architecture

### Information Hierarchy

1. **Villa detail page** (`/villas/[slug]`) — product showcase. Units table stays compact (Unit#, Plot, Area, Beds, Pool, Status). Add a link "View full inventory →" that navigates to `/masterplan?type={slug}`.

2. **Masterplan inventory** (`/masterplan`) — investor data room. Expandable rows with full area breakdown. This is the primary place for detailed unit analysis.

3. **Residences comparison** (`/residences`) — villa-type comparison table. No unit-level changes needed.

### Expandable Row Design (Masterplan inventory-table.tsx)

Desktop — click a row to expand a detail panel below it:

```
┌───────────────────────────────────────────────────────────────────────┐
│ A │ A1 │ Yehonatan │ 5 │ 212.20 m² │ From €626K │ Sold         │ ▼ │
├───────────────────────────────────────────────────────────────────────┤
│                                                                       │
│   Ground Floor        89.12 m²    Balcony           27.75 m²         │
│   Upper Floor         92.81 m²    Roof Terrace       8.11 m²         │
│   Attic               30.09 m²    Outdoor Area     196.80 m²         │
│   Bathrooms           3           Property Size    285.92 m²         │
│   Pool                Yes         Parking            Yes              │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

Note: "Built Area" (212.20) is already visible in the main row — no need to repeat in the panel.

Mobile — card expands inline with the same data stacked:

```
┌────────────────────────────────┐
│ Plot A · #A1                   │
│ Yehonatan              Sold    │
│ 5 bed · 212.20 m² · From €626K│
│                          [ ▼ ] │
├────────────────────────────────┤
│ Ground Floor     89.12 m²      │
│ Upper Floor      92.81 m²      │
│ Attic            30.09 m²      │
│ Balcony          27.75 m²      │
│ Roof Terrace      8.11 m²      │
│ Outdoor Area    196.80 m²      │
│ Property Size   285.92 m²      │
│ Bathrooms        3              │
│ Pool             Yes            │
│ Parking          Yes            │
└────────────────────────────────┘
```

### Visual Treatment

- Expand/collapse: chevron icon rotates on toggle
- Expanded panel: slightly indented, light background `bg-[var(--color-sand)]/30`
- Smooth CSS transition (max-height or grid-rows animation)
- Only one row expanded at a time (accordion behavior)
- Fields with value 0 or null are hidden (e.g., Lola has no upper floor/attic)

## Changes Required

### 1. GROQ Queries (`lib/sanity/queries.ts`)

Add fields to three queries:

**`villaBySlugQuery`** — add to units projection:
```
groundFloor, upperFloor, attic, balcony, roofTerrace
```

**`allPlotsQuery`** — add to units projection:
```
groundFloor, upperFloor, attic, balcony, roofTerrace, outdoorArea, bathrooms, hasParking
```

**`allUnitsQuery`** — add:
```
groundFloor, upperFloor, attic, balcony, roofTerrace, outdoorArea
```

### 2. TypeScript Types (`lib/sanity/types.ts`)

Add optional fields to `UnitWithRefs`:
```typescript
groundFloor?: number;
upperFloor?: number;
attic?: number;
balcony?: number;
roofTerrace?: number;
```

Add to `UnitFlat`:
```typescript
groundFloor?: number;
upperFloor?: number;
attic?: number;
balcony?: number;
roofTerrace?: number;
outdoorArea?: number;
```

Add to `PlotWithUnits.units[]`:
```typescript
groundFloor?: number;
upperFloor?: number;
attic?: number;
balcony?: number;
roofTerrace?: number;
outdoorArea?: number;
bathrooms?: number;
hasParking?: boolean;
```

### 3. Shared Component: `UnitDetailPanel`

New file: `components/shared/unit-detail-panel.tsx`

Props:
```typescript
type UnitDetailPanelProps = {
  groundFloor?: number;
  upperFloor?: number;
  attic?: number;
  balcony?: number;
  roofTerrace?: number;
  outdoorArea?: number;
  propertySize?: number;  // totalArea field from Sanity (outdoor + built)
  bathrooms?: number;
  hasPool?: boolean;
  hasParking?: boolean;
};
```

Renders a 2-column grid of label/value pairs. Skips any field that is 0/null/undefined.

### 3b. Update inventory table "Area" column

The main table "Total Area" column changes to show **Built Area** (computed: `groundFloor + upperFloor + attic`). Falls back to `totalArea` if floor fields are not populated. Column header label changes from "Total Area" to "Built Area".

### 4. Update `inventory-table.tsx` (Masterplan)

- Add expand/collapse state per row
- On row click, toggle expanded state
- Render `<UnitDetailPanel>` below expanded row
- Accordion behavior: expanding one row collapses others
- Add chevron indicator to each row
- Pass new fields from query data

### 5. Update `units-table.tsx` (Villa Detail)

- Add a "View full inventory →" link below the table
- Link goes to `/masterplan?type={villaSlug}`
- No expandable rows here — keep it compact

### 6. Update Masterplan page to accept `?type=` filter

- Read `searchParams.type` in `/app/[locale]/masterplan/page.tsx`
- Pass to `InventoryTable` as `initialTypeFilter`
- On load, pre-filter to that villa type

### 7. Rename Mikka → Mika

- Sanity Studio: rename villa document name and slug
- Seed data: update for consistency
- No code changes needed (names come from CMS)

### 8. Migration Script

New file: `sanity/seed/migrate-unit-details.ts`

Reads data from Excel MASTER tab and updates each unit document in Sanity with:
- `groundFloor`, `upperFloor` (= "first floor" in Excel), `attic` (= "second floor"), `balcony`, `roofTerrace`
- Fix D4/D5 bedrooms to 3
- Uses `client.patch(id).set({...}).commit()`

Run once: `npx tsx sanity/seed/migrate-unit-details.ts`

### 9. UI Strings

Add localized labels to Sanity `uiStrings` (if not already present):
- `specGroundFloor`: Ground Floor / קומת קרקע / Первый этаж / Ισόγειο
- `specUpperFloor`: Upper Floor / קומה עליונה / Верхний этаж / Όροφος
- `specAttic`: Attic / עליית גג / Мансарда / Σοφίτα
- `specBalcony`: Balcony / מרפסת / Балкон / Μπαλκόνι
- `specRoofTerrace`: Roof Terrace / מרפסת גג / Терраса на крыше / Βεράντα οροφής
- `specPropertySize`: Property Size / שטח הנכס / Площадь собственности / Μέγεθος ακινήτου
- `specBuiltArea`: Built Area / שטח בנוי / Площадь застройки / Δομημένη επιφάνεια

## Terminology

The current `totalArea` field is ambiguous — it stores **property size** (outdoor + building), not built area. New display terminology:

| Term | Meaning | Source | Example (A1) |
|------|---------|--------|-------------|
| **Built Area** | Livable space: ground + upper + attic | Computed from floor fields | 212.20 m² |
| **Property Size** | Total unit territory: built + outdoor | Current `totalArea` field | 285.92 m² |
| **Outdoor Area** | Private garden/yard | Current `outdoorArea` field | 196.80 m² |

- **Main table column** shows **Built Area** (computed). More meaningful for investors.
- **Expandable detail panel** shows everything: Built Area, floor breakdown, Property Size, Outdoor Area.
- For Mika apartments (no outdoor area): Built Area = totalArea, so no visible change.
- The Sanity field `totalArea` keeps its name (no schema migration), but the UI label changes.

## Out of Scope

- Individual unit pages (`/units/[id]`) — future enhancement
- Price display changes (current formula stays)
- Gallery/image changes per unit
