# Blueprint Reveal — Plot Layout Viewer

## Overview

When a user clicks a plot pin on the masterplan aerial image, the view transitions into an interactive architectural blueprint showing the plot's site plan with positioned unit hotspots. This replaces both the aerial view and the right-side detail panel — all information lives inside the blueprint.

## User Flow

1. User sees masterplan with aerial image + plot pins (existing behavior)
2. User clicks a plot pin (e.g., Plot B)
3. Animated transition: aerial zooms/blurs out → blueprint fades in with SVG line-drawing animation → unit hotspots appear in cascade
4. User hovers/taps unit hotspots to see specs (tooltip on desktop, bottom sheet on mobile)
5. User clicks "View Villa" in tooltip to navigate to villa detail page
6. User presses "Back to masterplan" button or Escape to reverse the animation back to aerial view

## Animation Sequence (~1.5s total)

### Phase 1: Zoom Out (0–0.4s)
- Right-side `PlotDetailPanel` fades out + slides right
- Aerial image begins blur (0 → 8px) + zoom toward selected plot pin
- Framer Motion `layout` animation on the container expanding to full width

### Phase 2: Morph (0.4–0.8s)
- Aerial fully fades out (opacity 0)
- Blueprint container scales from 0% to 100% width
- Dark background (`--color-night`) fades in behind

### Phase 3: Blueprint Build (0.8–1.5s)
- Plot boundary SVG lines draw themselves (`stroke-dashoffset` animation)
- Background architectural plan image fades in with subtle scale (0.95 → 1.0)
- Unit hotspot zones appear in staggered cascade with spring/bounce easing
- Header bar (plot name, availability badge, back button) slides in from top
- Orientation labels (Sea View / Mountain View) fade in at bottom

### Reverse Transition
Triggered by "Back to masterplan" button or Escape key. Same phases in reverse order:
- Unit blocks shrink + fade
- Blueprint container fades out
- Aerial unblurs + zooms out
- Detail panel slides back in from right
- Full 60/40 layout restored

## Blueprint View Layout

### Desktop
Full width of the masterplan section (replaces both aerial + panel columns):

```
┌─────────────────────────────────────────────────────┐
│ [Plot B]  [3 of 5 available]        [Esc] [← Back] │  ← Header
├─────────────────────────────────────────────────────┤
│                                                     │
│   ┌──────┐ ┌──────┐ ┌──────┐ ┌─────┐ ┌─────┐      │
│   │  1   │ │  2   │ │  3   │ │  4  │ │  5  │      │  ← Unit hotspots
│   │ YAIR │ │ YAIR │ │ SOLD │ │ TAI │ │ TAI │      │    overlaid on
│   │  ✓   │ │  ✓   │ │  ✗   │ │  ◉  │ │  ✓  │      │    plan image
│   └──────┘ └──────┘ └──────┘ └─────┘ └─────┘      │
│                                                     │
│   (architectural plan image as background)          │
│                                                     │
├─────────────────────────────────────────────────────┤
│ 🏔 Mountain view                     🌊 Sea view   │  ← Orientation
└─────────────────────────────────────────────────────┘
```

### Unit Hotspot Zones
- Semi-transparent colored overlays positioned over each unit on the plan image
- Color coding matches existing system: green (available), amber (reserved), red (sold)
- Show unit number + villa type name + status badge
- Sold units are dimmed (opacity 0.5)
- Hover triggers spec tooltip with spring animation

### Spec Tooltip (Desktop)
Appears above the hovered unit hotspot:
- Unit number + villa type name (e.g., "Unit #2 - Yair")
- Total area, bedrooms, bathrooms, pool, parking
- Status badge
- "View Villa →" CTA button linking to `/[locale]/villas/[slug]`
- Dismisses on mouse leave

### Mobile
- Blueprint occupies full screen (fixed position overlay)
- No hover → tap on unit opens bottom sheet with specs
- Bottom sheet matches existing `PlotDetailPanel` mobile pattern (drag handle, swipe down to dismiss)
- Close button (✕) or swipe down returns to aerial masterplan

## Floor Tabs (Plot E & F)

Plots with multiple floors show a tab switcher in the header:

```
[Plot E]  [Ground Floor | 1st Floor]     [← Back]
```

- Pill-style toggle with active state highlight
- Switching floors triggers crossfade animation on the plan image and unit hotspots
- Each floor has its own layout image and unit positions
- Ground Floor shows LOLA units, 1st Floor shows MIKA units

## Sanity CMS Schema Changes

### Plot Schema — New Fields

```ts
// Layout images (1 per floor; Plot E/F have 2)
defineField({
  name: "layoutImages",
  title: "Layout Plan Images",
  type: "array",
  of: [{
    type: "object",
    fields: [
      { name: "label", type: "string", title: "Floor Label" },  // e.g., "Ground Floor"
      { name: "image", type: "image", title: "Plan Image", options: { hotspot: true } },
    ],
  }],
})

// Unit positions on the layout plan
defineField({
  name: "unitPositions",
  title: "Unit Positions on Layout",
  type: "array",
  of: [{
    type: "object",
    fields: [
      { name: "unit", type: "reference", to: [{ type: "unit" }], title: "Unit" },
      { name: "floorIndex", type: "number", title: "Floor Index", description: "0 = ground, 1 = upper" },
      { name: "x", type: "number", title: "X (%)" },
      { name: "y", type: "number", title: "Y (%)" },
      { name: "width", type: "number", title: "Width (%)" },
      { name: "height", type: "number", title: "Height (%)" },
    ],
  }],
})
```

### Dev-Mode Position Editor
Reuse the existing pin-dragging pattern from `VisualExplorer`:
- Toggle "Edit units" mode in dev environment
- Drag unit hotspot rectangles over the plan image
- Positions auto-save via API (like existing `/api/plots/position`)
- New endpoint: `/api/plots/unit-positions` (PATCH)

## Components

### New Components
- `BlueprintView` — Main container: header, plan image, unit hotspots, orientation bar
- `BlueprintTransition` — Orchestrates the 3-phase animation between aerial and blueprint modes
- `UnitHotspot` — Positioned overlay for a single unit on the plan
- `UnitSpecTooltip` — Desktop hover tooltip with specs
- `FloorTabs` — Tab switcher for multi-floor plots (E/F)

### Modified Components
- `MasterplanInteractive` — Add `viewMode` state ("aerial" | "blueprint"), orchestrate transition
- `VisualExplorer` — Add ref forwarding for transition animation origin point

### Removed from View (During Blueprint)
- `PlotDetailPanel` — Hidden while blueprint is active (animated out, not unmounted)

## Data Flow

1. `MasterplanInteractive` holds `viewMode` state
2. On plot click: `setViewMode("blueprint")` + store selected plot
3. `BlueprintTransition` wraps both `VisualExplorer` and `BlueprintView` with `AnimatePresence`
4. `BlueprintView` receives plot data (already fetched — includes units from existing `allPlotsQuery`)
5. Layout images + unit positions fetched as part of the plot query (extend `allPlotsQuery` GROQ)
6. On "Back": `setViewMode("aerial")`, reverse animation

## Technology

- **Framer Motion** — All transitions, layout animations, `AnimatePresence` for enter/exit
- **SVG path animation** — `stroke-dashoffset` for boundary line drawing effect
- **Next.js Image** — Layout plan images via Sanity CDN
- **Radix UI** — Tooltip primitive for accessible spec popups (desktop)
- **CSS custom properties** — Status colors, consistent theming

## Accessibility

- Keyboard: Escape returns to masterplan, Tab cycles through unit hotspots
- Screen reader: Blueprint announced as region, each unit hotspot is a button with descriptive aria-label
- Focus trap inside blueprint view while active
- Reduced motion: Skip animations, instant transition (respect `prefers-reduced-motion`)
