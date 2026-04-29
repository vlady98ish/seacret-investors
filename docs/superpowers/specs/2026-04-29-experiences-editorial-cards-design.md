# Experiences Section — Editorial Photo Cards

**Date:** 2026-04-29
**Status:** Approved
**Section:** Location page → ExperiencesSection

## Summary

Replace the current text-only 3-column list layout of the ExperiencesSection with an editorial photo-card design. Each experience shows a full-bleed image with a gradient overlay and text content on top. Cards are grouped by category (Culture / Nature / Gastronomy) with icon-based navigation.

## Current State

- `components/location/experiences-section.tsx` renders 3 tile columns (one per category) with bullet-point text lists
- Each `Experience` document in Sanity has `title`, `description`, `image`, `category`, `sortOrder`
- The `image` field exists but is **not used** in the current component
- 12 experiences total: 4 culture, 4 nature, 4 gastronomy

## Design

### Layout: 1 Featured + 3 Row

Each category displays:
- **1 featured card** — full width, 400px tall on desktop / 320px on mobile
- **3 smaller cards** — equal width in a row below, 260px tall on desktop / 220px on mobile, stacking vertically on mobile

The first experience in each category (by `sortOrder`) becomes the featured card.

### Category Navigation

Three icon buttons centered above the grid:
- Culture (Landmark icon), Nature (Leaf icon), Gastronomy (UtensilsCrossed icon)
- Active category: full opacity + underline indicator + subtle ring on icon
- Inactive: 0.4 opacity
- Icons reuse the existing lucide-react icons already in the project

### Card Anatomy

Each card contains:
- **Background image** — from Sanity `image` field, rendered via `next/image` with `fill` + `object-cover`. Subtle scale-up on hover (1.04x).
- **Gradient overlay** — `linear-gradient(to top, rgba(9,34,42,0.92) 0%, rgba(9,34,42,0.45) 40%, transparent 100%)`
- **Content area** (positioned absolute, bottom):
  - **Badge** — category name in gold (`--color-gold-sun`) with translucent background pill
  - **Time/distance** (optional) — if available in description, shown as muted text next to badge
  - **Title** — Cinzel serif, white. Featured: 1.55rem, small: 1.05rem
  - **Description** — Assistant sans-serif, 75% white opacity. Featured: full description text. Small cards: truncated to 2 lines.

### Transitions

- Category switch: CSS opacity fade (0.35s) — fade out current grid, swap display, fade in new grid
- Card hover: translateY(-4px) + shadow-soft + image scale(1.04)
- Uses existing `ScrollReveal` component for entrance animations

### Responsive Behavior

- **Desktop (>768px):** Featured full-width, 3 cards in row
- **Mobile (≤768px):** Featured full-width (shorter), 3 cards stack vertically in single column

### Client Interactivity

This component needs `"use client"` for:
- Category tab state (React `useState`)
- Fade transition on category switch

### Data Flow

```
page.tsx fetches experiences via allExperiencesQuery
  → passes Experience[] to ExperiencesSection
    → component groups by category
    → first item per category = featured
    → renders via category navigation + grid
```

No new Sanity queries or schema changes needed. The existing `image` field on `Experience` documents must be populated (requires uploading images via Sanity Studio or a seed script).

## What Changes

| File | Change |
|------|--------|
| `components/location/experiences-section.tsx` | Full rewrite — new editorial card layout with category nav |
| Sanity Studio | Upload images for each experience (manual or seed script) |

## What Does NOT Change

- Sanity schema (`experience.ts`) — no field additions needed
- Location page (`app/[locale]/location/page.tsx`) — same props, same data flow
- Sanity queries — `allExperiencesQuery` already fetches all fields including image
- Other sections on the location page

## Edge Cases

- **Missing image:** If an experience has no image, render a fallback gradient based on category (teal for culture, blue for nature, gold for gastronomy)
- **Empty category:** If a category has 0 experiences, hide its nav icon
- **1–2 experiences in a category:** Featured only (1 item) or featured + 1 small card spanning wider (2 items)
- **Locale support:** Title and description already use `locale` prop for `getLocalizedValue` — no change needed

## Out of Scope

- Click-to-expand modal on cards (keep it simple, the card shows enough info)
- Carousel/swipe between categories (tab click only)
- Adding new fields to the Experience schema
