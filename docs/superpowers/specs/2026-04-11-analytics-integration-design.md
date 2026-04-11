# Analytics Integration Design

## Overview

Integrate analytics tracking into Sea'cret Residences V2 to enable the marketing team and ad agency to track form submissions, user behavior, and conversion funnels. The solution is designed so the site can be handed off — the agency manages everything through GTM and PostHog dashboards without developer involvement.

## Goals

- Track form submissions across all 4 forms with page context
- Track multi-step form funnel (step progression + abandonment)
- Track CTA clicks, villa views, and masterplan interactions
- Enable the ad agency to self-manage GA4, Meta Pixel, and future pixels via GTM
- Provide PostHog for visual funnel analysis and session replay
- GDPR-compliant: no tracking without cookie consent

## Architecture

### Three Analytics Layers

1. **Google Tag Manager (GTM)** — container script managed by the agency. They configure GA4, Meta Pixel, and any future pixels (TikTok, LinkedIn, etc.) through the GTM interface. No code changes needed for new tags.

2. **PostHog** — direct SDK integration for funnel visualization and session replay. Auto-captures page views and clicks. Custom events sent alongside dataLayer pushes.

3. **Cookie Consent** — GDPR banner that gates both GTM and PostHog. Scripts only load after user accepts.

### Data Flow

```
User action (form submit, CTA click, etc.)
    ↓
trackEvent(name, properties)  — lib/analytics.ts
    ↓
┌───────────────────┬─────────────────────┐
│ window.dataLayer  │  posthog.capture()  │
│   .push(event)    │                     │
└───────┬───────────┴──────────┬──────────┘
        ↓                      ↓
   GTM Container           PostHog Cloud
   (agency manages)        (funnels + replays)
        ↓
┌───────┴───────┐
│  GA4  │ Meta  │  ← configured by agency in GTM
└───────┴───────┘
```

## Environment Variables

All public (client-side), prefixed with `NEXT_PUBLIC_`:

| Variable | Description | Example |
|---|---|---|
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager container ID | `GTM-XXXXXXX` |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog project API key | `phc_...` |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog ingestion host | `https://us.i.posthog.com` |

If any variable is empty/missing, its corresponding script does not load. The site works normally without analytics.

## New Components

### 1. `GoogleTagManager` (`components/analytics/google-tag-manager.tsx`)

- Script component using `next/script` with `afterInteractive` strategy
- Renders GTM `<script>` tag and `<noscript>` iframe
- Only renders when `NEXT_PUBLIC_GTM_ID` is set AND cookie consent is granted
- Placed in root `app/layout.tsx`

### 2. `PostHogProvider` (`components/analytics/posthog-provider.tsx`)

- Client component wrapping `posthog-js` initialization
- Configured with `capture_pageview: true`, `capture_pageleave: true`, `session_recording: { maskAllInputs: true }`
- Masks all form inputs in session recordings for privacy
- Only initializes when `NEXT_PUBLIC_POSTHOG_KEY` is set AND cookie consent is granted
- Placed in `app/[locale]/layout.tsx`

### 3. `CookieConsent` (`components/analytics/cookie-consent.tsx`)

- Fixed banner at bottom of viewport
- Two buttons: Accept / Decline
- Consent state stored in `localStorage` key `cookie-consent`
- Multilingual text (en, he, ru, el) — translations inline in the component
- Includes link to Privacy Policy page
- Styling: minimal, dark background, matches site aesthetic
- Does not block page content

### 4. `AnalyticsProvider` (`components/analytics/analytics-provider.tsx`)

- Wrapper component that checks consent state
- Conditionally renders `GoogleTagManager` and `PostHogProvider`
- Re-checks consent on storage change events (if user changes preference)

## Analytics Helper — `lib/analytics.ts`

Single function used across the app:

```typescript
export function trackEvent(
  eventName: string,
  properties?: Record<string, string | number | boolean>
): void {
  // Push to GTM dataLayer
  window.dataLayer?.push({
    event: eventName,
    ...properties,
  });

  // Send to PostHog
  posthog?.capture(eventName, properties);
}
```

## Events Tracked

| Event | Trigger | Properties |
|---|---|---|
| `form_submit` | Any form successfully submitted | `form_name`, `page_path`, `locale` |
| `form_step` | Multi-step form: step transition | `step` (1, 2, 3), `page_path` |
| `form_abandon` | Multi-step form: user leaves mid-flow | `form_name`, `last_step`, `page_path` |
| `cta_click` | Click on CTA button | `button_text`, `page_path`, `destination` |
| `villa_view` | Villa detail page loaded | `villa_name`, `villa_slug` |
| `masterplan_click` | Click on plot in masterplan | `plot_id`, `plot_name` |
| `sticky_cta_open` | Sticky CTA dialog opened | `page_path` |

## Changes to Existing Code

### Forms (minimal changes — 1-2 lines each)

| File | Change |
|---|---|
| `components/contact/multi-step-form.tsx` | Add `trackEvent('form_step')` on step transitions, `trackEvent('form_submit')` on success, `trackEvent('form_abandon')` on `beforeunload` |
| `components/contact-form.tsx` | Add `trackEvent('form_submit', { form_name: 'contact' })` on success |
| `components/inline-contact-section.tsx` | Add `trackEvent('form_submit', { form_name: 'inline_contact' })` on success |
| `components/sticky-cta.tsx` | Add `trackEvent('sticky_cta_open')` on dialog open, `trackEvent('form_submit', { form_name: 'sticky_cta' })` on success |

### Pages

| File | Change |
|---|---|
| `app/[locale]/villas/[slug]/page.tsx` | Add `trackEvent('villa_view')` |
| Masterplan plot click handler | Add `trackEvent('masterplan_click')` |

### Layouts

| File | Change |
|---|---|
| `app/layout.tsx` | Add `AnalyticsProvider` wrapping children (includes GTM) |
| `app/[locale]/layout.tsx` | Add `PostHogProvider` and `CookieConsent` |

## Cookie Consent Translations

| Language | Accept | Decline | Message |
|---|---|---|---|
| en | Accept | Decline | We use cookies to analyze site traffic and optimize your experience. |
| ru | Принять | Отклонить | Мы используем cookies для анализа трафика и улучшения вашего опыта. |
| he | אישור | דחייה | אנו משתמשים בעוגיות כדי לנתח תנועה באתר ולשפר את החוויה שלך. |
| el | Αποδοχή | Απόρριψη | Χρησιμοποιούμε cookies για την ανάλυση της επισκεψιμότητας και τη βελτίωση της εμπειρίας σας. |

## Dependencies

New npm packages:

| Package | Purpose |
|---|---|
| `posthog-js` | PostHog JavaScript SDK |

GTM and GA4 scripts load via `<script>` tags — no npm packages needed.
Meta Pixel is configured inside GTM by the agency — no code needed.

## What the Agency Gets

After integration, the agency can:

1. **GTM**: Log into GTM container → create tags for GA4, Meta Pixel, or any other pixel → set triggers on dataLayer events (`form_submit`, `cta_click`, etc.) → publish. No developer needed.
2. **PostHog**: Log into PostHog → view funnels (form_step 1→2→3→submit), session replays, user paths. Pre-built events are already flowing.
3. **Add new pixels**: TikTok, LinkedIn, whatever — just add a new tag in GTM.

## Out of Scope

- Server-side tracking / Conversion API (can be added later in GTM)
- A/B testing (PostHog supports it but not needed now)
- Custom PostHog dashboards (agency sets these up themselves)
- Creating GA4 / Meta / GTM accounts (agency handles this)
