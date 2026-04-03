"use client";

import { useState } from "react";
import { z } from "zod";

import { cn } from "@/lib/cn";
import type { Locale } from "@/lib/i18n";
import { useT } from "@/lib/ui-strings-context";
import { captureUTM } from "@/lib/utm";

/* ── Zod schemas ─────────────────────────────────────────── */
const step1Schema = z.object({
  interest: z.string().min(1, "Please select an interest"),
});

const step2Schema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
});

const step3Schema = z.object({
  budget: z.string().optional(),
  timeline: z.string().optional(),
  message: z.string().optional(),
  gdprConsent: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the privacy policy" }),
  }),
});

/* ── Types ───────────────────────────────────────────────── */
interface FormData {
  interest: string;
  fullName: string;
  email: string;
  phone: string;
  budget: string;
  timeline: string;
  message: string;
  gdprConsent: boolean;
}

interface FieldErrors {
  [key: string]: string | undefined;
}

interface MultiStepFormProps {
  locale: Locale;
  villaNames?: string[];
  // CMS / uiStrings overrides
  labelFullName?: string;
  labelEmail?: string;
  labelPhone?: string;
  labelMessage?: string;
  labelSubmit?: string;
  labelSending?: string;
  labelSuccess?: string;
  labelError?: string;
  labelGdpr?: string;
  labelBack?: string;
  labelNext?: string;
  labelGeneralInquiry?: string;
  labelBudgetRange?: string;
  labelTimeline?: string;
  labelStep1?: string;
  labelStep2?: string;
  labelStep3?: string;
  budgetOptions?: string[];
  timelineOptions?: string[];
}

/* ── Progress indicator ──────────────────────────────────── */
function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8" role="group" aria-label={`Step ${current} of ${total}`}>
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          aria-current={i + 1 === current ? "step" : undefined}
          aria-label={`Step ${i + 1}`}
          className={cn(
            "rounded-full transition-all duration-300",
            i + 1 === current
              ? "w-8 h-2.5 bg-[var(--color-gold-sun)]"
              : i + 1 < current
                ? "w-2.5 h-2.5 bg-[var(--color-deep-teal)]"
                : "w-2.5 h-2.5 bg-[var(--color-deep-teal)]/20"
          )}
        />
      ))}
    </div>
  );
}

/* ── Input components ────────────────────────────────────── */
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-sm uppercase tracking-[0.22em] text-[var(--color-muted)]">
      {children}
    </span>
  );
}

function FieldError({ message, id }: { message?: string; id?: string }) {
  if (!message) return null;
  return <span id={id} role="alert" className="text-xs text-red-500 mt-1">{message}</span>;
}

const inputClass =
  "w-full rounded-[1.1rem] border border-[var(--color-deep-teal)]/10 bg-white px-4 py-4 outline-none transition focus:border-[var(--color-deep-teal)] focus:ring-1 focus:ring-[var(--color-deep-teal)]/20";

const selectClass =
  "w-full rounded-[1.1rem] border border-[var(--color-deep-teal)]/10 bg-white px-4 py-4 outline-none transition focus:border-[var(--color-deep-teal)] focus:ring-1 focus:ring-[var(--color-deep-teal)]/20 appearance-none";

/* ── Main component ──────────────────────────────────────── */
export function MultiStepForm({
  locale,
  villaNames,
  labelFullName,
  labelEmail,
  labelPhone,
  labelMessage,
  labelSubmit,
  labelSending,
  labelSuccess,
  labelError,
  labelGdpr,
  labelBack,
  labelNext,
  labelGeneralInquiry,
  labelBudgetRange,
  labelTimeline,
  labelStep1,
  labelStep2,
  labelStep3,
  budgetOptions,
  timelineOptions,
}: MultiStepFormProps) {
  const dict = {
    generalInquiry: labelGeneralInquiry ?? useT("formGeneralInquiry"),
    successTitle: useT("formThankYou"),
    successMessage: labelSuccess ?? useT("formThankYouMessage"),
    stepInterest: labelStep1 ?? useT("formWhatInterested"),
    selectInterest: useT("formChooseVilla"),
    stepDetails: labelStep2 ?? useT("formYourDetails"),
    fullName: labelFullName ?? useT("formFullName"),
    email: labelEmail ?? useT("formEmail"),
    phone: labelPhone ?? useT("formPhone"),
    phonePlaceholder: useT("formPhonePlaceholder"),
    stepAdditional: labelStep3 ?? useT("formAdditionalInfo"),
    budgetRange: labelBudgetRange ?? useT("formBudgetRange"),
    timeline: labelTimeline ?? useT("formTimeline"),
    message: labelMessage ?? useT("formMessage"),
    messagePlaceholder: useT("formMessagePlaceholder"),
    gdprConsent: labelGdpr ?? useT("formGdpr"),
    errorMessage: labelError ?? useT("formError"),
    back: labelBack ?? useT("formBack"),
    next: labelNext ?? useT("formNext"),
    submit: labelSubmit ?? useT("formSubmit"),
    sending: labelSending ?? useT("formSending"),
    step: useT("formStep"),
  };

  const resolvedBudgetOptions = budgetOptions ?? [];
  const resolvedTimelineOptions = timelineOptions ?? [];
  const names = villaNames ?? [];

  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formData, setFormData] = useState<FormData>({
    interest: "",
    fullName: "",
    email: "",
    phone: "",
    budget: "",
    timeline: "",
    message: "",
    gdprConsent: false,
  });

  function update(field: keyof FormData, value: string | boolean) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validateStep1(): boolean {
    const result = step1Schema.safeParse({ interest: formData.interest });
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const key = String(issue.path[0]);
        fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return false;
    }
    return true;
  }

  function validateStep2(): boolean {
    const result = step2Schema.safeParse({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone || undefined,
    });
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const key = String(issue.path[0]);
        fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return false;
    }
    return true;
  }

  function validateStep3(): boolean {
    const result = step3Schema.safeParse({
      budget: formData.budget || undefined,
      timeline: formData.timeline || undefined,
      message: formData.message || undefined,
      gdprConsent: formData.gdprConsent || undefined,
    });
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const key = String(issue.path[0]);
        fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return false;
    }
    return true;
  }

  function handleNext() {
    setErrors({});
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep((s) => s + 1);
  }

  function handleBack() {
    setErrors({});
    setStep((s) => s - 1);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateStep3()) return;

    setStatus("loading");
    const utm = captureUTM();

    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone || undefined,
      interest: formData.interest,
      preferredVilla: formData.interest !== dict.generalInquiry ? formData.interest : undefined,
      budget: formData.budget || undefined,
      message: formData.message || undefined,
      locale,
      source: typeof window !== "undefined" ? window.location.href : undefined,
      gdprConsent: true as const,
      ...utm,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as { ok: boolean; message: string };
      if (json.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  /* ── Success state ─────────────────────────────────────── */
  if (status === "success") {
    return (
      <div className="tile flex flex-col items-center justify-center text-center py-16 gap-6 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-[var(--color-deep-teal)]/10 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-[var(--color-deep-teal)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h3 className="text-h3 text-[var(--color-night)] mb-2">{dict.successTitle}</h3>
          <p className="text-body-muted">{dict.successMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tile flex-1 flex flex-col">
      <StepDots current={step} total={3} />

      <form onSubmit={handleSubmit} noValidate className="flex-1 flex flex-col">
        {/* ── Step 1: Interest ────────────────────────── */}
        {step === 1 && (
          <div className="animate-fade-in">
            <p className="eyebrow text-[var(--color-deep-teal)] mb-2">{dict.step} 1 / 3</p>
            <h2 className="text-h2 text-[var(--color-night)] mb-6">{dict.stepInterest}</h2>
            <p className="text-body-muted text-sm mb-6">{dict.selectInterest}</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3" role="radiogroup" aria-label="Select a villa">
              {[...names, dict.generalInquiry].map((name) => (
                <button
                  key={name}
                  type="button"
                  role="radio"
                  aria-checked={formData.interest === name}
                  onClick={() => update("interest", name)}
                  className={cn(
                    "rounded-[var(--radius-md)] border px-4 py-4 text-sm font-semibold tracking-wide transition-all duration-200 text-center",
                    formData.interest === name
                      ? "border-[var(--color-deep-teal)] bg-[var(--color-deep-teal)] text-white shadow-[var(--shadow-card)]"
                      : "border-[var(--color-deep-teal)]/15 bg-white text-[var(--color-ink)] hover:border-[var(--color-deep-teal)]/40 hover:bg-[var(--color-cream)]"
                  )}
                >
                  {name}
                </button>
              ))}
            </div>

            {errors.interest && (
              <p className="text-xs text-red-500 mt-3">{errors.interest}</p>
            )}
          </div>
        )}

        {/* ── Step 2: Details ─────────────────────────── */}
        {step === 2 && (
          <div className="animate-fade-in grid gap-5">
            <div>
              <p className="eyebrow text-[var(--color-deep-teal)] mb-2">{dict.step} 2 / 3</p>
              <h2 className="text-h2 text-[var(--color-night)] mb-6">{dict.stepDetails}</h2>
            </div>

            <label className="grid gap-2">
              <FieldLabel>{dict.fullName} *</FieldLabel>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                className={cn(inputClass, errors.fullName && "border-red-400")}
                autoComplete="name"
                aria-invalid={!!errors.fullName}
                aria-describedby={errors.fullName ? "error-fullName" : undefined}
              />
              <FieldError message={errors.fullName} id="error-fullName" />
            </label>

            <label className="grid gap-2">
              <FieldLabel>{dict.email} *</FieldLabel>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => update("email", e.target.value)}
                className={cn(inputClass, errors.email && "border-red-400")}
                autoComplete="email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "error-email" : undefined}
              />
              <FieldError message={errors.email} id="error-email" />
            </label>

            <label className="grid gap-2">
              <FieldLabel>{dict.phone}</FieldLabel>
              <input
                type="tel"
                value={formData.phone}
                placeholder={dict.phonePlaceholder}
                onChange={(e) => update("phone", e.target.value)}
                className={inputClass}
                autoComplete="tel"
              />
            </label>
          </div>
        )}

        {/* ── Step 3: Additional info ──────────────────── */}
        {step === 3 && (
          <div className="animate-fade-in grid gap-5">
            <div>
              <p className="eyebrow text-[var(--color-deep-teal)] mb-2">{dict.step} 3 / 3</p>
              <h2 className="text-h2 text-[var(--color-night)] mb-6">{dict.stepAdditional}</h2>
            </div>

            {resolvedBudgetOptions.length > 0 && (
              <label className="grid gap-2">
                <FieldLabel>{dict.budgetRange}</FieldLabel>
                <div className="relative">
                  <select
                    value={formData.budget}
                    onChange={(e) => update("budget", e.target.value)}
                    className={selectClass}
                  >
                    <option value="">— Select —</option>
                    {resolvedBudgetOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <svg
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </label>
            )}

            {resolvedTimelineOptions.length > 0 && (
              <label className="grid gap-2">
                <FieldLabel>{dict.timeline}</FieldLabel>
                <div className="relative">
                  <select
                    value={formData.timeline}
                    onChange={(e) => update("timeline", e.target.value)}
                    className={selectClass}
                  >
                    <option value="">— Select —</option>
                    {resolvedTimelineOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <svg
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </label>
            )}

            <label className="grid gap-2">
              <FieldLabel>{dict.message}</FieldLabel>
              <textarea
                value={formData.message}
                placeholder={dict.messagePlaceholder}
                onChange={(e) => update("message", e.target.value)}
                rows={4}
                className={inputClass}
              />
            </label>

            {/* GDPR consent */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative mt-0.5 flex-shrink-0">
                <input
                  type="checkbox"
                  checked={formData.gdprConsent}
                  onChange={(e) => update("gdprConsent", e.target.checked)}
                  className="sr-only peer"
                  aria-describedby={errors.gdprConsent ? "error-gdprConsent" : undefined}
                />
                <div
                  className={cn(
                    "w-5 h-5 rounded border-2 transition-colors flex items-center justify-center",
                    formData.gdprConsent
                      ? "border-[var(--color-deep-teal)] bg-[var(--color-deep-teal)]"
                      : "border-[var(--color-deep-teal)]/30 bg-white",
                    errors.gdprConsent && "border-red-400"
                  )}
                >
                  {formData.gdprConsent && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm text-[var(--color-muted)] leading-6">
                {dict.gdprConsent}
              </span>
            </label>
            {errors.gdprConsent && (
              <p id="error-gdprConsent" role="alert" className="text-xs text-red-500 -mt-3">{errors.gdprConsent}</p>
            )}

            {status === "error" && (
              <div role="alert" className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">
                {dict.errorMessage}
              </div>
            )}
          </div>
        )}

        {/* ── Navigation ──────────────────────────────── */}
        <div className={cn("flex mt-auto pt-8", step === 1 ? "justify-end" : "justify-between")}>
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="btn btn-outline"
            >
              {dict.back}
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="btn btn-primary"
            >
              {dict.next}
            </button>
          ) : (
            <button
              type="submit"
              disabled={status === "loading"}
              className="btn btn-primary min-w-[10rem]"
            >
              {status === "loading" ? dict.sending : dict.submit}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
