"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type ImageGalleryProps = {
  images: string[];
  villaName: string;
  emptyText?: string;
};

export function ImageGallery({ images, villaName, emptyText }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (images.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-xl bg-[var(--color-stone)] py-20 text-[var(--color-muted)]">
        <p>{emptyText}</p>
      </div>
    );
  }

  const displayImages = images.slice(0, 4);

  const prev = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex - 1 + displayImages.length) % displayImages.length);
  };

  const next = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % displayImages.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") setSelectedIndex(null);
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  };

  return (
    <>
      {/* Gallery grid */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {displayImages.map((src, i) => (
          <button
            key={src}
            onClick={() => setSelectedIndex(i)}
            className={[
              "group relative block w-full overflow-hidden rounded-xl bg-[var(--color-stone)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-deep-teal)]",
              i === 0 ? "aspect-[16/9] sm:col-span-2" : "aspect-[4/3]",
            ].join(" ")}
          >
            <Image
              src={src}
              alt={`${villaName} — photo ${i + 1}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes={i === 0 ? "100vw" : "(max-width: 640px) 100vw, 50vw"}
            />
            <div className="absolute inset-0 bg-[var(--color-night)]/0 transition-colors group-hover:bg-[var(--color-night)]/20" />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            key="lightbox"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSelectedIndex(null)}
            onKeyDown={handleKeyDown}
            tabIndex={-1}
          >
            {/* Close */}
            <button
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              onClick={(e) => { e.stopPropagation(); setSelectedIndex(null); }}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Prev */}
            {displayImages.length > 1 && (
              <button
                className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                onClick={(e) => { e.stopPropagation(); prev(); }}
                aria-label="Previous"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}

            {/* Next */}
            {displayImages.length > 1 && (
              <button
                className="absolute right-16 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                onClick={(e) => { e.stopPropagation(); next(); }}
                aria-label="Next"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            )}

            {/* Image */}
            <motion.div
              key={selectedIndex}
              className="relative max-h-[85dvh] max-w-[90vw]"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={displayImages[selectedIndex]}
                alt={`${villaName} — photo ${selectedIndex + 1}`}
                width={1400}
                height={900}
                className="max-h-[85dvh] w-auto rounded-xl object-contain"
                priority
              />
            </motion.div>

            {/* Counter */}
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/60">
              {selectedIndex + 1} / {displayImages.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
