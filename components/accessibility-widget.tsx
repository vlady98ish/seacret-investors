"use client";

import * as Dialog from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Accessibility, X, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { cn } from "@/lib/cn";
import type { Locale } from "@/lib/i18n";

/* ── Translations ──────────────────────────────────────────── */
const translations: Record<Locale, {
  title: string;
  reset: string;
  largeText: string;
  highContrast: string;
  noAnimations: string;
  highlightLinks: string;
  largeCursor: string;
}> = {
  en: {
    title: "Accessibility",
    reset: "Reset all",
    largeText: "Large text",
    highContrast: "High contrast",
    noAnimations: "Stop animations",
    highlightLinks: "Highlight links",
    largeCursor: "Large cursor",
  },
  he: {
    title: "נגישות",
    reset: "איפוס הכל",
    largeText: "טקסט גדול",
    highContrast: "ניגודיות גבוהה",
    noAnimations: "עצור אנימציות",
    highlightLinks: "הדגש קישורים",
    largeCursor: "סמן גדול",
  },
  ru: {
    title: "Доступность",
    reset: "Сбросить всё",
    largeText: "Крупный текст",
    highContrast: "Высокий контраст",
    noAnimations: "Без анимаций",
    highlightLinks: "Выделить ссылки",
    largeCursor: "Большой курсор",
  },
  el: {
    title: "Προσβασιμότητα",
    reset: "Επαναφορά όλων",
    largeText: "Μεγάλο κείμενο",
    highContrast: "Υψηλή αντίθεση",
    noAnimations: "Χωρίς κινήσεις",
    highlightLinks: "Επισήμανση συνδέσμων",
    largeCursor: "Μεγάλος δρομέας",
  },
};

/* ── Settings ──────────────────────────────────────────────── */
type SettingKey = "largeText" | "highContrast" | "noAnimations" | "highlightLinks" | "largeCursor";

type Settings = Record<SettingKey, boolean>;

const STORAGE_KEY = "a11y-settings";

const CLASS_MAP: Record<SettingKey, string> = {
  largeText: "a11y-large-text",
  highContrast: "a11y-high-contrast",
  noAnimations: "a11y-no-animations",
  highlightLinks: "a11y-highlight-links",
  largeCursor: "a11y-large-cursor",
};

const defaultSettings: Settings = {
  largeText: false,
  highContrast: false,
  noAnimations: false,
  highlightLinks: false,
  largeCursor: false,
};

function loadSettings(): Settings {
  if (typeof window === "undefined") return defaultSettings;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSettings;
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    return defaultSettings;
  }
}

function saveSettings(settings: Settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // localStorage unavailable
  }
}

function applyClasses(settings: Settings) {
  const root = document.documentElement;
  for (const [key, cls] of Object.entries(CLASS_MAP)) {
    if (settings[key as SettingKey]) {
      root.classList.add(cls);
    } else {
      root.classList.remove(cls);
    }
  }
}

/* ── Toggle component ──────────────────────────────────────── */
function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-[var(--color-deep-teal)]/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-deep-teal)]"
    >
      <span>{label}</span>
      <span
        className={cn(
          "relative inline-flex h-6 w-11 flex-shrink-0 rounded-full transition-colors duration-200",
          checked ? "bg-[var(--color-deep-teal)]" : "bg-[var(--color-muted)]/30"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200",
            checked ? "translate-x-5" : "translate-x-0.5"
          )}
        />
      </span>
    </button>
  );
}

/* ── Widget ────────────────────────────────────────────────── */
type AccessibilityWidgetProps = {
  locale: Locale;
};

export function AccessibilityWidget({ locale }: AccessibilityWidgetProps) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [mounted, setMounted] = useState(false);
  const t = translations[locale] || translations.en;

  useEffect(() => {
    const loaded = loadSettings();
    setSettings(loaded);
    applyClasses(loaded);
    setMounted(true);
  }, []);

  const updateSetting = useCallback((key: SettingKey, value: boolean) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      saveSettings(next);
      applyClasses(next);
      return next;
    });
  }, []);

  const resetAll = useCallback(() => {
    setSettings(defaultSettings);
    saveSettings(defaultSettings);
    applyClasses(defaultSettings);
  }, []);

  const hasAnyActive = Object.values(settings).some(Boolean);

  if (!mounted) return null;

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          className={cn(
            "fixed bottom-6 z-40 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all hover:scale-110",
            "bg-[var(--color-deep-teal)] text-white",
            "ltr:left-6 rtl:right-6",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold-sun)]"
          )}
          aria-label={t.title}
        >
          <Accessibility className="h-6 w-6" />
          {hasAnyActive && (
            <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-[var(--color-gold-sun)] ring-2 ring-white" />
          )}
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />

        <Dialog.Content className="fixed bottom-24 z-50 w-[calc(100vw-2rem)] max-w-xs rounded-2xl border border-[var(--color-deep-teal)]/10 bg-[var(--color-cream)] p-5 shadow-2xl ltr:left-4 rtl:right-4 sm:ltr:left-6 sm:rtl:right-6 focus-visible:outline-none">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-base font-semibold text-[var(--color-ink)]">
              {t.title}
            </Dialog.Title>
            <div className="flex items-center gap-1">
              {hasAnyActive && (
                <button
                  onClick={resetAll}
                  className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-[var(--color-muted)] transition hover:text-[var(--color-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-deep-teal)]"
                  aria-label={t.reset}
                >
                  <RotateCcw className="h-3 w-3" />
                  {t.reset}
                </button>
              )}
              <Dialog.Close asChild>
                <button
                  className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--color-muted)] transition hover:text-[var(--color-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-deep-teal)]"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </Dialog.Close>
            </div>
          </div>

          <VisuallyHidden.Root>
            <Dialog.Description>Adjust accessibility settings for this website</Dialog.Description>
          </VisuallyHidden.Root>

          <div className="grid divide-y divide-[var(--color-stone)]">
            <Toggle checked={settings.largeText} onChange={(v) => updateSetting("largeText", v)} label={t.largeText} />
            <Toggle checked={settings.highContrast} onChange={(v) => updateSetting("highContrast", v)} label={t.highContrast} />
            <Toggle checked={settings.noAnimations} onChange={(v) => updateSetting("noAnimations", v)} label={t.noAnimations} />
            <Toggle checked={settings.highlightLinks} onChange={(v) => updateSetting("highlightLinks", v)} label={t.highlightLinks} />
            <Toggle checked={settings.largeCursor} onChange={(v) => updateSetting("largeCursor", v)} label={t.largeCursor} />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
