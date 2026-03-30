import type { Locale } from "@/lib/i18n";

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
};

export function InlineContactSection({ locale: _locale, preferredOption, strings }: InlineContactSectionProps) {
  const eyebrow = strings?.eyebrow || "Get in Touch";
  const title = strings?.title || "Ready to discover your Sea\u2019cret?";
  const description = strings?.description || "Schedule a private viewing or request detailed information about our residences. A member of our team will contact you within 24 hours.";
  const whatsappUs = strings?.whatsappUs || "WhatsApp Us";
  const formFullName = strings?.formFullName || "Full Name *";
  const formEmail = strings?.formEmail || "Email *";
  const formPhone = strings?.formPhone || "Phone";
  const formMessage = strings?.formMessage || "Message";
  const formGdpr = strings?.formGdpr || "I agree to the Privacy Policy and consent to being contacted";
  const formSubmit = strings?.formSubmit || "Send Request";

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
            <a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary mt-6 inline-flex"
            >
              {whatsappUs}
            </a>
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
