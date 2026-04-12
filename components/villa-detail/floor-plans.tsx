"use client";

import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/cn";

type FloorPlansProps = {
  images: string[];
  labels?: string[];
  comingSoonText?: string;
  /**
   * Show at least this many tabs when you have fewer images (e.g. ground uploaded, upper still pending).
   * Extra tabs show a “coming soon” placeholder instead of hiding tabs entirely.
   */
  minTabCount?: number;
};

export function FloorPlans({ images, labels, comingSoonText, minTabCount }: FloorPlansProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-md border border-[var(--color-deep-teal)]/10 bg-white/60 py-16 text-[var(--color-muted)]">
        <p>{comingSoonText}</p>
      </div>
    );
  }

  const resolvedLabels = labels ?? [];
  const tabCount =
    minTabCount != null ? Math.max(images.length, minTabCount) : images.length;
  const showTabs = tabCount > 1;

  return (
    <div>
      {showTabs && (
        <div className="mb-6 flex flex-wrap gap-2">
          {Array.from({ length: tabCount }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={cn(
                "btn",
                activeIndex === i ? "btn-primary" : "btn-outline"
              )}
            >
              {resolvedLabels[i] ?? `Floor ${i + 1}`}
            </button>
          ))}
        </div>
      )}

      {/* Active floor plan — cap size so tall/wide renders stay readable */}
      <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-md bg-white/80 shadow-sm">
        <div className="flex max-h-[min(72vh,880px)] min-h-[12rem] items-center justify-center p-2 sm:p-4">
          {activeIndex < images.length ? (
            <Image
              src={images[activeIndex]}
              alt={resolvedLabels[activeIndex] ?? `Floor plan ${activeIndex + 1}`}
              width={1200}
              height={800}
              className="h-auto max-h-[min(72vh,880px)] w-full object-contain"
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority={activeIndex === 0}
            />
          ) : (
            <p className="px-4 py-12 text-center text-sm text-[var(--color-muted)]">
              {comingSoonText ?? "Coming soon"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
