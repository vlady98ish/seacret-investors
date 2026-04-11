"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/cn";

type FloorTabsProps = {
  floors: { label?: string }[];
  activeIndex: number;
  onSelect: (index: number) => void;
};

export function FloorTabs({ floors, activeIndex, onSelect }: FloorTabsProps) {
  if (floors.length <= 1) return null;

  return (
    <div className="flex items-center rounded-lg bg-[var(--color-night)]/40 p-1 backdrop-blur-sm border border-white/[0.06]">
      {floors.map((floor, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(i)}
          className={cn(
            "relative rounded-md px-4 py-1.5 text-xs font-semibold transition-colors",
            i === activeIndex
              ? "text-[var(--color-deep-teal)]"
              : "text-white/40 hover:text-white/70",
          )}
        >
          {i === activeIndex && (
            <motion.div
              layoutId="floor-tab-bg"
              className="absolute inset-0 rounded-md bg-white/90"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">
            {floor.label || `Floor ${i + 1}`}
          </span>
        </button>
      ))}
    </div>
  );
}
