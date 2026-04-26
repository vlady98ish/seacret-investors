"use client";

import { useState } from "react";
import { Car, Palmtree, Settings2, Sofa, UtensilsCrossed } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { getLocalizedValue, type Locale } from "@/lib/i18n";
import type { SpecCategory } from "@/lib/sanity/types";

type WhatsIncludedProps = {
  categories: SpecCategory[];
  locale: Locale;
  labelEyebrow?: string;
  labelTitle?: string;
  labelSubtitle?: string;
};

const ICON_MAP: Record<string, LucideIcon> = {
  sofa: Sofa,
  "utensils-crossed": UtensilsCrossed,
  palmtree: Palmtree,
  car: Car,
  "settings-2": Settings2,
};

export function WhatsIncluded({
  categories,
  locale,
  labelEyebrow,
  labelTitle,
  labelSubtitle,
}: WhatsIncludedProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!categories.length) return null;

  const active = categories[activeIndex];
  const activeName = getLocalizedValue(active.name, locale) ?? "";

  return (
    <section className="bg-[var(--color-cream)] py-20 lg:py-28 relative">
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(26,107,110,0.15), transparent)",
        }}
      />
      <div className="section-shell">
        <p className="eyebrow">
          {labelEyebrow || "Product Specification"}
        </p>
        <h2 className="text-h2 mt-3">{labelTitle || "What's Included"}</h2>
        {labelSubtitle && (
          <p className="text-body-muted mt-2 max-w-[45ch]">{labelSubtitle}</p>
        )}

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-[280px_1fr] md:gap-12">
          {/* Left nav */}
          <nav className="flex gap-2 overflow-x-auto md:flex-col md:gap-1.5">
            {categories.map((cat, i) => {
              const Icon = ICON_MAP[cat.icon] ?? Settings2;
              const name = getLocalizedValue(cat.name, locale) ?? "";
              const isActive = i === activeIndex;

              return (
                <button
                  key={cat._id}
                  onClick={() => setActiveIndex(i)}
                  className={`flex items-center gap-4 rounded-lg border px-4 py-3.5 text-left transition-all duration-200 md:w-full ${
                    isActive
                      ? "border-[rgba(13,103,119,0.08)] bg-[rgba(255,250,241,0.95)] shadow-[var(--shadow-soft)]"
                      : "border-transparent bg-transparent hover:bg-[rgba(255,250,241,0.6)]"
                  }`}
                >
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors duration-200 ${
                      isActive
                        ? "bg-[var(--color-deep-teal)] text-white"
                        : "bg-[rgba(26,107,110,0.08)] text-[var(--color-deep-teal)]"
                    }`}
                  >
                    <Icon className="h-[22px] w-[22px]" strokeWidth={1.5} />
                  </span>
                  <span className="hidden md:block">
                    <span className="block text-[0.95rem] font-semibold text-[var(--color-ink)]">
                      {name}
                    </span>
                    <span className="block text-xs text-[var(--color-muted)]">
                      {cat.items?.length ?? 0} items
                    </span>
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Right content */}
          <div key={active._id} className="animate-fade-in">
            <h3 className="text-h3 mb-6 border-b-2 border-[rgba(26,107,110,0.1)] pb-4">
              {activeName}
            </h3>
            <div className="flex flex-col">
              {(active.items ?? []).map((item, j) => {
                const area = getLocalizedValue(item.area, locale) ?? "";
                const spec = getLocalizedValue(item.spec, locale) ?? "";
                const notes = getLocalizedValue(item.notes, locale) ?? "";

                return (
                  <div
                    key={j}
                    className="grid grid-cols-[1fr_1.4fr] gap-8 border-b border-[rgba(13,103,119,0.05)] py-3.5 last:border-b-0"
                  >
                    <div className="flex items-baseline gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-deep-teal)] opacity-50" />
                      <span className="text-[0.95rem] font-semibold text-[var(--color-ink)]">
                        {area}
                      </span>
                    </div>
                    <div>
                      <p className="text-[0.95rem] text-[var(--color-ink)]">
                        {spec}
                      </p>
                      {notes && (
                        <p className="mt-0.5 text-[0.8rem] italic text-[var(--color-muted)]">
                          {notes}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
