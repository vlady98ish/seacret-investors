# Contact Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update all contact data, add Viber alongside WhatsApp, fix broken forms, and add email notifications via Resend.

**Architecture:** Data-first approach — update Sanity schema/types/seed first, then update components to consume new fields, then fix broken form wiring, then add Resend email notifications. CMS patch script runs last to update live data.

**Tech Stack:** Next.js 15, Sanity CMS, Resend, TypeScript, Tailwind CSS

---

### Task 1: Sanity schema + types — add viberNumber field

**Files:**
- Modify: `sanity/schemaTypes/siteSettings.ts:20` (add field after whatsappNumber)
- Modify: `lib/sanity/types.ts:64` (add to SiteSettings interface)

- [ ] **Step 1: Add viberNumber to Sanity schema**

In `sanity/schemaTypes/siteSettings.ts`, add after line 20 (the whatsappNumber field):

```ts
    defineField({ name: "viberNumber", title: "Viber Number", type: "string", group: "general", description: "Full number with country code, no spaces (e.g. 306931843439)." }),
```

- [ ] **Step 2: Add viberNumber to TypeScript interface**

In `lib/sanity/types.ts`, add after `whatsappNumber: string;` (line 64):

```ts
  viberNumber: string;
```

- [ ] **Step 3: Commit**

```bash
git add sanity/schemaTypes/siteSettings.ts lib/sanity/types.ts
git commit -m "feat: add viberNumber field to siteSettings schema and types"
```

---

### Task 2: UI strings schema + types — add Viber labels

**Files:**
- Modify: `sanity/schemaTypes/uiStrings.ts:76-77` (add ctaViberUs after ctaWhatsappUs)
- Modify: `sanity/schemaTypes/uiStrings.ts:158` (add miscChatViber after miscChatWhatsapp)
- Modify: `lib/sanity/types.ts:134` (add ctaViberUs after ctaWhatsappUs)
- Modify: `lib/sanity/types.ts:197` (add miscChatViber after miscChatWhatsapp)

- [ ] **Step 1: Add UI string fields to Sanity schema**

In `sanity/schemaTypes/uiStrings.ts`, add after `ctaWhatsappUs` line (line 76):

```ts
    { ...ls("ctaViberUs", "CTA: Viber Us"), group: "cta" },
```

Add after `miscChatWhatsapp` line (line 158):

```ts
    { ...ls("miscChatViber", "Misc: Chat on Viber"), group: "misc" },
```

- [ ] **Step 2: Add to UiStrings TypeScript interface**

In `lib/sanity/types.ts`, add after `ctaWhatsappUs: LocalizedString;` (line 134):

```ts
  ctaViberUs: LocalizedString;
```

Add after `miscChatWhatsapp: LocalizedString;` (line 197):

```ts
  miscChatViber: LocalizedString;
```

- [ ] **Step 3: Commit**

```bash
git add sanity/schemaTypes/uiStrings.ts lib/sanity/types.ts
git commit -m "feat: add Viber UI string fields to schema and types"
```

---

### Task 3: Update seed data with real contact info + Viber strings

**Files:**
- Modify: `sanity/seed/seed-data.ts:458-460` (siteSettings contact data)
- Modify: `sanity/seed/seed-data.ts:650` (add ctaViberUs after ctaWhatsappUs)
- Modify: `sanity/seed/seed-data.ts` (add miscChatViber in misc section)

- [ ] **Step 1: Update siteSettings seed data**

In `sanity/seed/seed-data.ts`, replace the contact fields (lines 458-460):

```ts
  salesEmail: "office@livebettergr.com",
  salesPhone: "+30 693 1843439",
  whatsappNumber: "306931843439",
  viberNumber: "306931843439",
```

- [ ] **Step 2: Add Viber UI strings to seed data**

In `sanity/seed/seed-data.ts`, after `ctaWhatsappUs: { en: "WhatsApp Us" },` (line 650), add:

```ts
  ctaViberUs: { en: "Viber Us" },
```

Find the `miscChatWhatsapp` entry in the uiStrings section and add after it:

```ts
  miscChatViber: { en: "Chat on Viber" },
```

- [ ] **Step 3: Commit**

```bash
git add sanity/seed/seed-data.ts
git commit -m "feat: update seed data with real contact info and Viber strings"
```

---

### Task 4: Add Viber translations

**Files:**
- Modify: `sanity/seed/fill-translations.ts:542` (add ctaViberUs after ctaWhatsappUs)
- Modify: `sanity/seed/fill-translations-v2.ts:81` (add miscChatViber after miscChatWhatsapp)

- [ ] **Step 1: Add translations to fill-translations.ts**

In `sanity/seed/fill-translations.ts`, after the `ctaWhatsappUs` line (line 542), add:

```ts
  ctaViberUs: { ru: "Напишите в Viber", he: "שלחו לנו בוייבר", el: "Στείλτε μας στο Viber" },
```

- [ ] **Step 2: Add translations to fill-translations-v2.ts**

In `sanity/seed/fill-translations-v2.ts`, after the `miscChatWhatsapp` line (line 81), add:

```ts
  miscChatViber: { en: "Chat on Viber", ru: "Написать в Viber", he: "שלחו הודעה בוייבר", el: "Συνομιλία στο Viber" },
  ctaViberUs: { en: "Viber Us", ru: "Напишите в Viber", he: "שלחו לנו בוייבר", el: "Στείλτε μας στο Viber" },
```

- [ ] **Step 3: Update directDescription translations to mention Viber**

In `sanity/seed/fill-translations.ts`, update the `directDescription` entries (around line 366) to include Viber:

```ts
  directDescription: {
    ru: "Предпочитаете прямой разговор? Свяжитесь с нами через WhatsApp, Viber, email или по телефону.",
    he: "מעדיפים שיחה ישירה? פנו אלינו בוואטסאפ, וייבר, באימייל או בטלפון.",
    el: "Προτιμάτε άμεση επικοινωνία; Επικοινωνήστε μαζί μας μέσω WhatsApp, Viber, email ή τηλεφώνου.",
  },
```

Also update the English version in `sanity/seed/seed-data.ts` in the contactPage section — find the `directDescription` and update:

```ts
    en: "Prefer a direct conversation? Reach us on WhatsApp, Viber, by email, or give us a call.",
```

- [ ] **Step 4: Commit**

```bash
git add sanity/seed/fill-translations.ts sanity/seed/fill-translations-v2.ts sanity/seed/seed-data.ts
git commit -m "feat: add Viber translations across all locales"
```

---

### Task 5: Update DirectContactSection — add Viber button

**Files:**
- Modify: `components/contact/direct-contact-section.tsx`

- [ ] **Step 1: Add Viber props and URL construction**

In `components/contact/direct-contact-section.tsx`, update the interface to add `labelChatViber` prop:

```ts
interface DirectContactSectionProps {
  locale: Locale;
  settings?: SiteSettings | null;
  eyebrow?: string;
  title?: string;
  description?: string;
  labelEmail?: string;
  labelPhone?: string;
  labelOfficeHours?: string;
  responsePromise?: string;
  labelChatWhatsapp?: string;
  labelChatViber?: string;
}
```

Update destructuring to include `labelChatViber`:

```ts
export function DirectContactSection({
  locale,
  settings,
  eyebrow,
  title,
  description,
  labelEmail,
  labelPhone,
  labelOfficeHours,
  responsePromise,
  labelChatWhatsapp,
  labelChatViber,
}: DirectContactSectionProps) {
```

Add viber variable and URL after the whatsapp ones:

```ts
  const whatsapp = settings?.whatsappNumber;
  const viber = settings?.viberNumber;
  const email = settings?.salesEmail;
  const phone = settings?.salesPhone;
  const officeHours = settings?.officeHours?.[locale] ?? settings?.officeHours?.en;

  if (!whatsapp && !viber && !email && !phone) return null;

  const whatsappUrl = whatsapp ? `https://wa.me/${whatsapp.replace(/\D/g, "")}` : undefined;
  const viberUrl = viber ? `viber://chat?number=%2B${viber.replace(/\D/g, "")}` : undefined;
```

- [ ] **Step 2: Replace single WhatsApp CTA with two messenger buttons**

Replace the WhatsApp button section (lines 63-73) with two side-by-side buttons:

```tsx
      {/* Messenger CTAs */}
      {(whatsappUrl || viberUrl) && (
        <div className="flex flex-col sm:flex-row gap-3">
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 rounded-full px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#25D366" }}
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {labelChatWhatsapp && <span>{labelChatWhatsapp}</span>}
            </a>
          )}
          {viberUrl && (
            <a
              href={viberUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 rounded-full px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#7360F2" }}
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.398.002C9.473.028 5.331.344 3.014 2.467 1.294 4.177.518 6.77.375 9.999c-.143 3.229-.332 9.29 5.735 10.89l.009.003h.013l-.006 2.488s-.041.988.621 1.189c.799.244 1.27-.514 2.034-1.328.42-.447.999-1.103 1.436-1.603 3.963.333 7.005-.428 7.352-.539.8-.256 5.327-.84 6.063-6.853.761-6.2-.37-10.114-2.436-11.885l-.002-.001C19.86.727 16.247-.038 11.398.002zm.432 2.09c4.273-.036 7.438.536 8.79 1.673 1.67 1.429 2.681 4.874 2.019 10.262-.579 4.736-3.927 5.316-4.594 5.53-.286.092-2.93.735-6.296.52 0 0-2.493 3.004-3.272 3.792-.121.124-.267.177-.363.152-.134-.036-.171-.195-.168-.431l.024-4.119c-.003 0-.004-.001-.006-.001-5.07-1.335-4.762-6.453-4.643-9.26.118-2.808.768-5.029 2.196-6.443 1.905-1.736 5.088-1.67 6.313-1.675zM11.924 4.9a.397.397 0 00-.4.395.4.4 0 00.4.396 4.574 4.574 0 013.246 1.343 4.472 4.472 0 011.328 3.386.397.397 0 00.394.401h.003a.397.397 0 00.397-.394 5.264 5.264 0 00-1.566-3.988A5.376 5.376 0 0011.924 4.9zm-3.29.706a.882.882 0 00-.189.011.935.935 0 00-.421.157 6.3 6.3 0 00-.656.577c-.27.271-.424.564-.482.86a2.006 2.006 0 00-.017.62c.082.553.341 1.165.723 1.853.574 1.035 1.385 2.133 2.456 3.196l.018.016.016.018c1.063 1.071 2.161 1.882 3.196 2.456.688.382 1.3.641 1.854.723.211.031.417.033.62-.017.296-.058.588-.213.86-.482.227-.228.414-.452.576-.656.275-.346.283-.734.038-.985l-1.576-1.576a.606.606 0 00-.854.012l-.932.904a.36.36 0 01-.345.071l-.027-.01a8.68 8.68 0 01-1.592-.897 11.52 11.52 0 01-1.783-1.676 8.69 8.69 0 01-.897-1.593l-.01-.027a.36.36 0 01.071-.345l.904-.932a.607.607 0 00.012-.854l-1.576-1.575a.596.596 0 00-.389-.25zm3.646.39a.397.397 0 00-.063.79 3.166 3.166 0 012.6 2.726.397.397 0 00.79-.076 3.953 3.953 0 00-3.248-3.405.401.401 0 00-.079-.036zm.19 1.603a.397.397 0 00-.12.776 1.594 1.594 0 011.218 1.362.397.397 0 00.791-.07 2.383 2.383 0 00-1.82-2.037.398.398 0 00-.068-.031z" />
              </svg>
              {labelChatViber && <span>{labelChatViber}</span>}
            </a>
          )}
        </div>
      )}
```

Remove the old `MessageCircle` import from lucide-react (no longer needed for the CTA area).

- [ ] **Step 3: Commit**

```bash
git add components/contact/direct-contact-section.tsx
git commit -m "feat: add Viber button alongside WhatsApp in DirectContactSection"
```

---

### Task 6: Update InlineContactSection — add Viber button + fix form

**Files:**
- Modify: `components/inline-contact-section.tsx`

- [ ] **Step 1: Add Viber props to types**

Update `InlineContactStrings` to add `viberUs`:

```ts
type InlineContactStrings = {
  eyebrow?: string;
  title?: string;
  description?: string;
  whatsappUs?: string;
  viberUs?: string;
  formFullName?: string;
  formEmail?: string;
  formPhone?: string;
  formMessage?: string;
  formGdpr?: string;
  formSubmit?: string;
};
```

Update `InlineContactSectionProps` to add `viberUrl`:

```ts
type InlineContactSectionProps = {
  locale: Locale;
  preferredOption?: string;
  strings?: InlineContactStrings;
  whatsappUrl?: string;
  viberUrl?: string;
};
```

- [ ] **Step 2: Add Viber button next to WhatsApp**

Update the destructuring to include `viberUrl`:

```ts
export function InlineContactSection({ locale, preferredOption, strings, whatsappUrl, viberUrl }: InlineContactSectionProps) {
```

Remove `locale: _locale` — we now use `locale` in the fetch call.

Add viber string:

```ts
  const viberUs = strings?.viberUs || useT("ctaViberUs");
```

Replace the single WhatsApp button block (lines 50-59) with two buttons:

```tsx
            {(whatsappUrl || viberUrl) && (
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary inline-flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    {whatsappUs}
                  </a>
                )}
                {viberUrl && (
                  <a
                    href={viberUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary inline-flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.398.002C9.473.028 5.331.344 3.014 2.467 1.294 4.177.518 6.77.375 9.999c-.143 3.229-.332 9.29 5.735 10.89l.009.003h.013l-.006 2.488s-.041.988.621 1.189c.799.244 1.27-.514 2.034-1.328.42-.447.999-1.103 1.436-1.603 3.963.333 7.005-.428 7.352-.539.8-.256 5.327-.84 6.063-6.853.761-6.2-.37-10.114-2.436-11.885l-.002-.001C19.86.727 16.247-.038 11.398.002zm.432 2.09c4.273-.036 7.438.536 8.79 1.673 1.67 1.429 2.681 4.874 2.019 10.262-.579 4.736-3.927 5.316-4.594 5.53-.286.092-2.93.735-6.296.52 0 0-2.493 3.004-3.272 3.792-.121.124-.267.177-.363.152-.134-.036-.171-.195-.168-.431l.024-4.119c-.003 0-.004-.001-.006-.001-5.07-1.335-4.762-6.453-4.643-9.26.118-2.808.768-5.029 2.196-6.443 1.905-1.736 5.088-1.67 6.313-1.675zM11.924 4.9a.397.397 0 00-.4.395.4.4 0 00.4.396 4.574 4.574 0 013.246 1.343 4.472 4.472 0 011.328 3.386.397.397 0 00.394.401h.003a.397.397 0 00.397-.394 5.264 5.264 0 00-1.566-3.988A5.376 5.376 0 0011.924 4.9zm-3.29.706a.882.882 0 00-.189.011.935.935 0 00-.421.157 6.3 6.3 0 00-.656.577c-.27.271-.424.564-.482.86a2.006 2.006 0 00-.017.62c.082.553.341 1.165.723 1.853.574 1.035 1.385 2.133 2.456 3.196l.018.016.016.018c1.063 1.071 2.161 1.882 3.196 2.456.688.382 1.3.641 1.854.723.211.031.417.033.62-.017.296-.058.588-.213.86-.482.227-.228.414-.452.576-.656.275-.346.283-.734.038-.985l-1.576-1.576a.606.606 0 00-.854.012l-.932.904a.36.36 0 01-.345.071l-.027-.01a8.68 8.68 0 01-1.592-.897 11.52 11.52 0 01-1.783-1.676 8.69 8.69 0 01-.897-1.593l-.01-.027a.36.36 0 01.071-.345l.904-.932a.607.607 0 00.012-.854l-1.576-1.575a.596.596 0 00-.389-.25zm3.646.39a.397.397 0 00-.063.79 3.166 3.166 0 012.6 2.726.397.397 0 00.79-.076 3.953 3.953 0 00-3.248-3.405.401.401 0 00-.079-.036zm.19 1.603a.397.397 0 00-.12.776 1.594 1.594 0 011.218 1.362.397.397 0 00.791-.07 2.383 2.383 0 00-1.82-2.037.398.398 0 00-.068-.031z" />
                    </svg>
                    {viberUs}
                  </a>
                )}
              </div>
            )}
```

- [ ] **Step 3: Wire up form submission**

Add `useState` import and form state management. Replace the existing `<form>` block with a working form that POSTs to `/api/contact`:

```tsx
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormStatus("loading");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fd.get("fullName"),
          email: fd.get("email"),
          phone: fd.get("phone") || undefined,
          message: fd.get("message") || undefined,
          interest: fd.get("interest") || "General Inquiry",
          locale,
          source: typeof window !== "undefined" ? window.location.href : undefined,
          gdprConsent: true,
        }),
      });
      const json = (await res.json()) as { ok: boolean };
      setFormStatus(json.ok ? "success" : "error");
    } catch {
      setFormStatus("error");
    }
  }
```

Update the `<form>` element to use `onSubmit={handleSubmit}`. Add success state rendering. Add disabled state to submit button during loading.

Add `{ useState }` to the react import at the top.

- [ ] **Step 4: Commit**

```bash
git add components/inline-contact-section.tsx
git commit -m "feat: add Viber button and wire up form in InlineContactSection"
```

---

### Task 7: Wire up StickyCTA form

**Files:**
- Modify: `components/sticky-cta.tsx`

- [ ] **Step 1: Add form state and submission handler**

Add `useState` import:

```ts
import { useState } from "react";
```

Update the component to use `locale` instead of `_locale`:

```ts
export function StickyCTA({ locale, context, labelTitle, labelFullName, labelEmail, labelPhone, labelSubmit }: StickyCTAProps) {
```

Add state and handler inside the component:

```ts
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fd.get("fullName"),
          email: fd.get("email"),
          phone: fd.get("phone") || undefined,
          interest: context || "Quick Inquiry",
          locale,
          source: typeof window !== "undefined" ? window.location.href : undefined,
          gdprConsent: true,
        }),
      });
      const json = (await res.json()) as { ok: boolean };
      setStatus(json.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }
```

- [ ] **Step 2: Update form to use the handler**

Replace the form `onSubmit` from `(e) => { e.preventDefault(); }` to `handleSubmit`.

Add success state inside Dialog.Content — show a thank-you message when `status === "success"`:

```tsx
          {status === "success" ? (
            <div className="flex flex-col items-center justify-center text-center py-16 gap-4">
              <div className="w-12 h-12 rounded-full bg-[var(--color-deep-teal)]/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-[var(--color-deep-teal)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm text-[var(--color-muted)]">Thank you! We'll be in touch soon.</p>
            </div>
          ) : (
            <form ... >
              {/* existing form fields */}
            </form>
          )}
```

Disable the submit button during loading:

```tsx
<button type="submit" className="btn btn-primary mt-2 w-full" disabled={status === "loading"}>
  {status === "loading" ? "Sending..." : labelSubmit}
</button>
```

- [ ] **Step 3: Commit**

```bash
git add components/sticky-cta.tsx
git commit -m "feat: wire up StickyCTA form to /api/contact"
```

---

### Task 8: Update all pages to pass viberUrl and Viber labels

**Files:**
- Modify: `app/[locale]/page.tsx:153-168`
- Modify: `app/[locale]/about/page.tsx:126-141`
- Modify: `app/[locale]/masterplan/page.tsx:220-236`
- Modify: `app/[locale]/residences/page.tsx:225-229`
- Modify: `app/[locale]/location/page.tsx:172-175`
- Modify: `app/[locale]/villas/[slug]/page.tsx:321-325`
- Modify: `app/[locale]/contact/page.tsx:148`

- [ ] **Step 1: Create a helper for messenger URLs**

In each page, add `viberUrl` construction next to the existing `whatsappUrl`. The pattern for each page's `InlineContactSection` usage — add these props:

```tsx
viberUrl={siteSettings?.viberNumber ? `viber://chat?number=%2B${siteSettings.viberNumber.replace(/\D/g, "")}` : undefined}
```

And in the `strings` object (where provided), add:

```tsx
viberUs: getLocalizedValue(uiStrings?.ctaViberUs, typedLocale),
```

- [ ] **Step 2: Update home page** (`app/[locale]/page.tsx`)

Add `viberUrl` prop and `viberUs` string to the `InlineContactSection` around line 153.

- [ ] **Step 3: Update about page** (`app/[locale]/about/page.tsx`)

Same pattern around line 126.

- [ ] **Step 4: Update masterplan page** (`app/[locale]/masterplan/page.tsx`)

Same pattern around line 220.

- [ ] **Step 5: Update residences page** (`app/[locale]/residences/page.tsx`)

Add `viberUrl` prop around line 228.

- [ ] **Step 6: Update location page** (`app/[locale]/location/page.tsx`)

Add `viberUrl` prop around line 174.

- [ ] **Step 7: Update villas slug page** (`app/[locale]/villas/[slug]/page.tsx`)

Add `viberUrl` prop around line 324.

- [ ] **Step 8: Update contact page** (`app/[locale]/contact/page.tsx`)

Pass `labelChatViber` to `DirectContactSection` around line 148:

```tsx
labelChatViber={t(uiStrings?.miscChatViber) || undefined}
```

- [ ] **Step 9: Commit**

```bash
git add app/
git commit -m "feat: pass viberUrl and Viber labels to all page contact sections"
```

---

### Task 9: Install Resend and add email notifications

**Files:**
- Modify: `app/api/contact/route.ts`

- [ ] **Step 1: Install resend**

```bash
npm install resend
```

- [ ] **Step 2: Add email sending to the API route**

In `app/api/contact/route.ts`, add Resend import and email sending after the Sanity write:

```ts
import { Resend } from "resend";
```

After the `sanityWriteClient.create(...)` block (around line 76), add:

```ts
  // Send email notification
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "Sea'cret Residences <onboarding@resend.dev>",
        to: "office@livebettergr.com",
        subject: `New inquiry from ${data.fullName}`,
        html: `
          <h2>New Lead Submission</h2>
          <table style="border-collapse:collapse;width:100%;max-width:600px;">
            <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Name</td><td style="padding:8px;border-bottom:1px solid #eee;">${data.fullName}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Email</td><td style="padding:8px;border-bottom:1px solid #eee;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
            ${data.phone ? `<tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Phone</td><td style="padding:8px;border-bottom:1px solid #eee;">${data.phone}</td></tr>` : ""}
            <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Interest</td><td style="padding:8px;border-bottom:1px solid #eee;">${data.interest}</td></tr>
            ${data.preferredVilla ? `<tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Preferred Villa</td><td style="padding:8px;border-bottom:1px solid #eee;">${data.preferredVilla}</td></tr>` : ""}
            ${data.budget ? `<tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Budget</td><td style="padding:8px;border-bottom:1px solid #eee;">${data.budget}</td></tr>` : ""}
            ${data.message ? `<tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Message</td><td style="padding:8px;border-bottom:1px solid #eee;">${data.message}</td></tr>` : ""}
            <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Locale</td><td style="padding:8px;border-bottom:1px solid #eee;">${data.locale}</td></tr>
            ${data.source ? `<tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Source</td><td style="padding:8px;border-bottom:1px solid #eee;">${data.source}</td></tr>` : ""}
            ${data.utmSource ? `<tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">UTM</td><td style="padding:8px;border-bottom:1px solid #eee;">${data.utmSource} / ${data.utmMedium} / ${data.utmCampaign}</td></tr>` : ""}
          </table>
        `,
      });
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError);
      // Don't fail the API response — Sanity write already succeeded
    }
  }
```

- [ ] **Step 3: Commit**

```bash
git add app/api/contact/route.ts package.json package-lock.json
git commit -m "feat: add Resend email notifications on form submission"
```

---

### Task 10: Update hardcoded phone format in legal pages

**Files:**
- Modify: `app/[locale]/terms/page.tsx:139`
- Modify: `app/[locale]/privacy-policy/page.tsx:220`

- [ ] **Step 1: Update terms page phone format**

In `app/[locale]/terms/page.tsx` line 139, change:

```tsx
Phone: <a href="tel:+306931843439">+30 6931 843 439</a>
```

to:

```tsx
Phone: <a href="tel:+306931843439">+30 693 1843439</a>
```

- [ ] **Step 2: Update privacy policy page phone format**

In `app/[locale]/privacy-policy/page.tsx` line 220, same change:

```tsx
Phone: <a href="tel:+306931843439">+30 693 1843439</a>
```

- [ ] **Step 3: Commit**

```bash
git add "app/[locale]/terms/page.tsx" "app/[locale]/privacy-policy/page.tsx"
git commit -m "fix: update phone format in legal pages to +30 693 1843439"
```

---

### Task 11: CMS patch script — update live Sanity data

**Files:**
- Create: `sanity/seed/patch-site-settings.ts`

- [ ] **Step 1: Create the patch script**

Create `sanity/seed/patch-site-settings.ts` following the pattern from `patch-contact-seo.ts`:

```ts
/**
 * Patch siteSettings with real contact data + viberNumber field.
 * Also adds new Viber UI strings.
 * Run: npx tsx sanity/seed/patch-site-settings.ts
 */

import { createClient } from "@sanity/client";
import fs from "fs";
import path from "path";

function loadEnv(): Record<string, string> {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) {
    throw new Error(`.env.local not found at ${envPath}`);
  }
  const raw = fs.readFileSync(envPath, "utf-8");
  const vars: Record<string, string> = {};
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed
      .slice(idx + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
    vars[key] = value;
  }
  return vars;
}

const env = loadEnv();
const projectId = env["NEXT_PUBLIC_SANITY_PROJECT_ID"];
const dataset = env["NEXT_PUBLIC_SANITY_DATASET"] ?? "production";
const token = env["SANITY_WRITE_TOKEN"];

if (!projectId || !token) {
  throw new Error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_WRITE_TOKEN in .env.local",
  );
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-01-01",
  useCdn: false,
});

async function patchSiteSettings() {
  console.log("\n📞 Patching siteSettings with real contact data...\n");

  for (const id of ["siteSettings", "drafts.siteSettings"]) {
    const doc = await client.getDocument(id);
    if (!doc) {
      console.log(`⏭  ${id} not found, skipping`);
      continue;
    }

    await client
      .patch(id)
      .set({
        salesEmail: "office@livebettergr.com",
        salesPhone: "+30 693 1843439",
        whatsappNumber: "306931843439",
        viberNumber: "306931843439",
      })
      .commit();

    console.log(`✅ ${id} patched`);
  }
}

async function patchUiStrings() {
  console.log("\n💬 Adding Viber UI strings...\n");

  for (const id of ["uiStrings", "drafts.uiStrings"]) {
    const doc = await client.getDocument(id);
    if (!doc) {
      console.log(`⏭  ${id} not found, skipping`);
      continue;
    }

    await client
      .patch(id)
      .set({
        ctaViberUs: { en: "Viber Us", ru: "Напишите в Viber", he: "שלחו לנו בוייבר", el: "Στείλτε μας στο Viber" },
        miscChatViber: { en: "Chat on Viber", ru: "Написать в Viber", he: "שלחו הודעה בוייבר", el: "Συνομιλία στο Viber" },
      })
      .commit();

    console.log(`✅ ${id} patched`);
  }
}

async function patchContactPageDescription() {
  console.log("\n📝 Updating contact page directDescription to mention Viber...\n");

  for (const id of ["contactPage", "drafts.contactPage"]) {
    const doc = await client.getDocument(id);
    if (!doc) {
      console.log(`⏭  ${id} not found, skipping`);
      continue;
    }

    await client
      .patch(id)
      .set({
        "directDescription.en": "Prefer a direct conversation? Reach us on WhatsApp, Viber, by email, or give us a call.",
        "directDescription.ru": "Предпочитаете прямой разговор? Свяжитесь с нами через WhatsApp, Viber, email или по телефону.",
        "directDescription.he": "מעדיפים שיחה ישירה? פנו אלינו בוואטסאפ, וייבר, באימייל או בטלפון.",
        "directDescription.el": "Προτιμάτε άμεση επικοινωνία; Επικοινωνήστε μαζί μας μέσω WhatsApp, Viber, email ή τηλεφώνου.",
      })
      .commit();

    console.log(`✅ ${id} patched`);
  }
}

async function main() {
  await patchSiteSettings();
  await patchUiStrings();
  await patchContactPageDescription();
  console.log("\n🎉 All patches complete!\n");
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
```

- [ ] **Step 2: Commit**

```bash
git add sanity/seed/patch-site-settings.ts
git commit -m "feat: add CMS patch script for contact data and Viber strings"
```

- [ ] **Step 3: Run the patch script**

```bash
npx tsx sanity/seed/patch-site-settings.ts
```

Verify output shows all patches successful.

---

### Task 12: Build verification and final commit

- [ ] **Step 1: Run build**

```bash
npm run build
```

Fix any TypeScript errors.

- [ ] **Step 2: Verify dev server**

```bash
npm run dev
```

Manually check:
- Contact page shows both WhatsApp and Viber buttons
- InlineContactSection forms submit correctly
- StickyCTA drawer form submits correctly
- Legal pages show correct phone format

- [ ] **Step 3: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix: address build errors from contact overhaul"
```
