"use client";

import type { Locale } from "@/lib/i18n";
import { useT } from "@/lib/ui-strings-context";

type InlineContactStrings = {
  eyebrow?: string;
  title?: string;
  description?: string;
  whatsappUs?: string;
  formFullName?: string;
  formEmail?: string;
  formPhone?: string;
  formMessage?: string;
  formGdpr?: string;
  formSubmit?: string;
};

type InlineContactSectionProps = {
  locale: Locale;
  preferredOption?: string;
  strings?: InlineContactStrings;
  whatsappUrl?: string;
};

export function InlineContactSection({ locale: _locale, preferredOption, strings, whatsappUrl }: InlineContactSectionProps) {
  const eyebrow = strings?.eyebrow || useT("miscGetInTouch");
  const title = strings?.title || useT("miscReadyToDiscover");
  const description = strings?.description || useT("miscContactPromise");
  const whatsappUs = strings?.whatsappUs || useT("ctaWhatsappUs");
  const formFullName = strings?.formFullName || useT("formFullName");
  const formEmail = strings?.formEmail || useT("formEmail");
  const formPhone = strings?.formPhone || useT("formPhone");
  const formMessage = strings?.formMessage || useT("formMessage");
  const formGdpr = strings?.formGdpr || useT("formGdpr");
  const formSubmit = strings?.formSubmit || useT("ctaSendRequest");

  return (
    <section className="bg-[var(--color-night)] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="eyebrow text-[var(--color-gold-sun)]">{eyebrow}</p>
            <h2 className="text-h2 mt-4 text-white">
              {title}
            </h2>
            <p className="mt-4 max-w-md text-white/60">
              {description}
            </p>
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary mt-6 inline-flex"
              >
                {whatsappUs}
              </a>
            )}
          </div>

          <form className="grid gap-4 rounded-lg bg-white/5 p-6 backdrop-blur-sm">
            <input
              type="text"
              name="fullName"
              placeholder={formFullName}
              required
              className="rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-[var(--color-gold-sun)]"
            />
            <input
              type="email"
              name="email"
              placeholder={formEmail}
              required
              className="rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-[var(--color-gold-sun)]"
            />
            <input
              type="tel"
              name="phone"
              placeholder={formPhone}
              className="rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-[var(--color-gold-sun)]"
            />
            <textarea
              name="message"
              placeholder={formMessage}
              rows={3}
              className="rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-[var(--color-gold-sun)]"
            />
            {preferredOption && <input type="hidden" name="interest" value={preferredOption} />}
            <label className="flex items-start gap-2 text-xs text-white/50">
              <input type="checkbox" required className="mt-0.5" />
              <span>{formGdpr}</span>
            </label>
            <button type="submit" className="btn btn-primary w-full">
              {formSubmit}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
