# Sanity Studio UX Redesign

**Date:** 2026-03-30
**Status:** Approved
**Scope:** Sanity Studio editing experience for seacret-investors-v2

## Problem

The default Sanity Studio configuration is difficult to use for non-technical users (content managers, clients). All 16 document types (plus 2 object types) appear in a flat list, every text field expands into 4 language sub-fields, and there is no logical grouping, guidance, or field descriptions.

## Target Users

- Content managers / marketers
- Clients (investors / developers)
- Non-technical, need a simple and clear interface

## Studio Interface Language

English only (field labels, descriptions, validation messages).

## Design

### 1. Custom Desk Structure

Replace deprecated `deskTool()` with `structureTool()` from `sanity/structure` (renamed in Sanity v3.20+). Custom structure defined in `sanity/desk/structure.ts`.

**Navigation groups:**

```
Pages          (icon: DocumentText)
  ├── Home           → singleton, direct edit
  ├── Residences     → singleton
  ├── Masterplan     → singleton
  ├── Location       → singleton
  ├── About          → singleton
  └── Contact        → singleton

Properties     (icon: Home)
  ├── Villa Types    → list with preview (name + area)
  ├── Units          → list with preview (unitNumber + status badge)
  └── Plots          → list with preview (name)

Content        (icon: Package)
  ├── Upgrades       → list ordered by sortOrder
  ├── Experiences    → list ordered by sortOrder
  ├── FAQ            → list ordered by sortOrder
  └── Developer      → singleton

Settings       (icon: Cog)
  ├── Site Settings  → singleton
  └── UI Strings     → singleton

Leads          (icon: Envelope)
  └── Submissions    → list, read-only, newest first
```

**Singleton pattern:** Pages and settings documents open directly in edit mode — no intermediate list, no "Create new" button, no confusion. A helper function creates singleton list items that filter to a specific document ID.

**Singleton document IDs:** `homePage`, `residencesPage`, `masterplanPage`, `locationPage`, `aboutPage`, `contactPage`, `siteSettings`, `uiStrings`, `developer`.

Note: All singletons except `developer` are already seeded with `_id == _type`. The `developer` document is currently fetched by type (`*[_type == "developer"][0]`), so the singleton structure must either create it with a fixed ID on first use, or filter by type.

### 2. Language Filter

Install `@sanity/language-filter` plugin.

**Configuration:**
- Languages: `en` (default), `he`, `ru`, `el`
- Filtered field types: `localeString`, `localeText`
- Default behavior: show only English
- English (default language) is always visible and cannot be hidden
- Users toggle additional languages via a toolbar button

**Result:** Instead of 4 sub-fields per text field, the user sees only the active language. Clean, uncluttered editing experience.

### 3. Schema Groups (Tabs)

Add `groups` to each document schema for tab-based navigation within documents. Replaces the current flat list of fields with logical sections.

**HomePage groups:**
- `hero` — heroTagline, heroSubtitle, heroImage, heroVideoUrl
- `concept` — conceptEyebrow, conceptCopy, conceptImage
- `lifestyle` — lifestyleTitle, lifestyleMoments array
- `sections` — featuredVillas, masterplanImage, ctaTitle, ctaSubtitle, locationTitle, locationDescription, locationHighlights, residencesTitle, residencesDescription, masterplanTitle, masterplanDescription, inlineContactEyebrow, inlineContactTitle, inlineContactDescription
- `seo` — seoTitle, seoDescription

**Unit groups:**
- `general` — unitNumber, plot, villaType, status
- `areas` — totalArea, outdoorArea, groundFloor, upperFloor, attic, balcony, roofTerrace
- `features` — bedrooms, bathrooms, hasPool, hasParking, floorLevel

**Villa groups:**
- `general` — name, slug, label, summary, highlights
- `media` — heroImage, galleryImages, floorPlanImages, tourUrl
- `specs` — typicalBedrooms, typicalBathrooms, areaRange, sortOrder

**Plot groups:**
- `general` — name, summary, aerialImage
- `position` — positionData object (x, y percentages for masterplan)
- `settings` — sortOrder

**ResidencesPage groups:**
- `hero` — heroImage, heroTitle, introCopy
- `sections` — collectionEyebrow, collectionTitle, collectionDescription, compareEyebrow, compareTitle, compareDescription, upgradesEyebrow, upgradesTitle, upgradesDescription, faqEyebrow, faqTitle
- `seo` — seoTitle, seoDescription

**LocationPage groups:**
- `hero` — heroImage, heroTitle
- `why` — whySection, whyEyebrow, whyTitle, whyFeatures array
- `highlights` — highlightTitle, highlightDescription, highlights array
- `distances` — distanceEyebrow, distanceTitle, distanceDescription, distances array, distanceMarkers array
- `airports` — airportEyebrow, airportTitle, airportDescription, airports array
- `experiences` — experiencesEyebrow, experiencesTitle, experiencesDescription
- `seo` — seoTitle, seoDescription

**MasterplanPage groups:**
- `hero` — heroImage, heroTitle, introCopy
- `stats` — statTotalLabel, statAvailableLabel, statReservedLabel, statSoldLabel, statPlotsLabel
- `explorer` — explorerEyebrow, explorerTitle, explorerDescription
- `inventory` — inventoryEyebrow, inventoryTitle, inventoryDescription
- `seo` — seoTitle, seoDescription

**ContactPage groups:**
- `hero` — heroTitle, heroSubtitle, responsePromise
- `office` — officeInfo, directEyebrow, directTitle, directDescription
- `labels` — labelEmail, labelPhone, labelOfficeHours
- `options` — budgetOptions, timelineOptions
- `seo` — seoTitle, seoDescription

**AboutPage groups:**
- `hero` — heroTitle, heroSubtitle, heroImage
- `story` — storyEyebrow, storyTitle, storyContent
- `stats` — stats array
- `values` — valuesEyebrow, valuesTitle, values array
- `founders` — foundersEyebrow, founders array
- `cta` — ctaTitle, ctaSubtitle, ctaButton
- `seo` — seoTitle, seoDescription

**UI Strings** — already has 9 groups defined in schema. Keep existing group IDs:
- `nav` — 6 strings
- `footer` — 7 strings
- `status` — 4 strings
- `specs` — 8 strings
- `form` — 12 strings
- `cta` — 8 strings
- `filters` — 21 strings
- `pricing` — 2 strings
- `misc` — 27 strings

**SiteSettings groups:**
- `general` — projectName, salesEmail, salesPhone, whatsappNumber, officeHours
- `brochures` — brochurePdf (object with en, he, ru, el file fields)
- `legal` — legalLinks (object with privacyPolicy, termsConditions, cookiePolicy URLs)
- `seo` — seoDescription

**Other schemas** (upgrade, experience, faq, leadSubmission): These have few enough fields that groups are optional. Add groups only if the field count justifies it.

### 4. Field UX Improvements

**Descriptions and placeholders:** Add `description` to all non-obvious fields with human-readable guidance.

Examples:
- `heroVideoUrl`: "YouTube or Vimeo link. Plays in background on the homepage hero."
- `areaRange` on villa: "e.g. '130-134' — the range of total area across units of this type"
- `position.x` on plot: "Horizontal position on the masterplan image (0 = left, 100 = right)"
- `lifestyleMoments`: "Add moments that showcase the Sea'cret lifestyle. Each needs a time period, description, and photo."

**Document icons:** Each document type gets a distinctive icon from `@sanity/icons` for quick visual recognition in the sidebar and lists.

**Validation messages:** Replace default "Required" with context-specific messages.

Examples:
- heroImage: "Please add a hero image — it's shown at the top of the page"
- unitNumber on unit: "Every unit needs a unique identifier (e.g. A1, B2)"
- email on leadSubmission: already read-only, no validation needed

**Read-only Lead Submissions:** All fields set to `readOnly: true`. No publish button. Description at the top: "Submissions from the contact form. View only."

## Out of Scope

- Data model changes (localeString/localeText structure stays as-is)
- GROQ query changes on the frontend
- Seed data migration
- Preview panes / live preview
- Document-level internationalization migration
- Custom input components

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@sanity/language-filter` | `^4.1.0` | Language toggle in Studio toolbar (v5 requires Sanity 5, v3.x requires React 18) |

Note: `@sanity/icons` is bundled with `sanity` v3 — no separate install needed.

## Files to Create/Modify

**New files:**
- `sanity/desk/structure.ts` — custom desk structure with groups and singletons

**Modified files:**
- `sanity.config.ts` — replace `deskTool()` with `structureTool({ structure })` from `sanity/structure`, add language filter plugin
- `sanity/schemaTypes/homePage.ts` — add groups, descriptions, validation messages
- `sanity/schemaTypes/residencesPage.ts` — add groups, descriptions
- `sanity/schemaTypes/masterplanPage.ts` — add groups, descriptions
- `sanity/schemaTypes/locationPage.ts` — add groups, descriptions
- `sanity/schemaTypes/contactPage.ts` — add groups, descriptions
- `sanity/schemaTypes/aboutPage.ts` — add groups, descriptions
- `sanity/schemaTypes/villa.ts` — add groups, descriptions, icons
- `sanity/schemaTypes/unit.ts` — add groups, descriptions
- `sanity/schemaTypes/plot.ts` — add groups, descriptions
- `sanity/schemaTypes/upgrade.ts` — add icon, descriptions
- `sanity/schemaTypes/experience.ts` — add icon, descriptions
- `sanity/schemaTypes/faq.ts` — add icon, descriptions
- `sanity/schemaTypes/developer.ts` — add icon, descriptions
- `sanity/schemaTypes/siteSettings.ts` — add groups, descriptions
- `sanity/schemaTypes/uiStrings.ts` — add 9 groups (tabs by category)
- `sanity/schemaTypes/leadSubmission.ts` — read-only, icon
- `package.json` — add @sanity/language-filter dependency
