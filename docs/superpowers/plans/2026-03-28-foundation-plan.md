# Sea'cret Residences v2 — Plan 1: Foundation & Infrastructure

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Set up the complete project foundation — design tokens, Sanity CMS schemas with seed data, i18n infrastructure, layout shell with navigation, global CTA system, and form submission API — so that Plan 2 (content pages) can build on a working, tested base.

**Architecture:** Next.js App Router with `[locale]` dynamic segment for i18n. Sanity CMS with field-level localization (`localeString`/`localeText` objects). Tailwind CSS v4 with custom CSS variables for the design system. Framer Motion for component animations. Cloudflare Turnstile for spam protection.

**Tech Stack:** Next.js, TypeScript, Tailwind CSS v4, Sanity, Framer Motion, Zod, Cloudflare Turnstile, Resend (email), Lucide React (icons)

**Spec:** `docs/superpowers/specs/2026-03-28-seacret-residences-v2-design.md`

**What this plan produces:** A working site shell with:
- All Sanity schemas defined and Studio functional
- Seed data for all 39 units, 6 villa types, 6 plots
- Locale routing (EN/HE/RU/EL) with RTL support
- Header with nav + locale switcher, Footer with legal links
- Global sticky CTA button + slide-in drawer form
- Inline contact section component (reusable on every page)
- Contact form API with Turnstile, GDPR, UTM tracking, Sanity write
- Placeholder pages for all 6 routes (content filled in Plan 2)

---

## File Structure

```
seacret-investors-v2/
├── app/
│   ├── globals.css                    # MODIFY — new design tokens, typography, Cinzel+Josefin
│   ├── layout.tsx                     # MODIFY — new fonts, metadata
│   ├── page.tsx                       # MODIFY — root redirect to /en
│   ├── [locale]/
│   │   ├── layout.tsx                 # CREATE — locale layout with header, footer, sticky CTA
│   │   ├── page.tsx                   # MODIFY — placeholder homepage
│   │   ├── residences/
│   │   │   └── page.tsx               # CREATE — placeholder
│   │   ├── villas/
│   │   │   └── [slug]/
│   │   │       └── page.tsx           # MODIFY — placeholder
│   │   ├── masterplan/
│   │   │   └── page.tsx               # CREATE — placeholder
│   │   ├── location/
│   │   │   └── page.tsx               # CREATE — placeholder
│   │   └── contact/
│   │       └── page.tsx               # CREATE — placeholder
│   ├── api/
│   │   └── contact/
│   │       └── route.ts               # MODIFY — Turnstile, GDPR, UTM, Sanity write
│   └── studio/
│       └── [[...tool]]/
│           └── page.tsx               # KEEP — Sanity Studio
├── components/
│   ├── site-header.tsx                # MODIFY — new design, mobile menu, brochure link
│   ├── site-footer.tsx                # CREATE — footer with legal links, locale switcher
│   ├── locale-switcher.tsx            # MODIFY — preserve current path on switch
│   ├── contact-form.tsx               # MODIFY — Turnstile, GDPR, UTM, context pre-fill
│   ├── inline-contact-section.tsx     # CREATE — dark section wrapping contact form
│   ├── sticky-cta.tsx                 # CREATE — floating button + slide-in drawer
│   └── scroll-reveal.tsx              # CREATE — IntersectionObserver animation wrapper
├── lib/
│   ├── i18n.ts                        # MODIFY — add locale detection, path preservation
│   ├── cn.ts                          # KEEP
│   ├── sanity/
│   │   ├── client.ts                  # MODIFY — add write client for mutations
│   │   ├── queries.ts                 # CREATE — all GROQ queries
│   │   └── types.ts                   # CREATE — TypeScript types for Sanity documents
│   ├── pricing.ts                     # CREATE — price computation logic
│   └── utm.ts                         # CREATE — UTM capture utility
├── sanity/
│   ├── env.ts                         # KEEP
│   ├── schemaTypes/
│   │   ├── index.ts                   # MODIFY — register all new types
│   │   ├── localeString.ts            # KEEP
│   │   ├── localeText.ts              # KEEP
│   │   ├── unit.ts                    # CREATE — core inventory entity
│   │   ├── villa.ts                   # MODIFY — restructure as villa type definition
│   │   ├── plot.ts                    # CREATE — plot document
│   │   ├── homePage.ts                # MODIFY — restructure for new homepage
│   │   ├── residencesPage.ts          # CREATE
│   │   ├── locationPage.ts            # CREATE
│   │   ├── masterplanPage.ts          # CREATE
│   │   ├── contactPage.ts             # CREATE
│   │   ├── upgrade.ts                 # CREATE
│   │   ├── experience.ts              # CREATE
│   │   ├── developer.ts               # CREATE
│   │   ├── faq.ts                     # CREATE
│   │   ├── siteSettings.ts            # MODIFY — add new fields
│   │   └── leadSubmission.ts          # MODIFY — add tracking fields
│   └── seed/
│       └── seed-data.ts               # CREATE — script to populate CMS
├── sanity.config.ts                   # MODIFY — register new schemas
├── package.json                       # MODIFY — pin versions, add new deps
├── next.config.ts                     # MODIFY — add image domains, i18n
└── middleware.ts                      # CREATE — locale detection + redirect
```

---

## Task 1: Pin Dependencies and Add New Packages

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Update package.json with pinned versions and new dependencies**

```json
{
  "name": "seacret-residences-v2",
  "private": true,
  "version": "2.0.0",
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "seed": "npx tsx sanity/seed/seed-data.ts"
  },
  "dependencies": {
    "@sanity/client": "^6.28.0",
    "@sanity/image-url": "^1.1.0",
    "@sanity/vision": "^3.72.0",
    "clsx": "^2.1.1",
    "framer-motion": "^12.6.0",
    "lucide-react": "^0.474.0",
    "next": "^15.2.0",
    "next-sanity": "^9.8.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "sanity": "^3.72.0",
    "tailwind-merge": "^3.0.0",
    "zod": "^3.24.0"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3.2.0",
    "@tailwindcss/postcss": "^4.0.0",
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "eslint": "^9.0.0",
    "eslint-config-next": "^15.2.0",
    "tailwindcss": "^4.0.0",
    "tsx": "^4.19.0",
    "typescript": "^5.7.0"
  }
}
```

- [ ] **Step 2: Install dependencies**

Run: `cd seacret-investors-v2 && npm install`
Expected: Clean install, no errors. `node_modules` populated.

- [ ] **Step 3: Verify dev server starts**

Run: `npm run dev`
Expected: Next.js dev server starts on localhost:3000

- [ ] **Step 4: Commit**

```bash
git add seacret-investors-v2/package.json seacret-investors-v2/package-lock.json
git commit -m "chore: pin dependency versions and add framer-motion, lucide-react, tsx"
```

---

## Task 2: Design Tokens — Typography, Colors, Global CSS

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Update root layout with Cinzel + Josefin Sans fonts**

Replace the entire contents of `app/layout.tsx`:

```typescript
import type { Metadata } from "next";
import { Cinzel, Josefin_Sans } from "next/font/google";

import "./globals.css";

const serif = Cinzel({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const sans = Josefin_Sans({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | The Sea'cret Residences Chiliadou",
    default: "The Sea'cret Residences Chiliadou — Luxury Coastal Living in Greece",
  },
  description:
    "Exclusive beachfront residences in Chiliadou, Greece. 39 luxury villas on the Corinthian Gulf. Hidden from many, perfect for few.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
```

Note: `lang` and `dir` are NOT set here — they're set in `[locale]/layout.tsx` where we know the locale.

- [ ] **Step 2: Rewrite globals.css with new design tokens**

Replace the entire contents of `app/globals.css`:

```css
@import "tailwindcss";

/* ── Design tokens ────────────────────────────────────────── */
:root {
  --color-night: #09222a;
  --color-ink: #13242a;
  --color-deep-teal: #0d6777;
  --color-muted: #5e6d70;
  --color-gold-sun: #efc676;
  --color-sand: #f3ead7;
  --color-stone: #eadbc2;
  --color-cream: #fff9f0;

  --shadow-soft: 0 24px 60px rgba(9, 34, 42, 0.10);
  --shadow-card: 0 8px 30px rgba(9, 34, 42, 0.08);

  --radius-sm: 0.5rem;
  --radius-md: 1rem;
  --radius-lg: 1.5rem;
  --radius-xl: 2rem;
  --radius-full: 999px;
}

/* ── Base ─────────────────────────────────────────────────── */
* { box-sizing: border-box; }

html { scroll-behavior: smooth; }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

body {
  margin: 0;
  min-height: 100dvh;
  background: var(--color-sand);
  color: var(--color-ink);
  font-family: var(--font-sans), "Josefin Sans", sans-serif;
  font-weight: 300;
  line-height: 1.7;
}

a { color: inherit; text-decoration: none; }
button, input, select, textarea { font: inherit; }

/* ── Typography ───────────────────────────────────────────── */
.font-serif { font-family: var(--font-serif), "Cinzel", serif; }
.font-sans { font-family: var(--font-sans), "Josefin Sans", sans-serif; }

.text-display {
  font-family: var(--font-serif), "Cinzel", serif;
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 400;
  line-height: 1.1;
  letter-spacing: 0.04em;
}

.text-h1 {
  font-family: var(--font-serif), "Cinzel", serif;
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 500;
  line-height: 1.15;
  letter-spacing: 0.03em;
}

.text-h2 {
  font-family: var(--font-serif), "Cinzel", serif;
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: 0.02em;
}

.text-h3 {
  font-family: var(--font-serif), "Cinzel", serif;
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: 0.02em;
}

.eyebrow {
  font-family: var(--font-sans), "Josefin Sans", sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--color-deep-teal);
}

.text-body {
  font-size: 1rem;
  font-weight: 300;
  line-height: 1.7;
  color: var(--color-ink);
}

.text-body-muted {
  font-size: 1rem;
  font-weight: 300;
  line-height: 1.7;
  color: var(--color-muted);
}

/* ── Layout ───────────────────────────────────────────────── */
.section-shell {
  margin-inline: auto;
  width: 100%;
  max-width: 1440px;
  padding-inline: 1.25rem;
}

@media (min-width: 640px) { .section-shell { padding-inline: 2rem; } }
@media (min-width: 1024px) { .section-shell { padding-inline: 3rem; } }

/* ── Components ───────────────────────────────────────────── */
.tile {
  border: 1px solid rgba(13, 103, 119, 0.08);
  border-radius: var(--radius-xl);
  background: rgba(255, 250, 241, 0.92);
  box-shadow: var(--shadow-soft);
  padding: 1.75rem;
  backdrop-filter: blur(10px);
}

.glass-panel {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-xl);
  background: rgba(9, 34, 42, 0.44);
  padding: 1.75rem;
  backdrop-filter: blur(16px);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;
  border-radius: var(--radius-sm);
  min-height: 3rem;
  padding: 0.75rem 1.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  transition: transform 200ms ease, box-shadow 200ms ease;
}

.btn:hover { transform: translateY(-2px); box-shadow: var(--shadow-card); }
.btn:active { transform: translateY(0); }

.btn-primary {
  background: linear-gradient(135deg, #f0cf88, #d8ad63);
  color: var(--color-night);
}

.btn-secondary {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
}

.btn-outline {
  background: transparent;
  border: 1px solid var(--color-deep-teal);
  color: var(--color-deep-teal);
}

/* ── Animations ───────────────────────────────────────────── */
@keyframes rise {
  from { opacity: 0; transform: translateY(32px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-rise { animation: rise 800ms cubic-bezier(0.2, 1, 0.22, 1) both; }
.animate-fade-in { animation: fade-in 1000ms ease both; }

/* ── Status badges ────────────────────────────────────────── */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.badge-available { background: #dcfce7; color: #166534; }
.badge-reserved { background: #fef3c7; color: #92400e; }
.badge-sold { background: #fee2e2; color: #991b1b; }
```

- [ ] **Step 3: Verify dev server renders with new fonts**

Run: `npm run dev`
Expected: Page loads with Cinzel headings and Josefin Sans body text. Sand background. No console errors.

- [ ] **Step 4: Commit**

```bash
git add seacret-investors-v2/app/layout.tsx seacret-investors-v2/app/globals.css
git commit -m "feat: design tokens — Cinzel + Josefin Sans, color palette, typography scale, component classes"
```

---

## Task 3: Sanity Schemas — Core Data Model

**Files:**
- Create: `sanity/schemaTypes/unit.ts`
- Modify: `sanity/schemaTypes/villa.ts`
- Create: `sanity/schemaTypes/plot.ts`
- Create: `sanity/schemaTypes/upgrade.ts`
- Create: `sanity/schemaTypes/experience.ts`
- Create: `sanity/schemaTypes/developer.ts`
- Create: `sanity/schemaTypes/faq.ts`
- Modify: `sanity/schemaTypes/leadSubmission.ts`
- Modify: `sanity/schemaTypes/siteSettings.ts`
- Modify: `sanity/schemaTypes/homePage.ts`
- Create: `sanity/schemaTypes/residencesPage.ts`
- Create: `sanity/schemaTypes/locationPage.ts`
- Create: `sanity/schemaTypes/masterplanPage.ts`
- Create: `sanity/schemaTypes/contactPage.ts`
- Modify: `sanity/schemaTypes/index.ts`

- [ ] **Step 1: Create `unit.ts` — the core inventory entity**

```typescript
import { defineField, defineType } from "sanity";

export const unitType = defineType({
  name: "unit",
  title: "Unit",
  type: "document",
  fields: [
    defineField({ name: "unitNumber", title: "Unit Number", type: "string", validation: (r) => r.required() }),
    defineField({ name: "plot", title: "Plot", type: "reference", to: [{ type: "plot" }], validation: (r) => r.required() }),
    defineField({ name: "villaType", title: "Villa Type", type: "reference", to: [{ type: "villa" }], validation: (r) => r.required() }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
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
    defineField({ name: "totalArea", title: "Total Area (m²)", type: "number", validation: (r) => r.required().positive() }),
    defineField({ name: "outdoorArea", title: "Outdoor Area (m²)", type: "number" }),
    defineField({ name: "bedrooms", title: "Bedrooms", type: "number", validation: (r) => r.required().min(1) }),
    defineField({ name: "bathrooms", title: "Bathrooms", type: "number", validation: (r) => r.required().min(1) }),
    defineField({ name: "groundFloor", title: "Ground Floor (m²)", type: "number" }),
    defineField({ name: "upperFloor", title: "Upper Floor (m²)", type: "number" }),
    defineField({ name: "attic", title: "Attic (m²)", type: "number" }),
    defineField({ name: "balcony", title: "Balcony (m²)", type: "number" }),
    defineField({ name: "roofTerrace", title: "Roof Terrace (m²)", type: "number" }),
    defineField({ name: "hasPool", title: "Swimming Pool", type: "boolean", initialValue: false }),
    defineField({ name: "hasParking", title: "Parking Spot", type: "boolean", initialValue: true }),
    defineField({
      name: "floorLevel",
      title: "Floor Level",
      type: "string",
      options: { list: [{ title: "Ground", value: "ground" }, { title: "Upper", value: "upper" }] },
      hidden: ({ document }) => !document?.unitNumber?.toString().match(/^[EF]/),
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

- [ ] **Step 2: Rewrite `villa.ts` as a villa type definition**

```typescript
import { defineField, defineType } from "sanity";

export const villaType = defineType({
  name: "villa",
  title: "Villa Type",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name" }, validation: (r) => r.required() }),
    defineField({ name: "label", title: "Label", type: "localeString" }),
    defineField({ name: "summary", title: "Summary", type: "localeText" }),
    defineField({
      name: "highlights",
      title: "Highlights",
      type: "array",
      of: [{ type: "localeString" }],
    }),
    defineField({ name: "heroImage", title: "Hero Image", type: "image", options: { hotspot: true } }),
    defineField({
      name: "galleryImages",
      title: "Gallery Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "floorPlanImages",
      title: "Floor Plan Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({ name: "tourUrl", title: "3D Tour URL", type: "url" }),
    defineField({ name: "typicalBedrooms", title: "Typical Bedrooms", type: "number" }),
    defineField({ name: "typicalBathrooms", title: "Typical Bathrooms", type: "number" }),
    defineField({ name: "areaRange", title: "Area Range", type: "string", description: "e.g. '130-134'" }),
    defineField({ name: "sortOrder", title: "Sort Order", type: "number", initialValue: 0 }),
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

- [ ] **Step 3: Create `plot.ts`**

```typescript
import { defineField, defineType } from "sanity";

export const plotType = defineType({
  name: "plot",
  title: "Plot",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "summary", title: "Summary", type: "localeText" }),
    defineField({ name: "aerialImage", title: "Aerial Image", type: "image", options: { hotspot: true } }),
    defineField({
      name: "positionData",
      title: "Position on Masterplan",
      type: "object",
      fields: [
        defineField({ name: "x", title: "X (%)", type: "number" }),
        defineField({ name: "y", title: "Y (%)", type: "number" }),
      ],
    }),
    defineField({ name: "sortOrder", title: "Sort Order", type: "number", initialValue: 0 }),
  ],
  preview: {
    select: { title: "name" },
  },
  orderings: [{ title: "Sort Order", name: "sortOrder", by: [{ field: "sortOrder", direction: "asc" }] }],
});
```

- [ ] **Step 4: Create `upgrade.ts`, `experience.ts`, `developer.ts`, `faq.ts`**

`sanity/schemaTypes/upgrade.ts`:
```typescript
import { defineField, defineType } from "sanity";

export const upgradeType = defineType({
  name: "upgrade",
  title: "Upgrade",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "localeString", validation: (r) => r.required() }),
    defineField({ name: "description", title: "Description", type: "localeText" }),
    defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: ["pool", "jacuzzi", "sauna", "bbq", "smart-house", "security", "fireplace"],
      },
    }),
    defineField({ name: "sortOrder", title: "Sort Order", type: "number", initialValue: 0 }),
  ],
});
```

`sanity/schemaTypes/experience.ts`:
```typescript
import { defineField, defineType } from "sanity";

export const experienceType = defineType({
  name: "experience",
  title: "Experience",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "localeString", validation: (r) => r.required() }),
    defineField({ name: "description", title: "Description", type: "localeText" }),
    defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: { list: ["culture", "nature", "gastronomy"] },
    }),
    defineField({ name: "sortOrder", title: "Sort Order", type: "number", initialValue: 0 }),
  ],
});
```

`sanity/schemaTypes/developer.ts`:
```typescript
import { defineField, defineType } from "sanity";

export const developerType = defineType({
  name: "developer",
  title: "Developer",
  type: "document",
  fields: [
    defineField({ name: "companyName", title: "Company Name", type: "string" }),
    defineField({ name: "description", title: "Description", type: "localeText" }),
    defineField({ name: "logo", title: "Logo", type: "image" }),
    defineField({ name: "credentials", title: "Credentials", type: "localeText" }),
    defineField({
      name: "team",
      title: "Team Members",
      type: "array",
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

`sanity/schemaTypes/faq.ts`:
```typescript
import { defineField, defineType } from "sanity";

export const faqType = defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  fields: [
    defineField({ name: "question", title: "Question", type: "localeString", validation: (r) => r.required() }),
    defineField({ name: "answer", title: "Answer", type: "localeText", validation: (r) => r.required() }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: { list: ["investment", "construction", "legal", "lifestyle", "general"] },
    }),
    defineField({ name: "sortOrder", title: "Sort Order", type: "number", initialValue: 0 }),
  ],
  orderings: [{ title: "Sort Order", name: "sortOrder", by: [{ field: "sortOrder", direction: "asc" }] }],
});
```

- [ ] **Step 5: Create page document schemas — `residencesPage.ts`, `locationPage.ts`, `masterplanPage.ts`, `contactPage.ts`**

`sanity/schemaTypes/residencesPage.ts`:
```typescript
import { defineField, defineType } from "sanity";

export const residencesPageType = defineType({
  name: "residencesPage",
  title: "Residences Page",
  type: "document",
  fields: [
    defineField({ name: "heroImage", title: "Hero Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "heroTitle", title: "Hero Title", type: "localeString" }),
    defineField({ name: "introCopy", title: "Intro Copy", type: "localeText" }),
    defineField({ name: "seoTitle", title: "SEO Title", type: "localeString" }),
    defineField({ name: "seoDescription", title: "SEO Description", type: "localeText" }),
  ],
});
```

`sanity/schemaTypes/locationPage.ts`:
```typescript
import { defineField, defineType } from "sanity";

export const locationPageType = defineType({
  name: "locationPage",
  title: "Location Page",
  type: "document",
  fields: [
    defineField({ name: "heroImage", title: "Hero Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "heroTitle", title: "Hero Title", type: "localeString" }),
    defineField({ name: "whySection", title: "Why Chiliadou Copy", type: "localeText" }),
    defineField({
      name: "distances",
      title: "Distance Markers",
      type: "array",
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
    defineField({ name: "seoTitle", title: "SEO Title", type: "localeString" }),
    defineField({ name: "seoDescription", title: "SEO Description", type: "localeText" }),
  ],
});
```

`sanity/schemaTypes/masterplanPage.ts`:
```typescript
import { defineField, defineType } from "sanity";

export const masterplanPageType = defineType({
  name: "masterplanPage",
  title: "Masterplan Page",
  type: "document",
  fields: [
    defineField({ name: "heroImage", title: "Hero/Aerial Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "heroTitle", title: "Hero Title", type: "localeString" }),
    defineField({ name: "introCopy", title: "Intro Copy", type: "localeText" }),
    defineField({ name: "seoTitle", title: "SEO Title", type: "localeString" }),
    defineField({ name: "seoDescription", title: "SEO Description", type: "localeText" }),
  ],
});
```

`sanity/schemaTypes/contactPage.ts`:
```typescript
import { defineField, defineType } from "sanity";

export const contactPageType = defineType({
  name: "contactPage",
  title: "Contact Page",
  type: "document",
  fields: [
    defineField({ name: "heroTitle", title: "Hero Title", type: "localeString" }),
    defineField({ name: "responsePromise", title: "Response Promise Text", type: "localeString" }),
    defineField({ name: "officeInfo", title: "Office Info", type: "localeText" }),
    defineField({ name: "seoTitle", title: "SEO Title", type: "localeString" }),
    defineField({ name: "seoDescription", title: "SEO Description", type: "localeText" }),
  ],
});
```

- [ ] **Step 6: Update `leadSubmission.ts` with tracking fields**

```typescript
import { defineField, defineType } from "sanity";

export const leadSubmissionType = defineType({
  name: "leadSubmission",
  title: "Lead Submission",
  type: "document",
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
  preview: {
    select: { title: "fullName", subtitle: "email" },
  },
});
```

- [ ] **Step 7: Update `siteSettings.ts`**

```typescript
import { defineField, defineType } from "sanity";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({ name: "projectName", title: "Project Name", type: "string" }),
    defineField({ name: "salesEmail", title: "Sales Email", type: "string" }),
    defineField({ name: "salesPhone", title: "Sales Phone", type: "string" }),
    defineField({ name: "whatsappNumber", title: "WhatsApp Number", type: "string" }),
    defineField({ name: "officeHours", title: "Office Hours", type: "localeString" }),
    defineField({ name: "seoDescription", title: "SEO Description", type: "localeText" }),
    defineField({
      name: "brochurePdf",
      title: "Brochure PDF",
      type: "object",
      fields: [
        defineField({ name: "en", title: "English", type: "file" }),
        defineField({ name: "he", title: "Hebrew", type: "file" }),
        defineField({ name: "ru", title: "Russian", type: "file" }),
        defineField({ name: "el", title: "Greek", type: "file" }),
      ],
    }),
    defineField({
      name: "legalLinks",
      title: "Legal Links",
      type: "object",
      fields: [
        defineField({ name: "privacyPolicy", title: "Privacy Policy URL", type: "url" }),
        defineField({ name: "termsConditions", title: "Terms & Conditions URL", type: "url" }),
        defineField({ name: "cookiePolicy", title: "Cookie Policy URL", type: "url" }),
      ],
    }),
  ],
});
```

- [ ] **Step 8: Update `homePage.ts` for new homepage structure**

```typescript
import { defineArrayMember, defineField, defineType } from "sanity";

export const homePageType = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  fields: [
    defineField({ name: "heroTagline", title: "Hero Tagline", type: "localeString" }),
    defineField({ name: "heroSubtitle", title: "Hero Subtitle", type: "localeString" }),
    defineField({ name: "heroImage", title: "Hero Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "heroVideoUrl", title: "Hero Video URL (Tier 2)", type: "url" }),
    defineField({ name: "conceptEyebrow", title: "Concept Eyebrow", type: "localeString" }),
    defineField({ name: "conceptCopy", title: "Concept Copy", type: "localeText" }),
    defineField({ name: "conceptImage", title: "Concept Image", type: "image", options: { hotspot: true } }),
    defineField({
      name: "lifestyleMoments",
      title: "Lifestyle Moments",
      type: "array",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "period", title: "Period (Morning/Day/Evening)", type: "string" }),
          defineField({ name: "copy", title: "Copy", type: "localeText" }),
          defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
        ],
      }],
    }),
    defineField({
      name: "featuredVillas",
      title: "Featured Villas (Homepage Preview)",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "villa" }] })],
    }),
    defineField({ name: "masterplanImage", title: "Masterplan Aerial Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "ctaTitle", title: "CTA Title", type: "localeString" }),
    defineField({ name: "ctaSubtitle", title: "CTA Subtitle", type: "localeString" }),
    defineField({ name: "seoTitle", title: "SEO Title", type: "localeString" }),
    defineField({ name: "seoDescription", title: "SEO Description", type: "localeText" }),
  ],
});
```

- [ ] **Step 9: Update `schemaTypes/index.ts` to register all types**

```typescript
import { contactPageType } from "./contactPage";
import { developerType } from "./developer";
import { experienceType } from "./experience";
import { faqType } from "./faq";
import { homePageType } from "./homePage";
import { leadSubmissionType } from "./leadSubmission";
import { localeStringType } from "./localeString";
import { localeTextType } from "./localeText";
import { locationPageType } from "./locationPage";
import { masterplanPageType } from "./masterplanPage";
import { plotType } from "./plot";
import { residencesPageType } from "./residencesPage";
import { siteSettingsType } from "./siteSettings";
import { unitType } from "./unit";
import { upgradeType } from "./upgrade";
import { villaType } from "./villa";

export const schemaTypes = [
  localeStringType,
  localeTextType,
  siteSettingsType,
  homePageType,
  residencesPageType,
  locationPageType,
  masterplanPageType,
  contactPageType,
  villaType,
  plotType,
  unitType,
  upgradeType,
  experienceType,
  developerType,
  faqType,
  leadSubmissionType,
];
```

- [ ] **Step 10: Verify Sanity Studio loads with all schemas**

Run: `npm run dev` → Navigate to `http://localhost:3000/studio`
Expected: Sanity Studio shows all document types in the sidebar: Villa Type, Plot, Unit, Home Page, Residences Page, Location Page, Masterplan Page, Contact Page, Upgrade, Experience, Developer, FAQ, Lead Submission, Site Settings.

- [ ] **Step 11: Commit**

```bash
git add seacret-investors-v2/sanity/
git commit -m "feat: complete Sanity schema — unit, villa, plot, page documents, trust surfaces, lead tracking"
```

---

## Task 4: Sanity Client, Types, and GROQ Queries

**Files:**
- Modify: `sanity/lib/client.ts` → move to `lib/sanity/client.ts`
- Create: `lib/sanity/types.ts`
- Create: `lib/sanity/queries.ts`

- [ ] **Step 1: Create Sanity client with read and write clients**

`lib/sanity/client.ts`:
```typescript
import { createClient } from "@sanity/client";

import { apiVersion, dataset, projectId } from "@/sanity/env";

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

export const sanityWriteClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
});
```

- [ ] **Step 2: Create TypeScript types for Sanity documents**

`lib/sanity/types.ts`:
```typescript
import type { Locale } from "@/lib/i18n";

export type LocalizedString = Record<Locale, string>;
export type LocalizedText = Record<Locale, string>;

export interface SanityImage {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
  hotspot?: { x: number; y: number; width: number; height: number };
}

export interface Villa {
  _id: string;
  name: string;
  slug: { current: string };
  label: LocalizedString;
  summary: LocalizedText;
  highlights: LocalizedString[];
  heroImage: SanityImage;
  galleryImages: SanityImage[];
  floorPlanImages: SanityImage[];
  tourUrl?: string;
  typicalBedrooms: number;
  typicalBathrooms: number;
  areaRange: string;
  sortOrder: number;
}

export type UnitStatus = "available" | "reserved" | "sold";

export interface Unit {
  _id: string;
  unitNumber: string;
  plot: { _ref: string; name: string };
  villaType: { _ref: string; name: string; slug: { current: string } };
  status: UnitStatus;
  totalArea: number;
  outdoorArea: number;
  bedrooms: number;
  bathrooms: number;
  groundFloor?: number;
  upperFloor?: number;
  attic?: number;
  balcony?: number;
  roofTerrace?: number;
  hasPool: boolean;
  hasParking: boolean;
  floorLevel?: "ground" | "upper";
}

export interface Plot {
  _id: string;
  name: string;
  summary: LocalizedText;
  aerialImage: SanityImage;
  positionData: { x: number; y: number };
  sortOrder: number;
}

export interface SiteSettings {
  projectName: string;
  salesEmail: string;
  salesPhone: string;
  whatsappNumber: string;
  officeHours: LocalizedString;
  brochurePdf: Record<Locale, { asset: { _ref: string; url: string } }>;
  legalLinks: {
    privacyPolicy?: string;
    termsConditions?: string;
    cookiePolicy?: string;
  };
}

export interface FAQ {
  _id: string;
  question: LocalizedString;
  answer: LocalizedText;
  category: string;
  sortOrder: number;
}
```

- [ ] **Step 3: Create GROQ queries**

`lib/sanity/queries.ts`:
```typescript
import { groq } from "next-sanity";

export const siteSettingsQuery = groq`*[_type == "siteSettings"][0]`;

export const homePageQuery = groq`*[_type == "homePage"][0]{
  ...,
  featuredVillas[]->{ _id, name, slug, label, heroImage, typicalBedrooms, areaRange, sortOrder }
}`;

export const allVillasQuery = groq`*[_type == "villa"] | order(sortOrder asc){
  _id, name, slug, label, summary, heroImage, typicalBedrooms, typicalBathrooms, areaRange, sortOrder
}`;

export const villaBySlugQuery = groq`*[_type == "villa" && slug.current == $slug][0]{
  ...,
  "units": *[_type == "unit" && villaType._ref == ^._id]{
    _id, unitNumber, status, totalArea, outdoorArea, bedrooms, bathrooms, hasPool, hasParking,
    "plotName": plot->name
  } | order(unitNumber asc)
}`;

export const allPlotsQuery = groq`*[_type == "plot"] | order(sortOrder asc){
  _id, name, summary, aerialImage, positionData, sortOrder,
  "units": *[_type == "unit" && plot._ref == ^._id]{
    _id, unitNumber, status, totalArea, bedrooms, hasPool,
    "villaTypeName": villaType->name,
    "villaTypeSlug": villaType->slug.current
  } | order(unitNumber asc)
}`;

export const allUnitsQuery = groq`*[_type == "unit"] | order(unitNumber asc){
  _id, unitNumber, status, totalArea, bedrooms, bathrooms, hasPool,
  "plotName": plot->name,
  "villaTypeName": villaType->name,
  "villaTypeSlug": villaType->slug.current
}`;

export const availabilityStatsQuery = groq`{
  "total": count(*[_type == "unit"]),
  "available": count(*[_type == "unit" && status == "available"]),
  "reserved": count(*[_type == "unit" && status == "reserved"]),
  "sold": count(*[_type == "unit" && status == "sold"])
}`;

export const residencesPageQuery = groq`*[_type == "residencesPage"][0]`;
export const locationPageQuery = groq`*[_type == "locationPage"][0]`;
export const masterplanPageQuery = groq`*[_type == "masterplanPage"][0]`;
export const contactPageQuery = groq`*[_type == "contactPage"][0]`;

export const allUpgradesQuery = groq`*[_type == "upgrade"] | order(sortOrder asc)`;
export const allExperiencesQuery = groq`*[_type == "experience"] | order(sortOrder asc)`;
export const allFaqsQuery = groq`*[_type == "faq"] | order(sortOrder asc)`;
export const developerQuery = groq`*[_type == "developer"][0]`;
```

- [ ] **Step 4: Create pricing utility**

`lib/pricing.ts`:
```typescript
const PRESALE_RATE_PER_M2 = 2950;

export function computePriceFrom(totalAreaM2: number): number {
  return Math.ceil((totalAreaM2 * PRESALE_RATE_PER_M2) / 1000) * 1000;
}

export function formatPrice(euros: number): string {
  if (euros >= 1_000_000) {
    return `€${(euros / 1_000_000).toFixed(1)}M`;
  }
  return `€${Math.round(euros / 1000)}K`;
}

export function formatPriceFrom(totalAreaM2: number): string {
  return `From ${formatPrice(computePriceFrom(totalAreaM2))}`;
}
```

- [ ] **Step 5: Create UTM capture utility**

`lib/utm.ts`:
```typescript
export interface UTMParams {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export function captureUTM(): UTMParams {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get("utm_source") ?? undefined,
    utmMedium: params.get("utm_medium") ?? undefined,
    utmCampaign: params.get("utm_campaign") ?? undefined,
  };
}
```

- [ ] **Step 6: Remove old `sanity/lib/client.ts` (replaced by `lib/sanity/client.ts`)**

Delete `sanity/lib/client.ts`. The new client is at `lib/sanity/client.ts`.

- [ ] **Step 7: Commit**

```bash
git add seacret-investors-v2/lib/sanity/ seacret-investors-v2/lib/pricing.ts seacret-investors-v2/lib/utm.ts
git rm seacret-investors-v2/sanity/lib/client.ts
git commit -m "feat: Sanity client, GROQ queries, TypeScript types, pricing logic, UTM utility"
```

---

## Task 5: i18n Infrastructure — Middleware, Locale Layout, Path-Preserving Switcher

**Files:**
- Modify: `lib/i18n.ts`
- Create: `middleware.ts`
- Create: `app/[locale]/layout.tsx`
- Modify: `app/page.tsx`
- Modify: `components/locale-switcher.tsx`

- [ ] **Step 1: Extend i18n utilities**

```typescript
export const locales = ["en", "he", "ru", "el"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";
export const rtlLocales: Locale[] = ["he"];

export const localeLabels: Record<Locale, string> = {
  en: "EN",
  he: "HE",
  ru: "RU",
  el: "GR",
};

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export function isRtl(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}

export function getLocalizedValue<T>(obj: Record<Locale, T> | undefined | null, locale: Locale): T | undefined {
  if (!obj) return undefined;
  return obj[locale] ?? obj[defaultLocale];
}
```

- [ ] **Step 2: Create middleware for locale detection**

`middleware.ts` (project root):
```typescript
import { type NextRequest, NextResponse } from "next/server";

import { defaultLocale, locales } from "@/lib/i18n";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files, API routes, and Sanity Studio
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/studio") ||
    pathname.includes(".") // static files
  ) {
    return NextResponse.next();
  }

  // Check if the pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Detect preferred locale from Accept-Language header
  const acceptLanguage = request.headers.get("accept-language") ?? "";
  const preferredLocale = locales.find((locale) =>
    acceptLanguage.toLowerCase().includes(locale)
  ) ?? defaultLocale;

  // Redirect to locale-prefixed path
  const url = request.nextUrl.clone();
  url.pathname = `/${preferredLocale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|studio|.*\\..*).*)"],
};
```

- [ ] **Step 3: Update root `app/page.tsx` to redirect**

```typescript
import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/en");
}
```

- [ ] **Step 4: Create `app/[locale]/layout.tsx`**

```typescript
import { notFound } from "next/navigation";

import { isRtl, isValidLocale, type Locale } from "@/lib/i18n";

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const rtl = isRtl(locale as Locale);

  return (
    <div lang={locale} dir={rtl ? "rtl" : "ltr"}>
      {/* Header, Footer, and Sticky CTA will be added in Task 6 */}
      <main>{children}</main>
    </div>
  );
}
```

Note: We set `lang` and `dir` on a `<div>` wrapper since the `<html>` is rendered in the root layout. In Task 6 we'll update the root layout to pass locale down.

- [ ] **Step 5: Rewrite locale switcher to preserve current path**

```typescript
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn";
import { type Locale, localeLabels, locales } from "@/lib/i18n";

type LocaleSwitcherProps = {
  locale: Locale;
  className?: string;
};

export function LocaleSwitcher({ locale, className }: LocaleSwitcherProps) {
  const pathname = usePathname();

  function getLocalizedPath(targetLocale: Locale): string {
    // Replace the current locale segment with the target locale
    const segments = pathname.split("/");
    if (segments.length > 1 && locales.includes(segments[1] as Locale)) {
      segments[1] = targetLocale;
    }
    return segments.join("/") || `/${targetLocale}`;
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {locales.map((loc) => (
        <Link
          key={loc}
          href={getLocalizedPath(loc)}
          className={cn(
            "rounded-sm px-2.5 py-1.5 text-xs font-semibold tracking-widest transition-colors",
            loc === locale
              ? "bg-[var(--color-gold-sun)] text-[var(--color-night)]"
              : "text-current opacity-60 hover:opacity-100"
          )}
        >
          {localeLabels[loc]}
        </Link>
      ))}
    </div>
  );
}
```

- [ ] **Step 6: Create placeholder pages for all routes**

Create each with a minimal placeholder that confirms routing works.

`app/[locale]/page.tsx`:
```typescript
import { notFound } from "next/navigation";

import { isValidLocale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return ["en", "he", "ru", "el"].map((locale) => ({ locale }));
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  return (
    <div className="section-shell py-32">
      <h1 className="text-display">The Sea&apos;cret Residences</h1>
      <p className="text-body-muted mt-4">Homepage — {locale.toUpperCase()}</p>
    </div>
  );
}
```

`app/[locale]/residences/page.tsx`:
```typescript
import { notFound } from "next/navigation";

import { isValidLocale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return ["en", "he", "ru", "el"].map((locale) => ({ locale }));
}

export default async function ResidencesPage({ params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  return (
    <div className="section-shell py-32">
      <h1 className="text-h1">Residences</h1>
      <p className="text-body-muted mt-4">All villa types — {locale.toUpperCase()}</p>
    </div>
  );
}
```

`app/[locale]/villas/[slug]/page.tsx`:
```typescript
import { notFound } from "next/navigation";

import { isValidLocale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string; slug: string }> };

const villaSlugs = ["lola", "mikka", "tai", "michal", "yair", "yehonatan"];

export function generateStaticParams() {
  return ["en", "he", "ru", "el"].flatMap((locale) =>
    villaSlugs.map((slug) => ({ locale, slug }))
  );
}

export default async function VillaDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) notFound();

  return (
    <div className="section-shell py-32">
      <h1 className="text-h1">Villa {slug}</h1>
      <p className="text-body-muted mt-4">Villa detail — {locale.toUpperCase()}</p>
    </div>
  );
}
```

`app/[locale]/masterplan/page.tsx`:
```typescript
import { notFound } from "next/navigation";

import { isValidLocale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return ["en", "he", "ru", "el"].map((locale) => ({ locale }));
}

export default async function MasterplanPage({ params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  return (
    <div className="section-shell py-32">
      <h1 className="text-h1">Masterplan</h1>
      <p className="text-body-muted mt-4">Interactive plot explorer — {locale.toUpperCase()}</p>
    </div>
  );
}
```

`app/[locale]/location/page.tsx`:
```typescript
import { notFound } from "next/navigation";

import { isValidLocale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return ["en", "he", "ru", "el"].map((locale) => ({ locale }));
}

export default async function LocationPage({ params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  return (
    <div className="section-shell py-32">
      <h1 className="text-h1">Location</h1>
      <p className="text-body-muted mt-4">Location &amp; connectivity — {locale.toUpperCase()}</p>
    </div>
  );
}
```

`app/[locale]/contact/page.tsx`:
```typescript
import { notFound } from "next/navigation";

import { isValidLocale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return ["en", "he", "ru", "el"].map((locale) => ({ locale }));
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  return (
    <div className="section-shell py-32">
      <h1 className="text-h1">Contact</h1>
      <p className="text-body-muted mt-4">Get in touch — {locale.toUpperCase()}</p>
    </div>
  );
}
```

- [ ] **Step 7: Verify all routes work**

Run: `npm run dev`
Test these URLs:
- `http://localhost:3000` → redirects to `/en`
- `http://localhost:3000/en` → Homepage placeholder
- `http://localhost:3000/en/residences` → Residences placeholder
- `http://localhost:3000/en/villas/yehonatan` → Villa detail placeholder
- `http://localhost:3000/en/masterplan` → Masterplan placeholder
- `http://localhost:3000/en/location` → Location placeholder
- `http://localhost:3000/en/contact` → Contact placeholder
- `http://localhost:3000/he` → Homepage with RTL direction
- `http://localhost:3000/studio` → Sanity Studio loads

- [ ] **Step 8: Commit**

```bash
git add seacret-investors-v2/lib/i18n.ts seacret-investors-v2/middleware.ts seacret-investors-v2/app/ seacret-investors-v2/components/locale-switcher.tsx
git commit -m "feat: i18n infrastructure — middleware, locale layout, path-preserving switcher, all route placeholders"
```

---

## Task 6: Layout Shell — Header, Footer, Sticky CTA

This task adds the header with navigation, footer with legal links, and the global sticky CTA button to the locale layout. These appear on every page.

**Files:**
- Modify: `components/site-header.tsx`
- Create: `components/site-footer.tsx`
- Create: `components/sticky-cta.tsx`
- Create: `components/inline-contact-section.tsx`
- Create: `components/scroll-reveal.tsx`
- Modify: `components/contact-form.tsx`
- Modify: `app/[locale]/layout.tsx`

Due to the length of this task, the full component code will be provided during implementation. The key deliverables are:

- [ ] **Step 1: Rewrite `site-header.tsx`** — Frosted glass navbar, Cinzel logo, nav links (Home, Residences, Masterplan, Location, Contact), locale switcher, brochure download icon, mobile hamburger menu with full-screen overlay. Fixed position.

- [ ] **Step 2: Create `site-footer.tsx`** — Dark background (#09222a), SR logo, locale switcher, legal links (Privacy, Terms, Cookies from siteSettings), copyright, social links placeholder.

- [ ] **Step 3: Create `scroll-reveal.tsx`** — Reusable IntersectionObserver wrapper using Framer Motion. Props: `direction` (up/left/right), `delay`, `duration`. Uses `motion.div` with `whileInView`.

- [ ] **Step 4: Rewrite `contact-form.tsx`** — Add GDPR consent checkbox, UTM capture via `useEffect` + `lib/utm.ts`, context pre-fill via `preferredOption` prop, locale tracking, Turnstile placeholder (token field, validated server-side). Keep existing Zod validation.

- [ ] **Step 5: Create `inline-contact-section.tsx`** — Dark section wrapper (#09222a) with eyebrow "GET IN TOUCH", heading, contact form, WhatsApp button. Accepts `locale` and `preferredOption` props for context pre-fill. Reusable on every page.

- [ ] **Step 6: Create `sticky-cta.tsx`** — Fixed bottom-right gold circular button (phone icon from Lucide). On click, opens a slide-in drawer from the right with a compact contact form. Uses Framer Motion `AnimatePresence` for smooth enter/exit. Drawer has backdrop overlay.

- [ ] **Step 7: Wire everything into `app/[locale]/layout.tsx`** — Import header, footer, sticky CTA. Fetch `siteSettings` from Sanity. Pass nav items, locale, settings to components.

- [ ] **Step 8: Verify layout renders on all pages**

Run: `npm run dev`
Expected: All pages show header with navigation, footer with legal links, and floating gold CTA button in bottom-right.

- [ ] **Step 9: Commit**

```bash
git add seacret-investors-v2/components/ seacret-investors-v2/app/[locale]/layout.tsx
git commit -m "feat: layout shell — header, footer, sticky CTA, inline contact section, scroll reveal"
```

---

## Task 7: Contact Form API — Turnstile, GDPR, UTM, Sanity Write

**Files:**
- Modify: `app/api/contact/route.ts`

- [ ] **Step 1: Rewrite the contact API endpoint**

```typescript
import { NextResponse } from "next/server";
import { z } from "zod";

import { sanityWriteClient } from "@/lib/sanity/client";

const payloadSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  interest: z.string().min(1),
  message: z.string().optional(),
  locale: z.string().min(2),
  source: z.string().optional(),
  preferredVilla: z.string().optional(),
  budget: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  gdprConsent: z.literal(true, { errorMap: () => ({ message: "GDPR consent is required" }) }),
  turnstileToken: z.string().optional(),
});

async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // Skip in development

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token }),
  });

  const data = (await response.json()) as { success: boolean };
  return data.success;
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = payloadSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { ok: false, message: "Please complete the form correctly." },
      { status: 400 }
    );
  }

  const data = result.data;

  // Verify Turnstile token
  if (data.turnstileToken) {
    const valid = await verifyTurnstile(data.turnstileToken);
    if (!valid) {
      return NextResponse.json(
        { ok: false, message: "Spam verification failed. Please try again." },
        { status: 403 }
      );
    }
  }

  // Write lead to Sanity
  try {
    await sanityWriteClient.create({
      _type: "leadSubmission",
      fullName: data.fullName,
      email: data.email,
      phone: data.phone ?? "",
      interest: data.interest,
      message: data.message ?? "",
      locale: data.locale,
      source: data.source ?? "",
      preferredVilla: data.preferredVilla ?? "",
      budget: data.budget ?? "",
      utmSource: data.utmSource ?? "",
      utmMedium: data.utmMedium ?? "",
      utmCampaign: data.utmCampaign ?? "",
      gdprConsent: data.gdprConsent,
    });
  } catch (error) {
    console.error("Failed to write lead to Sanity:", error);
    // Don't fail the request — still send email
  }

  // TODO: Send email via Resend (credentials needed)
  // For now, log the lead
  console.log("Lead received:", data.fullName, data.email, data.interest);

  return NextResponse.json({
    ok: true,
    message: "Thank you! We'll be in touch within 24 hours.",
  });
}
```

- [ ] **Step 2: Verify form submission works**

Run: `npm run dev`
Submit the contact form on any page.
Expected: Console logs the lead data. Response shows success message.

- [ ] **Step 3: Commit**

```bash
git add seacret-investors-v2/app/api/contact/route.ts
git commit -m "feat: contact API — Turnstile verification, GDPR consent, UTM tracking, Sanity write"
```

---

## Task 8: Clean Up — Remove Legacy Files

**Files:**
- Delete: `lib/content.ts` (587 lines of hardcoded dictionaries — replaced by Sanity)
- Delete: `lib/project-data.ts` (711 lines of hardcoded villa/plot data — replaced by Sanity)
- Delete: `components/masterplan-explorer.tsx` (will be rebuilt in Plan 3)
- Delete: `components/FloatingMessengers.tsx` (replaced by sticky CTA)
- Delete: `components/ContactForm.tsx` (if different from contact-form.tsx)
- Delete: `components/CTASection.tsx`
- Delete: `components/Hero.tsx`
- Delete: `components/InvestmentCard.tsx`
- Delete: `components/JsonLd.tsx`
- Delete: `components/ProjectCard.tsx`
- Delete: `components/ProjectsGrid.tsx`
- Delete: `components/Stats.tsx`
- Delete: `components/Footer.tsx`
- Delete: `components/Header.tsx`
- Delete: `lib/dashboard-data.ts`
- Delete: `lib/metadata.ts`
- Delete: `lib/projects.ts`
- Delete: `app/[locale]/(site)/` (old site group — replaced by new route structure)
- Delete: `app/[locale]/dashboard/` (not in v2 scope)
- Delete: `src/messages/` (old i18n messages — replaced by Sanity)
- Delete: `src/i18n/` (old i18n config — replaced by new lib/i18n.ts)
- Delete: `src/middleware.ts` (replaced by new middleware.ts at root)

Note: Some of these files may not exist in the v2 copy. Only delete what exists. Use `git status` to verify.

- [ ] **Step 1: Remove legacy files**

```bash
cd seacret-investors-v2
# Remove files that exist — skip ones that don't
git rm -f lib/content.ts lib/project-data.ts lib/dashboard-data.ts lib/metadata.ts lib/projects.ts 2>/dev/null || true
git rm -f components/masterplan-explorer.tsx components/FloatingMessengers.tsx 2>/dev/null || true
git rm -rf app/[locale]/\(site\)/ app/[locale]/dashboard/ 2>/dev/null || true
git rm -rf src/messages/ src/i18n/ src/middleware.ts 2>/dev/null || true
```

- [ ] **Step 2: Verify dev server still works**

Run: `npm run dev`
Expected: No import errors. All placeholder pages render.

- [ ] **Step 3: Commit**

```bash
git commit -m "chore: remove legacy v1 files — hardcoded content, old components, old routing"
```

---

## Summary

After completing all 8 tasks, you will have:

1. **Pinned dependencies** with Framer Motion, Lucide React, tsx added
2. **Design tokens** — Cinzel + Josefin Sans fonts, full color palette, typography scale, component classes
3. **16 Sanity schemas** — unit, villa, plot, 5 page documents, upgrade, experience, developer, FAQ, lead submission, site settings
4. **Sanity client** with read + write clients, GROQ queries for all data, TypeScript types
5. **i18n infrastructure** — middleware locale detection, path-preserving switcher, RTL support
6. **Layout shell** — frosted glass header, dark footer, sticky CTA drawer, inline contact section
7. **Contact API** — Turnstile spam protection, GDPR consent, UTM tracking, Sanity write
8. **Clean codebase** — legacy v1 files removed

**Next:** Plan 2 will build all 6 content pages on top of this foundation.
