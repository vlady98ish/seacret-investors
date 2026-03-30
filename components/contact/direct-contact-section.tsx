import { Clock, Mail, MessageCircle, Phone } from "lucide-react";

import type { Locale } from "@/lib/i18n";
import type { SiteSettings } from "@/lib/sanity/types";

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
}

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
}: DirectContactSectionProps) {
  const whatsapp = settings?.whatsappNumber;
  const email = settings?.salesEmail;
  const phone = settings?.salesPhone;
  const officeHours = settings?.officeHours?.[locale] ?? settings?.officeHours?.en;

  if (!whatsapp && !email && !phone) return null;

  const whatsappUrl = whatsapp ? `https://wa.me/${whatsapp.replace(/\D/g, "")}` : undefined;
  const emailUrl = email ? `mailto:${email}` : undefined;
  const phoneUrl = phone ? `tel:${phone.replace(/\s/g, "")}` : undefined;

  return (
    <div className="flex flex-col gap-6">
      {/* Heading */}
      <div>
        {eyebrow && (
          <p className="eyebrow text-[var(--color-deep-teal)] mb-3">
            {eyebrow}
          </p>
        )}
        {title && (
          <h2 className="text-h2 text-[var(--color-night)]">
            {title}
          </h2>
        )}
        {description && (
          <p className="text-body-muted mt-3 max-w-sm">
            {description}
          </p>
        )}
      </div>

      {/* WhatsApp — prominent gold CTA */}
      {whatsappUrl && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary flex items-center gap-3 w-full sm:w-auto"
        >
          <MessageCircle className="w-5 h-5 flex-shrink-0" />
          {labelChatWhatsapp && <span>{labelChatWhatsapp}</span>}
        </a>
      )}

      {/* Contact details */}
      <div className="tile flex flex-col gap-5">
        {/* Email */}
        {emailUrl && (
          <a
            href={emailUrl}
            className="flex items-center gap-4 group transition-opacity hover:opacity-80"
          >
            <div className="w-10 h-10 rounded-full bg-[var(--color-deep-teal)]/10 flex items-center justify-center flex-shrink-0 transition-colors group-hover:bg-[var(--color-deep-teal)]/20">
              <Mail className="w-4 h-4 text-[var(--color-deep-teal)]" />
            </div>
            <div>
              {labelEmail && (
                <p className="text-xs uppercase tracking-widest text-[var(--color-muted)] mb-0.5">
                  {labelEmail}
                </p>
              )}
              <p className="text-sm font-medium text-[var(--color-ink)]">{email}</p>
            </div>
          </a>
        )}

        {emailUrl && phoneUrl && <div className="h-px bg-[var(--color-deep-teal)]/8" />}

        {/* Phone */}
        {phoneUrl && (
          <a
            href={phoneUrl}
            className="flex items-center gap-4 group transition-opacity hover:opacity-80"
          >
            <div className="w-10 h-10 rounded-full bg-[var(--color-deep-teal)]/10 flex items-center justify-center flex-shrink-0 transition-colors group-hover:bg-[var(--color-deep-teal)]/20">
              <Phone className="w-4 h-4 text-[var(--color-deep-teal)]" />
            </div>
            <div>
              {labelPhone && (
                <p className="text-xs uppercase tracking-widest text-[var(--color-muted)] mb-0.5">
                  {labelPhone}
                </p>
              )}
              <p className="text-sm font-medium text-[var(--color-ink)]">{phone}</p>
            </div>
          </a>
        )}

        {/* Office hours */}
        {officeHours && (
          <>
            <div className="h-px bg-[var(--color-deep-teal)]/8" />
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[var(--color-deep-teal)]/10 flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 text-[var(--color-deep-teal)]" />
              </div>
              <div>
                {labelOfficeHours && (
                  <p className="text-xs uppercase tracking-widest text-[var(--color-muted)] mb-0.5">
                    {labelOfficeHours}
                  </p>
                )}
                <p className="text-sm font-medium text-[var(--color-ink)]">{officeHours}</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Response promise */}
      {responsePromise && (
        <div className="flex items-center gap-3 px-1">
          <div className="w-2 h-2 rounded-full bg-[var(--color-gold-sun)] flex-shrink-0" />
          <p className="text-sm text-[var(--color-muted)]">
            {responsePromise}
          </p>
        </div>
      )}
    </div>
  );
}
