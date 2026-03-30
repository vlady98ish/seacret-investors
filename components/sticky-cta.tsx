"use client";

import { MessageCircle, X } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/cn";
import type { Locale } from "@/lib/i18n";

type StickyCTAProps = {
  locale: Locale;
  context?: string;
  labelTitle?: string;
  labelFullName?: string;
  labelEmail?: string;
  labelPhone?: string;
  labelSubmit?: string;
};

export function StickyCTA({ locale: _locale, context, labelTitle, labelFullName, labelEmail, labelPhone, labelSubmit }: StickyCTAProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "fixed bottom-6 z-40 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all hover:scale-110",
          "bg-[var(--color-gold-sun)] text-[var(--color-night)]",
          "ltr:right-6 rtl:left-6",
          open && "pointer-events-none opacity-0"
        )}
        aria-label="Request information"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 z-50 h-full w-full max-w-md overflow-y-auto bg-[var(--color-cream)] p-6 shadow-2xl transition-transform duration-300",
          "ltr:right-0 rtl:left-0",
          open ? "translate-x-0" : "ltr:translate-x-full rtl:-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between">
          <p className="eyebrow">{labelTitle || "Request Information"}</p>
          <button
            onClick={() => setOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-md text-[var(--color-muted)] transition hover:text-[var(--color-ink)]"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          className="mt-6 grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            setOpen(false);
          }}
        >
          <input
            type="text"
            name="fullName"
            placeholder={`${labelFullName || "Full Name"} *`}
            required
            className="rounded-md border border-[var(--color-deep-teal)]/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-deep-teal)]"
          />
          <input
            type="email"
            name="email"
            placeholder={`${labelEmail || "Email"} *`}
            required
            className="rounded-md border border-[var(--color-deep-teal)]/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-deep-teal)]"
          />
          <input
            type="tel"
            name="phone"
            placeholder={labelPhone || "Phone"}
            className="rounded-md border border-[var(--color-deep-teal)]/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-deep-teal)]"
          />
          {context && <input type="hidden" name="interest" value={context} />}
          <button type="submit" className="btn btn-primary mt-2 w-full">
            {labelSubmit || "Send Request"}
          </button>
        </form>
      </div>
    </>
  );
}
