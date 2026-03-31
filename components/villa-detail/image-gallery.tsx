"use client";

import { AnimatePresence, motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Fade from "embla-carousel-fade";
import { X, ChevronLeft, ChevronRight, Expand } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

type ImageGalleryProps = {
  images: string[];
  villaName: string;
  emptyText?: string;
};

export function ImageGallery({
  images,
  villaName,
  emptyText,
}: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const [mainRef, mainApi] = useEmblaCarousel({ loop: true }, [Fade()]);

  const count = images.length;

  const scrollTo = useCallback(
    (index: number) => {
      mainApi?.scrollTo(index);
    },
    [mainApi],
  );

  const scrollPrev = useCallback(() => mainApi?.scrollPrev(), [mainApi]);
  const scrollNext = useCallback(() => mainApi?.scrollNext(), [mainApi]);

  const onSelect = useCallback(() => {
    if (!mainApi) return;
    setSelectedIndex(mainApi.selectedScrollSnap());
  }, [mainApi]);

  useEffect(() => {
    if (!mainApi) return;
    onSelect();
    mainApi.on("select", onSelect);
    mainApi.on("reInit", onSelect);
    return () => {
      mainApi.off("select", onSelect);
      mainApi.off("reInit", onSelect);
    };
  }, [mainApi, onSelect]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") scrollPrev();
      if (e.key === "ArrowRight") scrollNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, scrollPrev, scrollNext]);

  if (count === 0) {
    return (
      <div className="flex items-center justify-center rounded-2xl bg-[var(--color-stone)] py-24 text-[var(--color-muted)]">
        <p className="text-sm tracking-wide">{emptyText}</p>
      </div>
    );
  }

  return (
    <>
      <div className="group/gallery relative">
        {/* ── Main carousel ── */}
        <div className="relative overflow-hidden rounded-2xl bg-[var(--color-night)]">
          <div ref={mainRef} className="overflow-hidden">
            <div className="flex">
              {images.map((src, i) => (
                <div
                  key={src}
                  className="relative aspect-[2/1] w-full shrink-0 sm:aspect-[21/9]"
                >
                  <Image
                    src={src}
                    alt={`${villaName} — photo ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="100vw"
                    priority={i === 0}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Cinematic gradient overlays */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-[var(--color-night)]/50 via-transparent to-[var(--color-night)]/10" />
          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-[var(--color-night)]/15 via-transparent to-[var(--color-night)]/15" />

          {/* Navigation arrows — visible on hover */}
          {count > 1 && (
            <>
              <button
                className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[var(--color-night)]/30 text-white backdrop-blur-md transition-all duration-300 hover:border-white/30 hover:bg-[var(--color-night)]/50 sm:left-5 sm:opacity-0 sm:group-hover/gallery:opacity-100"
                onClick={scrollPrev}
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
              </button>
              <button
                className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[var(--color-night)]/30 text-white backdrop-blur-md transition-all duration-300 hover:border-white/30 hover:bg-[var(--color-night)]/50 sm:right-5 sm:opacity-0 sm:group-hover/gallery:opacity-100"
                onClick={scrollNext}
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </>
          )}

          {/* Bottom bar */}
          <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between px-5 pb-4 sm:px-8 sm:pb-6">
            {/* Dot indicators */}
            {count > 1 && (
              <div className="flex items-center gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => scrollTo(i)}
                    className={[
                      "h-1.5 rounded-full transition-all duration-300",
                      i === selectedIndex
                        ? "w-6 bg-white"
                        : "w-1.5 bg-white/40 hover:bg-white/70",
                    ].join(" ")}
                    aria-label={`Go to photo ${i + 1}`}
                  />
                ))}
              </div>
            )}

            <button
              onClick={() => setLightboxOpen(true)}
              className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium tracking-wide text-white backdrop-blur-md transition-all hover:border-white/40 hover:bg-white/20"
              aria-label="View full screen"
            >
              <Expand className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Full screen</span>
            </button>
          </div>
        </div>

      </div>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            key="lightbox"
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-[var(--color-night)]/95 backdrop-blur-sm"
              onClick={() => setLightboxOpen(false)}
            />

            {/* Close */}
            <button
              className="absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white/70 transition-all hover:border-white/30 hover:text-white"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close gallery"
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>

            {/* Navigation */}
            {count > 1 && (
              <>
                <button
                  className="absolute left-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 text-white/70 transition-all hover:border-white/30 hover:text-white sm:left-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    scrollPrev();
                  }}
                  aria-label="Previous"
                >
                  <ChevronLeft className="h-6 w-6" strokeWidth={1.5} />
                </button>
                <button
                  className="absolute right-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 text-white/70 transition-all hover:border-white/30 hover:text-white sm:right-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    scrollNext();
                  }}
                  aria-label="Next"
                >
                  <ChevronRight className="h-6 w-6" strokeWidth={1.5} />
                </button>
              </>
            )}

            {/* Image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedIndex}
                className="relative z-10 h-[80dvh] w-[88vw]"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={images[selectedIndex]}
                  alt={`${villaName} — photo ${selectedIndex + 1}`}
                  fill
                  className="rounded-xl object-contain"
                  sizes="88vw"
                  priority
                />
              </motion.div>
            </AnimatePresence>

            {/* Bottom indicator */}
            {count > 1 && (
              <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-4">
                <span className="text-sm font-light tabular-nums tracking-[0.2em] text-white/60">
                  {String(selectedIndex + 1).padStart(2, "0")}
                  <span className="mx-2 text-white/30">/</span>
                  {String(count).padStart(2, "0")}
                </span>

                <div className="flex gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={(e) => {
                        e.stopPropagation();
                        scrollTo(i);
                      }}
                      className={[
                        "h-1.5 rounded-full transition-all duration-300",
                        i === selectedIndex
                          ? "w-6 bg-white"
                          : "w-1.5 bg-white/30 hover:bg-white/60",
                      ].join(" ")}
                      aria-label={`Go to photo ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
