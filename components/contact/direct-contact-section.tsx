import { Clock, Mail, Phone } from "lucide-react";

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
  labelChatWhatsapp?: string;
  labelViber?: string;
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
  labelChatWhatsapp,
  labelViber,
}: DirectContactSectionProps) {
  const whatsapp = settings?.whatsappNumber;
  const viber = settings?.viberNumber;
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

      {/* WhatsApp CTA */}
      {whatsappUrl && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary flex items-center gap-3 w-full sm:w-auto"
          style={{ backgroundColor: "#25D366", borderColor: "#25D366" }}
        >
          <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          <span>{labelChatWhatsapp || "WhatsApp"}</span>
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

        {/* Viber */}
        {viber && phone && (
          <>
            {(emailUrl || phoneUrl) && <div className="h-px bg-[var(--color-deep-teal)]/8" />}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#7360F2]/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-[#7360F2]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.398.002C9.473.028 5.331.344 3.014 2.467 1.294 4.177.518 6.77.375 9.999c-.143 3.229-.332 9.29 5.735 10.89l.009.003h.013l-.006 2.488s-.041.988.621 1.189c.799.244 1.27-.514 2.034-1.328.42-.447.999-1.103 1.436-1.603 3.963.333 7.005-.428 7.352-.539.8-.256 5.327-.84 6.063-6.853.761-6.2-.37-10.114-2.436-11.885l-.002-.001C19.86.727 16.247-.038 11.398.002zm.432 2.09c4.273-.036 7.438.536 8.79 1.673 1.67 1.429 2.681 4.874 2.019 10.262-.579 4.736-3.927 5.316-4.594 5.53-.286.092-2.93.735-6.296.52 0 0-2.493 3.004-3.272 3.792-.121.124-.267.177-.363.152-.134-.036-.171-.195-.168-.431l.024-4.119c-.003 0-.004-.001-.006-.001-5.07-1.335-4.762-6.453-4.643-9.26.118-2.808.768-5.029 2.196-6.443 1.905-1.736 5.088-1.67 6.313-1.675z" />
                </svg>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-[var(--color-muted)] mb-0.5">
                  {labelViber || "Viber"}
                </p>
                <p className="text-sm font-medium text-[var(--color-ink)]">{phone}</p>
              </div>
            </div>
          </>
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

    </div>
  );
}
