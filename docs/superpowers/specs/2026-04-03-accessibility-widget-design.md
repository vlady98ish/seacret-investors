# Accessibility Widget Design Spec

**Date:** 2026-04-03
**Scope:** Floating accessibility settings widget with 5 toggles, localStorage persistence, localized to 4 languages.

---

## Decisions

- **Placement:** Fixed button, bottom-left corner (left-6 bottom-6), does not conflict with Sticky CTA (bottom-right)
- **Panel:** Radix Dialog, opens from button click
- **Settings storage:** localStorage key `a11y-settings`, JSON object, persists between visits
- **CSS strategy:** Classes on `<html>` element, global CSS rules in `globals.css`
- **Localization:** Hardcoded translation object in component (4 languages: en, he, ru, el)
- **Icon:** Lucide `Accessibility` icon

## Settings

| Setting | CSS class | Effect |
|---------|-----------|--------|
| Large text | `a11y-large-text` | Increases base font-size ~25% |
| High contrast | `a11y-high-contrast` | Dark background, white text, bright links |
| Stop animations | `a11y-no-animations` | `animation: none !important; transition: none !important` on all elements |
| Highlight links | `a11y-highlight-links` | All `<a>` get underline + visible outline |
| Large cursor | `a11y-large-cursor` | Enlarged cursor via CSS |

## Component

**File:** `components/accessibility-widget.tsx`

- Client component ("use client")
- Uses Radix Dialog (already installed) for panel
- Uses `VisuallyHidden` for Dialog title (screen reader only)
- Reads `locale` prop, uses hardcoded translations
- On mount: reads localStorage, applies classes to `document.documentElement`
- On toggle: updates state, localStorage, and `<html>` classes
- Reset button: clears all settings, removes all classes, clears localStorage

## CSS

**File:** `app/globals.css`

New section with rules for each `a11y-*` class on `html`:
- `html.a11y-large-text` — font-size increase
- `html.a11y-high-contrast` — forced colors, dark bg, white text
- `html.a11y-no-animations` — disable all motion
- `html.a11y-highlight-links` — underline + outline on links
- `html.a11y-large-cursor` — large cursor

## Layout integration

**File:** `app/[locale]/layout.tsx`

Add `<AccessibilityWidget locale={typedLocale} />` alongside `<StickyCTA>`.

## Files to modify

| File | Changes |
|------|---------|
| `components/accessibility-widget.tsx` | New file: full widget component |
| `app/globals.css` | Add a11y-* CSS classes |
| `app/[locale]/layout.tsx` | Add widget to layout |
