# The Sea'cret Residences Chiliadou — v2 Full Redesign

## Context

The Sea'cret Residences is a luxury beachfront villa development in Chiliadou, Greece (Corinthian Gulf). The existing v1 website is a functional Next.js prototype with hardcoded content that "looks okay" but doesn't match the premium quality of the brand and its investor presentation. v2 is a full redesign to create a site that looks expensive, exclusive, and converts international buyers into leads. The site targets Israeli, Russian, European, and Greek investors/buyers.

## Tech Stack

- **Framework:** Next.js (App Router) with TypeScript
- **Styling:** Tailwind CSS v4 + custom CSS variables
- **CMS:** Sanity (wired up — content managed via Studio)
- **Animations Tier 1:** CSS + IntersectionObserver + Framer Motion
- **Animations Tier 2:** + GSAP ScrollTrigger + Lenis smooth scroll
- **Validation:** Zod
- **Fonts:** Cinzel (headings) + Josefin Sans (body)
- **i18n:** URL-based locale routing (EN, HE, RU, EL) with RTL support for Hebrew (see i18n Strategy section)

## Design Identity

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `night` | #09222A | Headers, hero overlays, footer, dark sections |
| `deep-teal` | #0D6777 | Primary accent, links, section titles, eyebrows |
| `gold-sun` | #EFC676 | CTAs, highlights, premium accents, hover states |
| `sand` | #F3EAD7 | Page background |
| `stone` | #EADBC2 | Cards, tiles, secondary surfaces |
| `cream` | #FFF9F0 | Glass panels, light overlays |
| `ink` | #13242A | Body text |
| `muted` | #5E6D70 | Secondary text, captions |

### Typography

- **Headings:** Cinzel (serif) — 400/500/600/700 weights
- **Body:** Josefin Sans — 300/400/500/600/700 weights
- **Scale:** Display (clamp 36px-64px), H1 (36px), H2 (24px), H3 (20px), Body (16px), Eyebrow (12px uppercase tracked)
- **Line height:** Body 1.7, Headings 1.2
- **Letter spacing:** Headings +2-4px, Eyebrows +4px, Body default

### Design Style: Exaggerated Minimalism

- Bold typography with generous whitespace
- Full-bleed hero images with dark overlays
- Glass-morphism panels (frosted, semi-transparent)
- Gold accent on dark backgrounds for luxury feel
- Clean grid layouts with 8px spacing system
- SVG icons only (Lucide React) — no emojis

## Site Architecture (Approach C — Hybrid)

### Pages

| Route | Page | Content Source |
|-------|------|---------------|
| `/[locale]` | Homepage | Sanity: `homePage` |
| `/[locale]/residences` | All Residences | Sanity: `villa` collection |
| `/[locale]/villas/[slug]` | Villa Detail (×6) | Sanity: `villa` by slug |
| `/[locale]/masterplan` | Interactive Masterplan | Sanity: `plot` collection |
| `/[locale]/location` | Location & Connectivity | Sanity: `locationPage` |
| `/[locale]/contact` | Contact & Inquire | Sanity: `contactPage` + `siteSettings` |

**Total pages:** 6 templates × 4 locales = 24 pages + 6 villa slugs × 4 locales = 24 villa pages = **~48 static pages**

### Navigation

```
[SR Logo]  Home  Residences  Masterplan  Location  Contact  [EN ▾]
```

- Fixed position, frosted glass backdrop on scroll
- Hamburger menu on mobile with full-screen overlay
- Locale switcher: pill buttons (EN/HE/RU/GR)
- Active state: gold underline

## Pricing Logic

Prices displayed publicly as ranges, computed deterministically from unit data:

- **Price per m²:** Use presale rate (€2,950/m²) as the "from" price. Regular rate (€3,500/m²) is the reference ceiling but not shown publicly.
- **Villa type range:** Computed as `min(unit.totalArea) × €2,950` → displayed as "From €XXK"
- **Sold-out types (e.g. Tai):** Show the villa type with a "Sold Out" badge. Keep specs visible for social proof ("see what sold fast") but replace price with "Sold Out — similar options available" + CTA to comparable types.
- **Sold units:** Excluded from the "available" count but remain visible in the inventory table with "Sold" status.
- **Reserved units:** Shown with "Reserved" badge. Excluded from available count.
- **Homepage CTA:** "From €150K" (lowest possible: Lola ~49m² × €2,950 ≈ €144K, rounded up)

### Price Display Rules
| Context | Format | Example |
|---------|--------|---------|
| Villa card (residences page) | "From €XXK" | "From €383K" |
| Villa detail hero | "From €XXK" | "From €383K" |
| Unit row (inventory table) | "From €XXK" (unit-specific) | "From €395K" |
| Sold-out villa | "Sold Out" badge, no price | — |
| Homepage CTA | "From €150K" (project-wide minimum) | — |

## Trust & Credibility Surfaces

Luxury real estate buyers need reassurance beyond beautiful imagery:

### Downloadable Brochure
- PDF brochure per locale (managed via `siteSettings.brochurePdf`)
- Download CTA in header nav (icon) + on residences page + villa detail pages
- Gated option: require email before download (captures lead) — configurable in CMS

### Developer Section (homepage or dedicated section)
- Company/developer name and credentials
- Architect information with portfolio links
- Years of experience, completed projects
- Source: `developer` Sanity document

### Construction Timeline
- Visual timeline showing project phases (planning → permits → construction → delivery)
- Current status highlighted
- Expected delivery date
- Managed via CMS for easy updates

### FAQ Section
- Accordion on residences page and/or contact page
- Common questions: Golden Visa eligibility, financing, rental management, delivery timeline
- Source: `faq` Sanity documents, filterable by category

### Legal Footer Links
- Privacy Policy, Terms & Conditions, Cookie Policy
- Links managed via `siteSettings.legalLinks`

## Homepage Sections (8 sections)

### 1. Hero
- Full-viewport height
- Background: High-res image (sunset villas) or video (Tier 2)
- Overlay: Dark gradient from bottom
- Content: Tagline "Hidden from many, perfect for few" in Cinzel display
- CTAs: "Explore Residences" (gold) + "Request a Tour" (outline white)
- Animation: Parallax on image (0.3x), text fade-up on load

### 2. The Concept
- Split layout: text left, marble plaque logo image right
- Eyebrow: "THE CONCEPT"
- Copy: Brief philosophy from PDF — "In a world of crowded destinations..."
- Animation: Fade-up on scroll, image scale-in

### 3. Location Highlight
- Interactive map showing Chiliadou on the Corinthian Gulf
- Distance markers: Patras 30min, Nafpaktos 10min, Athens 2.5h
- Key facts: Blue Flag beach, No crowds, Pure authenticity
- CTA: "Explore Location →" links to /location
- Animation: Map pins animate in, distances counter up

### 4. Lifestyle
- Visual storytelling grid: Morning / Day / Evening
- 3 cards with full-bleed background images
- Poetic copy overlay (from PDF)
- Animation: Staggered reveal, parallax on images

### 5. Residences Preview
- Grid of 3-4 featured villa types as cards
- Each card: hero image, villa name, key specs (bedrooms, area), price range
- CTA: "View All Residences →" links to /residences
- Animation: Staggered card entrance with hover lift

### 6. Masterplan Teaser
- Aerial render of the complex
- Overlay: plot labels (A-F)
- Stats: "39 Residences · 6 Plots · X Available"
- CTA: "Explore the Masterplan →" links to /masterplan
- Animation: Image zoom on scroll, labels fade in

### 7. CTA Section
- Dark background (#09222a)
- Display text: "Discover Your Sea'cret"
- Subtitle: "From €150K · Only 39 exclusive residences"
- Button: "Schedule a Viewing" (gold)
- Animation: Text reveal, button pulse

### 8. Contact Section
- Inline lead capture form
- Fields: Full Name, Email, Phone, Interest (villa type dropdown), Message
- WhatsApp quick-connect button
- "A member of our team will contact you within 24h"

## Residences Page (`/residences`)

- Hero: Aerial view with "The Residences" overlay
- Villa type grid: 6 cards (Lola, Mikka, Tai, Michal, Yair, Yehonatan)
- Each card: exterior image, name, specs summary, price range badge, availability count
- Filter/sort by: bedrooms, size, availability
- Comparison section: table comparing all villa types
- Upgrades showcase: Pool, Jacuzzi, Sauna, BBQ, Smart House, Security, Fireplace
- Inline contact form (pre-fills with "General Interest")

## Villa Detail Page (`/villas/[slug]`)

- Immersive hero: full-bleed exterior image + villa name + tagline
- Specs panel (glass-morphism): bedrooms, bathrooms, total area, outdoor area, pool, parking
- Interior gallery: 4 images in masonry/grid layout
- Floor plans: Ground floor, Upper floor, Attic (tabbed or stacked)
- Available units: list of units in this villa type across all plots, with status (Available/Sold/Reserved)
- Price range: "From €XXK" with "Request exact pricing" CTA
- 3D Tour: embedded link/button if available
- Related villas: "You might also like" — 2-3 other villa types
- Inline contact form (pre-fills with villa name)

## Masterplan Page (`/masterplan`)

### Visual Explorer
- Full-screen aerial view of the complex
- Clickable plot overlays (A through F)
- Click plot → side panel slides in with:
  - Plot name and summary
  - Unit breakdown (villa types and counts)
  - Status per unit (Available/Sold/Reserved with color coding)
  - Link to each villa type page
  - Floor plan sheets
- Mobile: bottom sheet instead of side panel
- Color coding: Green = Available, Gold = Reserved, Red = Sold

### Inventory Table (below visual explorer)
- Filterable/sortable table for serious buyers and mobile accessibility
- Columns: Plot, Unit #, Villa Type, Bedrooms, Total Area (m²), Price From, Status
- Filters: by plot (A-F), by villa type, by status (available only / all)
- Sort: by price, by area, by plot
- Status badges: green "Available", gold "Reserved", red "Sold"
- Click row → navigates to villa detail page
- This table is the accessible alternative to the visual masterplan

## Location Page (`/location`)

- Hero: Beach/coastline photo with "Your Secret Escape" overlay
- Why Chiliadou section: Blue Flag beach, no crowds, pure authenticity
- Interactive distance map: markers for Patras, Nafpaktos, Trizonia, Rio Bridge, Galaxidi
- Airport connectivity: 3 cards (PVK, GPA, ATH) with route counts and key destinations
- Local amenities: Supermarkets (7min), Restaurants (2min), Beach bar
- Experiences: Cultural (Delphi, Galaxidi), Nature (beaches, hiking, kayaking), Gastronomy (olives, seafood, wine)
- Inline contact form

## Contact Page (`/contact`)

- Multi-step lead form:
  1. What are you interested in? (Villa type selection or General)
  2. Your details (Name, Email, Phone)
  3. Additional info (Budget range, Timeline, Message)
- WhatsApp button (prominent)
- Email + phone direct links
- Office hours / response time promise

## Global CTA System

### Sticky CTA Button
- Fixed bottom-right corner (bottom-center bar on mobile)
- Gold circular button with "Request Info" or phone icon
- Click → slide-in drawer from right with compact form
- Form fields: Name, Email, Phone, Interest (auto-fills based on current page context)
- Smooth enter/exit animation

### Inline Contact Section
- Appears at bottom of every page (homepage, residences, villa detail, masterplan, location)
- Dark background section
- Full form: Name, Email, Phone, Interest dropdown, Message
- Context pre-fill: villa pages pre-select the villa type, masterplan pre-selects the plot
- WhatsApp button alongside

### Form Submission
- API endpoint: `/api/contact` (POST)
- Validation: Zod schema (name required, email format, phone optional)
- **Spam protection:** Cloudflare Turnstile (invisible mode) — lightweight, no CAPTCHAs
- **GDPR consent:** Required checkbox — "I agree to the Privacy Policy and consent to being contacted"
- **UTM capture:** Auto-capture `utm_source`, `utm_medium`, `utm_campaign` from URL params, store with lead
- **Locale capture:** Store the user's current locale with the submission for language-appropriate follow-up
- **Source tracking:** Store the page URL where the form was submitted (e.g. `/en/villas/yehonatan`)
- On submit: write to Sanity as `leadSubmission` document + send email via Resend
- **Deduplication:** Same email + same villa interest within 24h → update existing lead, don't create duplicate
- Success state: "Thank you" with checkmark animation
- Error state: clear message with retry

## Animation Tiers

### Tier 1 — Scroll-Driven (Default)
- IntersectionObserver fade-up reveals (threshold 0.2)
- CSS `@keyframes` for rise and fade-in
- Framer Motion for component mount/unmount
- Parallax: hero image at 0.3x scroll speed (CSS transform)
- Staggered entrances: 50ms delay per card in grids
- Number counters: animate from 0 to target on scroll into view
- Image hover: scale(1.05) with 300ms transition
- Sticky header: backdrop-filter blur on scroll past hero
- `prefers-reduced-motion`: disable all scroll animations, keep instant state transitions

### Tier 2 — Full Cinematic (Opt-in)
- Everything from Tier 1, plus:
- GSAP ScrollTrigger: section pinning, horizontal scroll sections
- Lenis: smooth scroll with lerp 0.1
- Video hero: autoplay muted loop with gradient overlay
- Page transitions: Framer Motion layout animations between routes
- Text split: heading characters animate in individually (GSAP SplitText or custom)
- Cursor follower: custom cursor on desktop that scales on hover over interactive elements
- 3D tilt: villa cards respond to mouse position with perspective transform
- Shared element transitions: villa card → villa detail hero

### Implementation Strategy
- Build Tier 1 first as the production baseline
- Tier 2 is an enhancement layer, toggled via environment variable or config
- Both tiers share the same component structure — only animation wrappers differ
- Use dynamic imports for GSAP/Lenis to avoid bundle bloat in Tier 1

## Sanity CMS Schema

### Core Data Model

The 39 sellable units are the central entity. Every unit belongs to exactly one plot and one villa type.

**`unit`** (NEW — source of truth for inventory):
- `unitNumber` — e.g. "A1", "B3", "E5"
- `plot` — reference to `plot` document
- `villaType` — reference to `villa` document
- `status` — enum: `available` | `reserved` | `sold`
- `totalArea` — number (m²)
- `outdoorArea` — number (m²)
- `bedrooms` — number
- `bathrooms` — number
- `groundFloor` — number (m²)
- `upperFloor` — number (m², optional)
- `attic` — number (m², optional)
- `balcony` — number (m²)
- `roofTerrace` — number (m², optional)
- `hasPool` — boolean
- `hasParking` — boolean
- `floorLevel` — enum: `ground` | `upper` (for apartments in Plot E/F)

**`villa`** (villa type definition, not individual unit):
- `name` — localized string (e.g. "Yehonatan")
- `slug` — string
- `label` — localized string (e.g. "The Family Estate")
- `summary` — localized text
- `highlights` — array of localized strings
- `heroImage`, `galleryImages`, `floorPlanImages` — image assets
- `tourUrl` — optional 3D tour link
- `specs` — reference specs (typical bedrooms, bathrooms, area range)

**`plot`** (A through F):
- `name` — string (e.g. "Plot A")
- `summary` — localized text
- `aerialImage` — image
- `positionData` — object (x%, y% for masterplan overlay)
- Units are queried via reverse reference (`unit.plot == this._id`)

### Page Documents (each page gets its own document for independent SEO and localized content):

**`homePage`** — restructured sections matching new homepage design
**`residencesPage`** (NEW) — hero, intro copy, comparison table content, upgrades section
**`locationPage`** (NEW) — hero, why Chiliadou copy, distance data, airport info, experiences
**`masterplanPage`** (NEW) — hero, intro copy, legend labels
**`contactPage`** (NEW) — hero, form labels, response promise copy, office info

### Supporting Documents:

**`upgrade`** (NEW) — name, description, image, category (pool/jacuzzi/sauna/bbq/smart/security/fireplace)
**`experience`** (NEW) — title, description, image, category (culture/nature/gastronomy)
**`developer`** (NEW) — company name, description, logo, team members, credentials
**`faq`** (NEW) — question (localized), answer (localized), category, sort order

### Existing schemas to extend:
- `leadSubmission` — add: `source` (page URL), `preferredVilla`, `budget`, `locale`, `utmSource`, `utmMedium`, `utmCampaign`, `gdprConsent` (boolean), `countryCode`
- `siteSettings` — add: `whatsappNumber`, `emailAddress`, `officeHours`, `brochurePdf` (file asset per locale), `legalLinks` (privacy policy URL, terms URL)

## i18n Strategy

### Locale Routing
- URL pattern: `/en/...`, `/he/...`, `/ru/...`, `/el/...`
- Default locale: `en` (used for `x-default` hreflang)
- Root `/` redirects to `/en` (or browser-detected locale via `Accept-Language`)
- Locale switcher preserves current page path (e.g. `/he/villas/yehonatan` → `/en/villas/yehonatan`)

### Hreflang & Canonical
- Every page includes `<link rel="alternate" hreflang="xx" href="...">` for all 4 locales
- `<link rel="alternate" hreflang="x-default" href="/en/...">` points to English version
- `<link rel="canonical">` on each page points to itself (locale-specific)
- `<html lang="xx" dir="ltr|rtl">` set dynamically per locale

### Content Localization (Sanity)
- Field-level localization: each text field has `en`, `he`, `ru`, `el` sub-fields
- Slugs are NOT localized (same slug across locales, e.g. `/villas/yehonatan` in all languages)
- This keeps routing simple and avoids broken cross-locale links

### RTL Support (Hebrew)
- `dir="rtl"` on `<html>` when locale is `he`
- Use CSS logical properties (`margin-inline-start`, `padding-inline-end`) instead of `left`/`right`
- Navigation, cards, grids mirror horizontally
- Numbers, unit codes (m²), and map elements remain LTR within RTL context
- Form inputs: `dir="auto"` to handle mixed LTR/RTL input

## SEO & Performance

- Dynamic meta tags per page via Next.js `generateMetadata`
- Open Graph images: auto-generated or per-page hero images
- JSON-LD structured data: `RealEstateAgent` for the company + `Apartment` (schema.org) per villa type with `numberOfRooms`, `floorSize`, `geo`, `offers` (price range)
- `hreflang` alternate links on every page (see i18n Strategy)
- `x-default` pointing to English version
- `sitemap.xml` generated from all locale routes
- `robots.txt`
- Images: Next.js `<Image>` with WebP/AVIF, responsive srcset, lazy loading
- Fonts: `next/font/google` with `display: swap`, Cyrillic subset for Russian
- Static generation (SSG) for all pages with ISR for CMS updates
- Bundle splitting: GSAP/Lenis only loaded in Tier 2

## Responsive Breakpoints

| Breakpoint | Target |
|------------|--------|
| 375px | Small phone (iPhone SE) |
| 640px (sm) | Large phone |
| 768px (md) | Tablet portrait |
| 1024px (lg) | Tablet landscape / small desktop |
| 1440px (xl) | Desktop |
| 1920px (2xl) | Large desktop |

## Accessibility

- Color contrast: 4.5:1 minimum (all text on all backgrounds verified)
- Focus states: visible rings on all interactive elements
- Alt text: descriptive for all property images
- ARIA labels: icon-only buttons, locale switcher
- Keyboard navigation: full tab support, escape closes modals/drawers
- RTL: Hebrew layout with `dir="rtl"` — mirrored layouts, correct text alignment
- `prefers-reduced-motion`: respected across both animation tiers
- Skip-to-main link for keyboard users

## Verification Plan

1. `npm install` — dependencies install cleanly
2. `npm run dev` — local dev server starts without errors
3. Navigate all 6 page templates in EN locale
4. Switch to HE locale — verify RTL layout and Hebrew content
5. Switch to RU and EL — verify content renders
6. Test sticky CTA button — opens drawer, form submits, context pre-fills correctly
7. Test inline contact form on each page — validates and shows success/error states
8. Test masterplan — click each plot, verify panel shows correct units and statuses
9. Test villa detail pages — gallery, specs, floor plans, available units all render
10. Test responsive: 375px, 768px, 1440px
11. Run Lighthouse: target 90+ Performance, 100 Accessibility, 90+ SEO
12. Verify Sanity Studio accessible at /studio and content editable
13. Test Tier 1 animations: scroll reveals, parallax, hover states
14. Test Tier 2 animations (if enabled): GSAP, Lenis, video hero, page transitions
15. Verify `prefers-reduced-motion` disables animations gracefully
