"use client";

import { type FormEvent, useState } from "react";

import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";

type FormDictionary = {
  title: string;
  subtitle: string;
  fullName: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
  submit: string;
  success: string;
  failure: string;
  options: string[];
};

type ContactFormProps = {
  locale: string;
  dict: FormDictionary;
  preferredOption?: string;
};

export function ContactForm({ locale, dict, preferredOption }: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");
  const options = preferredOption && !dict.options.includes(preferredOption)
    ? [preferredOption, ...dict.options]
    : dict.options;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setFeedback("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      locale,
      fullName: String(formData.get("fullName") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      interest: String(formData.get("interest") ?? ""),
      message: String(formData.get("message") ?? ""),
    };

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = (await response.json()) as { ok: boolean; message: string };

    if (result.ok) {
      setStatus("success");
      setFeedback(dict.success);
      trackEvent("form_submit", {
        form_name: "contact",
        page_path: window.location.pathname,
        locale,
      });
      form.reset();
      return;
    }

    setStatus("error");
    setFeedback(dict.failure);
  }

  return (
    <div className="rounded-[2rem] border border-[var(--color-deep-teal)]/12 bg-[rgba(255,250,241,0.88)] p-7 shadow-[var(--shadow-soft)] backdrop-blur-sm sm:p-8">
      <p className="eyebrow text-[var(--color-deep-teal)]">{dict.title}</p>
      <p className="mt-4 max-w-md text-base leading-7 text-[var(--color-muted)]">{dict.subtitle}</p>

      <form
        id="seacret-contact-form"
        onSubmit={handleSubmit}
        className="mt-8 grid gap-4"
      >
        <label className="grid gap-2">
          <span className="text-sm uppercase tracking-[0.22em] text-[var(--color-muted)]">{dict.fullName}</span>
          <input
            type="text"
            name="fullName"
            required
            className="rounded-[1.1rem] border border-[var(--color-deep-teal)]/10 bg-white px-4 py-4 outline-none transition focus:border-[var(--color-deep-teal)]"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm uppercase tracking-[0.22em] text-[var(--color-muted)]">{dict.email}</span>
          <input
            type="email"
            name="email"
            required
            className="rounded-[1.1rem] border border-[var(--color-deep-teal)]/10 bg-white px-4 py-4 outline-none transition focus:border-[var(--color-deep-teal)]"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm uppercase tracking-[0.22em] text-[var(--color-muted)]">{dict.phone}</span>
          <input
            type="tel"
            name="phone"
            required
            className="rounded-[1.1rem] border border-[var(--color-deep-teal)]/10 bg-white px-4 py-4 outline-none transition focus:border-[var(--color-deep-teal)]"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm uppercase tracking-[0.22em] text-[var(--color-muted)]">{dict.interest}</span>
          <select
            name="interest"
            required
            defaultValue={preferredOption ?? ""}
            className="rounded-[1.1rem] border border-[var(--color-deep-teal)]/10 bg-white px-4 py-4 outline-none transition focus:border-[var(--color-deep-teal)]"
          >
            <option value="" disabled>
              Select one
            </option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-sm uppercase tracking-[0.22em] text-[var(--color-muted)]">{dict.message}</span>
          <textarea
            name="message"
            required
            rows={5}
            className="rounded-[1.1rem] border border-[var(--color-deep-teal)]/10 bg-white px-4 py-4 outline-none transition focus:border-[var(--color-deep-teal)]"
          />
        </label>

        <button
          type="submit"
          className="button-primary mt-2 w-full border-0"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Sending..." : dict.submit}
        </button>
      </form>

      <div
        role={status === "error" ? "alert" : "status"}
        aria-live="polite"
        className={cn(
          "mt-4 text-sm",
          status === "success" && "text-[var(--color-deep-teal)]",
          status === "error" && "text-red-600",
          status === "idle" && "sr-only",
        )}
      >
        {feedback}
      </div>
    </div>
  );
}
