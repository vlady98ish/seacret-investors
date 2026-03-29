# Sea'cret Residences v2 — Plan 2: Content Pages

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build all 6 page templates with real content, fetched from Sanity CMS with graceful fallbacks when CMS has no data. Every page uses Tier 1 animations and ends with an inline contact section.

**Architecture:** Server Components fetch Sanity data at build time. Each section receives CMS data as props (can be null). Sections use `getLocalizedValue()` with English fallback strings. Images resolve in order: Sanity URL → static `/public/assets/` → placeholder div.

**Tech Stack:** Next.js App Router (Server Components), Sanity GROQ, Framer Motion (ScrollReveal), Lucide React icons, Tailwind CSS v4

**Spec:** `docs/superpowers/specs/2026-03-28-seacret-residences-v2-design.md`
**Foundation (Plan 1):** Complete — design tokens, Sanity schemas, GROQ queries, i18n, layout shell, contact API

---

## Task 0: Shared Infrastructure

Build utilities and reusable components that all 6 pages depend on. This is the foundation for all content work.

**Files:**
- Create: `lib/dictionaries.ts` — Static UI string dictionaries with English fallback
- Modify: `lib/sanity/types.ts` — Add page document types, projected query types
- Create: `lib/sanity/image.ts` — Sanity image URL builder
- Create: `lib/metadata.ts` — SEO metadata builder with hreflang
- Create: `components/sections/page-hero.tsx` — Full-viewport hero (used on 5 pages)
- Create: `components/sections/section-heading.tsx` — Eyebrow + title + description
- Create: `components/sections/villa-card.tsx` — Villa type card for grids (used on 3 pages)
- Create: `components/sections/status-badge.tsx` — Available/Reserved/Sold badge
- Create: `components/sections/stats-bar.tsx` — Horizontal stat counters
- Create: `components/sections/image-with-fallback.tsx` — Sanity/static/placeholder image

### Sub-task 0A: Static Dictionaries

- [ ] Create `lib/dictionaries.ts` with English-only fallback strings for all UI chrome: nav labels, form labels, section eyebrows, CTA text, status labels, unit spec labels, filter labels. Export `getDictionary(locale: Locale)` function. Start English-only — other locales fall back to English for UI chrome; CMS provides real localized content.

### Sub-task 0B: Extended TypeScript Types

- [ ] Extend `lib/sanity/types.ts` with: `HomePage`, `ResidencesPage`, `LocationPage`, `MasterplanPage`, `ContactPage`, `Upgrade`, `Experience`, `Developer`, `FeaturedVilla` (projected from homePageQuery), `UnitWithRefs` (projected from villaBySlugQuery), `PlotWithUnits` (projected from allPlotsQuery). Match field names exactly to Sanity schemas.

### Sub-task 0C: Sanity Image Helper

- [ ] Create `lib/sanity/image.ts`. Use `@sanity/image-url` with projectId/dataset from `sanity/env.ts`. Export `urlFor(source)` builder and `getSanityImageUrl(image, width): string | null` helper that returns null when image is undefined.

### Sub-task 0D: SEO Metadata Utility

- [ ] Create `lib/metadata.ts`. Export `buildPageMetadata(page, locale, fallback)` returning Next.js `Metadata` with localized title/description, hreflang alternates for all 4 locales, x-default pointing to `/en/...`, canonical URL, and Open Graph basics.

### Sub-task 0E: Shared Section Components

- [ ] Create `components/sections/page-hero.tsx` — Server component. Full-viewport height, background image with dark gradient overlay, centered title + subtitle, optional children for CTA buttons. Props: `backgroundImage?: string`, `title: string`, `subtitle?: string`, `children?: ReactNode`. Fallback: solid night background when no image.

- [ ] Create `components/sections/section-heading.tsx` — Eyebrow (`.eyebrow`), title (`.text-h2`), optional description (`.text-body-muted`). Props: `eyebrow`, `title`, `description?`, `align?: "left" | "center"`.

- [ ] Create `components/sections/villa-card.tsx` — Server component. Shows villa image, name, label (localized), specs (bedrooms, area), price badge (computed via `formatPriceFrom`), availability count. Handles sold-out state with badge. Props: villa data, locale, units array (optional). Links to `/[locale]/villas/[slug]`.

- [ ] Create `components/sections/status-badge.tsx` — Renders `<span className="badge badge-{status}">{label}</span>`. Props: `status: UnitStatus`.

- [ ] Create `components/sections/stats-bar.tsx` — Horizontal row of stat items. Props: `stats: Array<{label: string, value: string | number}>`. Uses ScrollReveal for number reveal.

- [ ] Create `components/sections/image-with-fallback.tsx` — Next.js `<Image>` wrapper. Tries: Sanity URL → static src → placeholder div with gradient and Lucide `ImageIcon`. Props: `sanityImage?: SanityImage`, `staticSrc?: string`, `alt: string`, `width: number`, `height: number`, `className?: string`.

- [ ] Commit all Task 0 files.

---

## Task 1: Homepage

Build the 8-section homepage. The most visually impactful page.

**Files:**
- Create: `components/home/hero-section.tsx`
- Create: `components/home/concept-section.tsx`
- Create: `components/home/location-highlight-section.tsx`
- Create: `components/home/lifestyle-section.tsx`
- Create: `components/home/residences-preview-section.tsx`
- Create: `components/home/masterplan-teaser-section.tsx`
- Create: `components/home/cta-section.tsx`
- Modify: `app/[locale]/page.tsx`

### Implementation Notes

- Page fetches: `homePageQuery`, `availabilityStatsQuery`, `allUnitsQuery` (for price computation)
- Each section gets its CMS data slice as props (can be null)
- Use `getLocalizedValue(data?.field, locale) ?? "Fallback text"` pattern everywhere
- Images: try Sanity URL first, fall back to `/assets/pdf/page-*.jpg`
- Wrap sections in `<ScrollReveal>` for fade-up entrance
- Add `generateMetadata` using `buildPageMetadata()`

### Sections

- [ ] **Hero Section** — Full-viewport. Background: `homePage.heroImage` or `/assets/pdf/page-02-hero.jpg`. Tagline: "Hidden from many, perfect for few". Two CTAs: "Explore Residences" (gold btn) + "Request a Tour" (outline btn). CSS parallax on background.

- [ ] **Concept Section** — Split layout (text left, image right, mirrors in RTL). Eyebrow "THE CONCEPT". Copy from CMS or fallback. Image from CMS or `/assets/pdf/page-03-concept.jpg`.

- [ ] **Location Highlight** — Static map image with positioned distance markers. Key facts as icon cards. CTA → `/[locale]/location`. Counter animation for distances.

- [ ] **Lifestyle Section** — 3-card grid (Morning/Day/Evening). Background images with gradient overlay and poetic text. Staggered ScrollReveal.

- [ ] **Residences Preview** — 3-4 VillaCard components from `homePage.featuredVillas`. Computed prices from units. CTA → `/[locale]/residences`.

- [ ] **Masterplan Teaser** — Aerial image with plot labels overlay. StatsBar (39 Residences / 6 Plots / X Available). CTA → `/[locale]/masterplan`.

- [ ] **CTA Section** — Dark bg. "Discover Your Sea'cret". "From €150K · Only 39 exclusive residences". Gold button.

- [ ] **Wire homepage** — Fetch data in `page.tsx`, pass to sections, add InlineContactSection at bottom, add generateMetadata.

- [ ] Commit homepage.

---

## Task 2: Residences Page

Villa type grid with filters, comparison table, and upgrades showcase.

**Files:**
- Create: `components/residences/villa-type-grid.tsx`
- Create: `components/residences/villa-filters.tsx` (client component)
- Create: `components/residences/comparison-table.tsx`
- Create: `components/residences/upgrades-showcase.tsx`
- Modify: `app/[locale]/residences/page.tsx`

### Implementation Notes

- Page fetches: `residencesPageQuery`, `allVillasQuery`, `allUnitsQuery`, `allUpgradesQuery`
- VillaTypeGrid renders VillaCard components (from Task 0)
- VillaFilters is a client component managing filter/sort state
- ComparisonTable: responsive HTML table, horizontal scroll on mobile
- UpgradesShowcase: 7 upgrade cards with icons/images
- Fallback: placeholder cards with static images, "Contact for pricing" when no units

- [ ] Build VillaTypeGrid — renders all 6 villa types as VillaCards with computed prices and availability counts.

- [ ] Build VillaFilters (client) — Filter by bedrooms, size, availability. Sort by price, size, name. Pill-based UI.

- [ ] Build ComparisonTable — All 6 types compared side-by-side. Columns: Name, Bedrooms, Bathrooms, Area, Price From, Available. Horizontal scroll on mobile.

- [ ] Build UpgradesShowcase — Grid of upgrade cards. Sanity data or Lucide icon fallbacks for: Pool, Jacuzzi, Sauna, BBQ, Smart House, Security, Fireplace.

- [ ] Wire residences page — PageHero, filters + grid, comparison table, upgrades, InlineContactSection, generateMetadata.

- [ ] Commit residences page.

---

## Task 3: Villa Detail Page

Deep-dive page for each villa type with gallery, specs, floor plans, and units.

**Files:**
- Create: `components/villa-detail/specs-panel.tsx`
- Create: `components/villa-detail/image-gallery.tsx` (client component)
- Create: `components/villa-detail/floor-plans.tsx` (client component)
- Create: `components/villa-detail/units-table.tsx`
- Create: `components/villa-detail/related-villas.tsx`
- Modify: `app/[locale]/villas/[slug]/page.tsx`

### Implementation Notes

- Page fetches: `villaBySlugQuery` (includes resolved units with plotName), `allVillasQuery` (for related)
- SpecsPanel: glass-morphism overlay with Lucide icons for each spec
- ImageGallery: 4-image grid with lightbox modal (Framer Motion)
- FloorPlans: tabbed display (Ground/Upper/Attic)
- UnitsTable: rows per unit with StatusBadge
- RelatedVillas: 2-3 VillaCards excluding current villa
- Price: `formatPriceFrom(minUnitArea)` or "Contact for pricing"

- [ ] Build SpecsPanel — `.glass-panel` with bedrooms, bathrooms, area, outdoor, pool, parking. Lucide icons.

- [ ] Build ImageGallery (client) — Masonry grid of 4 images. Click opens lightbox with prev/next. Framer Motion enter/exit.

- [ ] Build FloorPlans (client) — Tab buttons for each floor level. Click shows floor plan image. Fallback to static assets.

- [ ] Build UnitsTable — Table of units for this villa type. Columns: Unit #, Plot, Area, Bedrooms, Pool, Status. StatusBadge per row.

- [ ] Build RelatedVillas — "You might also like" with 2-3 VillaCards. Exclude current, pick by similar bedroom count.

- [ ] Wire villa detail page — PageHero, SpecsPanel, ImageGallery, FloorPlans, price section + CTA, UnitsTable, 3D tour button if available, RelatedVillas, InlineContactSection (pre-fills villa name), generateMetadata.

- [ ] Commit villa detail page.

---

## Task 4: Masterplan Page

Interactive plot explorer with inventory table. Most complex client interactivity.

**Files:**
- Create: `components/masterplan/masterplan-interactive.tsx` (client — parent state manager)
- Create: `components/masterplan/visual-explorer.tsx` (client)
- Create: `components/masterplan/plot-detail-panel.tsx` (client)
- Create: `components/masterplan/inventory-table.tsx` (client)
- Modify: `app/[locale]/masterplan/page.tsx`

### Implementation Notes

- Page fetches: `masterplanPageQuery`, `allPlotsQuery`, `allUnitsQuery`, `availabilityStatsQuery`
- MasterplanInteractive wraps VisualExplorer + PlotDetailPanel, manages `selectedPlotId` state
- VisualExplorer: aerial image with absolute-positioned clickable plot hotspots (x%/y% from plot.positionData)
- PlotDetailPanel: side panel (desktop) / bottom sheet (mobile) with unit breakdown
- InventoryTable: filterable/sortable full inventory below the explorer
- Color coding: green=available, gold=reserved, red=sold

- [ ] Build MasterplanInteractive — Client component managing selectedPlotId state for children.

- [ ] Build VisualExplorer — Aerial image with positioned plot overlays. Click triggers onPlotSelect. Color-coded borders. Fallback: static image without hotspots.

- [ ] Build PlotDetailPanel — Slides in on plot select. Plot name, unit breakdown table, links to villa pages, floor plan images. Close button. RTL-aware slide direction.

- [ ] Build InventoryTable — Full inventory with filters (plot, villa type, status) and sort (price, area, plot). StatusBadge per row. Click row → villa detail. Cards layout on mobile.

- [ ] Wire masterplan page — PageHero, StatsBar, MasterplanInteractive, InventoryTable, InlineContactSection, generateMetadata.

- [ ] Commit masterplan page.

---

## Task 5: Location Page

Location storytelling with distance map, airports, and experiences.

**Files:**
- Create: `components/location/why-chiliadou-section.tsx`
- Create: `components/location/distance-map-section.tsx`
- Create: `components/location/airport-connectivity-section.tsx`
- Create: `components/location/experiences-section.tsx`
- Modify: `app/[locale]/location/page.tsx`

### Implementation Notes

- Page fetches: `locationPageQuery`, `allExperiencesQuery`
- Most data is inherently static (distances, airports) — hardcode as fallback constants
- CMS provides localized overrides and editorial control
- Map is a styled static image with positioned markers (not Google Maps embed)

- [ ] Build WhyChiliadouSection — 3 feature cards: Blue Flag Beach, No Crowds, Pure Authenticity. Lucide icons + ScrollReveal stagger.

- [ ] Build DistanceMapSection — Map image with positioned distance markers. Fallback: hardcoded distances (Patras 30min, Nafpaktos 10min, Athens 2.5h, etc).

- [ ] Build AirportConnectivitySection — 3 `.tile` cards for PVK, GPA, ATH airports with route counts and key destinations.

- [ ] Build ExperiencesSection — Category-grouped grid (Culture, Nature, Gastronomy). CMS data or hardcoded fallback cards.

- [ ] Wire location page — PageHero, WhyChiliadou, DistanceMap, AirportConnectivity, Experiences, InlineContactSection, generateMetadata.

- [ ] Commit location page.

---

## Task 6: Contact Page

Multi-step lead form with direct contact options.

**Files:**
- Create: `components/contact/multi-step-form.tsx` (client component)
- Create: `components/contact/direct-contact-section.tsx`
- Modify: `app/[locale]/contact/page.tsx`

### Implementation Notes

- Page fetches: `contactPageQuery`, `siteSettingsQuery`, `allVillasQuery` (for step 1 options)
- MultiStepForm: 3-step wizard (interest → details → additional info)
- Submits to existing `/api/contact` endpoint
- GDPR consent + UTM capture built in
- No InlineContactSection at bottom (this page IS the contact form)

- [ ] Build MultiStepForm (client) — 3 steps with progress indicator. Step 1: villa type selection (cards). Step 2: name, email, phone. Step 3: budget, timeline, message. Zod per-step validation. Submits to `/api/contact`. GDPR checkbox. UTM capture via `captureUTM()`.

- [ ] Build DirectContactSection — WhatsApp button (prominent), email link, phone link, office hours. Fallback strings when no CMS data.

- [ ] Wire contact page — Dark hero with title, MultiStepForm, DirectContactSection, generateMetadata. No InlineContactSection.

- [ ] Commit contact page.

---

## Null Safety Pattern (applies to ALL tasks)

Every page follows this pattern:
```typescript
const data = await sanityClient.fetch<HomePage | null>(homePageQuery);
// data may be null — guard every access
const title = getLocalizedValue(data?.heroTagline, locale) ?? "Fallback text";
```

## Image Resolution Order (applies to ALL tasks)

1. Sanity URL via `urlFor(image).width(w).url()` — when CMS has data
2. Static asset: `/assets/pdf/...` — available now for most villas/plots
3. Placeholder div with gradient + Lucide `ImageIcon` — universal fallback

## Commit Convention

Each task gets its own commit:
```
feat: homepage — 8 sections with CMS data and fallbacks
feat: residences page — villa grid, filters, comparison, upgrades
feat: villa detail — specs, gallery, floor plans, units, related
feat: masterplan — visual explorer, plot panel, inventory table
feat: location — distance map, airports, experiences
feat: contact — multi-step form, direct contact
```
