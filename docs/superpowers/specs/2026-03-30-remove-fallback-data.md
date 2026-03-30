# Remove Fallback Data — Design Spec

**Date:** 2026-03-30
**Goal:** Remove all hardcoded fallback data, static images, and placeholder content. All content comes from Sanity CMS; if CMS is empty, components gracefully degrade (don't render) instead of showing stale hardcoded data.

## What Gets Deleted

### Files (full removal)
- `lib/fallback-data.ts` — 625 lines of duplicated CMS content (villas, units, plots, upgrades, page content)
- `lib/villa-images.ts` — 79 lines mapping static image paths per villa
- `lib/sanity/fetch.ts` — `fetchWithFallback` helper no longer needed
- `public/assets/` — 105 MB of static images (pdf/, team/)
- `public/brochure/` — empty directory

### Constants removed from components (~30 files)
- All `FALLBACK_*` constants (founders, values, stats, experiences, FAQs, contact info, villa names, etc.)
- All `?? "/assets/..."` image path fallbacks
- All `?? "Some English text"` hardcoded text fallbacks
- Duplicate types like `HardcodedFounder` that exist only for fallback rendering

## Behavior When CMS Data Is Missing

### Pages (`app/[locale]/*/page.tsx`)
- Fetch from Sanity directly via `sanityClient.fetch()` (no `fetchWithFallback` wrapper)
- Critical pages where empty data is meaningless (villa detail `[slug]`) → `notFound()`
- Section-based pages (home, about, location, etc.) → pass data to components, each component decides independently whether to render

### Components
- Accept data via props (already the case)
- If key data is missing → `return null` (section does not appear)
- Images: `getSanityImageUrl()` returns `null` → don't render `<Image>`, optionally show a neutral placeholder div
- No English-language hardcoded strings; all UI text comes from `uiStrings` (already in place)

### Brochure PDF
- Remove hardcoded path `/brochure/seacret-residences-brochure.pdf` from site-header
- Brochure URL comes from `SiteSettings.brochurePdf` (type already exists)
- If no brochure in CMS → hide download button

### SEO Metadata
- `buildPageMetadata` in `lib/metadata.ts` keeps its `fallback` parameter for basic SEO (title/description)
- This is acceptable: SEO fallbacks are developer-facing defaults, not user content

## What Stays Unchanged

- Sanity schemas (`sanity/schemaTypes/`) — no changes
- UI strings system (`lib/sanity/ui-strings.ts`, `lib/ui-strings-context.tsx`)
- `lib/pricing.ts` — calculation logic, not fallback data
- `lib/i18n.ts` — locale utilities
- `lib/sanity/image.ts` — `getSanityImageUrl` already returns `null` correctly
- `lib/sanity/queries.ts` — GROQ queries unchanged
- `lib/sanity/types.ts` — type definitions unchanged

## Approach

Bottom-up cleanup in layers:
1. Delete source files (`fallback-data.ts`, `villa-images.ts`, `public/assets/`, `public/brochure/`)
2. Delete `lib/sanity/fetch.ts`
3. Fix all broken imports across pages and components
4. Clean each component: remove `FALLBACK_*` constants, add early `return null` guards
5. Clean each page: replace `fetchWithFallback`/custom fallback functions with direct `sanityClient.fetch()`
6. Fix site-header brochure link to use CMS data
7. Verify build compiles cleanly

## Files Affected

### Deletions (5)
- `lib/fallback-data.ts`
- `lib/villa-images.ts`
- `lib/sanity/fetch.ts`
- `public/assets/` (entire directory)
- `public/brochure/` (entire directory)

### Pages to update (7)
- `app/[locale]/page.tsx`
- `app/[locale]/about/page.tsx`
- `app/[locale]/contact/page.tsx`
- `app/[locale]/location/page.tsx`
- `app/[locale]/masterplan/page.tsx`
- `app/[locale]/residences/page.tsx`
- `app/[locale]/villas/[slug]/page.tsx`

### Components to update (~23)
- `components/home/hero-section.tsx`
- `components/home/concept-section.tsx`
- `components/home/lifestyle-section.tsx`
- `components/home/residences-preview-section.tsx`
- `components/home/location-highlight-section.tsx`
- `components/home/masterplan-teaser-section.tsx`
- `components/home/cta-section.tsx`
- `components/about/founders-section.tsx`
- `components/about/values-section.tsx`
- `components/about/stats-bar.tsx`
- `components/about/our-story-section.tsx`
- `components/about/about-cta-section.tsx`
- `components/contact/direct-contact-section.tsx`
- `components/contact/multi-step-form.tsx`
- `components/location/why-chiliadou-section.tsx`
- `components/location/experiences-section.tsx`
- `components/location/airport-connectivity-section.tsx`
- `components/location/distance-map-section.tsx`
- `components/masterplan/visual-explorer.tsx`
- `components/masterplan/inventory-table.tsx`
- `components/residences/upgrades-showcase.tsx`
- `components/sections/faq-accordion.tsx`
- `components/site-header.tsx`
- `components/villa-detail/image-gallery.tsx`
- `components/villa-detail/floor-plans.tsx`
- `components/villa-detail/related-villas.tsx`
- `components/sticky-cta.tsx`
- `components/inline-contact-section.tsx`

### Utility updates (1)
- `lib/metadata.ts` — remove fallback-data imports if any
