"use client";

import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/cn";

type FloorPlansProps = {
  images: string[];
  labels?: string[];
  comingSoonText?: string;
};

export function FloorPlans({ images, labels, comingSoonText }: FloorPlansProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-md border border-[var(--color-deep-teal)]/10 bg-white/60 py-16 text-[var(--color-muted)]">
        <p>{comingSoonText}</p>
      </div>
    );
  }

  const resolvedLabels = labels ?? [];

  return (
    <div>
      {/* Tabs — only show if multiple images */}
      {images.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {images.map((_, i) => (
            <button
              key={i}
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

      {/* Active floor plan */}
      <div className="relative w-full overflow-hidden rounded-md bg-white/80 shadow-sm">
        <Image
          src={images[activeIndex]}
          alt={resolvedLabels[activeIndex] ?? `Floor plan ${activeIndex + 1}`}
          width={1200}
          height={800}
          className="h-auto w-full object-contain"
          priority={activeIndex === 0}
        />
      </div>
    </div>
  );
}
