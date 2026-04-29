# Experiences Editorial Cards — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the text-only ExperiencesSection with editorial photo cards — 1 featured + 3 per category, icon-based category navigation, Sanity image integration.

**Architecture:** Rewrite `experiences-section.tsx` as a `"use client"` component with `useState` for active category. Group experiences by category, render the first as a featured full-width card and the rest in a 3-column row below. Images come from Sanity via `getSanityImageUrl` + `next/image`.

**Tech Stack:** React, Next.js (App Router), Tailwind CSS, Framer Motion (via existing ScrollReveal), lucide-react icons, Sanity image pipeline (`@sanity/image-url`).

**Spec:** `docs/superpowers/specs/2026-04-29-experiences-editorial-cards-design.md`

---

## File Structure

| File | Action | Responsibility |
|------|--------|---------------|
| `components/location/experiences-section.tsx` | Rewrite | Editorial card grid with category nav |
| `app/globals.css` | No change | Existing tokens used directly |
| `app/[locale]/location/page.tsx` | No change | Already passes correct props |
| `lib/sanity/queries.ts` | No change | Query already fetches image field |

---

### Task 1: Rewrite ExperiencesSection component

**Files:**
- Rewrite: `components/location/experiences-section.tsx`

- [ ] **Step 1: Replace file with new component skeleton**

Replace the entire content of `components/location/experiences-section.tsx` with:

```tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { Landmark, Leaf, UtensilsCrossed } from "lucide-react";

import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/sections/section-heading";
import { getSanityImageUrl } from "@/lib/sanity/image";
import type { Experience } from "@/lib/sanity/types";
import type { Locale } from "@/lib/i18n";

type CategoryKey = "culture" | "nature" | "gastronomy";

const CATEGORIES: { key: CategoryKey; Icon: typeof Landmark }[] = [
  { key: "culture", Icon: Landmark },
  { key: "nature", Icon: Leaf },
  { key: "gastronomy", Icon: UtensilsCrossed },
];

const FALLBACK_GRADIENTS: Record<CategoryKey, string> = {
  culture: "linear-gradient(135deg, #6B8E7B 0%, #2d5a3a 40%, #1a3d2a 100%)",
  nature: "linear-gradient(135deg, #64B5CE 0%, #2d8a9e 40%, #1a6b7e 100%)",
  gastronomy: "linear-gradient(135deg, #CE9464 0%, #9e6a2d 40%, #7e4a1a 100%)",
};

function groupExperiences(
  experiences: Experience[]
): Record<CategoryKey, Experience[]> {
  const grouped: Record<CategoryKey, Experience[]> = {
    culture: [],
    nature: [],
    gastronomy: [],
  };
  for (const exp of experiences) {
    if (exp.category in grouped) {
      grouped[exp.category as CategoryKey].push(exp);
    }
  }
  return grouped;
}

interface ExperiencesSectionProps {
  locale: Locale;
  experiences?: Experience[];
  eyebrow?: string;
  title?: string;
  description?: string;
  categoryLabels?: { culture?: string; nature?: string; gastronomy?: string };
}

export function ExperiencesSection({
  locale,
  experiences,
  eyebrow,
  title,
  description,
  categoryLabels: catLabels,
}: ExperiencesSectionProps) {
  const grouped = experiences?.length ? groupExperiences(experiences) : null;

  // Find first non-empty category as default
  const availableCategories = CATEGORIES.filter(
    (c) => grouped && grouped[c.key].length > 0
  );
  const [activeCategory, setActiveCategory] = useState<CategoryKey>(
    availableCategories[0]?.key ?? "culture"
  );
  const [fading, setFading] = useState(false);

  if (!grouped || availableCategories.length === 0) return null;

  const items = grouped[activeCategory];
  const featured = items[0];
  const rest = items.slice(1);

  function switchCategory(cat: CategoryKey) {
    if (cat === activeCategory) return;
    setFading(true);
    setTimeout(() => {
      setActiveCategory(cat);
      setFading(false);
    }, 300);
  }

  return (
    <section className="py-20" style={{ background: "var(--color-cream)" }}>
      <div className="section-shell flex flex-col gap-10">
        <ScrollReveal>
          <SectionHeading
            eyebrow={eyebrow}
            title={title}
            description={description}
          />
        </ScrollReveal>

        {/* Category navigation */}
        <div className="flex justify-center gap-10">
          {availableCategories.map(({ key, Icon }) => (
            <button
              key={key}
              onClick={() => switchCategory(key)}
              className="flex flex-col items-center gap-2 transition-opacity duration-300"
              style={{ opacity: activeCategory === key ? 1 : 0.4 }}
              aria-pressed={activeCategory === key}
            >
              <div
                className="flex h-[52px] w-[52px] items-center justify-center rounded-full transition-all duration-300"
                style={{
                  background: "rgba(26,107,110,0.08)",
                  boxShadow:
                    activeCategory === key
                      ? "0 0 0 2px rgba(26,107,110,0.25)"
                      : "none",
                }}
              >
                <Icon
                  size={22}
                  className="text-[var(--color-deep-teal)]"
                  strokeWidth={1.5}
                />
              </div>
              <span className="eyebrow" style={{ marginBottom: 0 }}>
                {catLabels?.[key] ?? key}
              </span>
              {/* Active underline */}
              <div
                className="h-[2px] w-6 rounded-full transition-transform duration-300"
                style={{
                  background: "var(--color-deep-teal)",
                  transform:
                    activeCategory === key ? "scaleX(1)" : "scaleX(0)",
                }}
              />
            </button>
          ))}
        </div>

        {/* Card grid */}
        <div
          className="flex flex-col gap-4 transition-opacity duration-300"
          style={{ opacity: fading ? 0 : 1 }}
        >
          {/* Featured card */}
          {featured && (
            <ExperienceCard
              experience={featured}
              locale={locale}
              category={activeCategory}
              variant="featured"
              catLabel={catLabels?.[activeCategory]}
            />
          )}

          {/* Bottom row */}
          {rest.length > 0 && (
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns:
                  rest.length === 1
                    ? "1fr"
                    : rest.length === 2
                      ? "repeat(2, 1fr)"
                      : "repeat(3, 1fr)",
              }}
            >
              {rest.map((exp) => (
                <ExperienceCard
                  key={exp._id}
                  experience={exp}
                  locale={locale}
                  category={activeCategory}
                  variant="small"
                  catLabel={catLabels?.[activeCategory]}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ── Individual Card ────────────────────────────────────────── */

function ExperienceCard({
  experience,
  locale,
  category,
  variant,
  catLabel,
}: {
  experience: Experience;
  locale: Locale;
  category: CategoryKey;
  variant: "featured" | "small";
  catLabel?: string;
}) {
  const imageUrl = getSanityImageUrl(
    experience.image,
    variant === "featured" ? 1440 : 600
  );
  const titleText = experience.title[locale] ?? experience.title.en;
  const descText =
    experience.description?.[locale] ?? experience.description?.en;

  const isFeatured = variant === "featured";
  const height = isFeatured ? "h-[400px] max-sm:h-[320px]" : "h-[260px] max-sm:h-[220px]";

  return (
    <div
      className={`group relative overflow-hidden rounded-[var(--radius-xl)] cursor-pointer
        transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]
        ${height}`}
    >
      {/* Background image or fallback gradient */}
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={titleText}
          fill
          sizes={isFeatured ? "100vw" : "(max-width: 768px) 100vw, 33vw"}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      ) : (
        <div
          className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.04]"
          style={{ background: FALLBACK_GRADIENTS[category] }}
        />
      )}

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(9,34,42,0.92) 0%, rgba(9,34,42,0.45) 40%, rgba(9,34,42,0.08) 100%)",
        }}
      />

      {/* Content */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ padding: isFeatured ? "28px" : "20px" }}
      >
        <div className="mb-2.5 flex items-center gap-2.5">
          <span
            className="rounded-full px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.25em]"
            style={{
              color: "var(--color-gold-sun)",
              background: "rgba(232,163,64,0.15)",
              backdropFilter: "blur(8px)",
            }}
          >
            {catLabel ?? category}
          </span>
        </div>

        <h3
          className="font-serif font-semibold text-white leading-tight tracking-wide"
          style={{ fontSize: isFeatured ? "1.55rem" : "1.05rem" }}
        >
          {titleText}
        </h3>

        {descText && (
          <p
            className={`mt-1.5 leading-relaxed ${!isFeatured ? "line-clamp-2" : ""}`}
            style={{
              color: "rgba(255,255,255,0.75)",
              fontSize: isFeatured ? "0.95rem" : "0.8rem",
              maxWidth: isFeatured ? "580px" : undefined,
            }}
          >
            {descText}
          </p>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify the dev server runs without errors**

Run: `npm run dev`

Open `http://localhost:3000/en/location` in the browser. Scroll to the Experiences section. Verify:
- Category icons (Culture / Nature / Gastronomy) appear centered
- Cards render with gradient fallbacks (images may not be uploaded yet)
- Clicking category icons switches the grid with a fade transition
- Featured card is full-width, 3 smaller cards in a row below
- Mobile: resize to <768px — bottom row stacks vertically

- [ ] **Step 3: Commit**

```bash
git add components/location/experiences-section.tsx
git commit -m "feat: rewrite experiences section as editorial photo cards

Replace text-only bullet lists with photo-card grid layout:
- 1 featured full-width card + 3 smaller cards per category
- Icon-based category navigation with fade transitions
- Sanity image integration via next/image
- Fallback gradients when images are missing
- Responsive: cards stack on mobile"
```

---

### Task 2: Verify responsive bottom-row grid for ≤2 items

The bottom row uses dynamic `gridTemplateColumns` for 1, 2, or 3 items. On mobile all cards stack. Verify this works across breakpoints.

- [ ] **Step 1: Test in browser**

Open `http://localhost:3000/en/location`. For each category, confirm:
- 4 items: 1 featured + 3 in a row ✓
- Check mobile (<768px): all cards stack vertically ✓

If a category has fewer than 3 non-featured items, the grid adapts (2 columns for 2 items, 1 column for 1 item).

- [ ] **Step 2: No changes needed if visual check passes**

---

### Task 3: Upload experience images in Sanity (manual/seed)

Experience documents exist but have no images. They need photos uploaded via Sanity Studio.

- [ ] **Step 1: Check which experiences have images**

Open Sanity Studio and check each experience document. If images are already there, skip to the commit step.

If images are missing, upload appropriate photos for each experience via Sanity Studio:
- `exp-delphi` — photo of Delphi ruins
- `exp-galaxidi` — photo of Galaxidi harbor
- `exp-monasteries` — Byzantine monastery photo
- `exp-tavernas` — Greek taverna photo
- `exp-beaches` — Chiliadou beach photo
- `exp-pools` — Infinity pool with sea view
- `exp-hiking` — Olive grove trail photo
- `exp-kayaking` — Kayak in bay photo
- `exp-olives` — Amfissa olives photo
- `exp-seafood` — Fresh seafood/fish photo
- `exp-cheese` — Cheese and honey photo
- `exp-wine` — Wine tasting/vineyard photo

- [ ] **Step 2: Verify images display in the component**

Refresh `http://localhost:3000/en/location`. Cards should now show real photos instead of gradient fallbacks. Verify:
- Images load and fill cards properly
- Hotspot cropping works (if set in Sanity)
- Hover zoom effect works on photos

---

### Task 4: Final visual polish and QA

- [ ] **Step 1: Full QA checklist**

Test in browser at `http://localhost:3000/en/location`:

1. **Desktop (>1024px):**
   - Section heading centered with eyebrow + title + description
   - 3 category icons centered, active one has ring + underline
   - Featured card ~400px tall, full width
   - 3 smaller cards ~260px tall in equal row
   - Hover: card lifts + shadow + image zooms

2. **Tablet (768px–1024px):**
   - Layout still works, cards may be narrower but still 3 in row

3. **Mobile (<768px):**
   - Featured card ~320px
   - Smaller cards stack vertically at ~220px each
   - Category icons still tappable

4. **Locale test:**
   - Switch to `/ru/location` — titles/descriptions in Russian
   - Switch to `/he/location` — RTL text renders correctly in cards

5. **Category switching:**
   - Click each category — fade out/in transition (0.3s)
   - No layout jumps between categories

- [ ] **Step 2: Fix any issues found**

Address any visual issues discovered in the QA pass.

- [ ] **Step 3: Commit any fixes**

```bash
git add components/location/experiences-section.tsx
git commit -m "fix: polish experiences editorial cards after QA"
```

Only commit if changes were made. Skip if QA passed clean.
