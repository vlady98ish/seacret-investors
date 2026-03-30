# Remove Fallback Data — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove all hardcoded fallback data, static images, and placeholder content so the site runs purely from Sanity CMS.

**Architecture:** Delete source files (fallback-data.ts, villa-images.ts, fetch.ts) and 105 MB of static assets, then fix all consumers: 4 page files and ~10 component files. Components that receive no data return `null` (section disappears). Villa detail page returns `notFound()` if CMS has no data.

**Tech Stack:** Next.js 15 (App Router), Sanity CMS, TypeScript

**Spec:** `docs/superpowers/specs/2026-03-30-remove-fallback-data.md`

---

### Task 1: Delete source files and static assets

**Files:**
- Delete: `lib/fallback-data.ts`
- Delete: `lib/villa-images.ts`
- Delete: `lib/sanity/fetch.ts`
- Delete: `public/assets/` (entire directory)
- Delete: `public/brochure/` (entire directory)

- [ ] **Step 1: Delete the three TypeScript source files**

```bash
rm seacret-investors-v2/lib/fallback-data.ts
rm seacret-investors-v2/lib/villa-images.ts
rm seacret-investors-v2/lib/sanity/fetch.ts
```

- [ ] **Step 2: Delete static assets directories**

```bash
rm -rf seacret-investors-v2/public/assets
rm -rf seacret-investors-v2/public/brochure
```

- [ ] **Step 3: Commit**

```bash
git add -A seacret-investors-v2/lib/fallback-data.ts seacret-investors-v2/lib/villa-images.ts seacret-investors-v2/lib/sanity/fetch.ts seacret-investors-v2/public/assets seacret-investors-v2/public/brochure
git commit -m "chore: delete fallback data files and 105 MB of static assets"
```

> **Note:** The project will NOT compile after this task. That is expected — subsequent tasks fix all consumers.

---

### Task 2: Clean page files — remove fallback imports and simplify fetch logic

**Files:**
- Modify: `app/[locale]/page.tsx`
- Modify: `app/[locale]/masterplan/page.tsx`
- Modify: `app/[locale]/residences/page.tsx`
- Modify: `app/[locale]/villas/[slug]/page.tsx`

These 4 pages import from `@/lib/fallback-data`. The villa detail page also imports from `@/lib/villa-images`. All other pages (about, contact, location) have no fallback imports.

- [ ] **Step 1: Clean `app/[locale]/page.tsx` (Home)**

Remove the fallback-data import line:
```typescript
// DELETE this line:
import { getFallbackHomePage, fallbackStats } from "@/lib/fallback-data";
```

Replace `fetchHomePage()` function (lines 28-36) with:
```typescript
async function fetchHomePage(): Promise<HomePageData | null> {
  try {
    return await sanityClient.fetch<HomePageData | null>(homePageQuery);
  } catch {
    return null;
  }
}
```

Replace `fetchStats()` function (lines 38-56) with:
```typescript
async function fetchStats() {
  try {
    return await sanityClient.fetch<{
      total: number;
      available: number;
      reserved: number;
      sold: number;
    } | null>(availabilityStatsQuery);
  } catch {
    return null;
  }
}
```

- [ ] **Step 2: Clean `app/[locale]/masterplan/page.tsx`**

Remove the fallback-data import block (lines 27-32):
```typescript
// DELETE these lines:
import {
  fallbackPlots,
  fallbackUnitsFlat,
  fallbackStats,
  getFallbackMasterplanPage,
} from "@/lib/fallback-data";
```

Replace the data fetching block (lines 71-114) with:
```typescript
  // Fetch all data from CMS
  let page: MasterplanPageType | null = null;
  let plots: PlotWithUnits[] = [];
  let units: UnitFlat[] = [];
  let stats: { total: number; available: number; reserved: number; sold: number } | null = null;
  let uiStrings: UiStrings | null = null;

  try {
    const result = await sanityClient.fetch<MasterplanPageType>(masterplanPageQuery);
    if (result) page = result;
  } catch {
    // CMS unavailable
  }

  try {
    const result = await sanityClient.fetch<PlotWithUnits[]>(allPlotsQuery);
    if (result?.length) plots = result;
  } catch {
    // CMS unavailable
  }

  try {
    const result = await sanityClient.fetch<UnitFlat[]>(allUnitsQuery);
    if (result?.length) units = result;
  } catch {
    // CMS unavailable
  }

  try {
    const result = await sanityClient.fetch(availabilityStatsQuery);
    if (result) stats = result;
  } catch {
    // CMS unavailable
  }

  try {
    const result = await sanityClient.fetch<UiStrings>(uiStringsQuery);
    if (result) uiStrings = result;
  } catch {
    // CMS unavailable
  }
```

Also fix `generateMetadata` (lines 44-57) — remove line `if (!page) page = getFallbackMasterplanPage();` and let page stay null. The `buildPageMetadata` already handles null with its fallback parameter.

Remove the `|| "English text"` fallbacks from stat labels, section headings, and hero subtitle. Replace with just `t(...)`:
- `const statTotalLabel = t(page?.statTotalLabel) ?? "";` (and similarly for other stat labels)
- `subtitle={introCopy}` (remove the `?? "6 residential plots..."` fallback)
- Remove all `|| "Explore"`, `|| "Interactive Masterplan"`, `|| "Full Inventory"`, etc. from SectionHeading props
- Remove `|| "text"` from all label constants (legendLabels, panelLabels, inventoryLabels) — replace with `?? ""`

The statsItems fallback block (lines 136-139 with hardcoded 39 and 6) — remove entirely. Use only:
```typescript
  const statsItems = stats
    ? [
        { label: statTotalLabel, value: stats.total },
        { label: statAvailableLabel, value: stats.available },
        { label: statReservedLabel, value: stats.reserved },
        { label: statSoldLabel, value: stats.sold },
      ]
    : [];
```

- [ ] **Step 3: Clean `app/[locale]/residences/page.tsx`**

Remove the fallback-data import block (lines 24-29):
```typescript
// DELETE these lines:
import {
  fallbackVillas,
  fallbackUnitsFlat,
  fallbackUpgrades,
  getFallbackResidencesPage,
} from "@/lib/fallback-data";
```

Replace data fetching block (lines 67-118): remove all `if (!x) x = fallbackX;` lines. Keep the try-catch blocks but simply let variables stay empty/null on failure. Specifically remove:
- `if (!page) page = getFallbackResidencesPage();` (lines 80)
- `if (!villas.length) villas = fallbackVillas;` (line 88)
- `if (!units.length) units = fallbackUnitsFlat;` (line 96)
- `if (!upgrades) upgrades = fallbackUpgrades as unknown as Upgrade[];` (line 104)

Also fix `generateMetadata` — remove `if (!page) page = getFallbackResidencesPage();` (line 48).

Remove `|| "English text"` from all string literals:
- `heroTitle`: change `t(page?.heroTitle) ?? "The Residences"` → `t(page?.heroTitle) ?? ""`
- `subtitle`: remove `?? "Six distinct villa types. Each a private world."`
- All SectionHeading eyebrow/title/description: remove `|| "Our Collection"`, `|| "Choose Your Villa"`, etc.
- All filterLabels values: remove `|| "Bedrooms"`, `|| "Available only"`, etc.
- All tableHeaders values: remove `|| "Villa Type"`, etc.

- [ ] **Step 4: Clean `app/[locale]/villas/[slug]/page.tsx`**

Remove both imports:
```typescript
// DELETE these lines:
import { fallbackVillas, getFallbackVillaWithUnits } from "@/lib/fallback-data";
import { getVillaImages } from "@/lib/villa-images";
```

Replace `fetchData()` function (lines 36-62):
```typescript
async function fetchData(slug: string): Promise<{
  villa: VillaWithUnits | null;
  allVillas: Villa[];
  uiStrings: UiStrings | null;
}> {
  let villa: VillaWithUnits | null = null;
  let allVillas: Villa[] = [];
  let uiStrings: UiStrings | null = null;

  try {
    const [villaResult, villasResult, uiStringsResult] = await Promise.all([
      sanityClient.fetch<VillaWithUnits | null>(villaBySlugQuery, { slug }),
      sanityClient.fetch<Villa[]>(allVillasQuery),
      sanityClient.fetch<UiStrings>(uiStringsQuery),
    ]);
    if (villaResult) villa = villaResult;
    if (villasResult?.length) allVillas = villasResult;
    if (uiStringsResult) uiStrings = uiStringsResult;
  } catch {
    // CMS unavailable
  }

  return { villa, allVillas, uiStrings };
}
```

In the page component, change the guard logic (lines 101-103):
```typescript
  // If no villa found in CMS, show 404
  if (!villa) notFound();
```

Remove the `villaSlugs` constant (line 26) and `isKnownSlug` check. Also remove `villaSlugs` from `generateStaticParams` — fetch slugs from CMS instead:
```typescript
export async function generateStaticParams() {
  try {
    const villas = await sanityClient.fetch<Array<{ slug: { current: string } }>>(
      groq`*[_type == "villa"]{ slug }`
    );
    return locales.flatMap((locale) =>
      villas.map((v) => ({ locale, slug: v.slug.current }))
    );
  } catch {
    return [];
  }
}
```

Add the `groq` import:
```typescript
import { groq } from "next-sanity";
```

Remove `staticImages` and all image fallback logic (lines 106-123). Replace with:
```typescript
  const heroImageUrl = getSanityImageUrl(villa.heroImage, 1600);

  const galleryImages = (villa.galleryImages ?? [])
    .map((img) => getSanityImageUrl(img, 800))
    .filter((u): u is string => Boolean(u));

  const floorPlanImages = (villa.floorPlanImages ?? [])
    .map((img) => getSanityImageUrl(img, 1200))
    .filter((u): u is string => Boolean(u));
```

Remove `|| "English text"` from ALL label constants (lines 141-184). Replace each `|| "..."` with `?? ""`.

- [ ] **Step 5: Clean `app/[locale]/about/page.tsx`**

This page has no fallback-data import but has a hardcoded image path and text fallbacks.

Remove the hardcoded hero image path (line 104):
```typescript
// Change from:
backgroundImage="/assets/team/about-hero.jpg"
// Change to:
backgroundImage={data?.heroImage ? getSanityImageUrl(data.heroImage, 1920) : undefined}
```

Add the import for `getSanityImageUrl`:
```typescript
import { getSanityImageUrl } from "@/lib/sanity/image";
```

Remove text fallbacks (lines 58-59):
```typescript
// Change from:
const heroTitle = getLocalizedValue(data?.heroTitle, typedLocale) || "Building the Future of Greek Living";
const heroSubtitle = getLocalizedValue(data?.heroSubtitle, typedLocale) || "Live Better Group — Transforming real estate since 2020";
// Change to:
const heroTitle = getLocalizedValue(data?.heroTitle, typedLocale) ?? "";
const heroSubtitle = getLocalizedValue(data?.heroSubtitle, typedLocale);
```

- [ ] **Step 6: Clean `app/[locale]/location/page.tsx`**

Remove the hardcoded hero image path (line 96):
```typescript
// Change from:
backgroundImage="/assets/pdf/page-04-location.jpg"
// Change to (need to add getSanityImageUrl import):
backgroundImage={page?.heroImage ? getSanityImageUrl(page.heroImage, 1920) : undefined}
```

Add the import:
```typescript
import { getSanityImageUrl } from "@/lib/sanity/image";
import { buildPageMetadata } from "@/lib/metadata";
```

Remove text fallbacks from hero (lines 87-89):
```typescript
const heroTitle = t(page?.heroTitle) ?? "";
const heroSubtitle = t(page?.whySection);
```

- [ ] **Step 7: Clean `app/[locale]/contact/page.tsx`**

Remove text fallbacks (lines 68-72):
```typescript
const heroTitle = t(contactPage?.heroTitle) ?? "";
const heroSubtitle = t(contactPage?.heroSubtitle);
```

- [ ] **Step 8: Commit**

```bash
git add seacret-investors-v2/app/
git commit -m "refactor: remove fallback imports and hardcoded text from all page files"
```

---

### Task 3: Clean home section components

**Files:**
- Modify: `components/home/hero-section.tsx`
- Modify: `components/home/concept-section.tsx`
- Modify: `components/home/lifestyle-section.tsx`
- Modify: `components/home/residences-preview-section.tsx`
- Modify: `components/home/location-highlight-section.tsx`
- Modify: `components/home/masterplan-teaser-section.tsx`
- Modify: `components/home/cta-section.tsx`

- [ ] **Step 1: Clean `hero-section.tsx`**

Remove text and image fallbacks:
```typescript
export function HeroSection({ data, locale, ctaExplore, ctaBrochure }: HeroSectionProps) {
  const title = getLocalizedValue(data?.heroTagline, locale) ?? "";
  const subtitle = getLocalizedValue(data?.heroSubtitle, locale);
  const imageUrl = getSanityImageUrl(data?.heroImage, 1920);

  return (
    <PageHero backgroundImage={imageUrl} title={title} subtitle={subtitle}>
      {ctaExplore && (
        <a href={`/${locale}/residences`} className="btn btn-primary">
          {ctaExplore}
        </a>
      )}
      {ctaBrochure && (
        <a href={`/${locale}/contact`} className="btn btn-secondary">
          {ctaBrochure}
        </a>
      )}
    </PageHero>
  );
}
```

- [ ] **Step 2: Clean `concept-section.tsx`**

Delete `FALLBACK_HEADING` and `FALLBACK_COPY` constants. Add null guard:
```typescript
export function ConceptSection({ data, locale }: ConceptSectionProps) {
  const eyebrow = getLocalizedValue(data?.conceptEyebrow, locale);
  const heading = getLocalizedValue(data?.conceptTitle, locale);
  const copy = getLocalizedValue(data?.conceptCopy, locale);
  const imageUrl = getSanityImageUrl(data?.conceptImage, 800);

  if (!heading && !copy) return null;

  return (
    <section className="bg-[var(--color-sand)] py-24 sm:py-32">
      <div className="section-shell">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <ScrollReveal direction="left">
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            {heading && <h2 className="text-h2 mt-4">{heading}</h2>}
            {copy && (
              <p className="text-body-muted mt-6 max-w-lg leading-relaxed">{copy}</p>
            )}
          </ScrollReveal>

          {imageUrl && (
            <ScrollReveal delay={0.15}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                <Image
                  src={imageUrl}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </ScrollReveal>
          )}
        </div>
      </div>
    </section>
  );
}
```

Remove `heading` and `copy` from props type — they're not passed from the page anymore. Simplify to:
```typescript
type ConceptSectionProps = {
  data: HomePage | null;
  locale: Locale;
};
```

- [ ] **Step 3: Clean `lifestyle-section.tsx`**

Delete the `fallbackMoments` array. Add null guard:
```typescript
export function LifestyleSection({ data, locale, title, eyebrowLabel, periodLabels }: LifestyleSectionProps) {
  const moments = data?.lifestyleMoments;
  if (!moments?.length) return null;

  // ...rest of component uses moments from CMS only, with getSanityImageUrl for images
```

For each moment image, use `getSanityImageUrl(moment.image, 800)` and only render if it exists.

- [ ] **Step 4: Clean `residences-preview-section.tsx`**

Delete the `placeholderVillas` array. Add null guard:
```typescript
export function ResidencesPreviewSection({ villas, locale, title, description, eyebrowLabel, ctaLabel, labelBed, labelContactForPricing }: ResidencesPreviewSectionProps) {
  if (!villas?.length) return null;

  // ...render using CMS villas only, using getSanityImageUrl for heroImage
```

Remove the fallback rendering branch that used `placeholderVillas`.

- [ ] **Step 5: Clean `location-highlight-section.tsx`**

Delete `FALLBACK_ICONS` and `fallbackHighlights`. Add null guard:
```typescript
export function LocationHighlightSection({ locale, title, description, highlights, eyebrowLabel, ctaLabel }: LocationHighlightSectionProps) {
  if (!highlights?.length) return null;

  // ...render only CMS-provided highlights
```

Remove all `?? "text"` fallbacks for eyebrow, title, description, ctaLabel.

- [ ] **Step 6: Clean `masterplan-teaser-section.tsx`**

Remove the image fallback and text fallbacks. Add null guard:
```typescript
export function MasterplanTeaserSection({ data, stats, locale, title, description, statTotalLabel, statPlotsLabel, statAvailableLabel, eyebrowLabel, ctaLabel }: MasterplanTeaserSectionProps) {
  const imageUrl = getSanityImageUrl(data?.masterplanImage, 1200);
  if (!imageUrl && !stats) return null;

  // Use imageUrl (can be null — render placeholder div if needed)
  // Remove ?? 39, ?? 6 hardcoded stats
  // Remove all || "text" fallbacks
```

- [ ] **Step 7: Clean `cta-section.tsx`**

Remove text fallbacks. Add null guard:
```typescript
export function CtaSection({ data, locale, ctaLabel }: CtaSectionProps) {
  const title = getLocalizedValue(data?.ctaTitle, locale);
  const subtitle = getLocalizedValue(data?.ctaSubtitle, locale);
  if (!title) return null;

  // ...render without || "text" fallbacks
```

- [ ] **Step 8: Commit**

```bash
git add seacret-investors-v2/components/home/
git commit -m "refactor: remove fallbacks from home section components"
```

---

### Task 4: Clean about section components

**Files:**
- Modify: `components/about/founders-section.tsx`
- Modify: `components/about/values-section.tsx`
- Modify: `components/about/stats-bar.tsx`
- Modify: `components/about/our-story-section.tsx`
- Modify: `components/about/about-cta-section.tsx`

- [ ] **Step 1: Clean `founders-section.tsx`**

Delete `FALLBACK_FOUNDERS`, `HardcodedFounder` type, and `founderImagePath()` function. The CMS provides founder photos via `SanityImage`. Update the component to only render CMS founders:

```typescript
import Image from "next/image";
import { getSanityImageUrl } from "@/lib/sanity/image";
import { ScrollReveal } from "@/components/scroll-reveal";
import type { SanityImage } from "@/lib/sanity/types";

type CmsFounder = {
  name: string;
  role: string;
  bio: string;
  photo?: SanityImage;
};

type FoundersSectionProps = {
  eyebrow?: string;
  founders?: CmsFounder[];
};

export function FoundersSection({ eyebrow, founders }: FoundersSectionProps) {
  if (!founders?.length) return null;

  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="section-shell">
        {eyebrow && (
          <ScrollReveal>
            <p className="eyebrow">{eyebrow}</p>
          </ScrollReveal>
        )}

        <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-16">
          {founders.map((founder, i) => {
            const photoUrl = founder.photo ? getSanityImageUrl(founder.photo as SanityImage, 320) : null;
            return (
              <ScrollReveal
                key={founder.name}
                delay={i * 0.1}
                direction={i === 0 ? "left" : "right"}
              >
                <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                  <div className="relative h-[200px] w-[160px] flex-shrink-0 overflow-hidden rounded-xl bg-[var(--color-stone)]">
                    {photoUrl && (
                      <Image
                        src={photoUrl}
                        alt={`${founder.name} — ${founder.role}`}
                        fill
                        className="object-cover"
                        sizes="160px"
                      />
                    )}
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-h3">{founder.name}</h3>
                    {founder.role && (
                      <p className="mt-1 text-sm font-medium text-[var(--color-deep-teal)]">
                        {founder.role}
                      </p>
                    )}
                    {founder.bio && (
                      <p className="text-body-muted mt-4">{founder.bio}</p>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

**Important:** The about page (`app/[locale]/about/page.tsx`) maps CMS founders with only `{ name, role, bio }`. Update it to also pass `photo`:
```typescript
  const founders = data?.founders?.map((f) => ({
    name: f.name,
    role: getLocalizedValue(f.role, typedLocale) || "",
    bio: getLocalizedValue(f.bio, typedLocale) || "",
    photo: f.photo,
  }));
```

- [ ] **Step 2: Clean `values-section.tsx`**

Delete `FALLBACK_VALUES`. Add null guard:
```typescript
export function ValuesSection({ eyebrow, title, values }: ValuesSectionProps) {
  if (!values?.length) return null;
  // ...render only CMS values, remove || "text" fallbacks for eyebrow/title
```

- [ ] **Step 3: Clean `stats-bar.tsx`**

Delete `FALLBACK_STATS`. Add null guard:
```typescript
export function StatsBar({ stats }: StatsBarProps) {
  if (!stats?.length) return null;
  // ...render only CMS stats
```

- [ ] **Step 4: Clean `our-story-section.tsx`**

Remove the three hardcoded paragraphs. Add null guard:
```typescript
export function OurStorySection({ eyebrow, title, content }: OurStorySectionProps) {
  if (!content) return null;
  // ...render only CMS content, remove || "text" fallbacks for eyebrow/title
```

- [ ] **Step 5: Clean `about-cta-section.tsx`**

Remove text fallbacks. Add null guard:
```typescript
export function AboutCtaSection({ locale, title, subtitle, buttonText }: AboutCtaSectionProps) {
  if (!title) return null;
  // ...render without || "text" fallbacks
```

- [ ] **Step 6: Commit**

```bash
git add seacret-investors-v2/components/about/ seacret-investors-v2/app/[locale]/about/page.tsx
git commit -m "refactor: remove fallbacks from about section components"
```

---

### Task 5: Clean location and contact components

**Files:**
- Modify: `components/location/why-chiliadou-section.tsx`
- Modify: `components/location/experiences-section.tsx`
- Modify: `components/location/airport-connectivity-section.tsx`
- Modify: `components/location/distance-map-section.tsx`
- Modify: `components/contact/direct-contact-section.tsx`
- Modify: `components/contact/multi-step-form.tsx`

- [ ] **Step 1: Clean `why-chiliadou-section.tsx`**

Delete `defaultFeatures`, `defaultIcons`. Add null guard:
```typescript
export function WhyChiliadouSection({ locale, eyebrow, title, description, features }: WhyChiliadouSectionProps) {
  if (!features?.length && !description) return null;
  // ...render CMS-provided features only, remove all || "text" fallbacks
```

- [ ] **Step 2: Clean `experiences-section.tsx`**

Delete `categoryMeta` fallback object. Add null guard:
```typescript
export function ExperiencesSection({ locale, experiences, eyebrow, title, description, categoryLabels }: ExperiencesSectionProps) {
  if (!experiences?.length) return null;
  // ...render CMS experiences only, remove || "text" fallbacks
```

- [ ] **Step 3: Clean `airport-connectivity-section.tsx`**

Delete `defaultAirports`. Add null guard:
```typescript
export function AirportConnectivitySection({ eyebrow, title, description, airports, ...labelProps }: AirportConnectivitySectionProps) {
  if (!airports?.length) return null;
  // ...render CMS airports only, remove || "text" fallbacks
```

- [ ] **Step 4: Clean `distance-map-section.tsx`**

Delete `defaultDistances`. Add null guard:
```typescript
export function DistanceMapSection({ eyebrow, title, description, markers, locationLabel }: DistanceMapSectionProps) {
  if (!markers?.length) return null;
  // ...render CMS markers only, remove || "text" fallbacks
```

- [ ] **Step 5: Clean `direct-contact-section.tsx`**

Delete `FALLBACK_WHATSAPP`, `FALLBACK_EMAIL`, `FALLBACK_PHONE`, `FALLBACK_OFFICE_HOURS`. The component already receives `settings?: SiteSettings` which has these values. Remove all fallback constants and only use CMS data:
```typescript
export function DirectContactSection({ locale, settings, eyebrow, title, description, labelEmail, labelPhone, labelOfficeHours, responsePromise, labelChatWhatsapp }: DirectContactSectionProps) {
  const whatsapp = settings?.whatsappNumber;
  const email = settings?.salesEmail;
  const phone = settings?.salesPhone;
  const officeHours = settings?.officeHours ? getLocalizedValue(settings.officeHours, locale) : undefined;

  if (!whatsapp && !email && !phone) return null;
  // ...render only CMS data, remove || "text" fallbacks
```

- [ ] **Step 6: Clean `multi-step-form.tsx`**

Delete `FALLBACK_VILLA_NAMES`, `DEFAULT_BUDGET_OPTIONS`, `DEFAULT_TIMELINE_OPTIONS`. The component receives these as props from the page:
```typescript
// Remove the constants, use props directly:
const resolvedVillaNames = villaNames ?? [];
const resolvedBudgetOptions = budgetOptions ?? [];
const resolvedTimelineOptions = timelineOptions ?? [];
```

Remove all `useT("key", "English fallback")` patterns — replace with `useT("key")` (the second argument is the fallback we want to remove).

- [ ] **Step 7: Commit**

```bash
git add seacret-investors-v2/components/location/ seacret-investors-v2/components/contact/
git commit -m "refactor: remove fallbacks from location and contact components"
```

---

### Task 6: Clean remaining components

**Files:**
- Modify: `components/masterplan/visual-explorer.tsx`
- Modify: `components/residences/upgrades-showcase.tsx`
- Modify: `components/sections/faq-accordion.tsx`
- Modify: `components/sections/villa-card.tsx`
- Modify: `components/residences/villa-filters.tsx`
- Modify: `components/residences/villa-type-grid.tsx`
- Modify: `components/villa-detail/floor-plans.tsx`
- Modify: `components/villa-detail/image-gallery.tsx`
- Modify: `components/villa-detail/related-villas.tsx`
- Modify: `components/inline-contact-section.tsx`
- Modify: `components/sticky-cta.tsx`

- [ ] **Step 1: Clean `visual-explorer.tsx`**

Delete `FALLBACK_POSITIONS`. The positions come from `PlotWithUnits.positionData` in the CMS. Replace the position lookup:
```typescript
// Old:
const pos = plot.positionData ?? FALLBACK_POSITIONS[plot.name as keyof typeof FALLBACK_POSITIONS];
// New:
const pos = plot.positionData;
if (!pos) return null; // skip plot with no position
```

Remove the hardcoded masterplan image path. Use `getSanityImageUrl` — but the aerial image is on the plot/page level. If no image prop exists on the component, skip the image or accept it as a prop. Check the current code to see where the aerial image comes from and use CMS data.

- [ ] **Step 2: Clean `upgrades-showcase.tsx`**

Delete `FALLBACK_UPGRADES`. Add null guard:
```typescript
export function UpgradesShowcase({ upgrades, locale }: UpgradesShowcaseProps) {
  if (!upgrades?.length) return null;
  // ...render CMS upgrades only
```

- [ ] **Step 3: Clean `faq-accordion.tsx`**

Delete `FALLBACK_FAQS`. Add null guard:
```typescript
export function FAQAccordion({ items }: FAQAccordionProps) {
  if (!items?.length) return null;
  // ...render CMS FAQs only
```

- [ ] **Step 4: Clean `villa-card.tsx`**

Remove `getVillaImages` import and usage:
```typescript
// DELETE:
import { getVillaImages } from "@/lib/villa-images";

// Change image resolution from:
const autoStaticSrc = getVillaImages(villa.slug.current).hero;
const imageSrc = imageUrl ?? staticImageSrc ?? autoStaticSrc;
// To:
const imageSrc = imageUrl ?? staticImageSrc;
```

Remove `|| "text"` fallbacks from labels.

- [ ] **Step 5: Clean `villa-filters.tsx`**

Remove `getVillaImages` import and its usage:
```typescript
// DELETE:
import { getVillaImages } from "@/lib/villa-images";

// In the VillaCard rendering, remove:
staticImageSrc={getVillaImages(villa.slug.current).hero}
```

Also remove the English fallback (second argument) from all `useT()` calls:
```typescript
// Change from:
useT("filterAll", "All")
useT("miscBed", "bed")
useT("statusSoldOut", "Sold Out")
// etc.
// Change to:
useT("filterAll")
useT("miscBed")
useT("statusSoldOut")
// etc.
```

- [ ] **Step 6: Clean `villa-type-grid.tsx`**

Remove `getVillaImages` import and its usage:
```typescript
// DELETE:
import { getVillaImages } from "@/lib/villa-images";

// In VillaCard rendering, remove:
staticImageSrc={getVillaImages(villa.slug.current).hero}
```

- [ ] **Step 7: Clean `floor-plans.tsx`**

Delete `DEFAULT_LABELS`:
```typescript
// Use labels prop directly, or empty strings if not provided
```

- [ ] **Step 8: Clean `image-gallery.tsx`, `related-villas.tsx`, `inline-contact-section.tsx`, `sticky-cta.tsx`**

For each: remove all `?? "text"` and `|| "text"` hardcoded English fallbacks. Components already receive labels as props.

For `inline-contact-section.tsx`: remove the `https://wa.me/1234567890` placeholder WhatsApp URL. Use site settings data.

- [ ] **Step 9: Commit**

```bash
git add seacret-investors-v2/components/
git commit -m "refactor: remove fallbacks from remaining components"
```

---

### Task 7: Fix site-header brochure link

**Files:**
- Modify: `components/site-header.tsx`
- Modify: `app/[locale]/layout.tsx` (to pass siteSettings to header)

- [ ] **Step 1: Update `site-header.tsx`**

The header currently has the `_siteSettings` parameter (unused with underscore prefix). Rename it and use it:
```typescript
export function SiteHeader({ locale, uiStrings, siteSettings }: SiteHeaderProps) {
```

Replace the hardcoded brochure link (line 93-100):
```typescript
// Old:
<a
  href="/brochure/seacret-residences-brochure.pdf"
  download
  ...
>

// New — only render if brochure exists in CMS:
{siteSettings?.brochurePdf?.[locale]?.asset?.url && (
  <a
    href={siteSettings.brochurePdf[locale].asset.url}
    download
    className="flex h-9 w-9 items-center justify-center rounded-md text-white/60 transition hover:text-white"
    aria-label="Download brochure"
  >
    <Download className="h-4 w-4" />
  </a>
)}
```

Also check the mobile menu for the same brochure link pattern and fix similarly.

- [ ] **Step 2: Verify layout passes siteSettings**

Check that `app/[locale]/layout.tsx` already fetches and passes `siteSettings` to `SiteHeader`. If not, add the fetch.

- [ ] **Step 3: Commit**

```bash
git add seacret-investors-v2/components/site-header.tsx seacret-investors-v2/app/[locale]/layout.tsx
git commit -m "refactor: brochure download from CMS site settings"
```

---

### Task 8: Build verification

- [ ] **Step 1: Run the build**

```bash
cd seacret-investors-v2 && npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 2: Fix any remaining compilation errors**

If the build fails, read the error messages carefully. Common issues:
- Unused imports left behind (remove them)
- Props no longer passed that components still expect (update prop types)
- Missing `getSanityImageUrl` imports added

- [ ] **Step 3: Run build again to confirm**

```bash
npm run build
```

Expected: Build succeeds.

- [ ] **Step 4: Commit any fixes**

```bash
git add -A seacret-investors-v2/
git commit -m "fix: resolve build errors from fallback cleanup"
```
