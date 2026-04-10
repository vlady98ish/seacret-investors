# Thank You Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a dedicated `/[locale]/contact/thank-you` page for conversion tracking, replacing the inline success state in the contact form.

**Architecture:** New Next.js page route at `app/[locale]/contact/thank-you/page.tsx` that reads CMS strings via server-side fetch. The multi-step form redirects here on success via `useRouter().push()`. Seven new `uiStrings` fields in Sanity for the "what's next" steps content.

**Tech Stack:** Next.js 15, React, Tailwind CSS, Sanity CMS, TypeScript

---

### Task 1: Add new CMS fields to Sanity schema and TypeScript types

**Files:**
- Modify: `sanity/schemaTypes/uiStrings.ts:167-168`
- Modify: `lib/sanity/types.ts:248-249`

- [ ] **Step 1: Add 7 new fields to uiStrings Sanity schema**

In `sanity/schemaTypes/uiStrings.ts`, add after line 168 (`formThankYouMessage`):

```typescript
    { ...ls("formThankYouNextSteps", "Form: Thank You Next Steps Eyebrow"), group: "form" },
    { ...ls("formThankYouStep1Title", "Form: Thank You Step 1 Title"), group: "form" },
    { ...ls("formThankYouStep1Desc", "Form: Thank You Step 1 Description"), group: "form" },
    { ...ls("formThankYouStep2Title", "Form: Thank You Step 2 Title"), group: "form" },
    { ...ls("formThankYouStep2Desc", "Form: Thank You Step 2 Description"), group: "form" },
    { ...ls("formThankYouStep3Title", "Form: Thank You Step 3 Title"), group: "form" },
    { ...ls("formThankYouStep3Desc", "Form: Thank You Step 3 Description"), group: "form" },
```

- [ ] **Step 2: Add matching fields to TypeScript UiStrings interface**

In `lib/sanity/types.ts`, add after `formThankYouMessage: LocalizedText;` (line 249):

```typescript
  formThankYouNextSteps: LocalizedString;
  formThankYouStep1Title: LocalizedString;
  formThankYouStep1Desc: LocalizedString;
  formThankYouStep2Title: LocalizedString;
  formThankYouStep2Desc: LocalizedString;
  formThankYouStep3Title: LocalizedString;
  formThankYouStep3Desc: LocalizedString;
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: No new errors related to these fields.

- [ ] **Step 4: Commit**

```bash
git add sanity/schemaTypes/uiStrings.ts lib/sanity/types.ts
git commit -m "feat: add CMS fields for thank-you page steps"
```

---

### Task 2: Seed CMS with translations for all 4 locales

**Files:**
- Modify: `sanity/seed/fill-translations-v2.ts:68-74`
- Create: `sanity/seed/fill-thank-you-strings.ts`

- [ ] **Step 1: Update existing formThankYouMessage seed to remove "24 hours"**

In `sanity/seed/fill-translations-v2.ts`, replace lines 69-74:

```typescript
  formThankYouMessage: {
    en: "We have received your enquiry and will be in touch shortly.",
    ru: "Мы получили ваш запрос и свяжемся с вами в ближайшее время.",
    he: "קיבלנו את פנייתכם וניצור קשר בהקדם.",
    el: "Λάβαμε το αίτημά σας και θα επικοινωνήσουμε σύντομα.",
  },
```

- [ ] **Step 2: Create seed script for new thank-you strings**

Create `sanity/seed/fill-thank-you-strings.ts`:

```typescript
/**
 * Seed thank-you page UI strings.
 * Run: npx tsx sanity/seed/fill-thank-you-strings.ts
 */

import { createClient } from "@sanity/client";
import fs from "fs";
import path from "path";

function loadEnv(): Record<string, string> {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) throw new Error(`.env.local not found`);
  const raw = fs.readFileSync(envPath, "utf-8");
  const vars: Record<string, string> = {};
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    vars[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
  }
  return vars;
}

const env = loadEnv();
const client = createClient({
  projectId: env["NEXT_PUBLIC_SANITY_PROJECT_ID"],
  dataset: env["NEXT_PUBLIC_SANITY_DATASET"] ?? "production",
  token: env["SANITY_WRITE_TOKEN"],
  apiVersion: "2024-01-01",
  useCdn: false,
});

const newStrings: Record<string, { en: string; ru: string; he: string; el: string }> = {
  formThankYouMessage: {
    en: "We have received your enquiry and will be in touch shortly.",
    ru: "Мы получили ваш запрос и свяжемся с вами в ближайшее время.",
    he: "קיבלנו את פנייתכם וניצור קשר בהקדם.",
    el: "Λάβαμε το αίτημά σας και θα επικοινωνήσουμε σύντομα.",
  },
  formThankYouNextSteps: {
    en: "What happens next",
    ru: "Что дальше",
    he: "מה הלאה",
    el: "Τι ακολουθεί",
  },
  formThankYouStep1Title: {
    en: "A personal manager will contact you",
    ru: "Персональный менеджер свяжется с вами",
    he: "מנהל אישי ייצור איתכם קשר",
    el: "Ένας προσωπικός σύμβουλος θα επικοινωνήσει μαζί σας",
  },
  formThankYouStep1Desc: {
    en: "Via the email or phone you provided",
    ru: "По email или телефону, который вы указали",
    he: "באמצעות המייל או הטלפון שציינתם",
    el: "Μέσω email ή τηλεφώνου που δηλώσατε",
  },
  formThankYouStep2Title: {
    en: "We'll prepare a personalized offer",
    ru: "Подготовим индивидуальное предложение",
    he: "נכין עבורכם הצעה מותאמת אישית",
    el: "Θα ετοιμάσουμε μια εξατομικευμένη πρόταση",
  },
  formThankYouStep2Desc: {
    en: "Based on your preferences and budget",
    ru: "С учётом ваших предпочтений и бюджета",
    he: "בהתאם להעדפות ולתקציב שלכם",
    el: "Με βάση τις προτιμήσεις και τον προϋπολογισμό σας",
  },
  formThankYouStep3Title: {
    en: "We'll arrange a virtual or in-person tour",
    ru: "Организуем виртуальный или личный тур",
    he: "נארגן סיור וירטואלי או אישי",
    el: "Θα κανονίσουμε εικονική ή προσωπική ξενάγηση",
  },
  formThankYouStep3Desc: {
    en: "At your convenience",
    ru: "По вашему удобному графику",
    he: "בזמן הנוח לכם",
    el: "Στη δική σας ευκολία",
  },
};

async function main() {
  console.log("\n🎉 Seeding thank-you page strings...\n");

  for (const id of ["uiStrings", "drafts.uiStrings"]) {
    try {
      await client.patch(id).set(newStrings).commit();
      console.log(`  ✓ uiStrings (${id}) — ${Object.keys(newStrings).length} fields`);
      break;
    } catch {
      // try next
    }
  }

  console.log("\n✅ Done!\n");
}

main().catch(console.error);
```

- [ ] **Step 3: Run the seed script**

Run: `npx tsx sanity/seed/fill-thank-you-strings.ts`
Expected: `✓ uiStrings` success message.

- [ ] **Step 4: Commit**

```bash
git add sanity/seed/fill-translations-v2.ts sanity/seed/fill-thank-you-strings.ts
git commit -m "feat: seed thank-you page CMS strings for all locales"
```

---

### Task 3: Create the thank-you page component

**Files:**
- Create: `app/[locale]/contact/thank-you/page.tsx`

- [ ] **Step 1: Create the page file**

Create `app/[locale]/contact/thank-you/page.tsx`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ScrollReveal } from "@/components/scroll-reveal";
import { getLocalizedValue, isValidLocale, type Locale } from "@/lib/i18n";
import { sanityClient } from "@/lib/sanity/client";
import { uiStringsQuery } from "@/lib/sanity/queries";
import type { UiStrings } from "@/lib/sanity/types";

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return ["en", "he", "ru", "el"].map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "ru" ? "Спасибо" : locale === "he" ? "תודה" : locale === "el" ? "Ευχαριστούμε" : "Thank You",
    robots: { index: false, follow: false },
  };
}

export default async function ThankYouPage({ params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const typedLocale = locale as Locale;

  let uiStrings: UiStrings | null = null;
  try {
    uiStrings = await sanityClient.fetch<UiStrings | null>(uiStringsQuery);
  } catch {
    // CMS unavailable — use fallbacks
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = (field: any, fallback = ""): string =>
    field ? (getLocalizedValue(field, typedLocale) as string) || fallback : fallback;

  const heading = t(uiStrings?.formThankYou, "Thank you!");
  const message = t(uiStrings?.formThankYouMessage, "We have received your enquiry and will be in touch shortly.");
  const nextStepsEyebrow = t(uiStrings?.formThankYouNextSteps, "What happens next");

  const steps = [
    {
      title: t(uiStrings?.formThankYouStep1Title, "A personal manager will contact you"),
      desc: t(uiStrings?.formThankYouStep1Desc, "Via the email or phone you provided"),
    },
    {
      title: t(uiStrings?.formThankYouStep2Title, "We'll prepare a personalized offer"),
      desc: t(uiStrings?.formThankYouStep2Desc, "Based on your preferences and budget"),
    },
    {
      title: t(uiStrings?.formThankYouStep3Title, "We'll arrange a virtual or in-person tour"),
      desc: t(uiStrings?.formThankYouStep3Desc, "At your convenience"),
    },
  ];

  const ctaResidences = t(uiStrings?.ctaExploreResidences, "Explore Residences");
  const ctaMasterplan = t(uiStrings?.ctaExploreMasterplan, "Explore the Masterplan");

  return (
    <>
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center bg-[var(--color-night)] px-4 py-24 text-center sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-night)] to-[#1a3a3e]" />

        <div className="relative z-10 flex flex-col items-center gap-6 animate-fade-in">
          {/* Checkmark */}
          <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[var(--color-deep-teal)]/15">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-deep-teal)]">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <h1 className="text-display text-white">{heading}</h1>
          <p className="mx-auto max-w-md text-lg text-white/60">{message}</p>
        </div>
      </section>

      {/* ── Next steps ───────────────────────────────── */}
      <section className="bg-[var(--color-sand)] py-16 sm:py-20">
        <div className="section-shell flex flex-col items-center">
          <ScrollReveal>
            <p className="eyebrow mb-8 text-center text-[var(--color-deep-teal)]">
              {nextStepsEyebrow}
            </p>
          </ScrollReveal>

          <div className="flex w-full max-w-xl flex-col gap-5">
            {steps.map((step, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-deep-teal)]/10 text-sm font-semibold text-[var(--color-deep-teal)]">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-ink)]">{step.title}</p>
                    <p className="mt-0.5 text-sm text-[var(--color-muted)]">{step.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* CTAs */}
          <ScrollReveal delay={0.3}>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link href={`/${locale}/residences`} className="btn btn-primary">
                {ctaResidences}
              </Link>
              <Link href={`/${locale}/masterplan`} className="btn btn-outline">
                {ctaMasterplan}
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Verify the page loads in browser**

Open: `http://localhost:3000/en/contact/thank-you`
Expected: Hero with checkmark + heading + steps + two CTA buttons. No build errors.

- [ ] **Step 3: Commit**

```bash
git add app/\[locale\]/contact/thank-you/page.tsx
git commit -m "feat: add dedicated thank-you page for conversion tracking"
```

---

### Task 4: Redirect form submission to the thank-you page

**Files:**
- Modify: `components/contact/multi-step-form.tsx:1-5` (add import)
- Modify: `components/contact/multi-step-form.tsx:168` (add router)
- Modify: `components/contact/multi-step-form.tsx:278-279` (redirect on success)
- Modify: `components/contact/multi-step-form.tsx:288-309` (remove inline success)

- [ ] **Step 1: Add `useRouter` import**

In `components/contact/multi-step-form.tsx`, add to the imports at top:

```typescript
import { useRouter } from "next/navigation";
```

- [ ] **Step 2: Initialize router in the component**

After line 166 (`const names = villaNames ?? [];`), add:

```typescript
  const router = useRouter();
```

- [ ] **Step 3: Replace `setStatus("success")` with redirect**

Replace line 279 (`setStatus("success");`) with:

```typescript
        router.push(`/${locale}/contact/thank-you`);
        return;
```

- [ ] **Step 4: Remove inline success state block**

Delete the entire success state block (lines 288-309):

```tsx
  /* ── Success state ─────────────────────────────────────── */
  if (status === "success") {
    return (
      <div className="tile flex flex-col items-center justify-center text-center py-16 gap-6 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-[var(--color-deep-teal)]/10 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-[var(--color-deep-teal)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h3 className="text-h3 text-[var(--color-night)] mb-2">{dict.successTitle}</h3>
          <p className="text-body-muted">{dict.successMessage}</p>
        </div>
      </div>
    );
  }
```

- [ ] **Step 5: Verify the flow end-to-end**

1. Go to `http://localhost:3000/en/contact`
2. Fill the form and submit
3. Expected: redirects to `/en/contact/thank-you`

- [ ] **Step 6: Commit**

```bash
git add components/contact/multi-step-form.tsx
git commit -m "feat: redirect form to thank-you page instead of inline success"
```

---

### Task 5: Exclude thank-you page from sitemap

**Files:**
- Modify: `app/sitemap.ts`

The `robots: { index: false, follow: false }` in the page metadata already prevents indexing. The sitemap uses an explicit list of pages (line 8), and `/contact/thank-you` is not in that list — so it's already excluded. No changes needed.

- [ ] **Step 1: Verify sitemap does not include thank-you**

Run: `curl -s http://localhost:3000/sitemap.xml | grep -c "thank-you"`
Expected: `0`

- [ ] **Step 2: No commit needed — already excluded by design**

---

### Task 6: Final verification

- [ ] **Step 1: Test all 4 locales**

Visit each URL and verify correct language:
- `http://localhost:3000/en/contact/thank-you`
- `http://localhost:3000/ru/contact/thank-you`
- `http://localhost:3000/he/contact/thank-you` (RTL layout)
- `http://localhost:3000/el/contact/thank-you`

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: No errors.

- [ ] **Step 3: Run build**

Run: `npm run build`
Expected: Build succeeds. Thank-you page appears in the output.
