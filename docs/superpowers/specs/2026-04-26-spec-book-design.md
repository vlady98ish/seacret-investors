# Spec Book Integration — Design Spec

## Goal

Integrate SPEC_BOOK data from the project Excel into the site as two features:
1. **"What's Included"** — base product specifications on the villa detail page
2. **Enhanced Upgrades** — priced extras with photos on the residences page

Both features must be CMS-editable (Sanity) so the client can manage content without code changes. The site supports 4 locales: en, he, ru, el.

---

## Data Layer

### New Sanity Schema: `specCategory`

A new document type for base product specifications.

```
specCategory (document)
├── name: localeString (required) — e.g. "Furniture", "Kitchen"
├── icon: string (select list) — maps to Lucide icon names
│   options: "sofa", "utensils-crossed", "palmtree", "car", "settings-2"
├── sortOrder: number (default 0)
└── items[]: array of objects
    ├── area: localeString — e.g. "Living Room", "Cabinets"
    ├── spec: localeString — e.g. "Sofa 3-4 seats, armchairs, coffee table"
    └── notes: localeString — e.g. "Core furnished living area"
```

**Groups**: general (name, icon, sortOrder), items (items array).

**Seed data**: 5 categories from SPEC_BOOK tab with English values. Hebrew category headers from the Excel used as `he` translations. Russian and Greek translations TBD by client.

### Extended Sanity Schema: `upgrade`

Add 3 fields to the existing `upgrade` document:

```
upgrade (existing document) — additions:
├── price: number (optional) — e.g. 6000
├── priceUnit: string (options: "item" | "meter", default "item")
└── priceNote: localeString (optional) — e.g. "excl. VAT"
```

No changes to existing fields (name, description, image, category, sortOrder).

**Seed data**: 9 extras from SPEC_BOOK with EUR prices. Fence uses priceUnit "meter".

---

## Villa Detail Page — "What's Included" Section

### Placement

After Gallery, before Floor Plans:

```
Hero → SpecsPanel → Gallery → ★ What's Included → Floor Plans → Pricing → Units → Related → Contact
```

### Component: `components/villa-detail/whats-included.tsx`

**Layout**: Split — left category navigation (280px) + right content panel.

**Left navigation**:
- Vertical stack of category buttons
- Each: icon in 44px rounded square + category name + item count
- Active state: white card background, shadow, teal icon fill
- Inactive: transparent bg, teal-tinted icon
- Mobile (< 900px): horizontal scroll row

**Right content panel**:
- Panel header: category name in Cinzel serif
- Items as 2-column grid rows (name | value + note)
- Dot markers for each item
- Footer note per category (contextual hint text)
- Fade-in animation on category switch

**Section styling**:
- Background: `var(--color-cream)` to visually separate from adjacent sections
- Top border: gradient line `rgba(26,107,110,0.15)`
- Eyebrow: "Product Specification"
- Heading: "What's Included" (needs localeString in uiStrings)

**Data source**: Fetches all `specCategory` documents via GROQ, sorted by `sortOrder`.

### New GROQ Query

```groq
*[_type == "specCategory"] | order(sortOrder asc) {
  _id,
  name,
  icon,
  sortOrder,
  items[] {
    area,
    spec,
    notes
  }
}
```

### New UI Strings (uiStrings schema)

- `specBookEyebrow`: localeString — "Product Specification"
- `specBookTitle`: localeString — "What's Included"
- `specBookSubtitle`: localeString — "Every villa comes fully equipped..."

---

## Residences Page — Enhanced Upgrades

### What Changes

Component `components/residences/upgrades-showcase.tsx` is refactored.

### Card Structure

```
┌─────────────────────┐
│  [photo]            │  image from Sanity (height: 220px, object-cover)
│                     │  fallback: icon in circle (existing behavior)
├─────────────────────┤
│  WELLNESS           │  category badge (uppercase, teal bg tint)
│  Jacuzzi            │  name (Cinzel serif)
│  Outdoor spa, 4...  │  description (2-line clamp)
│─────────────────────│
│  8,000 EUR    excl. │  price + unit + note
└─────────────────────┘
```

### Grid

Replace current flex-math layout:
```
Before: flex flex-wrap [&>*]:w-[calc(50%-0.75rem)] [&>*]:md:w-[calc(33.333%-1rem)]
After:  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
```

### Price Display

- Standard items: `{price.toLocaleString()} EUR` with "excl. VAT" note
- Per-meter items (fence): `{price} EUR / m`
- No price: card shows without price footer (backwards compatible)

### Category Badge Mapping

```
pool → "Outdoor Living"
jacuzzi → "Wellness"
sauna → "Wellness"
bbq → "Outdoor Living"
smart-house → "Technology"
security → "Security"
fireplace → "Interior"
```

This mapping lives in the component as a static object. Category badge is optional — only renders when category is set.

### Disclaimer Block

New element below the upgrade grid:
- Left border: 3px solid `var(--color-deep-teal)`
- Background: `rgba(26, 107, 110, 0.04)`
- Text: "Project: Chiliadou — All prices are indicative and exclude VAT at 24%."
- This text should come from a new `residencesPage` Sanity field or be hardcoded initially.

### Updated GROQ

Existing `allUpgradesQuery` needs to include the new fields:

```groq
*[_type == "upgrade"] | order(sortOrder asc) {
  _id,
  name,
  description,
  image,
  category,
  sortOrder,
  price,
  priceUnit,
  priceNote
}
```

### TypeScript Type Update

Add to `lib/sanity/types.ts`:

```ts
// Existing Upgrade type — add:
price?: number;
priceUnit?: "item" | "meter";
priceNote?: LocaleString;
```

New type:

```ts
type SpecCategory = {
  _id: string;
  name: LocaleString;
  icon: string;
  sortOrder: number;
  items: Array<{
    area: LocaleString;
    spec: LocaleString;
    notes: LocaleString;
  }>;
};
```

---

## Files Changed

### New Files
- `sanity/schemaTypes/specCategory.ts` — new Sanity schema
- `components/villa-detail/whats-included.tsx` — new component

### Modified Files
- `sanity/schemaTypes/index.ts` — register specCategory
- `sanity/schemaTypes/upgrade.ts` — add price, priceUnit, priceNote fields
- `lib/sanity/types.ts` — add SpecCategory type, extend Upgrade type
- `lib/sanity/queries.ts` — add specCategoriesQuery, update allUpgradesQuery
- `components/residences/upgrades-showcase.tsx` — refactor for photos + prices
- `app/[locale]/villas/[slug]/page.tsx` — add WhatsIncluded section after gallery
- `sanity/schemaTypes/uiStrings.ts` — add specBook labels

### Optional / Follow-up
- `sanity/seed/` — seed script for specCategory documents + upgrade prices
- Upload real upgrade photos to Sanity

---

## What We're NOT Doing

- No changes to the existing `SpecsPanel` component
- No changes to `villa` or `unit` schemas
- No new pages or routes
- No changes to other Residences page sections (filters, comparison, FAQ)
- No pricing logic changes (upgrade prices are display-only, not calculated)
