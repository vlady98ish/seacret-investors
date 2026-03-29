import { Clock, Mail, MessageCircle, Phone } from "lucide-react";

import type { Locale } from "@/lib/i18n";
import type { SiteSettings } from "@/lib/sanity/types";

interface DirectContactSectionProps {
  locale: Locale;
  settings?: SiteSettings | null;
}

const FALLBACK_WHATSAPP = "972501234567";
const FALLBACK_EMAIL = "info@seacret-residences.com";
const FALLBACK_PHONE = "+972 50 123 4567";
const FALLBACK_OFFICE_HOURS = "Sunday–Thursday, 9:00–18:00";

export function DirectContactSection({ locale, settings }: DirectContactSectionProps) {
  const whatsapp = settings?.whatsappNumber ?? FALLBACK_WHATSAPP;
  const email = settings?.salesEmail ?? FALLBACK_EMAIL;
  const phone = settings?.salesPhone ?? FALLBACK_PHONE;
  const officeHours =
    (settings?.officeHours?.[locale] ?? settings?.officeHours?.en) ?? FALLBACK_OFFICE_HOURS;

  const whatsappUrl = `https://wa.me/${whatsapp.replace(/\D/g, "")}`;
  const emailUrl = `mailto:${email}`;
  const phoneUrl = `tel:${phone.replace(/\s/g, "")}`;

  return (
    <div className="flex flex-col gap-6">
      {/* Heading */}
      <div>
        <p className="eyebrow text-[var(--color-deep-teal)] mb-3">Direct Contact</p>
        <h2 className="text-h2 text-[var(--color-night)]">Speak with our team</h2>
        <p className="text-body-muted mt-3 max-w-sm">
          Prefer a direct conversation? Reach us on WhatsApp, by email, or give us a call.
        </p>
      </div>

      {/* WhatsApp — prominent gold CTA */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-primary flex items-center gap-3 w-full sm:w-auto"
      >
        <MessageCircle className="w-5 h-5 flex-shrink-0" />
        <span>Chat on WhatsApp</span>
      </a>

      {/* Contact details */}
      <div className="tile flex flex-col gap-5">
        {/* Email */}
        <a
          href={emailUrl}
          className="flex items-center gap-4 group transition-opacity hover:opacity-80"
        >
          <div className="w-10 h-10 rounded-full bg-[var(--color-deep-teal)]/10 flex items-center justify-center flex-shrink-0 transition-colors group-hover:bg-[var(--color-deep-teal)]/20">
            <Mail className="w-4 h-4 text-[var(--color-deep-teal)]" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-[var(--color-muted)] mb-0.5">
              Email
            </p>
            <p className="text-sm font-medium text-[var(--color-ink)]">{email}</p>
          </div>
        </a>

        <div className="h-px bg-[var(--color-deep-teal)]/8" />

        {/* Phone */}
        <a
          href={phoneUrl}
          className="flex items-center gap-4 group transition-opacity hover:opacity-80"
        >
          <div className="w-10 h-10 rounded-full bg-[var(--color-deep-teal)]/10 flex items-center justify-center flex-shrink-0 transition-colors group-hover:bg-[var(--color-deep-teal)]/20">
            <Phone className="w-4 h-4 text-[var(--color-deep-teal)]" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-[var(--color-muted)] mb-0.5">
              Phone
            </p>
            <p className="text-sm font-medium text-[var(--color-ink)]">{phone}</p>
          </div>
        </a>

        <div className="h-px bg-[var(--color-deep-teal)]/8" />

        {/* Office hours */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[var(--color-deep-teal)]/10 flex items-center justify-center flex-shrink-0">
            <Clock className="w-4 h-4 text-[var(--color-deep-teal)]" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-[var(--color-muted)] mb-0.5">
              Office Hours
            </p>
            <p className="text-sm font-medium text-[var(--color-ink)]">{officeHours}</p>
          </div>
        </div>
      </div>

      {/* Response promise */}
      <div className="flex items-center gap-3 px-1">
        <div className="w-2 h-2 rounded-full bg-[var(--color-gold-sun)] flex-shrink-0" />
        <p className="text-sm text-[var(--color-muted)]">
          We respond to all inquiries <strong className="text-[var(--color-ink)]">within 24 hours</strong>.
        </p>
      </div>
    </div>
  );
}
