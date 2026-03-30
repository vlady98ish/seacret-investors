# i18n: Fill Translations + Safety Net

**Date:** 2026-03-30
**Status:** Approved
**Scope:** Fill missing translations for RU/HE/EL, add validation, GROQ fallbacks, translation badge

## Problem

246 localeString/localeText fields across 7 documents (+ 97 UI strings) are missing Russian, Hebrew, and Greek translations. When a user switches locale on the frontend, they see English fallback or empty content. There is no mechanism to prevent publishing incomplete translations.

## Design

### 1. Fill Translations Script

**File:** `sanity/seed/fill-translations.ts`

A one-shot script that:
- Fetches all documents from Sanity that have localeString/localeText fields
- For each field with a non-empty `en` value but missing `ru`, `he`, or `el` — fills in the translation
- Translations are hardcoded in the script (not AI-generated at runtime)
- Uses `client.patch()` with batch mutations for efficiency
- Skips fields that already have a non-empty translation (never overwrites)

**Documents to translate:**
- `homePage` — 18 fields
- `residencesPage` — 15 fields
- `masterplanPage` — 15 fields
- `locationPage` — 49 fields
- `contactPage` — 19 fields
- `aboutPage` — 33 fields
- `uiStrings` — 97 fields

**Languages:** Russian (ru), Hebrew (he), Greek (el)

**Total translations to generate:** ~246 fields × 3 languages = ~738 translations

### 2. Validation Helper

**File:** `sanity/lib/validation.ts`

A shared validation function `requireAllTranslations` that:
- Takes a Sanity `Rule` and returns a custom validation
- Checks that all 4 language keys (`en`, `he`, `ru`, `el`) have non-empty trimmed values
- Returns error message listing which languages are missing
- Blocks publishing (error level, not warning)

**Applied to critical fields only:**
- All `seoTitle` and `seoDescription` fields (every page)
- All hero titles (`heroTagline`, `heroTitle`)
- Navigation strings in uiStrings (`navHome`, `navResidences`, etc.)
- CTA strings in uiStrings (`ctaScheduleTour`, `ctaRequestInfo`, etc.)
- Status badges (`statusAvailable`, `statusReserved`, `statusSold`, `statusSoldOut`)
- Form strings (`formSubmit`, `formSuccess`, `formError`)

**Not applied to:**
- Array items (locationHighlights, lifestyleMoments, etc.) — too restrictive for editing flow
- Secondary descriptions and eyebrows — fallback to English is acceptable
- Fields in leadSubmission (read-only, not translated)

### 3. GROQ coalesce() Fallbacks

**File:** `lib/sanity/queries.ts`

Update all GROQ queries to use `coalesce()` for locale field access:

```groq
// Before:
heroTitle[$locale]

// After:
coalesce(heroTitle[$locale], heroTitle.en, "")
```

This ensures:
1. Try the requested locale first
2. Fall back to English if the locale field is empty
3. Fall back to empty string if English is also empty

Apply to every localeString/localeText field access in every query.

### 4. Translation Completeness Badge

**File:** `sanity/components/translation-badge.ts`

A custom document badge that shows translation status:
- **Green ("Translated"):** All localeString/localeText fields have all 4 languages filled
- **Yellow ("Partial"):** Some fields have translations, some don't
- **Red ("EN only"):** No translations beyond English

**Configuration in `sanity.config.ts`:**
```ts
document: {
  badges: (prev, context) => [...prev, TranslationBadge],
}
```

Badge scans all fields of the document recursively, checking locale objects for completeness.

**Applies to all document types except:**
- `leadSubmission` (read-only, not translated)
- `localeString` / `localeText` (object types, not documents)

## Out of Scope

- Migration to document-level i18n
- Migration to internationalized-array plugin
- AI-powered translation in Studio
- TMS integrations
- Portable Text localization
- Hebrew RTL layout changes

## Files to Create/Modify

**New files:**
- `sanity/seed/fill-translations.ts` — one-shot translation script
- `sanity/lib/validation.ts` — shared validation helper
- `sanity/components/translation-badge.ts` — document badge component

**Modified files:**
- `lib/sanity/queries.ts` — add coalesce() to all locale field accesses
- `sanity.config.ts` — register translation badge
- `sanity/schemaTypes/homePage.ts` — apply requireAllTranslations to critical fields
- `sanity/schemaTypes/residencesPage.ts` — apply to critical fields
- `sanity/schemaTypes/masterplanPage.ts` — apply to critical fields
- `sanity/schemaTypes/locationPage.ts` — apply to critical fields
- `sanity/schemaTypes/contactPage.ts` — apply to critical fields
- `sanity/schemaTypes/aboutPage.ts` — apply to critical fields
- `sanity/schemaTypes/uiStrings.ts` — apply to nav, CTA, status, form strings

## Dependencies

None — all using existing packages.
