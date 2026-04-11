# Analytics Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add GTM, PostHog, and cookie consent so the marketing agency can self-manage GA4/Meta Pixel, while PostHog provides funnels and session replay.

**Architecture:** GTM container loaded via `next/script`, PostHog SDK initialized in a client provider, both gated behind a cookie consent banner. A single `trackEvent()` helper pushes to both `dataLayer` and PostHog. All config via env vars — empty vars = no scripts.

**Tech Stack:** Next.js 15 (App Router), posthog-js, next/script (GTM), localStorage (consent)

---

## File Structure

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `lib/analytics.ts` | `trackEvent()` helper — pushes to dataLayer + PostHog |
| Create | `components/analytics/google-tag-manager.tsx` | GTM script loader |
| Create | `components/analytics/posthog-provider.tsx` | PostHog SDK init + provider |
| Create | `components/analytics/cookie-consent.tsx` | GDPR consent banner |
| Create | `components/analytics/analytics-provider.tsx` | Consent-gated wrapper for GTM + PostHog |
| Modify | `app/layout.tsx` | Add GTM noscript iframe |
| Modify | `app/[locale]/layout.tsx` | Wrap children with AnalyticsProvider + CookieConsent |
| Modify | `components/contact/multi-step-form.tsx` | Add form_step, form_submit, form_abandon tracking |
| Modify | `components/contact-form.tsx` | Add form_submit tracking |
| Modify | `components/inline-contact-section.tsx` | Add form_submit tracking |
| Modify | `components/sticky-cta.tsx` | Add sticky_cta_open + form_submit tracking |
| Modify | `components/masterplan/masterplan-interactive.tsx` | Add masterplan_click tracking |
| Modify | `app/[locale]/villas/[slug]/page.tsx` | Add villa_view tracking |

---

### Task 1: Create branch and install posthog-js

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Create feature branch**

```bash
git checkout -b feat/analytics-integration
```

- [ ] **Step 2: Install posthog-js**

```bash
yarn add posthog-js
```

- [ ] **Step 3: Commit**

```bash
git add package.json yarn.lock
git commit -m "chore: add posthog-js dependency"
```

---

### Task 2: Create analytics helper (`lib/analytics.ts`)

**Files:**
- Create: `lib/analytics.ts`

- [ ] **Step 1: Create the trackEvent helper**

```typescript
// lib/analytics.ts
import type { PostHog } from "posthog-js";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    posthog?: PostHog;
  }
}

export function trackEvent(
  eventName: string,
  properties?: Record<string, string | number | boolean | undefined>
): void {
  // Push to GTM dataLayer
  if (typeof window !== "undefined" && window.dataLayer) {
    window.dataLayer.push({ event: eventName, ...properties });
  }

  // Send to PostHog
  if (typeof window !== "undefined" && window.posthog) {
    window.posthog.capture(eventName, properties);
  }
}
```

- [ ] **Step 2: Verify it compiles**

```bash
npx tsc --noEmit lib/analytics.ts
```

- [ ] **Step 3: Commit**

```bash
git add lib/analytics.ts
git commit -m "feat: add trackEvent analytics helper for dataLayer + PostHog"
```

---

### Task 3: Create GTM component

**Files:**
- Create: `components/analytics/google-tag-manager.tsx`

- [ ] **Step 1: Create the GTM script component**

```tsx
// components/analytics/google-tag-manager.tsx
import Script from "next/script";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export function GoogleTagManager() {
  if (!GTM_ID) return null;

  return (
    <>
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `,
        }}
      />
    </>
  );
}

export function GoogleTagManagerNoscript() {
  if (!GTM_ID) return null;

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/analytics/google-tag-manager.tsx
git commit -m "feat: add Google Tag Manager script component"
```

---

### Task 4: Create PostHog provider

**Files:**
- Create: `components/analytics/posthog-provider.tsx`

- [ ] **Step 1: Create the PostHog provider component**

```tsx
// components/analytics/posthog-provider.tsx
"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!POSTHOG_KEY) return;
    if (posthog.__loaded) return;

    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      capture_pageview: true,
      capture_pageleave: true,
      session_recording: {
        maskAllInputs: true,
      },
      loaded: (ph) => {
        // Expose globally so trackEvent() can access it
        window.posthog = ph;
      },
    });
  }, []);

  return <>{children}</>;
}
```

- [ ] **Step 2: Commit**

```bash
git add components/analytics/posthog-provider.tsx
git commit -m "feat: add PostHog provider with session recording"
```

---

### Task 5: Create cookie consent banner

**Files:**
- Create: `components/analytics/cookie-consent.tsx`

- [ ] **Step 1: Create the consent banner component**

```tsx
// components/analytics/cookie-consent.tsx
"use client";

import { useState, useEffect } from "react";
import type { Locale } from "@/lib/i18n";

const CONSENT_KEY = "cookie-consent";

const translations: Record<string, { message: string; accept: string; decline: string; privacy: string }> = {
  en: {
    message: "We use cookies to analyze site traffic and optimize your experience.",
    accept: "Accept",
    decline: "Decline",
    privacy: "Privacy Policy",
  },
  ru: {
    message: "Мы используем cookies для анализа трафика и улучшения вашего опыта.",
    accept: "Принять",
    decline: "Отклонить",
    privacy: "Политика конфиденциальности",
  },
  he: {
    message: "אנו משתמשים בעוגיות כדי לנתח תנועה באתר ולשפר את החוויה שלך.",
    accept: "אישור",
    decline: "דחייה",
    privacy: "מדיניות פרטיות",
  },
  el: {
    message: "Χρησιμοποιούμε cookies για την ανάλυση της επισκεψιμότητας και τη βελτίωση της εμπειρίας σας.",
    accept: "Αποδοχή",
    decline: "Απόρριψη",
    privacy: "Πολιτική Απορρήτου",
  },
};

export function getConsent(): boolean | null {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(CONSENT_KEY);
  if (value === "granted") return true;
  if (value === "denied") return false;
  return null;
}

export function CookieConsent({ locale }: { locale: Locale }) {
  const [visible, setVisible] = useState(false);
  const t = translations[locale] || translations.en;

  useEffect(() => {
    if (getConsent() === null) {
      setVisible(true);
    }
  }, []);

  function handleAccept() {
    localStorage.setItem(CONSENT_KEY, "granted");
    setVisible(false);
    // Trigger re-render in AnalyticsProvider via storage event
    window.dispatchEvent(new Event("storage"));
  }

  function handleDecline() {
    localStorage.setItem(CONSENT_KEY, "denied");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[var(--color-night)] px-4 py-4 sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <p className="text-sm text-white/70 text-center sm:text-left">
          {t.message}{" "}
          <a href={`/${locale}/privacy-policy`} className="underline hover:text-white">
            {t.privacy}
          </a>
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={handleDecline}
            className="rounded-md border border-white/20 px-4 py-2 text-sm text-white/70 transition hover:bg-white/10"
          >
            {t.decline}
          </button>
          <button
            onClick={handleAccept}
            className="rounded-md bg-[var(--color-gold-sun)] px-4 py-2 text-sm font-semibold text-[var(--color-night)] transition hover:brightness-110"
          >
            {t.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/analytics/cookie-consent.tsx
git commit -m "feat: add GDPR cookie consent banner with i18n"
```

---

### Task 6: Create AnalyticsProvider wrapper

**Files:**
- Create: `components/analytics/analytics-provider.tsx`

- [ ] **Step 1: Create the consent-gated analytics provider**

```tsx
// components/analytics/analytics-provider.tsx
"use client";

import { useState, useEffect } from "react";
import { getConsent } from "./cookie-consent";
import { GoogleTagManager } from "./google-tag-manager";
import { PostHogProvider } from "./posthog-provider";

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<boolean | null>(null);

  useEffect(() => {
    setConsent(getConsent());

    function onStorage() {
      setConsent(getConsent());
    }

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <>
      {consent === true && (
        <>
          <GoogleTagManager />
          <PostHogProvider>{children}</PostHogProvider>
        </>
      )}
      {consent !== true && children}
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/analytics/analytics-provider.tsx
git commit -m "feat: add consent-gated AnalyticsProvider wrapper"
```

---

### Task 7: Wire analytics into layouts

**Files:**
- Modify: `app/layout.tsx:51-65`
- Modify: `app/[locale]/layout.tsx:28-54`

- [ ] **Step 1: Add GTM noscript to root layout**

In `app/layout.tsx`, add the import and noscript iframe right after `<body>`:

```tsx
// Add import at top:
import { GoogleTagManagerNoscript } from "@/components/analytics/google-tag-manager";

// In the JSX, add after <body>:
<body>
  <GoogleTagManagerNoscript />
  {children}
  <SpeedInsights />
  <Analytics />
</body>
```

- [ ] **Step 2: Add AnalyticsProvider and CookieConsent to locale layout**

In `app/[locale]/layout.tsx`, add the imports and wrap content:

```tsx
// Add imports at top:
import { AnalyticsProvider } from "@/components/analytics/analytics-provider";
import { CookieConsent } from "@/components/analytics/cookie-consent";

// In the JSX, wrap the inner content with AnalyticsProvider and add CookieConsent:
<UiStringsProvider uiStrings={uiStrings} locale={typedLocale}>
  <AnalyticsProvider>
    <div lang={locale} dir={rtl ? "rtl" : "ltr"}>
      {/* ...existing content unchanged... */}
      <StickyCTA ... />
      <CookieConsent locale={typedLocale} />
    </div>
  </AnalyticsProvider>
</UiStringsProvider>
```

- [ ] **Step 3: Verify the app builds**

```bash
yarn build
```

Expected: Build succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx app/[locale]/layout.tsx
git commit -m "feat: wire GTM, PostHog, and cookie consent into layouts"
```

---

### Task 8: Track multi-step form events

**Files:**
- Modify: `components/contact/multi-step-form.tsx`

- [ ] **Step 1: Add trackEvent import and form_step tracking**

At the top of `multi-step-form.tsx`, add the import:

```tsx
import { trackEvent } from "@/lib/analytics";
```

In the `handleNext` function (line 240-245), add tracking after validation passes:

```tsx
function handleNext() {
  setErrors({});
  if (step === 1 && !validateStep1()) return;
  if (step === 2 && !validateStep2()) return;
  const nextStep = step + 1;
  trackEvent("form_step", {
    step: nextStep,
    page_path: typeof window !== "undefined" ? window.location.pathname : "",
  });
  setStep(nextStep);
}
```

Note: also track step 1 view on initial mount. Add a `useEffect` inside the component body, after the state declarations (after line 183):

```tsx
import { useState, useEffect, useRef } from "react";
// ... (update the existing import)

// Inside the component, after the state declarations:
const abandonRef = useRef(false);

useEffect(() => {
  trackEvent("form_step", {
    step: 1,
    page_path: window.location.pathname,
  });
  abandonRef.current = true;

  function handleBeforeUnload() {
    if (abandonRef.current) {
      trackEvent("form_abandon", {
        form_name: "multi_step",
        last_step: step,
        page_path: window.location.pathname,
      });
    }
  }

  window.addEventListener("beforeunload", handleBeforeUnload);
  return () => window.removeEventListener("beforeunload", handleBeforeUnload);
}, []);
```

- [ ] **Step 2: Add form_submit tracking**

In the `handleSubmit` function, after the successful redirect (line 281):

```tsx
if (json.ok) {
  abandonRef.current = false;
  trackEvent("form_submit", {
    form_name: "multi_step",
    page_path: typeof window !== "undefined" ? window.location.pathname : "",
    locale,
  });
  router.push(`/${locale}/contact/thank-you`);
  return;
}
```

- [ ] **Step 3: Verify the app builds**

```bash
yarn build
```

- [ ] **Step 4: Commit**

```bash
git add components/contact/multi-step-form.tsx
git commit -m "feat: track multi-step form steps, submit, and abandonment"
```

---

### Task 9: Track contact-form.tsx submissions

**Files:**
- Modify: `components/contact-form.tsx`

- [ ] **Step 1: Add tracking to contact form**

Add import at top:

```tsx
import { trackEvent } from "@/lib/analytics";
```

In the `handleSubmit` function, after `setStatus("success")` (line 62):

```tsx
if (result.ok) {
  setStatus("success");
  setFeedback(dict.success);
  trackEvent("form_submit", {
    form_name: "contact",
    page_path: typeof window !== "undefined" ? window.location.pathname : "",
    locale,
  });
  form.reset();
  return;
}
```

- [ ] **Step 2: Commit**

```bash
git add components/contact-form.tsx
git commit -m "feat: track contact form submissions"
```

---

### Task 10: Track inline-contact-section.tsx submissions

**Files:**
- Modify: `components/inline-contact-section.tsx`

- [ ] **Step 1: Add tracking to inline contact form**

Add import at top:

```tsx
import { trackEvent } from "@/lib/analytics";
```

In the `handleSubmit` function, after `setFormStatus(json.ok ? "success" : "error")` (line 61):

```tsx
const json = (await res.json()) as { ok: boolean };
if (json.ok) {
  trackEvent("form_submit", {
    form_name: "inline_contact",
    page_path: typeof window !== "undefined" ? window.location.pathname : "",
    locale,
  });
}
setFormStatus(json.ok ? "success" : "error");
```

- [ ] **Step 2: Commit**

```bash
git add components/inline-contact-section.tsx
git commit -m "feat: track inline contact section submissions"
```

---

### Task 11: Track sticky CTA open + form submit

**Files:**
- Modify: `components/sticky-cta.tsx`

- [ ] **Step 1: Add tracking to sticky CTA**

Add import at top:

```tsx
import { trackEvent } from "@/lib/analytics";
```

Add `onOpenChange` handler to `Dialog.Root` to track opens (line 50):

```tsx
<Dialog.Root onOpenChange={(open) => {
  if (open) {
    trackEvent("sticky_cta_open", {
      page_path: typeof window !== "undefined" ? window.location.pathname : "",
    });
  }
}}>
```

In the `handleSubmit` function, after `setStatus(json.ok ? "success" : "error")` (line 43):

```tsx
const json = (await res.json()) as { ok: boolean };
if (json.ok) {
  trackEvent("form_submit", {
    form_name: "sticky_cta",
    page_path: typeof window !== "undefined" ? window.location.pathname : "",
    locale,
  });
}
setStatus(json.ok ? "success" : "error");
```

- [ ] **Step 2: Commit**

```bash
git add components/sticky-cta.tsx
git commit -m "feat: track sticky CTA open and form submissions"
```

---

### Task 12: Track villa page views

**Files:**
- Create: `components/analytics/villa-view-tracker.tsx`
- Modify: `app/[locale]/villas/[slug]/page.tsx`

The villa page is a server component, so we need a small client component to fire the event.

- [ ] **Step 1: Create client-side villa view tracker**

```tsx
// components/analytics/villa-view-tracker.tsx
"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export function VillaViewTracker({ villaName, villaSlug }: { villaName: string; villaSlug: string }) {
  useEffect(() => {
    trackEvent("villa_view", { villa_name: villaName, villa_slug: villaSlug });
  }, [villaName, villaSlug]);

  return null;
}
```

- [ ] **Step 2: Add tracker to villa page**

In `app/[locale]/villas/[slug]/page.tsx`, add the import and render the tracker component inside the page JSX, near the top:

```tsx
import { VillaViewTracker } from "@/components/analytics/villa-view-tracker";

// Inside the page component return, add at the beginning of the JSX:
<VillaViewTracker villaName={villaName} villaSlug={slug} />
```

- [ ] **Step 3: Commit**

```bash
git add components/analytics/villa-view-tracker.tsx app/[locale]/villas/[slug]/page.tsx
git commit -m "feat: track villa detail page views"
```

---

### Task 13: Track masterplan plot clicks

**Files:**
- Modify: `components/masterplan/masterplan-interactive.tsx`

- [ ] **Step 1: Add tracking to plot selection**

Add import at top of `masterplan-interactive.tsx`:

```tsx
import { trackEvent } from "@/lib/analytics";
```

In the `handlePlotSelect` function (line 86), add tracking:

```tsx
const handlePlotSelect = (id: string) => {
  const plot = plots.find((p) => p._id === id);
  trackEvent("masterplan_click", {
    plot_id: id,
    plot_name: plot?.name ?? id,
  });

  const isNewSelection = selectedPlotId !== id;
  setSelectedPlotId((prev) => (prev === id ? null : id));

  if (!isNewSelection) {
    if (plot && ((plot.layoutImages?.length ?? 0) > 0 || getFallbackLayout(plot.name) != null)) {
      setViewMode("blueprint");
    }
  }
};
```

- [ ] **Step 2: Commit**

```bash
git add components/masterplan/masterplan-interactive.tsx
git commit -m "feat: track masterplan plot clicks"
```

---

### Task 14: Final build verification and env documentation

**Files:**
- Modify: none (verification only)

- [ ] **Step 1: Full build check**

```bash
yarn build
```

Expected: Build succeeds. No analytics errors (env vars are empty, so GTM and PostHog components return null / skip init).

- [ ] **Step 2: Verify lint passes**

```bash
yarn lint
```

- [ ] **Step 3: Add env var documentation**

Add to `.env.example` (or create if it doesn't exist):

```bash
# Analytics (leave empty to disable)
NEXT_PUBLIC_GTM_ID=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

- [ ] **Step 4: Commit**

```bash
git add .env.example
git commit -m "docs: add analytics env vars to .env.example"
```
