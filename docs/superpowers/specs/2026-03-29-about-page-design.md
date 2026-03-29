# Sea'cret Residences — About Page

> Dedicated `/about` page for Live Better Group. Editorial flow layout with full origin story.

## Decisions Made

- **Separate page** (not a homepage section)
- **Layout:** Editorial Flow — Hero → Stats → Story → Founders → Values → CTA → Contact
- **Navigation:** Add "About" before "Contact" in main nav
- **Content approach:** Full origin story (pandemic, Patras, students, expansion)
- **Founder photos:** B&W headshots already downloaded to `/public/assets/team/`

---

## Page Structure

### 1. PageHero (compact)

Reuse existing `PageHero` component.

- **Title:** "Building the Future of Greek Living"
- **Subtitle:** "Live Better Group — Transforming real estate since 2020"
- **Background image:** Reuse an existing project photo (e.g., `/assets/pdf/page-04-location.jpg` or a construction/portfolio shot)

### 2. Stats Bar

Full-width dark strip (`--color-ink`) immediately below hero. Four stats with gold (`--color-gold-sun`) numbers and muted labels.

| Stat | Value | Label |
|------|-------|-------|
| Completed projects | 12+ | Completed Projects |
| Housing units | 80+ | Units Delivered |
| Capital raised | €10M+ | Capital Raised |
| ROI | 45%+ | ROI in 2023–2024 |

Animated counters on scroll: use Framer Motion `useInView` to trigger, `useMotionValue` + `useTransform` + `animate` to count from 0 to target over 1.5s with `easeOut`. Display integers only (no decimals). For values with suffixes like "€10M+" — animate the number part (0→10), render prefix/suffix statically. Respect `prefers-reduced-motion` — show final values immediately.

### 3. Our Story

Background: `--color-cream` (`#fff9f0`).

**Eyebrow:** "Our Story"
**Heading:** "From a pandemic-era idea to Greece's most dynamic developer"

**Content (3 paragraphs):**

1. **The beginning:** Founded September 2020 during the pandemic. Tom Linkovsky and Evgeny Kalika — friends for 30+ years — identified untapped potential in the Greek real estate market, starting with Patras, a vibrant university city.

2. **The concept:** They saw students living in outdated, poorly maintained apartments and created the "Airbnb for students" — fully furnished apartments for long-term rental. 5-year track record with zero vacant units exceeding one week.

3. **The expansion:** From student housing, they expanded into family housing, property flips, villa construction, and luxury vacation residences. Today Live Better Group operates across Patras, Athens, and the resort towns of Chiliadou and Akrata.

Layout: Left-aligned text with `max-w-3xl`, centered in `section-shell`. ScrollReveal entrance.

### 4. The Founders

Background: `white`.

**Eyebrow:** "The Founders"

Two founder cards side-by-side on desktop, stacked on mobile. Each card:

- **Photo:** Rounded-xl, ~160×200 aspect. B&W images from `/assets/team/tom-linkovsky.webp` and `/assets/team/evgeny-kalika.webp`
- **Name** (text-h3)
- **Role** ("Co-Founder" in deep-teal)
- **Bio** (2–3 lines, muted text)

**Tom Linkovsky** — Entrepreneur with over 20 years of experience. Previously owned a restaurant chain in Tel Aviv, worked in import and large-scale event management. Brings operational drive and strategic vision.

**Evgeny Kalika** — Specialist in marketing, strategic consulting, and advertising. Known for discipline, reliability, and responsibility. Drives the group's investor relations and market positioning.

ScrollReveal with `direction="left"` for Tom, `direction="right"` for Evgeny.

### 5. Why Live Better (Values)

Background: `--color-sand` (`#f3ead7`).

**Eyebrow:** "Why Live Better"
**Heading:** "A 360° approach to real estate investment"

Grid of 6 value cards (3×2 desktop, 2×3 tablet, 1×6 mobile). Each card: white bg, rounded-xl, padding, icon (Lucide) + title + short description.

| Icon | Title | Description |
|------|-------|-------------|
| `Shield` | Full Transparency | Honesty at every stage. Online access to construction monitoring. |
| `Key` | Real Ownership | Full property rights registered in your name from day one. |
| `Globe` | Global Investor Base | Dozens of investors from Israel, Greece, Poland, Germany, USA, and beyond. |
| `TrendingUp` | Above-Market Returns | Investment profitability exceeded 45% in 2023–2024. Expected 7–10% annual rental yield. |
| `Handshake` | End-to-End Support | Full transaction support from property selection to key handover. |
| `MapPin` | Local Expertise | Deep relationships with Greek agents, architects, engineers, contractors, and authorities. |

Staggered ScrollReveal (`delay={i * 0.08}`).

### 6. CTA

Reuse existing `CtaSection` pattern (dark bg, centered text, button to `/contact`).

- **Title:** "Ready to invest with confidence?"
- **Subtitle:** "Join dozens of investors already building wealth with Live Better Group"
- **Button:** "Schedule a Consultation" → links to `/{locale}/contact`

### 7. InlineContactSection

Reuse existing `InlineContactSection` component at the bottom.

---

## Navigation Change

In `components/site-header.tsx`, add `{ key: "about", href: "/about" }` before the `contact` item in the `navItems` array.

Update `lib/dictionaries.ts` to add `about: "About"` to the `nav` object.

---

## File Plan

| Action | File |
|--------|------|
| Create | `app/[locale]/about/page.tsx` — main page component |
| Create | `components/about/stats-counter.tsx` — animated stat counter (client component) |
| Create | `components/about/our-story-section.tsx` — story section |
| Create | `components/about/founders-section.tsx` — founder cards with photos |
| Create | `components/about/values-section.tsx` — value proposition grid |
| Create | `components/about/about-cta-section.tsx` — page-specific CTA |
| Modify | `components/site-header.tsx` — add "about" nav item |
| Modify | `lib/dictionaries.ts` — add nav.about label |
| Delete | `components/home/developer-section.tsx` — no longer needed |
| Keep | `public/assets/team/tom-linkovsky.webp` — already downloaded |
| Keep | `public/assets/team/evgeny-kalika.webp` — already downloaded |

---

## SEO

- **Title:** "About Live Better Group | Sea'cret Residences Chiliadou"
- **Description:** "Meet the team behind Sea'cret Residences. Live Better Group — 12+ completed projects, 80+ units delivered, €10M+ invested capital. Real estate expertise since 2020."
- Add `/about` routes to `app/sitemap.ts` for all 4 locales.

---

## Design Tokens (from existing palette)

| Token | Value | Usage |
|-------|-------|-------|
| `--color-night` | `#09222a` | Hero bg, CTA bg |
| `--color-ink` | `#13242a` | Stats bar bg |
| `--color-deep-teal` | `#0d6777` | Eyebrows, founder role text, icons |
| `--color-gold-sun` | `#efc676` | Stat numbers |
| `--color-sand` | `#f3ead7` | Values section bg |
| `--color-cream` | `#fff9f0` | Story section bg |
| `--color-muted` | `#5e6d70` | Body text, descriptions |

---

## UX Guidelines Applied

- **Accessibility:** All images have alt text. Contrast ratios ≥4.5:1. Focus states visible. prefers-reduced-motion disables counter animations and ScrollReveal.
- **Touch targets:** All interactive elements ≥44×44px.
- **Animation:** ScrollReveal for section entrances (existing component). Stats counter animates 0→target over 1.5s with easeOut. Stagger on value cards 80ms per item. All animations ≤400ms except counter.
- **Responsive:** Mobile-first. Founder cards stack at `lg` breakpoint. Value grid: 1 col mobile, 2 col tablet, 3 col desktop.
- **Performance:** Founder photos are small webp files (~8–11KB). Lazy load below-fold images.
