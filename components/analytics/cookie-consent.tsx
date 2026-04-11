"use client";

import { useState, useEffect } from "react";
import type { Locale } from "@/lib/i18n";

const CONSENT_KEY = "cookie-consent";

const translations: Record<string, { message: string; accept: string; decline: string; privacy: string }> = {
  en: {
    message: "We use cookies to analyze site traffic and optimize your experience.",
    accept: "Accept",
    decline: "Decline",
    privacy: "Privacy Policy",
  },
  ru: {
    message: "Мы используем cookies для анализа трафика и улучшения вашего опыта.",
    accept: "Принять",
    decline: "Отклонить",
    privacy: "Политика конфиденциальности",
  },
  he: {
    message: "אנו משתמשים בעוגיות כדי לנתח תנועה באתר ולשפר את החוויה שלך.",
    accept: "אישור",
    decline: "דחייה",
    privacy: "מדיניות פרטיות",
  },
  el: {
    message: "Χρησιμοποιούμε cookies για την ανάλυση της επισκεψιμότητας και τη βελτίωση της εμπειρίας σας.",
    accept: "Αποδοχή",
    decline: "Απόρριψη",
    privacy: "Πολιτική Απορρήτου",
  },
};

export function getConsent(): boolean | null {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(CONSENT_KEY);
  if (value === "granted") return true;
  if (value === "denied") return false;
  return null;
}

export function CookieConsent({ locale }: { locale: Locale }) {
  const [visible, setVisible] = useState(false);
  const t = translations[locale] || translations.en;

  useEffect(() => {
    if (getConsent() === null) {
      setVisible(true);
    }
  }, []);

  function handleAccept() {
    localStorage.setItem(CONSENT_KEY, "granted");
    setVisible(false);
    window.dispatchEvent(new Event("storage"));
  }

  function handleDecline() {
    localStorage.setItem(CONSENT_KEY, "denied");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[var(--color-night)] px-4 py-4 sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <p className="text-sm text-white/70 text-center sm:text-left">
          {t.message}{" "}
          <a href={`/${locale}/privacy-policy`} className="underline hover:text-white">
            {t.privacy}
          </a>
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={handleDecline}
            className="rounded-md border border-white/20 px-4 py-2 text-sm text-white/70 transition hover:bg-white/10"
          >
            {t.decline}
          </button>
          <button
            onClick={handleAccept}
            className="rounded-md bg-[var(--color-gold-sun)] px-4 py-2 text-sm font-semibold text-[var(--color-night)] transition hover:brightness-110"
          >
            {t.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
