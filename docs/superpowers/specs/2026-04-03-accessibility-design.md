# Accessibility Design Spec — Sea'cret Residences V2

**Date:** 2026-04-03
**Target:** WCAG 2.1 AA for critical elements + UX-focused accessibility
**Approach:** Component-by-component (Approach A)
**Libraries:** Radix UI Primitives, eslint-plugin-jsx-a11y

---

## Decisions

- **WCAG Level:** AA compliance for critical elements (forms, navigation, modals), with emphasis on real usability over formal checkbox compliance.
- **Component library:** Radix UI Primitives (headless, unstyled). Existing Tailwind styles remain unchanged.
- **Tooling:** `eslint-plugin-jsx-a11y` for development-time linting. No runtime axe testing.
- **Scope:** All pages equally — no priority ordering by page.
- **Approach:** Component-by-component. Each component is fully brought to a11y standard before moving to the next.

---

## 1. Infrastructure

### Packages to install

- `@radix-ui/react-dialog` — mobile menu, lightbox, sticky CTA
- `@radix-ui/react-accordion` — FAQ section
- `@radix-ui/react-visually-hidden` — hidden accessible text
- `eslint-plugin-jsx-a11y` — a11y linting

### Skip Link

- Add as first element inside `app/[locale]/layout.tsx`
- Localized text: "Skip to main content" / equivalent in he, ru, el
- Visually hidden by default, visible on focus (Tailwind: `sr-only focus:not-sr-only`)
- Target: `<main id="main-content">`

### ESLint

- Add `plugin:jsx-a11y/recommended` to ESLint config
- Run to identify current violations; fix during component work

---

## 2. Header / Navigation

**File:** `components/site-header.tsx`

### Mobile menu → Radix Dialog

- Replace overlay implementation with `Dialog.Root` / `Dialog.Portal` / `Dialog.Overlay` / `Dialog.Content`
- Burger button → `Dialog.Trigger`
- Gains: focus trap, `aria-modal`, Escape close, focus return on close
- Tailwind styles unchanged

### ARIA

- `aria-current="page"` on active nav link (desktop + mobile)
- `aria-label="Main navigation"` on `<nav>`
- Existing aria-labels on menu toggle — keep as-is

### Focus styles

- Add `focus-visible:outline` or `focus-visible:ring` on all nav links (desktop)

---

## 3. Footer

**File:** `components/site-footer.tsx`

### ARIA

- `aria-label="Footer navigation"` on `<nav>`
- `aria-current="page"` on active link

### Contrast

- Replace `text-white/60` with a concrete color achieving >= 4.5:1 ratio on `--color-night` (#09222a)
- Replace `text-white/40` similarly — maintain visual hierarchy (muted vs primary) while passing AA
- Both colors to be determined with a contrast checker tool

### Links

- If legal text (Privacy Policy, Terms) uses `<span>` — convert to `<a>` or `<button>`
- Add focus-visible styles on all footer links

---

## 4. FAQ Accordion

**File:** `components/sections/faq-accordion.tsx`

### Migration to Radix Accordion

- Replace custom toggle implementation with `Accordion.Root` / `Accordion.Item` / `Accordion.Trigger` / `Accordion.Content`
- `type="single"` + `collapsible` — matches current behavior
- Chevron animation via `data-[state=open]:rotate-180`
- Radix provides: `aria-expanded`, `aria-controls`, `role="region"`, keyboard nav (Arrow Up/Down, Home, End)
- Tailwind styles unchanged

---

## 5. Modals (Lightbox, Sticky CTA)

### Lightbox (Image Gallery)

**File:** `components/villa-detail/image-gallery.tsx`

- Wrap fullscreen gallery in Radix `Dialog`
- `Dialog.Title` with `VisuallyHidden`: "Photo gallery"
- `Dialog.Description` with `VisuallyHidden`: "Photo X of Y, {villaName}"
- Existing Arrow Left/Right keyboard navigation — keep
- Focus trap, Escape close, focus return — from Radix
- On open: focus on content. On close: return focus to thumbnail.

### Sticky CTA

**File:** `components/sticky-cta.tsx`

- Wrap drawer in Radix `Dialog`
- Floating button → `Dialog.Trigger`
- `Dialog.Title`: "Request information" (visually hidden or visible)
- Focus trap inside form, Escape close
- On close: return focus to floating button

### Both modals

- Radix auto-adds `aria-modal="true"`, `role="dialog"`, `aria-hidden` on background
- Remove manual `overflow: hidden` body management — Radix handles scroll lock

---

## 6. Forms

**Files:** `components/contact-form.tsx`, `components/contact/multi-step-form.tsx`

### Error-field association

- Each input: `aria-describedby="error-{fieldName}"` when error exists
- Each error message: `id="error-{fieldName}"`
- `aria-invalid="true"` on fields with errors

### Status messages

- Success: `<div role="status" aria-live="polite">`
- Error: `<div role="alert">`

### Multi-step form — step indicator

- Container: `aria-label="Step {current} of {total}"`
- Dots: `aria-current="step"` on current, `aria-label="Step N"` on each
- `aria-live="polite"` on container to announce step changes

### Multi-step form — villa selection (Step 1)

- Use `role="radiogroup"` on the container + `role="radio"` + `aria-checked` on each option (single-select behavior matches radio semantics best)
- Add `aria-label` on the radiogroup: "Select a villa"

### Preserved

- `autoComplete` attributes — already present
- `required` attributes — already present
- Label associations — already present

---

## 7. Tables

**Files:** `components/residences/comparison-table.tsx`, `components/residences/inventory-table.tsx`, `components/villa-detail/units-table.tsx`

### Header semantics

- `scope="col"` on all `<th>` in `<thead>`
- `scope="row"` on `<th>` in rows (if first column is villa/unit name)

### Caption

- `<caption>` on each table: "Villa comparison", "Available units", "Unit inventory"
- Styled via Tailwind or hidden with `VisuallyHidden` if not needed visually

### Status badges

- Verify text inside badges is present (not color-only)
- Check contrast of badge text on colored backgrounds — fix if < 4.5:1

### Responsive scroll

- Scrollable table wrapper: `role="region"` + `aria-label="Scrollable table"` + `tabindex="0"`
- Enables keyboard users to scroll horizontally

---

## 8. Image Gallery (Carousel)

**File:** `components/villa-detail/image-gallery.tsx`

### Carousel region

- Container: `role="region"` + `aria-label="Photo gallery, {villaName}"` + `aria-roledescription="carousel"`

### Slides

- Each slide: `role="group"` + `aria-roledescription="slide"` + `aria-label="Photo {i} of {total}"`
- Visible slide: `aria-hidden="false"`, others: `aria-hidden="true"`

### Dot indicators

- `aria-label="Go to photo {i}"` on each dot
- `aria-current="true"` on active dot

### Navigation buttons

- `aria-label="Previous photo"` / `"Next photo"` — already present, keep
- `aria-disabled="true"` when on first/last slide (if not looping)

### Live region

- Hidden `<div aria-live="polite" aria-atomic="true">`: announces "Photo {i} of {total}" on manual slide change
- No announcement on auto-scroll

---

## 9. Locale Switcher

**File:** `components/locale-switcher.tsx`

- Container: `aria-label="Choose language"`
- Each button/link: `aria-label` with full language name in native script: "English", "עברית", "Русский", "Ελληνικά"
- `aria-current="true"` on current language
- Visual display remains short codes (en, he, ru, el)

---

## 10. Color Contrast (Global Pass)

**File:** `app/globals.css` + component files

### Header navigation

- `text-white/60` → concrete color with >= 4.5:1 on `--color-night` (#09222a)
- Approximate target: ~`#9fb3b8` or similar (verify with contrast tool)

### Footer

- `text-white/60` and `text-white/40` → concrete colors >= 4.5:1
- Maintain visual hierarchy: primary text brighter, secondary slightly dimmer, both passing AA

### Forms

- Placeholder text: check contrast (not required by WCAG, but improve for UX)
- Label text: verify >= 4.5:1

### Status badges

- Check text contrast inside `badge-available`, `badge-reserved`, `badge-sold`
- Darken backgrounds or change text color if < 4.5:1

### Approach

- Preserve existing design palette — pick nearest passing colors
- Update CSS custom properties in `globals.css` where applicable

---

## Files to modify (complete list)

| File | Changes |
|------|---------|
| `app/[locale]/layout.tsx` | Skip link, `id="main-content"` on `<main>` |
| `components/site-header.tsx` | Radix Dialog for mobile menu, aria-current, focus styles |
| `components/site-footer.tsx` | aria-label, aria-current, contrast fix, legal links |
| `components/sections/faq-accordion.tsx` | Radix Accordion migration |
| `components/villa-detail/image-gallery.tsx` | Radix Dialog for lightbox, carousel ARIA, live region |
| `components/sticky-cta.tsx` | Radix Dialog for drawer |
| `components/contact-form.tsx` | aria-describedby, aria-invalid, aria-live |
| `components/contact/multi-step-form.tsx` | Step indicator ARIA, error associations, selection buttons |
| `components/residences/comparison-table.tsx` | scope, caption, badge contrast, scroll wrapper |
| `components/residences/inventory-table.tsx` | scope, caption, scroll wrapper |
| `components/villa-detail/units-table.tsx` | scope, caption, scroll wrapper |
| `components/locale-switcher.tsx` | aria-label, aria-current |
| `app/globals.css` | Contrast color updates |
| `.eslintrc` / `eslint.config.*` | jsx-a11y plugin |
| `package.json` | New dependencies |
