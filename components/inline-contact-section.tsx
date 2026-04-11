"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/analytics";
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

export function InlineContactSection({ locale, preferredOption, strings, whatsappUrl }: InlineContactSectionProps) {
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
      if (json.ok) {
        trackEvent("form_submit", {
          form_name: "inline_contact",
          page_path: window.location.pathname,
          locale,
        });
      }
      setFormStatus(json.ok ? "success" : "error");
    } catch {
      setFormStatus("error");
    }
  }

  return (
    <section className="bg-[var(--color-night)] py-16 sm:py-20 lg:py-24">
      <div className="section-shell">
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
                className="btn btn-secondary mt-6 inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {whatsappUs}
              </a>
            )}
          </div>

          {formStatus === "success" ? (
            <div className="flex flex-col items-center justify-center text-center py-12 gap-4 rounded-lg bg-white/5 p-6 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-[var(--color-gold-sun)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm text-white/60">Thank you! We&apos;ll be in touch soon.</p>
            </div>
          ) : (
            <form className="grid gap-4 rounded-lg bg-white/5 p-6 backdrop-blur-sm" onSubmit={handleSubmit}>
              <label className="grid gap-1.5">
                <span className="text-xs font-medium text-white/60">{formFullName}</span>
                <input
                  type="text"
                  name="fullName"
                  required
                  className="rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-[var(--color-gold-sun)] focus:ring-1 focus:ring-[var(--color-gold-sun)]/30"
                />
              </label>
              <label className="grid gap-1.5">
                <span className="text-xs font-medium text-white/60">{formEmail}</span>
                <input
                  type="email"
                  name="email"
                  required
                  className="rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-[var(--color-gold-sun)] focus:ring-1 focus:ring-[var(--color-gold-sun)]/30"
                />
              </label>
              <label className="grid gap-1.5">
                <span className="text-xs font-medium text-white/60">{formPhone}</span>
                <input
                  type="tel"
                  name="phone"
                  className="rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-[var(--color-gold-sun)] focus:ring-1 focus:ring-[var(--color-gold-sun)]/30"
                />
              </label>
              <label className="grid gap-1.5">
                <span className="text-xs font-medium text-white/60">{formMessage}</span>
                <textarea
                  name="message"
                  rows={3}
                  className="rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-[var(--color-gold-sun)] focus:ring-1 focus:ring-[var(--color-gold-sun)]/30"
                />
              </label>
              {preferredOption && <input type="hidden" name="interest" value={preferredOption} />}
              <label className="flex items-start gap-2 text-xs text-white/50">
                <input type="checkbox" required className="mt-0.5" />
                <span>{formGdpr}</span>
              </label>
              <button type="submit" className="btn btn-primary w-full" disabled={formStatus === "loading"}>
                {formStatus === "loading" ? "Sending..." : formSubmit}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
