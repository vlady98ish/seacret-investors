# Contact Overhaul: Phone, Messengers, Forms, Email Notifications

**Date:** 2026-04-03
**Status:** Approved

## Summary

Update all contact data site-wide, add Viber alongside WhatsApp, fix broken forms (InlineContactSection, StickyCTA), and add email notifications on form submission via Resend.

## 1. Sanity Data Updates

### 1a. Schema (`sanity/schemaTypes/siteSettings.ts`)

Add new field:

```ts
defineField({
  name: "viberNumber",
  title: "Viber Number",
  type: "string",
  group: "general",
  description: "Full number with country code, no spaces (e.g. 306931843439)."
})
```

### 1b. Types (`lib/sanity/types.ts`)

Add to `SiteSettings` interface:

```ts
viberNumber: string;
```

### 1c. Seed data (`sanity/seed/seed-data.ts`)

Update `siteSettings`:

```ts
salesPhone: "+30 693 1843439",
salesEmail: "office@livebettergr.com",
whatsappNumber: "306931843439",
viberNumber: "306931843439",
```

### 1d. CMS patch script (`sanity/seed/patch-site-settings.ts`)

New script to update existing CMS document:

```ts
// Patches siteSettings with real contact data + viberNumber field
```

### 1e. UI Strings

**Schema** (`sanity/schemaTypes/uiStrings.ts`): add `ctaViberUs` and `miscChatViber` fields.

**Seed data** (`sanity/seed/seed-data.ts`): add English values:
- `ctaViberUs: { en: "Viber Us" }`
- `miscChatViber: { en: "Chat on Viber" }`

**Translations** (`sanity/seed/fill-translations.ts` and `fill-translations-v2.ts`): add translations:
- RU: "Написать в Viber" / "Чат в Viber"
- HE: "שלחו הודעה בוייבר" / "צ'אט בוייבר"
- EL: "Στείλτε μας στο Viber" / "Συνομιλία στο Viber"

**Types** (`lib/sanity/types.ts`): add `ctaViberUs` and `miscChatViber` to `UiStrings`.

### 1f. CMS patch script for UI strings

New script or extend patch script to upsert new UI string fields in CMS.

## 2. Messenger Buttons (WhatsApp + Viber)

### 2a. DirectContactSection (`components/contact/direct-contact-section.tsx`)

Current: single WhatsApp CTA button.
New: two buttons side by side in `flex gap-3`.

- WhatsApp: brand green `#25D366`, custom SVG icon
- Viber: brand purple `#7360F2`, custom SVG icon
- Both use `btn` styling with messenger-specific background colors
- Both open in new tab (`target="_blank"`)
- URLs:
  - WhatsApp: `https://wa.me/{number}`
  - Viber: `viber://chat?number=%2B{number}`

Props: add `settings.viberNumber`, `labelChatViber`.

### 2b. InlineContactSection (`components/inline-contact-section.tsx`)

Current: single "WhatsApp Us" button.
New: two buttons side by side.

Props: add `viberUrl`, `strings.viberUs`.

### 2c. All pages passing `whatsappUrl`

6 pages construct `whatsappUrl` from `siteSettings.whatsappNumber`. Each must also construct `viberUrl` from `siteSettings.viberNumber` and pass it + label.

Pages: `page.tsx` (home), `about/page.tsx`, `masterplan/page.tsx`, `residences/page.tsx`, `location/page.tsx`, `villas/[slug]/page.tsx`.

### 2d. Contact page (`app/[locale]/contact/page.tsx`)

Pass `labelChatViber` to `DirectContactSection`.

## 3. Fix Broken Forms

### 3a. InlineContactSection (`components/inline-contact-section.tsx`)

Current: `<form>` with no `onSubmit` handler — does nothing on submit.

Fix:
- Add `"use client"` (already present)
- Add `useState` for status (idle/loading/success/error)
- Add `onSubmit` handler that POSTs to `/api/contact`
- Add GDPR checkbox (already has one but needs to send `gdprConsent: true`)
- Show loading state on button, success/error feedback after submit
- Include `locale` prop in payload

### 3b. StickyCTA (`components/sticky-cta.tsx`)

Current: `onSubmit={(e) => { e.preventDefault(); }}` — does nothing.

Fix:
- Add `useState` for status
- Add `onSubmit` handler → POST `/api/contact`
- Add success state (replace form with confirmation)
- Add GDPR consent checkbox
- Pass `locale` prop (currently unused `_locale`)

## 4. Email Notifications via Resend

### 4a. Install Resend

```bash
npm install resend
```

### 4b. Environment variable

```
RESEND_API_KEY=re_xxxxx
```

### 4c. Update API route (`app/api/contact/route.ts`)

After writing to Sanity, send email notification:

```ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// After sanityWriteClient.create(...)
await resend.emails.send({
  from: "Sea'cret Residences <noreply@livebettergr.com>",
  to: "office@livebettergr.com",
  subject: `New inquiry from ${data.fullName}`,
  html: `...formatted lead details...`,
});
```

Email contains: name, email, phone, interest, villa preference, budget, message, locale, source URL, UTM params.

Email sending failure should NOT fail the API response — wrap in try/catch, log error, still return success to user.

### 4d. Domain verification

Resend requires domain verification for custom `from` addresses. Until verified, can use Resend's default `onboarding@resend.dev`. User needs to add DNS records for `livebettergr.com` in Resend dashboard.

## 5. Hardcoded Data in Legal Pages

### 5a. Terms page (`app/[locale]/terms/page.tsx`)

Line 139: update phone format from `+30 6931 843 439` to `+30 693 1843439`.
`tel:` href: `+306931843439` (unchanged, already correct).

### 5b. Privacy Policy page (`app/[locale]/privacy-policy/page.tsx`)

Line 220: same phone format update.

## Out of Scope

- Changing legal entity email (`lkholdingsike@gmail.com`) in terms/privacy pages
- Redesigning form UX beyond wiring
- Adding Telegram or other messengers
- Form analytics/tracking
