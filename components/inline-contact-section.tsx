"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { useT } from "@/lib/ui-strings-context";

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

type InlineContactSectionProps = {
  locale: Locale;
  preferredOption?: string;
  strings?: InlineContactStrings;
  whatsappUrl?: string;
  viberUrl?: string;
};

export function InlineContactSection({ locale, preferredOption, strings, whatsappUrl, viberUrl }: InlineContactSectionProps) {
  const eyebrow = strings?.eyebrow || useT("miscGetInTouch");
  const title = strings?.title || useT("miscReadyToDiscover");
  const description = strings?.description || useT("miscContactPromise");
  const whatsappUs = strings?.whatsappUs || useT("ctaWhatsappUs");
  const viberUs = strings?.viberUs || useT("ctaViberUs");
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
      setFormStatus(json.ok ? "success" : "error");
    } catch {
      setFormStatus("error");
    }
  }

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
