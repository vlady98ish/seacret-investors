# Thank You Page After Form Submission

## Purpose

Dedicated `/contact/thank-you` page for conversion tracking (Google Analytics, Meta Pixel, etc.). After successful contact form submission, redirect the user to this page instead of showing an inline success message.

## Route

`/[locale]/contact/thank-you` — supports all 4 locales (en, he, ru, el).

## Design: Hero + Next Steps + CTAs

### Structure

1. **Dark hero block** (compact, like other inner pages)
   - Animated checkmark icon (teal circle with check SVG)
   - Heading: localized "Thank you!" from CMS (`formThankYou`)
   - Subtitle: localized message from CMS (`formThankYouMessage`) — no time commitments like "24 hours"

2. **"What's next" steps** (sand background)
   - Eyebrow: localized from CMS (new field `thankYouNextStepsEyebrow`)
   - 3 numbered steps with title + description, all from CMS (new field `thankYouSteps` — array of localized title/description pairs)
   - Fallback hardcoded steps if CMS is empty

3. **Two CTA buttons** (centered, side by side on desktop, stacked on mobile)
   - Primary (filled): "Explore Residences" → `/{locale}/residences`
   - Secondary (outline): "Masterplan" → `/{locale}/masterplan`
   - Labels from existing CMS fields (`ctaExploreResidences`, `ctaExploreMasterplan`)

### Visual Specs

- Hero: `bg-[var(--color-night)]` with gradient, `compact` variant (like PageHero but custom — no background image needed)
- Steps section: `bg-[var(--color-sand)]`
- Step numbers: teal circle with `rgba(13,103,119,0.1)` background
- Buttons: existing `.btn .btn-primary` and `.btn .btn-outline` classes
- Entry animation: `animate-fade-in` on checkmark + text

## CMS Changes

### New fields in `uiStrings` (form group)

No new Sanity schema fields needed. Reuse existing:
- `formThankYou` — already exists (heading)
- `formThankYouMessage` — already exists (subtitle)
- `ctaExploreResidences` — already exists (primary CTA)
- `ctaExploreMasterplan` — already exists (secondary CTA)

### New fields needed

Add to `uiStrings` schema (form group):
- `formThankYouNextSteps` (localeString) — eyebrow text for "What's next" section
- `formThankYouStep1Title` (localeString)
- `formThankYouStep1Desc` (localeString)
- `formThankYouStep2Title` (localeString)
- `formThankYouStep2Desc` (localeString)
- `formThankYouStep3Title` (localeString)
- `formThankYouStep3Desc` (localeString)

### Seed data (all 4 locales)

| Field | EN | RU | HE | EL |
|-------|----|----|----|----|
| formThankYouNextSteps | What happens next | Что дальше | ?מה הלאה | Τι ακολουθεί |
| Step 1 title | A personal manager will contact you | Персональный менеджер свяжется с вами | מנהל אישי ייצור איתכם קשר | Ένας προσωπικός σύμβουλος θα επικοινωνήσει μαζί σας |
| Step 1 desc | Via the email or phone you provided | По email или телефону, который вы указали | באמצעות המייל או הטלפון שציינתם | Μέσω email ή τηλεφώνου που δηλώσατε |
| Step 2 title | We'll prepare a personalized offer | Подготовим индивидуальное предложение | נכין עבורכם הצעה מותאמת אישית | Θα ετοιμάσουμε μια εξατομικευμένη πρόταση |
| Step 2 desc | Based on your preferences and budget | С учётом ваших предпочтений и бюджета | בהתאם להעדפות ולתקציב שלכם | Με βάση τις προτιμήσεις και τον προϋπολογισμό σας |
| Step 3 title | We'll arrange a virtual or in-person tour | Организуем виртуальный или личный тур | נארגן סיור וירטואלי או אישי | Θα κανονίσουμε εικονική ή προσωπική ξενάγηση |
| Step 3 desc | At your convenience | По вашему удобному графику | בזמן הנוח לכם | Στη δική σας ευκολία |

## Form Flow Change

In `multi-step-form.tsx`: after successful API response, instead of `setStatus("success")`, redirect via `router.push(/{locale}/contact/thank-you)`.

Remove the inline success state JSX block (lines 289-308) — it's replaced by the dedicated page.

## Tracking

The dedicated URL `/{locale}/contact/thank-you` enables:
- Google Analytics goal/conversion on page view
- Meta Pixel standard event (`Lead` or `CompleteRegistration`)
- Any tag manager trigger based on URL match

No tracking code is added in this spec — the URL itself is the enabler.

## SEO

- `noindex, nofollow` via metadata (page should not appear in search)
- No entry in sitemap
