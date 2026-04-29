"use client";

import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { MessageCircle, X } from "lucide-react";

import { trackEvent } from "@/lib/analytics";
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
  autoOpenDelayMs?: number;
};

export function StickyCTA({
  locale,
  context,
  labelTitle,
  labelFullName,
  labelEmail,
  labelPhone,
  labelSubmit,
  autoOpenDelayMs = 10000,
}: StickyCTAProps) {
  const [open, setOpen] = useState(false);
  const [showNudge, setShowNudge] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const nudgeCopy = {
    en: { title: "Need details?", cta: "Open form", close: "Dismiss" },
    ru: { title: "Нужны детали?", cta: "Открыть форму", close: "Закрыть" },
    he: { title: "צריכים פרטים?", cta: "פתחו טופס", close: "סגירה" },
    el: { title: "Θέλετε λεπτομέρειες;", cta: "Άνοιγμα φόρμας", close: "Κλείσιμο" },
  }[locale] ?? { title: "Need details?", cta: "Open form", close: "Dismiss" };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const timer = window.setTimeout(() => {
      setShowNudge(true);
      trackEvent("sticky_cta_auto_open", {
        page_path: window.location.pathname,
        delay_ms: autoOpenDelayMs,
      });
    }, autoOpenDelayMs);

    return () => window.clearTimeout(timer);
  }, [autoOpenDelayMs]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fd.get("fullName"),
          email: fd.get("email"),
          phone: fd.get("phone") || undefined,
          interest: context || "Quick Inquiry",
          locale,
          source: typeof window !== "undefined" ? window.location.href : undefined,
          gdprConsent: true,
        }),
      });
      const json = (await res.json()) as { ok: boolean };
      if (json.ok) {
        trackEvent("form_submit", {
          form_name: "sticky_cta",
          page_path: window.location.pathname,
          locale,
        });
      }
      setStatus(json.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (nextOpen) {
          setShowNudge(false);
          setStatus((prev) => (prev === "success" ? "success" : "idle"));
          trackEvent("sticky_cta_open", { page_path: window.location.pathname });
        }
      }}
    >
      {showNudge && !open && (
        <div
          className={cn(
            "fixed bottom-24 z-40 w-[300px] rounded-2xl border border-[var(--color-gold-sun)]/40 bg-[linear-gradient(155deg,rgba(255,255,255,0.96)_0%,rgba(249,243,227,0.94)_55%,rgba(236,248,248,0.92)_100%)] p-4 shadow-[0_20px_50px_rgba(7,18,30,0.24)] backdrop-blur-md",
            "animate-[ctaNudgeIn_560ms_cubic-bezier(0.22,1,0.36,1)]",
            "ltr:right-6 rtl:left-6",
          )}
        >
          <span
            aria-hidden
            className={cn(
              "absolute -bottom-2 block h-4 w-4 rotate-45 border-b border-r border-[var(--color-gold-sun)]/40 bg-[linear-gradient(160deg,rgba(255,255,255,0.96)_0%,rgba(246,238,214,0.94)_100%)]",
              "ltr:right-7 rtl:left-7",
            )}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_80%_0%,rgba(232,163,64,0.18)_0%,rgba(232,163,64,0)_38%)]"
          />
          <div className="mb-2 flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-gold-sun)] text-[var(--color-night)] shadow-[0_6px_16px_rgba(232,163,64,0.35)]">
              <MessageCircle className="h-4 w-4" />
            </div>
            <p className="flex-1 pt-0.5 text-sm font-semibold leading-snug text-[var(--color-ink)]">
              {nudgeCopy.title}
            </p>
            <button
              type="button"
              onClick={() => {
                setShowNudge(false);
              }}
              aria-label={nudgeCopy.close}
              className="mt-0.5 rounded-md p-1 text-[var(--color-muted)] transition hover:bg-[var(--color-deep-teal)]/6 hover:text-[var(--color-ink)]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <button
            type="button"
            className="group relative w-full overflow-hidden rounded-xl border border-[var(--color-deep-teal)]/18 bg-white px-3 py-2.5 text-sm font-semibold text-[var(--color-deep-teal)] shadow-[0_6px_18px_rgba(13,103,119,0.08)] transition duration-300 hover:-translate-y-0.5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-deep-teal)]/35"
            onClick={() => {
              setShowNudge(false);
              setOpen(true);
            }}
          >
            <span
              aria-hidden
              className="absolute inset-0 -translate-x-full bg-[linear-gradient(90deg,var(--color-deep-teal)_0%,#118499_100%)] transition-transform duration-300 group-hover:translate-x-0"
            />
            <span className="relative">{nudgeCopy.cta}</span>
          </button>
        </div>
      )}

      {/* Floating button */}
      <Dialog.Trigger asChild>
        <button
          className={cn(
            "fixed bottom-6 z-40 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all hover:scale-110",
            "bg-[var(--color-gold-sun)] text-[var(--color-night)]",
            "ltr:right-6 rtl:left-6",
            showNudge && !open && "ring-4 ring-[var(--color-gold-sun)]/35"
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

          {status === "success" ? (
            <div className="flex flex-col items-center justify-center text-center py-16 gap-4">
              <div className="w-12 h-12 rounded-full bg-[var(--color-deep-teal)]/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-[var(--color-deep-teal)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm text-[var(--color-muted)]">Thank you! We&apos;ll be in touch soon.</p>
            </div>
          ) : (
            <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
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
              <button type="submit" className="btn btn-primary mt-2 w-full" disabled={status === "loading"}>
                {status === "loading" ? "Sending..." : labelSubmit}
              </button>
            </form>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
