# Sea'cret Residences v2 — Plan 3: Interactive & Polish

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the site to production quality — seed CMS with real data from the PDF presentation, add Tier 1 animation polish, implement SEO (JSON-LD, sitemap, robots.txt), add trust surfaces (FAQ, developer section, brochure download), and optionally add Tier 2 cinematic animations.

**Architecture:** CMS seed script populates Sanity with all 39 units, 6 villa types, 6 plots, and page content. Tier 1 animations use existing ScrollReveal + Framer Motion. SEO uses Next.js generateMetadata + static files. Tier 2 is opt-in via env var.

**Tech Stack:** Sanity CLI (seed), Next.js metadata API, schema.org JSON-LD, Framer Motion, GSAP (Tier 2), Lenis (Tier 2)

**Spec:** `docs/superpowers/specs/2026-03-28-seacret-residences-v2-design.md`

---

## Task 1: Seed Sanity CMS with Real Data

Populate the CMS with all content from the PDF presentation so pages render with real data instead of fallbacks.

**Files:**
- Create: `sanity/seed/seed-data.ts` — Script to create all documents

**What to seed (from the PDF):**

**6 Villa Types:**
| Name | Slug | Bedrooms | Bathrooms | Area Range | Sort |
|------|------|----------|-----------|------------|------|
| Lola | lola | 1 | 1 | 49-52 | 1 |
| Mikka | mikka | 1 | 1 | 59-63 | 2 |
| Tai | tai | 2 | 2 | 85 | 3 |
| Michal | michal | 3 | 2 | 130-134 | 4 |
| Yair | yair | 3 | 2 | 142-150 | 5 |
| Yehonatan | yehonatan | 5 | 3 | 212-214 | 6 |

**6 Plots:** A (position ~20%,40%), B (~35%,55%), C (~50%,45%), D (~62%,35%), E (~75%,28%), F (~85%,22%)

**39 Units** (from PDF floor plans — Plot A: 2 Yehonatan + 2 Tai; Plot B: 3 Yair + 2 Tai; Plot C: 3 Michal + 2 Tai; Plot D: 5 Michal; Plot E: 5 Lola ground + 5 Mikka upper; Plot F: 5 Lola ground + 5 Mikka upper)

**Sold units:** A1 Yehonatan, A3 Tai, A4 Tai, B4 Tai, B5 Tai, C1 Michal, C4 Tai, C5 Tai, E3 Lola, F1 Lola

**7 Upgrades:** Pool, Outdoor Jacuzzi, 2-Person Outdoor Sauna, BBQ Corner, Smart House, Security System, Fireplace

**Homepage content:** Taglines, concept copy, lifestyle moments (Morning/Day/Evening)

**Site Settings:** Project name, placeholder email/phone/WhatsApp

- [ ] Write seed script using `@sanity/client` create mutations
- [ ] Run: `npm run seed`
- [ ] Verify data appears in Sanity Studio at /studio
- [ ] Verify homepage and all pages now render with real CMS content
- [ ] Commit

---

## Task 2: SEO — JSON-LD, Sitemap, Robots.txt

**Files:**
- Create: `app/sitemap.ts` — Dynamic sitemap generation
- Create: `app/robots.ts` — Robots.txt
- Create: `components/json-ld.tsx` — Structured data component
- Modify: `app/[locale]/page.tsx` — Add JSON-LD
- Modify: `app/[locale]/villas/[slug]/page.tsx` — Add Apartment JSON-LD

- [ ] Create `app/sitemap.ts` — Generate sitemap with all locale routes (homepage, residences, 6 villas, masterplan, location, contact × 4 locales)
- [ ] Create `app/robots.ts` — Allow all, point to sitemap
- [ ] Create `components/json-ld.tsx` — Server component that renders `<script type="application/ld+json">`. Support `RealEstateAgent` (company) and `Apartment` (per villa) schemas
- [ ] Add `RealEstateAgent` JSON-LD to homepage
- [ ] Add `Apartment` JSON-LD to each villa detail page with numberOfRooms, floorSize, geo coordinates (Chiliadou: 38.3647, 21.8892)
- [ ] Commit

---

## Task 3: Trust Surfaces — FAQ, Developer Section

**Files:**
- Create: `components/sections/faq-accordion.tsx` — Expandable FAQ
- Create: `components/sections/developer-section.tsx` — Developer credibility
- Modify: `app/[locale]/residences/page.tsx` — Add FAQ section
- Modify: `app/[locale]/page.tsx` — Add developer section

- [ ] Create `faq-accordion.tsx` — Client component. Accordion with expandable items. Props: `faqs: FAQ[]`, `locale: Locale`. Fallback: 5 hardcoded FAQs (Golden Visa, financing, construction timeline, rental management, delivery date)
- [ ] Create `developer-section.tsx` — Server component. Company name, description, credentials. Fetches developer query. Fallback: placeholder text
- [ ] Add FAQ to residences page (between upgrades and contact section)
- [ ] Add developer section to homepage (between CTA and contact section)
- [ ] Seed FAQ data: 5 questions with English answers
- [ ] Commit

---

## Task 4: Brochure Download

**Files:**
- Modify: `components/site-header.tsx` — Wire download button
- Create: `components/brochure-modal.tsx` — Optional email gate before download

- [ ] Copy the PDF brochure to `public/brochure/seacret-residences-en.pdf` (or link to the existing PDF in Downloads)
- [ ] Wire the Download icon in the header to either direct-download the PDF or open a modal asking for email first (lead capture)
- [ ] For now: direct download link (no email gate — simpler)
- [ ] Commit

---

## Task 5: Tier 1 Animation Polish

Ensure all existing ScrollReveal animations work correctly and add missing ones.

**Files:**
- Modify: various page and section components

- [ ] Verify ScrollReveal is applied to all section entrances on homepage
- [ ] Add staggered animations to villa cards on residences page
- [ ] Add counter animation to StatsBar (animate numbers from 0 to target)
- [ ] Add hover scale effect on villa cards (verify CSS transition works)
- [ ] Add smooth header backdrop-blur transition on scroll
- [ ] Test `prefers-reduced-motion` — all animations should be disabled
- [ ] Commit

---

## Task 6: Tier 2 Cinematic Animations (Optional)

Add GSAP + Lenis for the cinematic experience. Behind an env var `NEXT_PUBLIC_ANIMATION_TIER=2`.

**Files:**
- Create: `lib/animation-config.ts` — Tier detection
- Create: `components/smooth-scroll-provider.tsx` — Lenis wrapper
- Modify: `app/[locale]/layout.tsx` — Conditionally wrap with Lenis
- Create: `components/home/hero-section-cinematic.tsx` — Video hero variant

- [ ] Install: `gsap` + `@studio-freight/lenis` (or `lenis`)
- [ ] Create animation config: `const TIER = process.env.NEXT_PUBLIC_ANIMATION_TIER === "2" ? 2 : 1`
- [ ] Create Lenis smooth scroll provider (client component, wraps children)
- [ ] Conditionally enable Lenis in locale layout when Tier 2
- [ ] Create cinematic hero variant with video background + text split animation
- [ ] Commit

---

## Summary

| Task | Scope | Priority |
|------|-------|----------|
| 1. Seed CMS | Real data for all pages | Critical |
| 2. SEO | JSON-LD, sitemap, robots | High |
| 3. Trust surfaces | FAQ, developer section | High |
| 4. Brochure download | PDF download from header | Medium |
| 5. Tier 1 polish | Animation consistency | Medium |
| 6. Tier 2 cinematic | GSAP, Lenis, video hero | Low (optional) |

After Plan 3, the site is production-ready.
