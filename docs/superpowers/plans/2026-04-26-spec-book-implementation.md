# Spec Book Integration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add "What's Included" specs section to villa detail pages and enhance the upgrades showcase on the residences page with photos and prices.

**Architecture:** New `specCategory` Sanity schema for base specs, extended `upgrade` schema with price fields. New `WhatsIncluded` component with split layout on villa detail page. Refactored `UpgradesShowcase` with photo cards and price display.

**Tech Stack:** Next.js App Router, Sanity CMS, Tailwind CSS, Lucide icons, TypeScript

**Spec:** `docs/superpowers/specs/2026-04-26-spec-book-design.md`

---

### Task 1: Sanity Schema — specCategory

**Files:**
- Create: `sanity/schemaTypes/specCategory.ts`
- Modify: `sanity/schemaTypes/index.ts`

- [ ] **Step 1: Create the specCategory schema**

```ts
// sanity/schemaTypes/specCategory.ts
import { defineField, defineType } from "sanity";
import { ComponentIcon } from "@sanity/icons";

export const specCategoryType = defineType({
  name: "specCategory",
  title: "Spec Category",
  type: "document",
  icon: ComponentIcon,
  groups: [
    { name: "general", title: "General", default: true },
    { name: "items", title: "Items" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "localeString",
      group: "general",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      group: "general",
      options: {
        list: [
          { title: "Sofa (Furniture)", value: "sofa" },
          { title: "Utensils (Kitchen)", value: "utensils-crossed" },
          { title: "Palmtree (Outdoor)", value: "palmtree" },
          { title: "Car (Parking)", value: "car" },
          { title: "Settings (Technical)", value: "settings-2" },
        ],
      },
      description: "Icon shown in the category navigation.",
    }),
    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      group: "general",
      initialValue: 0,
      description: "Lower numbers appear first.",
    }),
    defineField({
      name: "items",
      title: "Specification Items",
      type: "array",
      group: "items",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "area", title: "Area / Feature", type: "localeString" }),
            defineField({ name: "spec", title: "Specification", type: "localeString" }),
            defineField({ name: "notes", title: "Notes", type: "localeString" }),
          ],
          preview: {
            select: { title: "area.en", subtitle: "spec.en" },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: "name.en", subtitle: "icon" },
    prepare({ title, subtitle }) {
      return { title: title ?? "Untitled", subtitle: subtitle ?? "" };
    },
  },
  orderings: [
    { title: "Sort Order", name: "sortOrder", by: [{ field: "sortOrder", direction: "asc" }] },
  ],
});
```

- [ ] **Step 2: Register in schema index**

Add to `sanity/schemaTypes/index.ts`:

```ts
// Add import at top:
import { specCategoryType } from "./specCategory";

// Add to schemaTypes array, after upgradeType:
export const schemaTypes = [
  // ... existing entries ...
  upgradeType,
  specCategoryType,   // <-- add this line
  // ... rest ...
];
```

- [ ] **Step 3: Verify Studio loads**

Run: `npm run dev`

Open Sanity Studio at `/studio`. Verify "Spec Category" appears in the document list. Create a test document and delete it.

- [ ] **Step 4: Commit**

```bash
git add sanity/schemaTypes/specCategory.ts sanity/schemaTypes/index.ts
git commit -m "feat: add specCategory Sanity schema for base specifications"
```

---

### Task 2: Extend upgrade schema with price fields

**Files:**
- Modify: `sanity/schemaTypes/upgrade.ts`

- [ ] **Step 1: Add price fields to upgrade schema**

Add 3 new fields after the existing `category` field in `sanity/schemaTypes/upgrade.ts`:

```ts
    defineField({
      name: "price",
      title: "Price (EUR)",
      type: "number",
      description: "Price in EUR, excluding VAT. Leave empty if pricing is not public.",
    }),
    defineField({
      name: "priceUnit",
      title: "Price Unit",
      type: "string",
      options: {
        list: [
          { title: "Per item", value: "item" },
          { title: "Per meter", value: "meter" },
        ],
        layout: "radio",
      },
      initialValue: "item",
      hidden: ({ document }) => !document?.price,
    }),
    defineField({
      name: "priceNote",
      title: "Price Note",
      type: "localeString",
      description: 'Short note under the price, e.g. "excl. VAT".',
      hidden: ({ document }) => !document?.price,
    }),
```

- [ ] **Step 2: Verify Studio loads**

Run: `npm run dev`

Open Studio → Upgrades → edit any upgrade. Verify price, priceUnit, and priceNote fields appear. Enter a price and confirm priceUnit/priceNote become visible.

- [ ] **Step 3: Commit**

```bash
git add sanity/schemaTypes/upgrade.ts
git commit -m "feat: add price fields to upgrade schema"
```

---

### Task 3: TypeScript types and GROQ queries

**Files:**
- Modify: `lib/sanity/types.ts`
- Modify: `lib/sanity/queries.ts`

- [ ] **Step 1: Add SpecCategory type and extend Upgrade type**

Add at the end of `lib/sanity/types.ts`, before the closing (after the `Experience` interface):

```ts
export interface SpecCategory {
  _id: string;
  name: LocalizedString;
  icon: string;
  sortOrder: number;
  items: Array<{
    area: LocalizedString;
    spec: LocalizedString;
    notes: LocalizedString;
  }>;
}
```

Extend the existing `Upgrade` interface — add 3 fields after `sortOrder`:

```ts
export interface Upgrade {
  _id: string;
  name: LocalizedString;
  description: LocalizedText;
  image: SanityImage;
  category: string;
  sortOrder: number;
  price?: number;
  priceUnit?: "item" | "meter";
  priceNote?: LocalizedString;
}
```

- [ ] **Step 2: Add specCategoriesQuery and update allUpgradesQuery**

In `lib/sanity/queries.ts`:

Add new query:

```ts
export const specCategoriesQuery = groq`*[_type == "specCategory"] | order(sortOrder asc) {
  _id,
  name,
  icon,
  sortOrder,
  items[] {
    area,
    spec,
    notes
  }
}`;
```

Update the existing `allUpgradesQuery` to include new fields:

```ts
export const allUpgradesQuery = groq`*[_type == "upgrade"] | order(sortOrder asc) {
  _id,
  name,
  description,
  image,
  category,
  sortOrder,
  price,
  priceUnit,
  priceNote
}`;
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add lib/sanity/types.ts lib/sanity/queries.ts
git commit -m "feat: add SpecCategory type and upgrade price fields to queries"
```

---

### Task 4: Add uiStrings labels for spec book

**Files:**
- Modify: `sanity/schemaTypes/uiStrings.ts`
- Modify: `lib/sanity/types.ts` (UiStrings interface)

- [ ] **Step 1: Add fields to uiStrings schema**

In `sanity/schemaTypes/uiStrings.ts`, add 3 new fields in the appropriate section (after the existing "Specs" group or at the end):

```ts
    // Spec Book
    defineField({ name: "specBookEyebrow", title: "Spec Book Eyebrow", type: "localeString" }),
    defineField({ name: "specBookTitle", title: "Spec Book Title", type: "localeString" }),
    defineField({ name: "specBookSubtitle", title: "Spec Book Subtitle", type: "localeString" }),
```

- [ ] **Step 2: Update UiStrings interface**

In `lib/sanity/types.ts`, add to the `UiStrings` interface (after the `// Misc` section):

```ts
  // Spec Book
  specBookEyebrow: LocalizedString;
  specBookTitle: LocalizedString;
  specBookSubtitle: LocalizedString;
```

- [ ] **Step 3: Commit**

```bash
git add sanity/schemaTypes/uiStrings.ts lib/sanity/types.ts
git commit -m "feat: add spec book UI string labels"
```

---

### Task 5: WhatsIncluded component

**Files:**
- Create: `components/villa-detail/whats-included.tsx`

- [ ] **Step 1: Create the component**

```tsx
// components/villa-detail/whats-included.tsx
"use client";

import { useState } from "react";
import { Car, Palmtree, Settings2, Sofa, UtensilsCrossed } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { getLocalizedValue, type Locale } from "@/lib/i18n";
import type { SpecCategory } from "@/lib/sanity/types";

type WhatsIncludedProps = {
  categories: SpecCategory[];
  locale: Locale;
  labelEyebrow?: string;
  labelTitle?: string;
  labelSubtitle?: string;
};

const ICON_MAP: Record<string, LucideIcon> = {
  sofa: Sofa,
  "utensils-crossed": UtensilsCrossed,
  palmtree: Palmtree,
  car: Car,
  "settings-2": Settings2,
};

export function WhatsIncluded({
  categories,
  locale,
  labelEyebrow,
  labelTitle,
  labelSubtitle,
}: WhatsIncludedProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!categories.length) return null;

  const active = categories[activeIndex];
  const activeName = getLocalizedValue(active.name, locale) ?? "";

  return (
    <section className="bg-[var(--color-cream)] py-20 lg:py-28 relative">
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(26,107,110,0.15), transparent)",
        }}
      />
      <div className="section-shell">
        <p className="eyebrow">
          {labelEyebrow || "Product Specification"}
        </p>
        <h2 className="text-h2 mt-3">{labelTitle || "What's Included"}</h2>
        {labelSubtitle && (
          <p className="text-body-muted mt-2 max-w-[45ch]">{labelSubtitle}</p>
        )}

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-[280px_1fr] md:gap-12">
          {/* Left nav */}
          <nav className="flex gap-2 overflow-x-auto md:flex-col md:gap-1.5">
            {categories.map((cat, i) => {
              const Icon = ICON_MAP[cat.icon] ?? Settings2;
              const name = getLocalizedValue(cat.name, locale) ?? "";
              const isActive = i === activeIndex;

              return (
                <button
                  key={cat._id}
                  onClick={() => setActiveIndex(i)}
                  className={`flex items-center gap-4 rounded-lg border px-4 py-3.5 text-left transition-all duration-200 md:w-full ${
                    isActive
                      ? "border-[rgba(13,103,119,0.08)] bg-[rgba(255,250,241,0.95)] shadow-[var(--shadow-soft)]"
                      : "border-transparent bg-transparent hover:bg-[rgba(255,250,241,0.6)]"
                  }`}
                >
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors duration-200 ${
                      isActive
                        ? "bg-[var(--color-deep-teal)] text-white"
                        : "bg-[rgba(26,107,110,0.08)] text-[var(--color-deep-teal)]"
                    }`}
                  >
                    <Icon className="h-[22px] w-[22px]" strokeWidth={1.5} />
                  </span>
                  <span className="hidden md:block">
                    <span className="block text-[0.95rem] font-semibold text-[var(--color-ink)]">
                      {name}
                    </span>
                    <span className="block text-xs text-[var(--color-muted)]">
                      {cat.items?.length ?? 0} items
                    </span>
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Right content */}
          <div key={active._id} className="animate-fade-in">
            <h3 className="text-h3 mb-6 border-b-2 border-[rgba(26,107,110,0.1)] pb-4">
              {activeName}
            </h3>
            <div className="flex flex-col">
              {(active.items ?? []).map((item, j) => {
                const area = getLocalizedValue(item.area, locale) ?? "";
                const spec = getLocalizedValue(item.spec, locale) ?? "";
                const notes = getLocalizedValue(item.notes, locale) ?? "";

                return (
                  <div
                    key={j}
                    className="grid grid-cols-[1fr_1.4fr] gap-8 border-b border-[rgba(13,103,119,0.05)] py-3.5 last:border-b-0"
                  >
                    <div className="flex items-baseline gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-deep-teal)] opacity-50" />
                      <span className="text-[0.95rem] font-semibold text-[var(--color-ink)]">
                        {area}
                      </span>
                    </div>
                    <div>
                      <p className="text-[0.95rem] text-[var(--color-ink)]">
                        {spec}
                      </p>
                      {notes && (
                        <p className="mt-0.5 text-[0.8rem] italic text-[var(--color-muted)]">
                          {notes}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/villa-detail/whats-included.tsx
git commit -m "feat: add WhatsIncluded split-layout component"
```

---

### Task 6: Wire WhatsIncluded into villa detail page

**Files:**
- Modify: `app/[locale]/villas/[slug]/page.tsx`

- [ ] **Step 1: Add imports and data fetching**

At the top of the file, add imports:

```ts
import { WhatsIncluded } from "@/components/villa-detail/whats-included";
import { specCategoriesQuery } from "@/lib/sanity/queries";
import type { SpecCategory } from "@/lib/sanity/types";
```

In the `fetchData` function, add `specCategories` to the return type and fetch:

```ts
// Add to return type:
async function fetchData(slug: string): Promise<{
  villa: VillaWithUnits | null;
  allVillas: Villa[];
  uiStrings: UiStrings | null;
  siteSettings: SiteSettings | null;
  specCategories: SpecCategory[];
}> {
```

Add `specCategories` variable and fetch it in the Promise.all:

```ts
  let specCategories: SpecCategory[] = [];

  // Inside the try block, add to Promise.all:
  const [villaResult, villasResult, uiStringsResult, settingsResult, specResult] = await Promise.all([
    sanityClient.fetch<VillaWithUnits | null>(villaBySlugQuery, { slug }),
    sanityClient.fetch<Villa[]>(allVillasQuery),
    sanityClient.fetch<UiStrings>(uiStringsQuery),
    getSiteSettings(),
    sanityClient.fetch<SpecCategory[]>(specCategoriesQuery),
  ]);
  // ... existing assignments ...
  if (specResult?.length) specCategories = specResult;

  return { villa, allVillas, uiStrings, siteSettings, specCategories };
```

- [ ] **Step 2: Add labels and render the component**

In the component body, destructure `specCategories`:

```ts
  const { villa, allVillas, uiStrings, siteSettings, specCategories } = await fetchData(slug);
```

Add label extraction (after existing label extractions):

```ts
  const labelSpecBookEyebrow = t(uiStrings?.specBookEyebrow) ?? "";
  const labelSpecBookTitle = t(uiStrings?.specBookTitle) ?? "";
  const labelSpecBookSubtitle = t(uiStrings?.specBookSubtitle) ?? "";
```

In the JSX, add the WhatsIncluded section **after the Gallery section** and **before the Floor Plans section**:

```tsx
      {/* What's Included */}
      {specCategories.length > 0 && (
        <WhatsIncluded
          categories={specCategories}
          locale={typedLocale}
          labelEyebrow={labelSpecBookEyebrow}
          labelTitle={labelSpecBookTitle}
          labelSubtitle={labelSpecBookSubtitle}
        />
      )}
```

- [ ] **Step 3: Verify page renders**

Run: `npm run dev`

Visit a villa detail page. The "What's Included" section should appear after the gallery (will be empty until seed data is added). Page should not crash if no specCategory documents exist.

- [ ] **Step 4: Commit**

```bash
git add app/\[locale\]/villas/\[slug\]/page.tsx
git commit -m "feat: wire WhatsIncluded section into villa detail page"
```

---

### Task 7: Refactor UpgradesShowcase with photos and prices

**Files:**
- Modify: `components/residences/upgrades-showcase.tsx`

- [ ] **Step 1: Rewrite the component**

Replace the content of `components/residences/upgrades-showcase.tsx`:

```tsx
import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import {
  Bath,
  Flame,
  Shield,
  Sparkles,
  TabletSmartphone,
  ThermometerSun,
  UtensilsCrossed,
  Waves,
} from "lucide-react";

import { getLocalizedValue, type Locale } from "@/lib/i18n";
import { getSanityImageUrl } from "@/lib/sanity/image";
import type { Upgrade } from "@/lib/sanity/types";

type UpgradesShowcaseProps = {
  upgrades: Upgrade[] | null;
  locale: Locale;
};

const UPGRADE_ICON_BY_CATEGORY: Record<string, LucideIcon> = {
  pool: Waves,
  jacuzzi: Bath,
  sauna: ThermometerSun,
  bbq: UtensilsCrossed,
  "smart-house": TabletSmartphone,
  security: Shield,
  fireplace: Flame,
};

const CATEGORY_BADGE_LABEL: Record<string, string> = {
  pool: "Outdoor Living",
  jacuzzi: "Wellness",
  sauna: "Wellness",
  bbq: "Outdoor Living",
  "smart-house": "Technology",
  security: "Security",
  fireplace: "Interior",
};

function upgradeIconForCategory(category: string | undefined): LucideIcon {
  if (!category) return Sparkles;
  return UPGRADE_ICON_BY_CATEGORY[category] ?? Sparkles;
}

export function UpgradesShowcase({ upgrades, locale }: UpgradesShowcaseProps) {
  if (!upgrades?.length) return null;

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {upgrades.map((upgrade) => {
          const name = getLocalizedValue(upgrade.name, locale) ?? "";
          const description = getLocalizedValue(upgrade.description, locale) ?? "";
          const imageUrl = getSanityImageUrl(upgrade.image, 600);
          const Icon = upgradeIconForCategory(upgrade.category);
          const badgeLabel = upgrade.category
            ? CATEGORY_BADGE_LABEL[upgrade.category]
            : undefined;
          const priceNote = upgrade.priceNote
            ? getLocalizedValue(upgrade.priceNote, locale)
            : undefined;

          return (
            <div
              key={upgrade._id}
              className="tile flex flex-col overflow-hidden p-0 transition-transform duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-card)]"
            >
              {imageUrl ? (
                <div className="relative h-[220px] bg-[var(--color-stone)]">
                  <Image
                    src={imageUrl}
                    alt={name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              ) : (
                <div className="flex h-[220px] items-center justify-center bg-[var(--color-stone)]">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-deep-teal)]/10 text-[var(--color-deep-teal)]">
                    <Icon className="h-8 w-8" aria-hidden />
                  </div>
                </div>
              )}

              <div className="flex flex-1 flex-col p-5">
                {badgeLabel && (
                  <span className="mb-2 inline-block w-fit rounded-sm bg-[rgba(26,107,110,0.08)] px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.15em] text-[var(--color-deep-teal)]">
                    {badgeLabel}
                  </span>
                )}
                <h3 className="text-h3 text-base">{name}</h3>
                {description && (
                  <p className="mt-1 line-clamp-2 text-sm text-[var(--color-muted)]">
                    {description}
                  </p>
                )}

                {upgrade.price != null && (
                  <div className="mt-auto flex items-baseline justify-between border-t border-[rgba(13,103,119,0.06)] pt-3 mt-4">
                    <span className="text-xl font-bold text-[var(--color-ink)]">
                      {upgrade.price.toLocaleString("en-US")}{" "}
                      <span className="text-xs font-normal text-[var(--color-muted)]">
                        {upgrade.priceUnit === "meter" ? "EUR / m" : "EUR"}
                      </span>
                    </span>
                    {priceNote && (
                      <span className="text-xs italic text-[var(--color-muted)]">
                        {priceNote}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {upgrades.some((u) => u.price != null) && (
        <div className="mt-8 rounded-r border-l-[3px] border-[var(--color-deep-teal)] bg-[rgba(26,107,110,0.04)] px-5 py-4 text-sm text-[var(--color-muted)]">
          <strong>Project: Chiliadou</strong> — All prices are indicative and
          exclude VAT at 24%. Final pricing may vary based on villa configuration
          and site conditions.
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 2: Verify page renders**

Run: `npm run dev`

Visit `/en/residences`. The upgrades section should render. Cards without prices should still work (backwards compatible). Cards with images show the photo, cards without show the icon fallback.

- [ ] **Step 3: Commit**

```bash
git add components/residences/upgrades-showcase.tsx
git commit -m "feat: refactor UpgradesShowcase with photo cards and prices"
```

---

### Task 8: Seed data — specCategory documents

**Files:**
- Create: `sanity/seed/seed-spec-categories.ts`

- [ ] **Step 1: Create the seed script**

```ts
// sanity/seed/seed-spec-categories.ts
import { createClient } from "@sanity/client";
import "dotenv/config";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN!,
  apiVersion: "2024-01-01",
  useCdn: false,
});

const categories = [
  {
    _type: "specCategory",
    _id: "specCategory-furniture",
    name: { en: "Furniture", he: "ריהוט", ru: "Мебель", el: "Furniture" },
    icon: "sofa",
    sortOrder: 1,
    items: [
      {
        _key: "living",
        area: { en: "Living Room", he: "סלון", ru: "Гостиная", el: "Living Room" },
        spec: { en: "Sofa 3-4 seats, armchairs, coffee table, TV unit, carpet", he: "ספה 3-4 מושבים, כורסאות, שולחן קפה, מזנון טלוויזיה, שטיח", ru: "Диван 3-4 места, кресла, журнальный стол, ТВ-тумба, ковёр", el: "Sofa 3-4 seats, armchairs, coffee table, TV unit, carpet" },
        notes: { en: "Core furnished living area", he: "אזור מגורים מרוהט", ru: "Основная жилая зона", el: "Core furnished living area" },
      },
      {
        _key: "bedrooms",
        area: { en: "Bedrooms", he: "חדרי שינה", ru: "Спальни", el: "Bedrooms" },
        spec: { en: "Bed, mattress, wardrobes, side tables", he: "מיטה, מזרן, ארונות, שידות", ru: "Кровать, матрас, шкафы, тумбочки", el: "Bed, mattress, wardrobes, side tables" },
        notes: { en: "Per room according to unit type", he: "לחדר בהתאם לסוג היחידה", ru: "На комнату по типу юнита", el: "Per room according to unit type" },
      },
      {
        _key: "dining",
        area: { en: "Dining", he: "פינת אוכל", ru: "Столовая", el: "Dining" },
        spec: { en: "Table + 4-8 chairs", he: "שולחן + 4-8 כיסאות", ru: "Стол + 4-8 стульев", el: "Table + 4-8 chairs" },
        notes: { en: "Depends on villa size", he: "בהתאם לגודל הווילה", ru: "Зависит от размера виллы", el: "Depends on villa size" },
      },
      {
        _key: "outdoor",
        area: { en: "Outdoor", he: "חוץ", ru: "Открытая зона", el: "Outdoor" },
        spec: { en: "Sunbeds, lounge set, dining set", he: "מיטות שיזוף, פינת ישיבה, פינת אוכל", ru: "Шезлонги, лаунж-набор, обеденный набор", el: "Sunbeds, lounge set, dining set" },
        notes: { en: "Garden / terrace package", he: "חבילת גינה / מרפסת", ru: "Пакет сад / терраса", el: "Garden / terrace package" },
      },
      {
        _key: "extras",
        area: { en: "Extras", he: "תוספות", ru: "Доп. элементы", el: "Extras" },
        spec: { en: "Curtains, lighting fixtures, mirrors", he: "וילונות, גופי תאורה, מראות", ru: "Шторы, светильники, зеркала", el: "Curtains, lighting fixtures, mirrors" },
        notes: { en: "Decor and fit-out package", he: "חבילת עיצוב וגימור", ru: "Пакет декора и отделки", el: "Decor and fit-out package" },
      },
    ],
  },
  {
    _type: "specCategory",
    _id: "specCategory-kitchen",
    name: { en: "Kitchen", he: "מטבח", ru: "Кухня", el: "Kitchen" },
    icon: "utensils-crossed",
    sortOrder: 2,
    items: [
      { _key: "cabinets", area: { en: "Cabinets", he: "ארונות", ru: "Шкафы", el: "Cabinets" }, spec: { en: "Custom MDF / lacquer", he: "MDF מותאם / לכה", ru: "MDF на заказ / лак", el: "Custom MDF / lacquer" }, notes: { en: "Final finish to be selected", he: "גימור סופי ייבחר", ru: "Финишное покрытие по выбору", el: "Final finish to be selected" } },
      { _key: "countertop", area: { en: "Countertop", he: "משטח עבודה", ru: "Столешница", el: "Countertop" }, spec: { en: "Quartz / Granite", he: "קוורץ / גרניט", ru: "Кварц / Гранит", el: "Quartz / Granite" }, notes: { en: "According to villa tier", he: "בהתאם לדרגת הווילה", ru: "По классу виллы", el: "According to villa tier" } },
      { _key: "appliances", area: { en: "Appliances", he: "מכשירי חשמל", ru: "Техника", el: "Appliances" }, spec: { en: "Oven, stove, hood, fridge", he: "תנור, כיריים, קולט, מקרר", ru: "Духовка, плита, вытяжка, холодильник", el: "Oven, stove, hood, fridge" }, notes: { en: "Integrated package", he: "חבילה משולבת", ru: "Комплексный пакет", el: "Integrated package" } },
      { _key: "sink", area: { en: "Sink", he: "כיור", ru: "Мойка", el: "Sink" }, spec: { en: "Double stainless", he: "כיור כפול נירוסטה", ru: "Двойная нержавеющая", el: "Double stainless" }, notes: { en: "Standard specification", he: "מפרט סטנדרטי", ru: "Стандартная спецификация", el: "Standard specification" } },
      { _key: "island", area: { en: "Island", he: "אי מטבח", ru: "Остров", el: "Island" }, spec: { en: "Yes (mid/high types)", he: "כן (סוגים בינוניים/גבוהים)", ru: "Да (средний/высокий тип)", el: "Yes (mid/high types)" }, notes: { en: "Applies to larger villas", he: "רלוונטי לווילות גדולות", ru: "Для больших вилл", el: "Applies to larger villas" } },
    ],
  },
  {
    _type: "specCategory",
    _id: "specCategory-outdoor",
    name: { en: "Outdoor & Pool", he: "חוץ ובריכה", ru: "Двор и бассейн", el: "Outdoor & Pool" },
    icon: "palmtree",
    sortOrder: 3,
    items: [
      { _key: "pool", area: { en: "Pool", he: "בריכה", ru: "Бассейн", el: "Pool" }, spec: { en: "Private", he: "פרטית", ru: "Частный", el: "Private" }, notes: { en: "Dedicated pool per villa / where applicable", he: "בריכה ייעודית לכל וילה", ru: "Отдельный бассейн на виллу", el: "Dedicated pool per villa" } },
      { _key: "size", area: { en: "Size", he: "גודל", ru: "Размер", el: "Size" }, spec: { en: "18–45 m²", he: "18–45 מ\"ר", ru: "18–45 м²", el: "18–45 m²" }, notes: { en: "By villa type", he: "בהתאם לסוג הווילה", ru: "По типу виллы", el: "By villa type" } },
      { _key: "heating", area: { en: "Heating", he: "חימום", ru: "Подогрев", el: "Heating" }, spec: { en: "Optional", he: "אופציונלי", ru: "Опционально", el: "Optional" }, notes: { en: "Upgrade option", he: "אפשרות שדרוג", ru: "Опция апгрейда", el: "Upgrade option" } },
      { _key: "garden", area: { en: "Garden", he: "גינה", ru: "Сад", el: "Garden" }, spec: { en: "Mediterranean landscaping", he: "גינון ים-תיכוני", ru: "Средиземноморский ландшафт", el: "Mediterranean landscaping" }, notes: { en: "Low-maintenance concept", he: "קונספט תחזוקה נמוכה", ru: "Концепция минимального ухода", el: "Low-maintenance concept" } },
      { _key: "irrigation", area: { en: "Irrigation", he: "השקיה", ru: "Полив", el: "Irrigation" }, spec: { en: "Automatic", he: "אוטומטית", ru: "Автоматический", el: "Automatic" }, notes: { en: "Installed system", he: "מערכת מותקנת", ru: "Установленная система", el: "Installed system" } },
      { _key: "fence", area: { en: "Fence", he: "גדר", ru: "Забор", el: "Fence" }, spec: { en: "Yes", he: "כן", ru: "Да", el: "Yes" }, notes: { en: "Privacy and safety", he: "פרטיות ובטיחות", ru: "Приватность и безопасность", el: "Privacy and safety" } },
    ],
  },
  {
    _type: "specCategory",
    _id: "specCategory-parking",
    name: { en: "Parking", he: "חניה", ru: "Парковка", el: "Parking" },
    icon: "car",
    sortOrder: 4,
    items: [
      { _key: "type", area: { en: "Type", he: "סוג", ru: "Тип", el: "Type" }, spec: { en: "Private", he: "פרטית", ru: "Частная", el: "Private" }, notes: { en: "Allocated to each villa", he: "מוקצה לכל וילה", ru: "Выделена для каждой виллы", el: "Allocated to each villa" } },
      { _key: "spaces", area: { en: "Spaces", he: "מקומות", ru: "Мест", el: "Spaces" }, spec: { en: "1–3", he: "1–3", ru: "1–3", el: "1–3" }, notes: { en: "According to unit type", he: "בהתאם לסוג היחידה", ru: "По типу юнита", el: "According to unit type" } },
      { _key: "covered", area: { en: "Covered", he: "מקורה", ru: "Крытая", el: "Covered" }, spec: { en: "Optional", he: "אופציונלי", ru: "Опционально", el: "Optional" }, notes: { en: "Pergola / covered option", he: "פרגולה / אפשרות מקורה", ru: "Пергола / крытый вариант", el: "Pergola / covered option" } },
      { _key: "ev", area: { en: "EV", he: "רכב חשמלי", ru: "Электромобиль", el: "EV" }, spec: { en: "Ready", he: "מוכן", ru: "Готово", el: "Ready" }, notes: { en: "Electric vehicle preparation", he: "הכנה לרכב חשמלי", ru: "Подготовка для электромобиля", el: "Electric vehicle preparation" } },
    ],
  },
  {
    _type: "specCategory",
    _id: "specCategory-technical",
    name: { en: "Technical", he: "מפרט טכני", ru: "Технические системы", el: "Technical" },
    icon: "settings-2",
    sortOrder: 5,
    items: [
      { _key: "ac", area: { en: "AC", he: "מיזוג אוויר", ru: "Кондиционер", el: "AC" }, spec: { en: "VRF / Split", he: "VRF / Split", ru: "VRF / Split", el: "VRF / Split" }, notes: { en: "Depending on MEP design", he: "בהתאם לתכנון MEP", ru: "По проекту MEP", el: "Depending on MEP design" } },
      { _key: "heating", area: { en: "Heating", he: "חימום", ru: "Отопление", el: "Heating" }, spec: { en: "Heat Pump", he: "משאבת חום", ru: "Тепловой насос", el: "Heat Pump" }, notes: { en: "Energy efficient solution", he: "פתרון חסכוני באנרגיה", ru: "Энергоэффективное решение", el: "Energy efficient solution" } },
      { _key: "solar", area: { en: "Solar", he: "סולארי", ru: "Солнечная", el: "Solar" }, spec: { en: "Yes", he: "כן", ru: "Да", el: "Yes" }, notes: { en: "Solar support / water heating", he: "תמיכה סולארית / חימום מים", ru: "Солнечная поддержка / нагрев воды", el: "Solar support / water heating" } },
      { _key: "windows", area: { en: "Windows", he: "חלונות", ru: "Окна", el: "Windows" }, spec: { en: "Double glazing", he: "זיגוג כפול", ru: "Двойное остекление", el: "Double glazing" }, notes: { en: "Energy-efficient glazing", he: "זיגוג חסכוני באנרגיה", ru: "Энергосберегающее остекление", el: "Energy-efficient glazing" } },
      { _key: "insulation", area: { en: "Insulation", he: "בידוד", ru: "Изоляция", el: "Insulation" }, spec: { en: "Full EU standard", he: "תקן EU מלא", ru: "Полный стандарт ЕС", el: "Full EU standard" }, notes: { en: "Envelope insulation standard", he: "תקן בידוד מעטפת", ru: "Стандарт изоляции оболочки", el: "Envelope insulation standard" } },
      { _key: "smart", area: { en: "Smart Home", he: "בית חכם", ru: "Умный дом", el: "Smart Home" }, spec: { en: "Optional", he: "אופציונלי", ru: "Опционально", el: "Optional" }, notes: { en: "Upgrade package", he: "חבילת שדרוג", ru: "Пакет апгрейда", el: "Upgrade package" } },
    ],
  },
];

async function main() {
  const tx = client.transaction();
  for (const cat of categories) {
    tx.createOrReplace(cat);
  }
  const result = await tx.commit();
  console.log(`Seeded ${categories.length} spec categories`, result);
}

main().catch(console.error);
```

- [ ] **Step 2: Run the seed script**

Run: `npx tsx sanity/seed/seed-spec-categories.ts`

Expected: "Seeded 5 spec categories" message. Verify in Studio that 5 specCategory documents appear.

- [ ] **Step 3: Commit**

```bash
git add sanity/seed/seed-spec-categories.ts
git commit -m "feat: add seed script for specCategory data with 4-locale translations"
```

---

### Task 9: Seed upgrade prices

**Files:**
- Create: `sanity/seed/seed-upgrade-prices.ts`

- [ ] **Step 1: Create the seed script**

```ts
// sanity/seed/seed-upgrade-prices.ts
import { createClient } from "@sanity/client";
import "dotenv/config";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN!,
  apiVersion: "2024-01-01",
  useCdn: false,
});

const PRICE_NOTE = { en: "excl. VAT", he: 'לא כולל מע"מ', ru: "без НДС", el: "excl. VAT" };

const upgradePrices: Record<string, { price: number; priceUnit: string }> = {
  bbq: { price: 6000, priceUnit: "item" },
  jacuzzi: { price: 8000, priceUnit: "item" },
  sauna: { price: 4000, priceUnit: "item" },
  pool: { price: 16000, priceUnit: "item" },
  "smart-house": { price: 7000, priceUnit: "item" },
  security: { price: 3000, priceUnit: "item" },
  fireplace: { price: 3000, priceUnit: "item" },
};

// Fence is per-meter — handled separately by category match

async function main() {
  const upgrades = await client.fetch<Array<{ _id: string; category: string }>>(
    `*[_type == "upgrade"]{ _id, category }`
  );

  const tx = client.transaction();
  let patched = 0;

  for (const u of upgrades) {
    const priceInfo = upgradePrices[u.category];
    if (priceInfo) {
      tx.patch(u._id, (p) =>
        p.set({
          price: priceInfo.price,
          priceUnit: priceInfo.priceUnit,
          priceNote: PRICE_NOTE,
        })
      );
      patched++;
    }
    // Handle fence by checking if there's a "fence" category not in the map
    // (KNX may not exist yet as a category, add manually if needed)
  }

  if (patched > 0) {
    const result = await tx.commit();
    console.log(`Patched ${patched} upgrades with prices`, result);
  } else {
    console.log("No upgrades matched. Check category values in Sanity.");
  }
}

main().catch(console.error);
```

- [ ] **Step 2: Run the seed script**

Run: `npx tsx sanity/seed/seed-upgrade-prices.ts`

Expected: "Patched N upgrades with prices". Verify in Studio that upgrades now show price fields.

- [ ] **Step 3: Check the site**

Run: `npm run dev`

Visit `/en/residences` — upgrades should now show prices. Visit `/en/villas/alpha` (or any villa) — "What's Included" section should show with all 5 categories.

- [ ] **Step 4: Commit**

```bash
git add sanity/seed/seed-upgrade-prices.ts
git commit -m "feat: add seed script for upgrade prices from SPEC_BOOK"
```

---

## Summary of all tasks

| # | Task | New/Modified | Description |
|---|------|-------------|-------------|
| 1 | specCategory schema | New schema | Sanity document type for base specs |
| 2 | upgrade price fields | Modify schema | Add price, priceUnit, priceNote |
| 3 | Types and queries | Modify lib | SpecCategory type + updated GROQ |
| 4 | uiStrings labels | Modify schema + types | 3 new labels for spec book section |
| 5 | WhatsIncluded component | New component | Split-layout spec viewer |
| 6 | Villa detail page wiring | Modify page | Fetch + render WhatsIncluded |
| 7 | UpgradesShowcase refactor | Modify component | Photos + prices + grid |
| 8 | Seed spec categories | New script | 5 categories with 4-locale translations |
| 9 | Seed upgrade prices | New script | Patch existing upgrades with EUR prices |
