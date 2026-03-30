# Sanity Studio UX Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the Sanity Studio editing experience with custom navigation, language filtering, grouped tabs, field descriptions, and icons — making it intuitive for non-technical content managers and clients.

**Architecture:** Custom desk structure with 5 navigation groups and singleton patterns for page/settings documents. `@sanity/language-filter` hides inactive language fields. Each schema gets `groups` for tab navigation and `description` for user guidance. No data model or frontend changes.

**Tech Stack:** Sanity v3 (`structureTool`), `@sanity/language-filter@^4.1.0`, `@sanity/icons` (bundled), TypeScript

**Spec:** `docs/superpowers/specs/2026-03-30-sanity-studio-ux-redesign.md`

**Testing note:** Sanity schemas have no unit test framework in this project. Verification is done by running the Studio (`npm run dev` → `/studio`) and visually confirming each change. Each task includes a verification step.

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `package.json` | Modify | Add `@sanity/language-filter` dependency |
| `sanity.config.ts` | Modify | Replace `deskTool` with `structureTool`, add language filter plugin |
| `sanity/desk/structure.ts` | Create | Custom desk structure with 5 groups and singleton helpers |
| `sanity/schemaTypes/homePage.ts` | Modify | Add groups, descriptions, icons |
| `sanity/schemaTypes/residencesPage.ts` | Modify | Add groups, descriptions, icons |
| `sanity/schemaTypes/masterplanPage.ts` | Modify | Add groups, descriptions, icons |
| `sanity/schemaTypes/locationPage.ts` | Modify | Add groups, descriptions, icons |
| `sanity/schemaTypes/contactPage.ts` | Modify | Add groups, descriptions, icons |
| `sanity/schemaTypes/aboutPage.ts` | Modify | Add groups, descriptions, icons |
| `sanity/schemaTypes/villa.ts` | Modify | Add groups, descriptions, icon |
| `sanity/schemaTypes/unit.ts` | Modify | Add groups, descriptions, icon |
| `sanity/schemaTypes/plot.ts` | Modify | Add groups, descriptions, icon |
| `sanity/schemaTypes/upgrade.ts` | Modify | Add icon, descriptions |
| `sanity/schemaTypes/experience.ts` | Modify | Add icon, descriptions |
| `sanity/schemaTypes/faq.ts` | Modify | Add icon, descriptions |
| `sanity/schemaTypes/developer.ts` | Modify | Add icon, descriptions |
| `sanity/schemaTypes/siteSettings.ts` | Modify | Add groups, descriptions, icon |
| `sanity/schemaTypes/leadSubmission.ts` | Modify | Add readOnly to all fields, icon |

---

### Task 1: Install language-filter dependency

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install `@sanity/language-filter`**

```bash
cd /Users/vladyslavi/Projects/Personal/livebetter-projects/seacret-investors-v2 && npm install @sanity/language-filter@^4.1.0
```

Expected: Package added to `package.json` dependencies.

- [ ] **Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install @sanity/language-filter"
```

---

### Task 2: Create custom desk structure and update sanity.config.ts

**Files:**
- Create: `sanity/desk/structure.ts`
- Modify: `sanity.config.ts`

- [ ] **Step 1: Create `sanity/desk/structure.ts`**

```ts
import type { StructureResolver } from "sanity/structure";
import {
  CogIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  HomeIcon,
  PackageIcon,
} from "@sanity/icons";

// Singleton types — open directly in edit mode, no list
const singletonTypes = new Set([
  "homePage",
  "residencesPage",
  "masterplanPage",
  "locationPage",
  "aboutPage",
  "contactPage",
  "siteSettings",
  "uiStrings",
  "developer",
]);

// All types managed via custom structure — hide from default "new document" menu
const hiddenTypes = new Set([
  ...singletonTypes,
  "villa",
  "plot",
  "unit",
  "upgrade",
  "experience",
  "faq",
  "leadSubmission",
  // object types (not documents, but hide from any stray listing)
  "localeString",
  "localeText",
]);

export const structure: StructureResolver = (S) => {
  const singleton = (typeId: string, title: string) =>
    S.listItem()
      .title(title)
      .id(typeId)
      .child(S.document().schemaType(typeId).documentId(typeId));

  const documentList = (
    typeId: string,
    title: string,
    ordering?: { field: string; direction: "asc" | "desc" },
  ) => {
    let list = S.documentTypeList(typeId).title(title);
    if (ordering) {
      list = list.defaultOrdering([ordering]);
    }
    return S.listItem().title(title).child(list);
  };

  return S.list()
    .title("Content")
    .items([
      // — Pages —
      S.listItem()
        .title("Pages")
        .icon(DocumentTextIcon)
        .child(
          S.list()
            .title("Pages")
            .items([
              singleton("homePage", "Home"),
              singleton("residencesPage", "Residences"),
              singleton("masterplanPage", "Masterplan"),
              singleton("locationPage", "Location"),
              singleton("aboutPage", "About"),
              singleton("contactPage", "Contact"),
            ]),
        ),

      S.divider(),

      // — Properties —
      S.listItem()
        .title("Properties")
        .icon(HomeIcon)
        .child(
          S.list()
            .title("Properties")
            .items([
              documentList("villa", "Villa Types", {
                field: "sortOrder",
                direction: "asc",
              }),
              documentList("unit", "Units", {
                field: "unitNumber",
                direction: "asc",
              }),
              documentList("plot", "Plots", {
                field: "sortOrder",
                direction: "asc",
              }),
            ]),
        ),

      S.divider(),

      // — Content —
      S.listItem()
        .title("Content")
        .icon(PackageIcon)
        .child(
          S.list()
            .title("Content")
            .items([
              documentList("upgrade", "Upgrades", {
                field: "sortOrder",
                direction: "asc",
              }),
              documentList("experience", "Experiences", {
                field: "sortOrder",
                direction: "asc",
              }),
              documentList("faq", "FAQ", {
                field: "sortOrder",
                direction: "asc",
              }),
              singleton("developer", "Developer"),
            ]),
        ),

      S.divider(),

      // — Settings —
      S.listItem()
        .title("Settings")
        .icon(CogIcon)
        .child(
          S.list()
            .title("Settings")
            .items([
              singleton("siteSettings", "Site Settings"),
              singleton("uiStrings", "UI Strings"),
            ]),
        ),

      S.divider(),

      // — Leads —
      S.listItem()
        .title("Leads")
        .icon(EnvelopeIcon)
        .child(
          S.documentTypeList("leadSubmission")
            .title("Submissions")
            .defaultOrdering([{ field: "_createdAt", direction: "desc" }]),
        ),
    ]);
};

// Filter singletons out of "new document" options
export const newDocumentOptions = (prev: { templateId: string }[]) =>
  prev.filter(({ templateId }) => !singletonTypes.has(templateId));
```

- [ ] **Step 2: Update `sanity.config.ts`**

Replace the entire file:

```ts
import { languageFilter } from "@sanity/language-filter";
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { newDocumentOptions, structure } from "./sanity/desk/structure";
import { dataset, projectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schemaTypes";

export default defineConfig({
  name: "default",
  title: "Sea'cret Residences Studio",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool({ structure }),
    languageFilter({
      supportedLanguages: [
        { id: "en", title: "English" },
        { id: "he", title: "Hebrew" },
        { id: "ru", title: "Russian" },
        { id: "el", title: "Greek" },
      ],
      defaultLanguages: ["en"],
      filterField: (enclosingType, member, selectedLanguageIds) =>
        !["localeString", "localeText"].includes(enclosingType.name) ||
        selectedLanguageIds.includes(member.name),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
  document: {
    newDocumentOptions,
  },
});
```

- [ ] **Step 3: Verify — run Studio**

```bash
cd /Users/vladyslavi/Projects/Personal/livebetter-projects/seacret-investors-v2 && npm run dev
```

Open `http://localhost:3000/studio`. Verify:
- 5 groups visible in sidebar: Pages, Properties, Content, Settings, Leads
- Clicking "Pages → Home" opens the home page document directly (no list)
- Clicking "Properties → Villa Types" opens a list of villas
- Clicking "Leads" opens submissions sorted newest first
- Language filter toggle visible in the toolbar
- Switching languages shows/hides localeString/localeText sub-fields

- [ ] **Step 4: Commit**

```bash
git add sanity/desk/structure.ts sanity.config.ts
git commit -m "feat: custom desk structure, language filter, migrate to structureTool"
```

---

### Task 3: Add groups and descriptions to page schemas (Part 1 — Home, Residences, Masterplan)

**Files:**
- Modify: `sanity/schemaTypes/homePage.ts`
- Modify: `sanity/schemaTypes/residencesPage.ts`
- Modify: `sanity/schemaTypes/masterplanPage.ts`

- [ ] **Step 1: Update `homePage.ts`**

Replace the entire file:

```ts
import { defineArrayMember, defineField, defineType } from "sanity";
import { HomeIcon } from "@sanity/icons";

export const homePageType = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  icon: HomeIcon,
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "concept", title: "Concept" },
    { name: "lifestyle", title: "Lifestyle" },
    { name: "sections", title: "Sections" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    // Hero
    defineField({ name: "heroTagline", title: "Hero Tagline", type: "localeString", group: "hero", description: "Main headline displayed over the hero image." }),
    defineField({ name: "heroSubtitle", title: "Hero Subtitle", type: "localeString", group: "hero", description: "Smaller text below the tagline." }),
    defineField({ name: "heroImage", title: "Hero Image", type: "image", options: { hotspot: true }, group: "hero", description: "Full-width background image for the homepage hero.", validation: (r) => r.required().error("Please add a hero image — it's the first thing visitors see.") }),
    defineField({ name: "heroVideoUrl", title: "Hero Video URL", type: "url", group: "hero", description: "YouTube or Vimeo link. Plays in background on the homepage hero." }),

    // Concept
    defineField({ name: "conceptEyebrow", title: "Concept Eyebrow", type: "localeString", group: "concept", description: "Small label above the concept title (e.g. 'Our Vision')." }),
    defineField({ name: "conceptCopy", title: "Concept Copy", type: "localeText", group: "concept", description: "Main body text for the concept section." }),
    defineField({ name: "conceptImage", title: "Concept Image", type: "image", options: { hotspot: true }, group: "concept" }),

    // Lifestyle
    defineField({ name: "lifestyleTitle", title: "Lifestyle Section Title", type: "localeString", group: "lifestyle" }),
    defineField({
      name: "lifestyleMoments",
      title: "Lifestyle Moments",
      type: "array",
      group: "lifestyle",
      description: "Add moments that showcase the Sea'cret lifestyle. Each needs a time period, description, and photo.",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "period", title: "Period", type: "string", description: "e.g. 'Morning', 'Afternoon', 'Evening'" }),
          defineField({ name: "copy", title: "Copy", type: "localeText" }),
          defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
        ],
      }],
    }),

    // Sections
    defineField({
      name: "featuredVillas",
      title: "Featured Villas",
      type: "array",
      group: "sections",
      description: "Select villas to highlight on the homepage.",
      of: [defineArrayMember({ type: "reference", to: [{ type: "villa" }] })],
    }),
    defineField({ name: "masterplanImage", title: "Masterplan Aerial Image", type: "image", options: { hotspot: true }, group: "sections" }),
    defineField({ name: "ctaTitle", title: "CTA Title", type: "localeString", group: "sections" }),
    defineField({ name: "ctaSubtitle", title: "CTA Subtitle", type: "localeString", group: "sections" }),
    defineField({ name: "locationTitle", title: "Location Section Title", type: "localeString", group: "sections" }),
    defineField({ name: "locationDescription", title: "Location Section Description", type: "localeText", group: "sections" }),
    defineField({
      name: "locationHighlights",
      title: "Location Highlights",
      type: "array",
      group: "sections",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "title", title: "Title", type: "localeString" }),
          defineField({ name: "description", title: "Description", type: "localeText" }),
        ],
      }],
    }),
    defineField({ name: "residencesTitle", title: "Residences Section Title", type: "localeString", group: "sections" }),
    defineField({ name: "residencesDescription", title: "Residences Section Description", type: "localeText", group: "sections" }),
    defineField({ name: "masterplanTitle", title: "Masterplan Section Title", type: "localeString", group: "sections" }),
    defineField({ name: "masterplanDescription", title: "Masterplan Section Description", type: "localeText", group: "sections" }),
    defineField({ name: "inlineContactEyebrow", title: "Inline Contact Eyebrow", type: "localeString", group: "sections" }),
    defineField({ name: "inlineContactTitle", title: "Inline Contact Title", type: "localeString", group: "sections" }),
    defineField({ name: "inlineContactDescription", title: "Inline Contact Description", type: "localeText", group: "sections" }),

    // SEO
    defineField({ name: "seoTitle", title: "SEO Title", type: "localeString", group: "seo", description: "Title shown in browser tabs and search results." }),
    defineField({ name: "seoDescription", title: "SEO Description", type: "localeText", group: "seo", description: "Short description for search engines (150-160 characters recommended)." }),
  ],
});
```

- [ ] **Step 2: Update `residencesPage.ts`**

Replace the entire file:

```ts
import { defineField, defineType } from "sanity";
import { DocumentsIcon } from "@sanity/icons";

export const residencesPageType = defineType({
  name: "residencesPage",
  title: "Residences Page",
  type: "document",
  icon: DocumentsIcon,
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "sections", title: "Sections" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    // Hero
    defineField({ name: "heroImage", title: "Hero Image", type: "image", options: { hotspot: true }, group: "hero", validation: (r) => r.required().error("Please add a hero image for the residences page.") }),
    defineField({ name: "heroTitle", title: "Hero Title", type: "localeString", group: "hero" }),
    defineField({ name: "introCopy", title: "Intro Copy", type: "localeText", group: "hero", description: "Introductory paragraph below the hero." }),

    // Sections
    defineField({ name: "collectionEyebrow", title: "Collection Eyebrow", type: "localeString", group: "sections" }),
    defineField({ name: "collectionTitle", title: "Collection Title", type: "localeString", group: "sections" }),
    defineField({ name: "collectionDescription", title: "Collection Description", type: "localeText", group: "sections" }),
    defineField({ name: "compareEyebrow", title: "Compare Eyebrow", type: "localeString", group: "sections" }),
    defineField({ name: "compareTitle", title: "Compare Title", type: "localeString", group: "sections" }),
    defineField({ name: "compareDescription", title: "Compare Description", type: "localeText", group: "sections" }),
    defineField({ name: "upgradesEyebrow", title: "Upgrades Eyebrow", type: "localeString", group: "sections" }),
    defineField({ name: "upgradesTitle", title: "Upgrades Title", type: "localeString", group: "sections" }),
    defineField({ name: "upgradesDescription", title: "Upgrades Description", type: "localeText", group: "sections" }),
    defineField({ name: "faqEyebrow", title: "FAQ Eyebrow", type: "localeString", group: "sections" }),
    defineField({ name: "faqTitle", title: "FAQ Title", type: "localeString", group: "sections" }),

    // SEO
    defineField({ name: "seoTitle", title: "SEO Title", type: "localeString", group: "seo", description: "Title shown in browser tabs and search results." }),
    defineField({ name: "seoDescription", title: "SEO Description", type: "localeText", group: "seo", description: "Short description for search engines (150-160 characters recommended)." }),
  ],
});
```

- [ ] **Step 3: Update `masterplanPage.ts`**

Replace the entire file:

```ts
import { defineField, defineType } from "sanity";
import { PresentationIcon } from "@sanity/icons";

export const masterplanPageType = defineType({
  name: "masterplanPage",
  title: "Masterplan Page",
  type: "document",
  icon: PresentationIcon,
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "stats", title: "Stats" },
    { name: "explorer", title: "Explorer" },
    { name: "inventory", title: "Inventory" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    // Hero
    defineField({ name: "heroImage", title: "Hero / Aerial Image", type: "image", options: { hotspot: true }, group: "hero", validation: (r) => r.required().error("Please add a hero image for the masterplan page.") }),
    defineField({ name: "heroTitle", title: "Hero Title", type: "localeString", group: "hero" }),
    defineField({ name: "introCopy", title: "Intro Copy", type: "localeText", group: "hero", description: "Introductory paragraph below the hero." }),

    // Stats
    defineField({ name: "statTotalLabel", title: "Total Residences Label", type: "localeString", group: "stats" }),
    defineField({ name: "statAvailableLabel", title: "Available Label", type: "localeString", group: "stats" }),
    defineField({ name: "statReservedLabel", title: "Reserved Label", type: "localeString", group: "stats" }),
    defineField({ name: "statSoldLabel", title: "Sold Label", type: "localeString", group: "stats" }),
    defineField({ name: "statPlotsLabel", title: "Plots Label", type: "localeString", group: "stats" }),

    // Explorer
    defineField({ name: "explorerEyebrow", title: "Explorer Eyebrow", type: "localeString", group: "explorer" }),
    defineField({ name: "explorerTitle", title: "Explorer Title", type: "localeString", group: "explorer" }),
    defineField({ name: "explorerDescription", title: "Explorer Description", type: "localeText", group: "explorer" }),

    // Inventory
    defineField({ name: "inventoryEyebrow", title: "Inventory Eyebrow", type: "localeString", group: "inventory" }),
    defineField({ name: "inventoryTitle", title: "Inventory Title", type: "localeString", group: "inventory" }),
    defineField({ name: "inventoryDescription", title: "Inventory Description", type: "localeText", group: "inventory" }),

    // SEO
    defineField({ name: "seoTitle", title: "SEO Title", type: "localeString", group: "seo", description: "Title shown in browser tabs and search results." }),
    defineField({ name: "seoDescription", title: "SEO Description", type: "localeText", group: "seo", description: "Short description for search engines (150-160 characters recommended)." }),
  ],
});
```

- [ ] **Step 4: Verify in Studio**

Run `npm run dev`, open `/studio`. Check:
- Home page has 5 tabs: Hero, Concept, Lifestyle, Sections, SEO
- Residences page has 3 tabs: Hero, Sections, SEO
- Masterplan page has 5 tabs: Hero, Stats, Explorer, Inventory, SEO
- Fields appear under the correct tabs
- Descriptions visible under relevant fields

- [ ] **Step 5: Commit**

```bash
git add sanity/schemaTypes/homePage.ts sanity/schemaTypes/residencesPage.ts sanity/schemaTypes/masterplanPage.ts
git commit -m "feat: add groups, descriptions, icons to home/residences/masterplan page schemas"
```

---

### Task 4: Add groups and descriptions to page schemas (Part 2 — Location, Contact, About)

**Files:**
- Modify: `sanity/schemaTypes/locationPage.ts`
- Modify: `sanity/schemaTypes/contactPage.ts`
- Modify: `sanity/schemaTypes/aboutPage.ts`

- [ ] **Step 1: Update `locationPage.ts`**

Replace the entire file:

```ts
import { defineField, defineType } from "sanity";
import { PinIcon } from "@sanity/icons";

export const locationPageType = defineType({
  name: "locationPage",
  title: "Location Page",
  type: "document",
  icon: PinIcon,
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "why", title: "Why Chiliadou" },
    { name: "highlights", title: "Highlights" },
    { name: "distances", title: "Distances" },
    { name: "airports", title: "Airports" },
    { name: "experiences", title: "Experiences" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    // Hero
    defineField({ name: "heroImage", title: "Hero Image", type: "image", options: { hotspot: true }, group: "hero", validation: (r) => r.required().error("Please add a hero image for the location page.") }),
    defineField({ name: "heroTitle", title: "Hero Title", type: "localeString", group: "hero" }),

    // Why Chiliadou
    defineField({ name: "whySection", title: "Why Chiliadou Copy", type: "localeText", group: "why", description: "Main paragraph explaining why Chiliadou is special." }),
    defineField({ name: "whyEyebrow", title: "Why Eyebrow", type: "localeString", group: "why" }),
    defineField({ name: "whyTitle", title: "Why Title", type: "localeString", group: "why" }),
    defineField({
      name: "whyFeatures",
      title: "Why Features",
      type: "array",
      group: "why",
      description: "Key selling points with icons (e.g. climate, nature, safety).",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "icon", title: "Icon Name", type: "string", description: "Lucide icon name (e.g. 'sun', 'shield', 'trees')." }),
          defineField({ name: "heading", title: "Heading", type: "localeString" }),
          defineField({ name: "description", title: "Description", type: "localeText" }),
        ],
      }],
    }),

    // Highlights
    defineField({ name: "highlightTitle", title: "Highlight Section Title", type: "localeString", group: "highlights" }),
    defineField({ name: "highlightDescription", title: "Highlight Section Description", type: "localeText", group: "highlights" }),
    defineField({
      name: "highlights",
      title: "Highlights (cards)",
      type: "array",
      group: "highlights",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "title", title: "Title", type: "localeString" }),
          defineField({ name: "description", title: "Description", type: "localeText" }),
        ],
      }],
    }),

    // Distances
    defineField({ name: "distanceEyebrow", title: "Distance Eyebrow", type: "localeString", group: "distances" }),
    defineField({ name: "distanceTitle", title: "Distance Title", type: "localeString", group: "distances" }),
    defineField({ name: "distanceDescription", title: "Distance Description", type: "localeText", group: "distances" }),
    defineField({
      name: "distances",
      title: "Distance Markers (non-localized)",
      type: "array",
      group: "distances",
      description: "Legacy distance markers with fixed-language place names.",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "place", title: "Place", type: "string" }),
          defineField({ name: "time", title: "Travel Time", type: "string" }),
          defineField({ name: "lat", title: "Latitude", type: "number" }),
          defineField({ name: "lng", title: "Longitude", type: "number" }),
        ],
      }],
    }),
    defineField({
      name: "distanceMarkers",
      title: "Distance Markers (Localized)",
      type: "array",
      group: "distances",
      description: "Localized distance markers shown on the map.",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "place", title: "Place", type: "localeString" }),
          defineField({ name: "time", title: "Travel Time", type: "localeString" }),
          defineField({ name: "detail", title: "Detail", type: "localeString" }),
          defineField({ name: "lat", title: "Latitude", type: "number" }),
          defineField({ name: "lng", title: "Longitude", type: "number" }),
        ],
      }],
    }),

    // Airports
    defineField({ name: "airportEyebrow", title: "Airport Eyebrow", type: "localeString", group: "airports" }),
    defineField({ name: "airportTitle", title: "Airport Title", type: "localeString", group: "airports" }),
    defineField({ name: "airportDescription", title: "Airport Description", type: "localeText", group: "airports" }),
    defineField({
      name: "airports",
      title: "Airports",
      type: "array",
      group: "airports",
      description: "List of nearby airports with connectivity details.",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "code", title: "Code", type: "string", description: "IATA code (e.g. PFO, LCA)." }),
          defineField({ name: "name", title: "Airport Name", type: "localeString" }),
          defineField({ name: "city", title: "City", type: "localeString" }),
          defineField({ name: "travelTime", title: "Travel Time", type: "localeString" }),
          defineField({ name: "destinations", title: "Destinations Count", type: "number" }),
          defineField({ name: "countries", title: "Countries", type: "number" }),
          defineField({ name: "note", title: "Note", type: "localeString" }),
          defineField({ name: "isNearest", title: "Nearest?", type: "boolean" }),
        ],
      }],
    }),

    // Experiences
    defineField({ name: "experiencesEyebrow", title: "Experiences Eyebrow", type: "localeString", group: "experiences" }),
    defineField({ name: "experiencesTitle", title: "Experiences Title", type: "localeString", group: "experiences" }),
    defineField({ name: "experiencesDescription", title: "Experiences Description", type: "localeText", group: "experiences" }),

    // SEO
    defineField({ name: "seoTitle", title: "SEO Title", type: "localeString", group: "seo", description: "Title shown in browser tabs and search results." }),
    defineField({ name: "seoDescription", title: "SEO Description", type: "localeText", group: "seo", description: "Short description for search engines (150-160 characters recommended)." }),
  ],
});
```

- [ ] **Step 2: Update `contactPage.ts`**

Replace the entire file:

```ts
import { defineField, defineType } from "sanity";
import { EnvelopeIcon } from "@sanity/icons";

export const contactPageType = defineType({
  name: "contactPage",
  title: "Contact Page",
  type: "document",
  icon: EnvelopeIcon,
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "office", title: "Office & Direct Contact" },
    { name: "labels", title: "Labels" },
    { name: "options", title: "Form Options" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    // Hero
    defineField({ name: "heroTitle", title: "Hero Title", type: "localeString", group: "hero" }),
    defineField({ name: "heroSubtitle", title: "Hero Subtitle", type: "localeString", group: "hero" }),
    defineField({ name: "responsePromise", title: "Response Promise", type: "localeString", group: "hero", description: "Text like 'We'll get back to you within 24 hours'." }),

    // Office
    defineField({ name: "officeInfo", title: "Office Info", type: "localeText", group: "office", description: "Office address and opening hours text." }),
    defineField({ name: "directEyebrow", title: "Direct Contact Eyebrow", type: "localeString", group: "office" }),
    defineField({ name: "directTitle", title: "Direct Contact Title", type: "localeString", group: "office" }),
    defineField({ name: "directDescription", title: "Direct Contact Description", type: "localeText", group: "office" }),

    // Labels
    defineField({ name: "labelEmail", title: "Label: Email", type: "localeString", group: "labels" }),
    defineField({ name: "labelPhone", title: "Label: Phone", type: "localeString", group: "labels" }),
    defineField({ name: "labelOfficeHours", title: "Label: Office Hours", type: "localeString", group: "labels" }),

    // Form options
    defineField({
      name: "budgetOptions",
      title: "Budget Options",
      type: "array",
      group: "options",
      description: "Options shown in the budget dropdown on the contact form.",
      of: [{ type: "localeString" }],
    }),
    defineField({
      name: "timelineOptions",
      title: "Timeline Options",
      type: "array",
      group: "options",
      description: "Options shown in the timeline dropdown on the contact form.",
      of: [{ type: "localeString" }],
    }),

    // SEO
    defineField({ name: "seoTitle", title: "SEO Title", type: "localeString", group: "seo", description: "Title shown in browser tabs and search results." }),
    defineField({ name: "seoDescription", title: "SEO Description", type: "localeText", group: "seo", description: "Short description for search engines (150-160 characters recommended)." }),
  ],
});
```

- [ ] **Step 3: Update `aboutPage.ts`**

Replace the entire file:

```ts
import { defineField, defineType } from "sanity";
import { UsersIcon } from "@sanity/icons";

export const aboutPageType = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  icon: UsersIcon,
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "story", title: "Our Story" },
    { name: "stats", title: "Stats" },
    { name: "values", title: "Values" },
    { name: "founders", title: "Founders" },
    { name: "cta", title: "CTA" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    // Hero
    defineField({ name: "heroTitle", title: "Hero Title", type: "localeString", group: "hero" }),
    defineField({ name: "heroSubtitle", title: "Hero Subtitle", type: "localeString", group: "hero" }),
    defineField({ name: "heroImage", title: "Hero Image", type: "image", options: { hotspot: true }, group: "hero", validation: (r) => r.required().error("Please add a hero image for the about page.") }),

    // Story
    defineField({ name: "storyEyebrow", title: "Story Eyebrow", type: "localeString", group: "story" }),
    defineField({ name: "storyTitle", title: "Story Title", type: "localeString", group: "story" }),
    defineField({ name: "storyContent", title: "Story Content", type: "localeText", group: "story" }),

    // Stats
    defineField({
      name: "stats",
      title: "Stats Bar",
      type: "array",
      group: "stats",
      description: "Key numbers displayed in a horizontal bar (e.g. '20+ Villas', '6 Plots').",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "value", title: "Value", type: "string", description: "The number or figure (e.g. '20+', '6')." }),
          defineField({ name: "label", title: "Label", type: "localeString" }),
        ],
      }],
    }),

    // Values
    defineField({ name: "valuesEyebrow", title: "Values Eyebrow", type: "localeString", group: "values" }),
    defineField({ name: "valuesTitle", title: "Values Title", type: "localeString", group: "values" }),
    defineField({
      name: "values",
      title: "Values",
      type: "array",
      group: "values",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "icon", title: "Icon", type: "string", description: "Lucide icon name (e.g. 'heart', 'shield', 'leaf')." }),
          defineField({ name: "title", title: "Title", type: "localeString" }),
          defineField({ name: "description", title: "Description", type: "localeText" }),
        ],
      }],
    }),

    // Founders
    defineField({ name: "foundersEyebrow", title: "Founders Eyebrow", type: "localeString", group: "founders" }),
    defineField({
      name: "founders",
      title: "Founders",
      type: "array",
      group: "founders",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "name", title: "Name", type: "string" }),
          defineField({ name: "role", title: "Role", type: "localeString" }),
          defineField({ name: "bio", title: "Bio", type: "localeText" }),
          defineField({ name: "photo", title: "Photo", type: "image", options: { hotspot: true } }),
        ],
      }],
    }),

    // CTA
    defineField({ name: "ctaTitle", title: "CTA Title", type: "localeString", group: "cta" }),
    defineField({ name: "ctaSubtitle", title: "CTA Subtitle", type: "localeString", group: "cta" }),
    defineField({ name: "ctaButton", title: "CTA Button Text", type: "localeString", group: "cta" }),

    // SEO
    defineField({ name: "seoTitle", title: "SEO Title", type: "localeString", group: "seo", description: "Title shown in browser tabs and search results." }),
    defineField({ name: "seoDescription", title: "SEO Description", type: "localeText", group: "seo", description: "Short description for search engines (150-160 characters recommended)." }),
  ],
});
```

- [ ] **Step 4: Verify in Studio**

Open `/studio`. Check:
- Location page has 7 tabs: Hero, Why Chiliadou, Highlights, Distances, Airports, Experiences, SEO
- Contact page has 5 tabs: Hero, Office & Direct Contact, Labels, Form Options, SEO
- About page has 7 tabs: Hero, Our Story, Stats, Values, Founders, CTA, SEO
- All icons appear correctly in the sidebar

- [ ] **Step 5: Commit**

```bash
git add sanity/schemaTypes/locationPage.ts sanity/schemaTypes/contactPage.ts sanity/schemaTypes/aboutPage.ts
git commit -m "feat: add groups, descriptions, icons to location/contact/about page schemas"
```

---

### Task 5: Add groups, descriptions, and icons to property schemas (Villa, Unit, Plot)

**Files:**
- Modify: `sanity/schemaTypes/villa.ts`
- Modify: `sanity/schemaTypes/unit.ts`
- Modify: `sanity/schemaTypes/plot.ts`

- [ ] **Step 1: Update `villa.ts`**

Replace the entire file:

```ts
import { defineField, defineType } from "sanity";
import { HomeIcon } from "@sanity/icons";

export const villaType = defineType({
  name: "villa",
  title: "Villa Type",
  type: "document",
  icon: HomeIcon,
  groups: [
    { name: "general", title: "General", default: true },
    { name: "media", title: "Media" },
    { name: "specs", title: "Specs" },
  ],
  fields: [
    // General
    defineField({ name: "name", title: "Name", type: "string", group: "general", validation: (r) => r.required().error("Every villa type needs a name (e.g. 'Villa Alpha').") }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name" }, group: "general", validation: (r) => r.required(), description: "URL-friendly name. Click 'Generate' to create from the name." }),
    defineField({ name: "label", title: "Label", type: "localeString", group: "general", description: "Short marketing label shown on villa cards." }),
    defineField({ name: "summary", title: "Summary", type: "localeText", group: "general", description: "Brief description of this villa type." }),
    defineField({
      name: "highlights",
      title: "Highlights",
      type: "array",
      group: "general",
      description: "Key selling points (e.g. 'Private pool', 'Sea view').",
      of: [{ type: "localeString" }],
    }),

    // Media
    defineField({ name: "heroImage", title: "Hero Image", type: "image", options: { hotspot: true }, group: "media", validation: (r) => r.required().error("Please add a main photo for this villa type.") }),
    defineField({
      name: "galleryImages",
      title: "Gallery Images",
      type: "array",
      group: "media",
      description: "Additional photos shown in the villa detail gallery.",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "floorPlanImages",
      title: "Floor Plan Images",
      type: "array",
      group: "media",
      description: "Floor plan drawings or diagrams.",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({ name: "tourUrl", title: "3D Tour URL", type: "url", group: "media", description: "Link to a 3D virtual tour (e.g. Matterport)." }),

    // Specs
    defineField({ name: "typicalBedrooms", title: "Typical Bedrooms", type: "number", group: "specs" }),
    defineField({ name: "typicalBathrooms", title: "Typical Bathrooms", type: "number", group: "specs" }),
    defineField({ name: "areaRange", title: "Area Range", type: "string", group: "specs", description: "e.g. '130-134' — the range of total area across units of this type." }),
    defineField({ name: "sortOrder", title: "Sort Order", type: "number", group: "specs", initialValue: 0, description: "Lower numbers appear first in lists." }),
  ],
  preview: {
    select: { title: "name", subtitle: "areaRange" },
    prepare({ title, subtitle }) {
      return { title, subtitle: subtitle ? `${subtitle} m²` : "" };
    },
  },
  orderings: [{ title: "Sort Order", name: "sortOrder", by: [{ field: "sortOrder", direction: "asc" }] }],
});
```

- [ ] **Step 2: Update `unit.ts`**

Replace the entire file:

```ts
import { defineField, defineType } from "sanity";
import { DocumentIcon } from "@sanity/icons";

export const unitType = defineType({
  name: "unit",
  title: "Unit",
  type: "document",
  icon: DocumentIcon,
  groups: [
    { name: "general", title: "General", default: true },
    { name: "areas", title: "Areas" },
    { name: "features", title: "Features" },
  ],
  fields: [
    // General
    defineField({ name: "unitNumber", title: "Unit Number", type: "string", group: "general", validation: (r) => r.required().error("Every unit needs a unique identifier (e.g. A1, B2).") }),
    defineField({ name: "plot", title: "Plot", type: "reference", to: [{ type: "plot" }], group: "general", validation: (r) => r.required().error("Please select the plot this unit is on.") }),
    defineField({ name: "villaType", title: "Villa Type", type: "reference", to: [{ type: "villa" }], group: "general", validation: (r) => r.required().error("Please select the villa type for this unit.") }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      group: "general",
      options: {
        list: [
          { title: "Available", value: "available" },
          { title: "Reserved", value: "reserved" },
          { title: "Sold", value: "sold" },
        ],
        layout: "radio",
      },
      initialValue: "available",
      validation: (r) => r.required(),
    }),

    // Areas
    defineField({ name: "totalArea", title: "Total Area (m²)", type: "number", group: "areas", validation: (r) => r.required().positive().error("Total area is required and must be a positive number.") }),
    defineField({ name: "outdoorArea", title: "Outdoor Area (m²)", type: "number", group: "areas" }),
    defineField({ name: "groundFloor", title: "Ground Floor (m²)", type: "number", group: "areas" }),
    defineField({ name: "upperFloor", title: "Upper Floor (m²)", type: "number", group: "areas" }),
    defineField({ name: "attic", title: "Attic (m²)", type: "number", group: "areas" }),
    defineField({ name: "balcony", title: "Balcony (m²)", type: "number", group: "areas" }),
    defineField({ name: "roofTerrace", title: "Roof Terrace (m²)", type: "number", group: "areas" }),

    // Features
    defineField({ name: "bedrooms", title: "Bedrooms", type: "number", group: "features", validation: (r) => r.required().min(1) }),
    defineField({ name: "bathrooms", title: "Bathrooms", type: "number", group: "features", validation: (r) => r.required().min(1) }),
    defineField({ name: "hasPool", title: "Swimming Pool", type: "boolean", group: "features", initialValue: false }),
    defineField({ name: "hasParking", title: "Parking Spot", type: "boolean", group: "features", initialValue: true }),
    defineField({
      name: "floorLevel",
      title: "Floor Level",
      type: "string",
      group: "features",
      options: { list: [{ title: "Ground", value: "ground" }, { title: "Upper", value: "upper" }] },
      hidden: ({ document }) => !document?.unitNumber?.toString().match(/^[EF]/),
      description: "Only applies to E and F unit types.",
    }),
  ],
  preview: {
    select: { title: "unitNumber", villaName: "villaType.name", plotName: "plot.name", status: "status" },
    prepare({ title, villaName, plotName, status }) {
      return { title: `${title} — ${villaName ?? ""}`, subtitle: `${plotName ?? ""} · ${status ?? ""}` };
    },
  },
  orderings: [{ title: "Unit Number", name: "unitNumber", by: [{ field: "unitNumber", direction: "asc" }] }],
});
```

- [ ] **Step 3: Update `plot.ts`**

Replace the entire file:

```ts
import { defineField, defineType } from "sanity";
import { PinIcon } from "@sanity/icons";

export const plotType = defineType({
  name: "plot",
  title: "Plot",
  type: "document",
  icon: PinIcon,
  groups: [
    { name: "general", title: "General", default: true },
    { name: "position", title: "Position" },
    { name: "settings", title: "Settings" },
  ],
  fields: [
    // General
    defineField({ name: "name", title: "Name", type: "string", group: "general", validation: (r) => r.required().error("Every plot needs a name (e.g. 'Plot A').") }),
    defineField({ name: "summary", title: "Summary", type: "localeText", group: "general" }),
    defineField({ name: "aerialImage", title: "Aerial Image", type: "image", options: { hotspot: true }, group: "general" }),

    // Position
    defineField({
      name: "positionData",
      title: "Position on Masterplan",
      type: "object",
      group: "position",
      description: "Coordinates for placing this plot on the masterplan image.",
      fields: [
        defineField({ name: "x", title: "X (%)", type: "number", description: "Horizontal position (0 = left, 100 = right)." }),
        defineField({ name: "y", title: "Y (%)", type: "number", description: "Vertical position (0 = top, 100 = bottom)." }),
      ],
    }),

    // Settings
    defineField({ name: "sortOrder", title: "Sort Order", type: "number", group: "settings", initialValue: 0, description: "Lower numbers appear first in lists." }),
  ],
  preview: { select: { title: "name" } },
  orderings: [{ title: "Sort Order", name: "sortOrder", by: [{ field: "sortOrder", direction: "asc" }] }],
});
```

- [ ] **Step 4: Verify in Studio**

Open `/studio`. Check:
- Villa Types show 3 tabs: General, Media, Specs
- Units show 3 tabs: General, Areas, Features
- Plots show 3 tabs: General, Position, Settings
- Icons visible next to document names in lists

- [ ] **Step 5: Commit**

```bash
git add sanity/schemaTypes/villa.ts sanity/schemaTypes/unit.ts sanity/schemaTypes/plot.ts
git commit -m "feat: add groups, descriptions, icons to villa/unit/plot schemas"
```

---

### Task 6: Add icons and descriptions to content schemas (Upgrade, Experience, FAQ, Developer)

**Files:**
- Modify: `sanity/schemaTypes/upgrade.ts`
- Modify: `sanity/schemaTypes/experience.ts`
- Modify: `sanity/schemaTypes/faq.ts`
- Modify: `sanity/schemaTypes/developer.ts`

- [ ] **Step 1: Update `upgrade.ts`**

Replace the entire file:

```ts
import { defineField, defineType } from "sanity";
import { SparklesIcon } from "@sanity/icons";

export const upgradeType = defineType({
  name: "upgrade",
  title: "Upgrade",
  type: "document",
  icon: SparklesIcon,
  fields: [
    defineField({ name: "name", title: "Name", type: "localeString", validation: (r) => r.required() }),
    defineField({ name: "description", title: "Description", type: "localeText" }),
    defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true }, description: "Photo or illustration of this upgrade option." }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: { list: ["pool", "jacuzzi", "sauna", "bbq", "smart-house", "security", "fireplace"] },
      description: "Used for filtering and grouping upgrades.",
    }),
    defineField({ name: "sortOrder", title: "Sort Order", type: "number", initialValue: 0, description: "Lower numbers appear first." }),
  ],
});
```

- [ ] **Step 2: Update `experience.ts`**

Replace the entire file:

```ts
import { defineField, defineType } from "sanity";
import { StarIcon } from "@sanity/icons";

export const experienceType = defineType({
  name: "experience",
  title: "Experience",
  type: "document",
  icon: StarIcon,
  fields: [
    defineField({ name: "title", title: "Title", type: "localeString", validation: (r) => r.required() }),
    defineField({ name: "description", title: "Description", type: "localeText" }),
    defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true }, description: "Photo representing this experience." }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: { list: ["culture", "nature", "gastronomy"] },
      description: "Used for filtering experiences on the location page.",
    }),
    defineField({ name: "sortOrder", title: "Sort Order", type: "number", initialValue: 0, description: "Lower numbers appear first." }),
  ],
});
```

- [ ] **Step 3: Update `faq.ts`**

Replace the entire file:

```ts
import { defineField, defineType } from "sanity";
import { HelpCircleIcon } from "@sanity/icons";

export const faqType = defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  icon: HelpCircleIcon,
  fields: [
    defineField({ name: "question", title: "Question", type: "localeString", validation: (r) => r.required() }),
    defineField({ name: "answer", title: "Answer", type: "localeText", validation: (r) => r.required() }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: { list: ["investment", "construction", "legal", "lifestyle", "general"] },
      description: "Groups FAQs by topic on the residences page.",
    }),
    defineField({ name: "sortOrder", title: "Sort Order", type: "number", initialValue: 0, description: "Lower numbers appear first." }),
  ],
  orderings: [{ title: "Sort Order", name: "sortOrder", by: [{ field: "sortOrder", direction: "asc" }] }],
});
```

- [ ] **Step 4: Update `developer.ts`**

Replace the entire file:

```ts
import { defineField, defineType } from "sanity";
import { CaseIcon } from "@sanity/icons";

export const developerType = defineType({
  name: "developer",
  title: "Developer",
  type: "document",
  icon: CaseIcon,
  fields: [
    defineField({ name: "companyName", title: "Company Name", type: "string" }),
    defineField({ name: "description", title: "Description", type: "localeText", description: "About the development company." }),
    defineField({ name: "logo", title: "Logo", type: "image" }),
    defineField({ name: "credentials", title: "Credentials", type: "localeText", description: "Licenses, certifications, or notable achievements." }),
    defineField({
      name: "team",
      title: "Team Members",
      type: "array",
      description: "Key team members shown on the website.",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "name", title: "Name", type: "string" }),
          defineField({ name: "role", title: "Role", type: "localeString" }),
          defineField({ name: "photo", title: "Photo", type: "image" }),
        ],
      }],
    }),
  ],
});
```

- [ ] **Step 5: Verify in Studio**

Open `/studio`. Check:
- Content → Upgrades shows sparkles icon
- Content → Experiences shows star icon
- Content → FAQ shows help circle icon
- Content → Developer opens as singleton with briefcase icon
- Descriptions visible on category fields and sortOrder

- [ ] **Step 6: Commit**

```bash
git add sanity/schemaTypes/upgrade.ts sanity/schemaTypes/experience.ts sanity/schemaTypes/faq.ts sanity/schemaTypes/developer.ts
git commit -m "feat: add icons and descriptions to upgrade/experience/faq/developer schemas"
```

---

### Task 7: Add groups to Settings schemas (SiteSettings, UI Strings)

**Files:**
- Modify: `sanity/schemaTypes/siteSettings.ts`

Note: `uiStrings.ts` already has 9 groups defined — no changes needed there.

- [ ] **Step 1: Update `siteSettings.ts`**

Replace the entire file:

```ts
import { defineField, defineType } from "sanity";
import { CogIcon } from "@sanity/icons";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  icon: CogIcon,
  groups: [
    { name: "general", title: "General", default: true },
    { name: "brochures", title: "Brochures" },
    { name: "legal", title: "Legal" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    // General
    defineField({ name: "projectName", title: "Project Name", type: "string", group: "general" }),
    defineField({ name: "salesEmail", title: "Sales Email", type: "string", group: "general", description: "Shown on the contact page and footer." }),
    defineField({ name: "salesPhone", title: "Sales Phone", type: "string", group: "general", description: "Include country code (e.g. +357 XXX XXXX)." }),
    defineField({ name: "whatsappNumber", title: "WhatsApp Number", type: "string", group: "general", description: "Full number with country code, no spaces (e.g. 35799123456)." }),
    defineField({ name: "officeHours", title: "Office Hours", type: "localeString", group: "general" }),

    // Brochures
    defineField({
      name: "brochurePdf",
      title: "Brochure PDF",
      type: "object",
      group: "brochures",
      description: "Upload a brochure PDF for each language. Visitors download the version matching their language.",
      fields: [
        defineField({ name: "en", title: "English", type: "file" }),
        defineField({ name: "he", title: "Hebrew", type: "file" }),
        defineField({ name: "ru", title: "Russian", type: "file" }),
        defineField({ name: "el", title: "Greek", type: "file" }),
      ],
    }),

    // Legal
    defineField({
      name: "legalLinks",
      title: "Legal Links",
      type: "object",
      group: "legal",
      description: "URLs to legal documents. Shown in the footer.",
      fields: [
        defineField({ name: "privacyPolicy", title: "Privacy Policy URL", type: "url" }),
        defineField({ name: "termsConditions", title: "Terms & Conditions URL", type: "url" }),
        defineField({ name: "cookiePolicy", title: "Cookie Policy URL", type: "url" }),
      ],
    }),

    // SEO
    defineField({ name: "seoDescription", title: "SEO Description", type: "localeText", group: "seo", description: "Default meta description used when a page doesn't have its own." }),
  ],
});
```

- [ ] **Step 2: Verify in Studio**

Open `/studio → Settings → Site Settings`. Check:
- 4 tabs: General, Brochures, Legal, SEO
- Descriptions visible on salesEmail, salesPhone, whatsappNumber, brochurePdf, legalLinks

Open `/studio → Settings → UI Strings`. Check:
- 9 existing tabs still work: Navigation, Footer, Status, Specs, Form, CTA, Filters & Tables, Pricing, Misc

- [ ] **Step 3: Commit**

```bash
git add sanity/schemaTypes/siteSettings.ts
git commit -m "feat: add groups, descriptions, icon to siteSettings schema"
```

---

### Task 8: Make Lead Submissions read-only

**Files:**
- Modify: `sanity/schemaTypes/leadSubmission.ts`

- [ ] **Step 1: Update `leadSubmission.ts`**

Replace the entire file:

```ts
import { defineField, defineType } from "sanity";
import { EnvelopeIcon } from "@sanity/icons";

export const leadSubmissionType = defineType({
  name: "leadSubmission",
  title: "Lead Submission",
  type: "document",
  icon: EnvelopeIcon,
  readOnly: true,
  description: "Submissions from the contact form. View only.",
  fields: [
    defineField({ name: "fullName", title: "Full Name", type: "string" }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({ name: "phone", title: "Phone", type: "string" }),
    defineField({ name: "interest", title: "Interest", type: "string" }),
    defineField({ name: "message", title: "Message", type: "text" }),
    defineField({ name: "locale", title: "Locale", type: "string" }),
    defineField({ name: "source", title: "Source Page URL", type: "string" }),
    defineField({ name: "preferredVilla", title: "Preferred Villa", type: "string" }),
    defineField({ name: "budget", title: "Budget Range", type: "string" }),
    defineField({ name: "utmSource", title: "UTM Source", type: "string" }),
    defineField({ name: "utmMedium", title: "UTM Medium", type: "string" }),
    defineField({ name: "utmCampaign", title: "UTM Campaign", type: "string" }),
    defineField({ name: "gdprConsent", title: "GDPR Consent", type: "boolean" }),
    defineField({ name: "countryCode", title: "Country Code", type: "string" }),
  ],
  preview: { select: { title: "fullName", subtitle: "email" } },
});
```

- [ ] **Step 2: Verify in Studio**

Open `/studio → Leads → Submissions`. Check:
- All fields are read-only (not editable)
- No publish/unpublish buttons
- Submissions listed newest first

- [ ] **Step 3: Commit**

```bash
git add sanity/schemaTypes/leadSubmission.ts
git commit -m "feat: make leadSubmission read-only with icon"
```

---

### Task 9: Final verification and cleanup

- [ ] **Step 1: Full Studio walkthrough**

Run `npm run dev`, open `/studio`. Walk through every section:

1. **Pages** — open each singleton (Home, Residences, Masterplan, Location, About, Contact). Verify tabs, descriptions, icons.
2. **Properties** — open Villa Types list, Units list, Plots list. Verify grouping, ordering, previews.
3. **Content** — open Upgrades, Experiences, FAQ lists and Developer singleton. Verify icons, descriptions.
4. **Settings** — open Site Settings and UI Strings. Verify tabs.
5. **Leads** — open Submissions. Verify read-only, newest-first ordering.
6. **Language filter** — toggle languages. Verify only selected language fields show in localeString/localeText objects.
7. **New document menu** — click "+" (create new). Verify singletons don't appear in the list.

- [ ] **Step 2: Run build to check for TypeScript errors**

```bash
cd /Users/vladyslavi/Projects/Personal/livebetter-projects/seacret-investors-v2 && npm run build
```

Expected: Build succeeds with no TypeScript errors in schema files.

- [ ] **Step 3: Commit any remaining fixes**

If any issues were found, fix and commit:

```bash
git add -A
git commit -m "fix: address Studio UX issues found during verification"
```
