"use client";

import * as Dialog from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { MessageCircle, X } from "lucide-react";

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
  return (
    <Dialog.Root>
      {/* Floating button */}
      <Dialog.Trigger asChild>
        <button
          className={cn(
            "fixed bottom-6 z-40 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all hover:scale-110",
            "bg-[var(--color-gold-sun)] text-[var(--color-night)]",
            "ltr:right-6 rtl:left-6"
          )}
          aria-label="Request information"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        {/* Backdrop */}
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />

        {/* Drawer */}
        <Dialog.Content
          className={cn(
            "fixed top-0 z-50 h-full w-full max-w-md overflow-y-auto bg-[var(--color-cream)] p-6 shadow-2xl",
            "ltr:right-0 rtl:left-0"
          )}
        >
          <div className="flex items-center justify-between">
            <Dialog.Title className="eyebrow">{labelTitle}</Dialog.Title>
            <Dialog.Close asChild>
              <button
                className="flex h-10 w-10 items-center justify-center rounded-md text-[var(--color-muted)] transition hover:text-[var(--color-ink)]"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>

          <VisuallyHidden.Root>
            <Dialog.Description>Quick contact form to request information</Dialog.Description>
          </VisuallyHidden.Root>

          <form
            className="mt-6 grid gap-4"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <label className="grid gap-1.5">
              <span className="sr-only">{labelFullName}</span>
              <input
                type="text"
                name="fullName"
                placeholder={labelFullName ? `${labelFullName} *` : ""}
                required
                autoComplete="name"
                className="rounded-md border border-[var(--color-deep-teal)]/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-deep-teal)]"
              />
            </label>
            <label className="grid gap-1.5">
              <span className="sr-only">{labelEmail}</span>
              <input
                type="email"
                name="email"
                placeholder={labelEmail ? `${labelEmail} *` : ""}
                required
                autoComplete="email"
                className="rounded-md border border-[var(--color-deep-teal)]/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-deep-teal)]"
              />
            </label>
            <label className="grid gap-1.5">
              <span className="sr-only">{labelPhone}</span>
              <input
                type="tel"
                name="phone"
                placeholder={labelPhone}
                autoComplete="tel"
                className="rounded-md border border-[var(--color-deep-teal)]/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-deep-teal)]"
              />
            </label>
            {context && <input type="hidden" name="interest" value={context} />}
            <button type="submit" className="btn btn-primary mt-2 w-full">
              {labelSubmit}
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
