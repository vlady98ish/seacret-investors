# About Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a dedicated `/about` page for Live Better Group with editorial flow layout, animated stats, founder profiles, company values, and navigation integration.

**Architecture:** Server-rendered Next.js page at `app/[locale]/about/page.tsx` composed of 5 section components under `components/about/`. One client component for animated counter. All others are server components using existing `ScrollReveal`, `SectionHeading`, and `PageHero`. Nav updated in header + dictionary.

**Tech Stack:** Next.js App Router, Framer Motion (counter animation), Tailwind CSS, Lucide icons

**Spec:** `docs/superpowers/specs/2026-03-29-about-page-design.md`

---

## File Structure

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `components/about/stats-counter.tsx` | Client component — animated counting numbers |
| Create | `components/about/stats-bar.tsx` | Stats bar section with 4 stats |
| Create | `components/about/our-story-section.tsx` | Origin story — 3 paragraphs |
| Create | `components/about/founders-section.tsx` | Founder cards with photos |
| Create | `components/about/values-section.tsx` | 6 value proposition cards |
| Create | `components/about/about-cta-section.tsx` | CTA with consultation link |
| Create | `app/[locale]/about/page.tsx` | Page component composing all sections |
| Modify | `components/site-header.tsx` | Add "about" nav item before "contact" |
| Modify | `lib/dictionaries.ts` | Add `nav.about` label |
| Modify | `app/sitemap.ts` | Add `/about` to sitemap pages |
| Delete | `components/home/developer-section.tsx` | No longer needed |

---

## Task 1: Navigation + Dictionary + Sitemap

Wire up the route before building the page so we can verify routing works.

**Files:**
- Modify: `lib/dictionaries.ts`
- Modify: `components/site-header.tsx`
- Modify: `app/sitemap.ts`

- [ ] **Step 1: Add `about` to dictionary**

In `lib/dictionaries.ts`, add `about: "About"` to the `nav` object after `location`:

```typescript
nav: {
  home: "Home",
  residences: "Residences",
  masterplan: "Masterplan",
  location: "Location",
  about: "About",
  contact: "Contact",
},
```

- [ ] **Step 2: Add "about" nav item to header**

In `components/site-header.tsx`, add `{ key: "about", href: "/about" }` before the `contact` entry in the `navItems` array:

```typescript
const navItems = [
  { key: "home", href: "" },
  { key: "residences", href: "/residences" },
  { key: "masterplan", href: "/masterplan" },
  { key: "location", href: "/location" },
  { key: "about", href: "/about" },
  { key: "contact", href: "/contact" },
];
```

- [ ] **Step 3: Add `/about` to sitemap**

In `app/sitemap.ts`, add `"/about"` to the `pages` array:

```typescript
const pages = ["", "/residences", "/masterplan", "/location", "/about", "/contact"];
```

- [ ] **Step 4: Commit**

```bash
git add lib/dictionaries.ts components/site-header.tsx app/sitemap.ts
git commit -m "$(cat <<'EOF'
feat: add About to navigation, dictionary, and sitemap

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Stats Counter (client component)

The animated counter is the only client component. Build it first since the stats bar depends on it.

**Files:**
- Create: `components/about/stats-counter.tsx`

- [ ] **Step 1: Create the animated counter component**

Create `components/about/stats-counter.tsx`:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

type StatsCounterProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
};

export function StatsCounter({ value, prefix = "", suffix = "", duration = 1.5 }: StatsCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const shouldReduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    if (shouldReduceMotion) {
      setDisplay(value);
      return;
    }

    const startTime = performance.now();

    function step(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      // easeOut curve
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }, [isInView, value, duration, shouldReduceMotion]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{display}{suffix}
    </span>
  );
}
```

- [ ] **Step 2: Verify no TypeScript errors**

Run: `npx tsc --noEmit 2>&1 | grep stats-counter`
Expected: no output (no errors in the file)

- [ ] **Step 3: Commit**

```bash
git add components/about/stats-counter.tsx
git commit -m "$(cat <<'EOF'
feat: add StatsCounter — animated counting component with reduced-motion support

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Stats Bar Section

**Files:**
- Create: `components/about/stats-bar.tsx`

- [ ] **Step 1: Create the stats bar section**

Create `components/about/stats-bar.tsx`:

```tsx
import { StatsCounter } from "@/components/about/stats-counter";

const STATS = [
  { value: 12, suffix: "+", label: "Completed Projects" },
  { value: 80, suffix: "+", label: "Units Delivered" },
  { value: 10, prefix: "€", suffix: "M+", label: "Capital Raised" },
  { value: 45, suffix: "%+", label: "ROI in 2023–2024" },
];

export function StatsBar() {
  return (
    <section className="bg-[var(--color-ink)]">
      <div className="section-shell flex flex-wrap items-center justify-center gap-8 py-10 sm:gap-12 md:gap-16 lg:justify-between lg:py-12">
        {STATS.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-3xl font-semibold text-[var(--color-gold-sun)] sm:text-4xl">
              <StatsCounter
                value={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
              />
            </p>
            <p className="mt-1 text-xs tracking-wide text-[var(--color-muted)]">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify no TypeScript errors**

Run: `npx tsc --noEmit 2>&1 | grep stats-bar`
Expected: no output

- [ ] **Step 3: Commit**

```bash
git add components/about/stats-bar.tsx
git commit -m "$(cat <<'EOF'
feat: add StatsBar section — 4 animated stats with gold counters

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Our Story Section

**Files:**
- Create: `components/about/our-story-section.tsx`

- [ ] **Step 1: Create the story section**

Create `components/about/our-story-section.tsx`:

```tsx
import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/sections/section-heading";

export function OurStorySection() {
  return (
    <section className="bg-[var(--color-cream)] py-24 sm:py-32">
      <div className="section-shell">
        <ScrollReveal>
          <SectionHeading
            eyebrow="Our Story"
            title="From a pandemic-era idea to Greece's most dynamic developer"
          />
        </ScrollReveal>

        <div className="mt-10 max-w-3xl space-y-6">
          <ScrollReveal delay={0.1}>
            <p className="text-body-muted">
              In September 2020, while the world was in lockdown, Tom Linkovsky and Evgeny
              Kalika — friends for over 30 years — saw what others missed: untapped potential
              in the Greek real estate market. They started in Patras, a vibrant university
              city and major transport hub on the Peloponnese coast.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <p className="text-body-muted">
              The problem was clear — students were living in outdated, poorly maintained
              apartments. The solution became Live Better&apos;s first concept: the &ldquo;Airbnb
              for students&rdquo; — fully furnished apartments for long-term rental. Five years
              in, the model has a perfect track record: zero vacant units exceeding one week.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <p className="text-body-muted">
              From student housing, the group expanded into family residences, property flips,
              villa construction, and luxury vacation homes. Today Live Better Group operates
              across Patras, Athens, and the resort towns of Chiliadou and Akrata — with 14
              projects in progress and over 420 housing units in the pipeline.
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/about/our-story-section.tsx
git commit -m "$(cat <<'EOF'
feat: add OurStorySection — 3-paragraph origin story with scroll animations

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Founders Section

**Files:**
- Create: `components/about/founders-section.tsx`

- [ ] **Step 1: Create the founders section**

Create `components/about/founders-section.tsx`:

```tsx
import Image from "next/image";

import { ScrollReveal } from "@/components/scroll-reveal";

const FOUNDERS = [
  {
    name: "Tom Linkovsky",
    role: "Co-Founder",
    image: "/assets/team/tom-linkovsky.webp",
    bio: "Entrepreneur with over 20 years of experience. Previously owned a restaurant chain in Tel Aviv, worked in import and large-scale event management. Brings operational drive and strategic vision to every project.",
  },
  {
    name: "Evgeny Kalika",
    role: "Co-Founder",
    image: "/assets/team/evgeny-kalika.webp",
    bio: "Specialist in marketing, strategic consulting, and advertising. Known for discipline, reliability, and responsibility. Drives the group's investor relations and market positioning across Europe.",
  },
];

export function FoundersSection() {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="section-shell">
        <ScrollReveal>
          <p className="eyebrow">The Founders</p>
        </ScrollReveal>

        <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-16">
          {FOUNDERS.map((founder, i) => (
            <ScrollReveal
              key={founder.name}
              delay={i * 0.1}
              direction={i === 0 ? "left" : "right"}
            >
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                <div className="relative h-[200px] w-[160px] flex-shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src={founder.image}
                    alt={`${founder.name} — ${founder.role}`}
                    fill
                    className="object-cover"
                    sizes="160px"
                  />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-h3">{founder.name}</h3>
                  <p className="mt-1 text-sm font-medium text-[var(--color-deep-teal)]">
                    {founder.role}
                  </p>
                  <p className="text-body-muted mt-4">{founder.bio}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/about/founders-section.tsx
git commit -m "$(cat <<'EOF'
feat: add FoundersSection — team cards with B&W photos and bios

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Values Section

**Files:**
- Create: `components/about/values-section.tsx`

- [ ] **Step 1: Create the values section**

Create `components/about/values-section.tsx`:

```tsx
import { Globe, Handshake, Key, MapPin, Shield, TrendingUp } from "lucide-react";

import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/sections/section-heading";

const VALUES = [
  {
    icon: Shield,
    title: "Full Transparency",
    description: "Honesty at every stage. Online access to construction monitoring.",
  },
  {
    icon: Key,
    title: "Real Ownership",
    description: "Full property rights registered in your name from day one.",
  },
  {
    icon: Globe,
    title: "Global Investor Base",
    description: "Dozens of investors from Israel, Greece, Poland, Germany, USA, and beyond.",
  },
  {
    icon: TrendingUp,
    title: "Above-Market Returns",
    description: "Investment profitability exceeded 45% in 2023–2024. Expected 7–10% annual rental yield.",
  },
  {
    icon: Handshake,
    title: "End-to-End Support",
    description: "Full transaction support from property selection to key handover.",
  },
  {
    icon: MapPin,
    title: "Local Expertise",
    description: "Deep relationships with Greek agents, architects, engineers, contractors, and authorities.",
  },
];

export function ValuesSection() {
  return (
    <section className="bg-[var(--color-sand)] py-24 sm:py-32">
      <div className="section-shell">
        <ScrollReveal>
          <SectionHeading
            eyebrow="Why Live Better"
            title="A 360° approach to real estate investment"
          />
        </ScrollReveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {VALUES.map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 0.08}>
              <div className="rounded-xl bg-white p-6 shadow-[var(--shadow-card)]">
                <item.icon className="h-7 w-7 text-[var(--color-deep-teal)]" />
                <h3 className="text-h3 mt-4">{item.title}</h3>
                <p className="text-body-muted mt-2 text-sm">{item.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/about/values-section.tsx
git commit -m "$(cat <<'EOF'
feat: add ValuesSection — 6 value proposition cards with icons

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: About CTA Section

**Files:**
- Create: `components/about/about-cta-section.tsx`

- [ ] **Step 1: Create the CTA section**

Create `components/about/about-cta-section.tsx`:

```tsx
import Link from "next/link";

import type { Locale } from "@/lib/i18n";
import { ScrollReveal } from "@/components/scroll-reveal";

type AboutCtaSectionProps = {
  locale: Locale;
};

export function AboutCtaSection({ locale }: AboutCtaSectionProps) {
  return (
    <section className="bg-[var(--color-night)] py-24 sm:py-32">
      <div className="section-shell text-center">
        <ScrollReveal>
          <h2 className="text-display text-white">
            Ready to invest with confidence?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-lg text-white/60">
            Join dozens of investors already building wealth with Live Better Group
          </p>
          <div className="mt-10">
            <Link href={`/${locale}/contact`} className="btn btn-primary">
              Schedule a Consultation
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/about/about-cta-section.tsx
git commit -m "$(cat <<'EOF'
feat: add AboutCtaSection — consultation CTA for about page

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: About Page Route

Compose all sections into the page.

**Files:**
- Create: `app/[locale]/about/page.tsx`

- [ ] **Step 1: Create the about page**

Create `app/[locale]/about/page.tsx`:

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AboutCtaSection } from "@/components/about/about-cta-section";
import { FoundersSection } from "@/components/about/founders-section";
import { OurStorySection } from "@/components/about/our-story-section";
import { StatsBar } from "@/components/about/stats-bar";
import { ValuesSection } from "@/components/about/values-section";
import { InlineContactSection } from "@/components/inline-contact-section";
import { PageHero } from "@/components/sections/page-hero";
import { isValidLocale, type Locale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return ["en", "he", "ru", "el"].map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};

  return buildPageMetadata(null, locale as Locale, "/about", {
    title: "About Live Better Group | Sea'cret Residences Chiliadou",
    description:
      "Meet the team behind Sea'cret Residences. Live Better Group — 12+ completed projects, 80+ units delivered, €10M+ invested capital. Real estate expertise since 2020.",
  });
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const typedLocale = locale as Locale;

  return (
    <>
      <PageHero
        title="Building the Future of Greek Living"
        subtitle="Live Better Group — Transforming real estate since 2020"
        backgroundImage="/assets/pdf/page-04-location.jpg"
        compact
      />
      <StatsBar />
      <OurStorySection />
      <FoundersSection />
      <ValuesSection />
      <AboutCtaSection locale={typedLocale} />
      <InlineContactSection locale={typedLocale} />
    </>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit 2>&1 | grep about`
Expected: no errors related to about page files

- [ ] **Step 3: Verify dev server renders the page**

Run: `npm run dev` and navigate to `http://localhost:3000/en/about`
Expected: page renders with hero, stats bar, story, founders (with photos), values grid, CTA, and contact form. "About" link appears in nav before "Contact".

- [ ] **Step 4: Commit**

```bash
git add app/\[locale\]/about/page.tsx
git commit -m "$(cat <<'EOF'
feat: add /about page — editorial layout with hero, stats, story, founders, values, CTA

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

## Task 9: Cleanup

Remove the unused developer-section component from the homepage.

**Files:**
- Delete: `components/home/developer-section.tsx`

- [ ] **Step 1: Delete the old developer section**

```bash
rm components/home/developer-section.tsx
```

- [ ] **Step 2: Verify no imports reference it**

Run: `grep -r "developer-section" --include="*.tsx" --include="*.ts" .`
Expected: no results (it was already removed from homepage in this session)

- [ ] **Step 3: Commit**

```bash
git add -u components/home/developer-section.tsx
git commit -m "$(cat <<'EOF'
chore: remove unused developer-section component — replaced by /about page

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

## Summary

| Task | What | Files |
|------|------|-------|
| 1 | Nav + Dictionary + Sitemap | 3 modified |
| 2 | StatsCounter (client) | 1 created |
| 3 | StatsBar section | 1 created |
| 4 | OurStorySection | 1 created |
| 5 | FoundersSection | 1 created |
| 6 | ValuesSection | 1 created |
| 7 | AboutCtaSection | 1 created |
| 8 | About page route | 1 created |
| 9 | Cleanup old component | 1 deleted |
