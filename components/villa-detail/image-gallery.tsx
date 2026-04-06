"use client";

import * as Dialog from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { AnimatePresence, motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Fade from "embla-carousel-fade";
import { X, ChevronLeft, ChevronRight, Expand } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type ImageGalleryProps = {
  images: string[];
  villaName: string;
  emptyText?: string;
  /** Softer layout for homepage masterplan (16∶9, larger radius). */
  variant?: "default" | "masterplan";
};

export function ImageGallery({
  images,
  villaName,
  emptyText,
  variant = "default",
}: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const liveRef = useRef<HTMLDivElement>(null);

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
    const idx = mainApi.selectedScrollSnap();
    setSelectedIndex(idx);
    if (liveRef.current) {
      liveRef.current.textContent = `Photo ${idx + 1} of ${count}`;
    }
  }, [mainApi, count]);

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

  const radius = variant === "masterplan" ? "rounded-xl" : "rounded-xl";
  const slideAspect =
    variant === "masterplan"
      ? "relative aspect-[16/9] w-full shrink-0"
      : "relative aspect-[2/1] w-full shrink-0 sm:aspect-[21/9]";
  const bottomGradient =
    variant === "masterplan"
      ? "from-[var(--color-night)]/35 via-transparent"
      : "from-[var(--color-night)]/50 via-transparent";

  return (
    <>
      <div
        className="group/gallery relative"
        role="region"
        aria-label={`Photo gallery, ${villaName}`}
        aria-roledescription="carousel"
      >
        {/* Live region for slide announcements */}
        <div ref={liveRef} aria-live="polite" aria-atomic="true" className="sr-only" />

        {/* ── Main carousel ── */}
        <div className={`relative overflow-hidden ${radius} bg-[var(--color-night)] shadow-[var(--shadow-card)]`}>
          <div ref={mainRef} className="overflow-hidden">
            <div className="flex">
              {images.map((src, i) => (
                <div
                  key={`${src}-${i}`}
                  className={slideAspect}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`Photo ${i + 1} of ${count}`}
                  aria-hidden={i !== selectedIndex}
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

          {/* Bottom weight for dots + full screen (lighter on masterplan for cream section) */}
          <div className={`pointer-events-none absolute inset-0 ${radius} bg-gradient-to-t ${bottomGradient} to-[var(--color-night)]/10`} aria-hidden="true" />
          <div className={`pointer-events-none absolute inset-0 ${radius} bg-gradient-to-r from-[var(--color-night)]/15 via-transparent to-[var(--color-night)]/15`} aria-hidden="true" />

          {/* Navigation arrows */}
          {count > 1 && (
            <>
              <button
                className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[var(--color-night)]/30 text-white backdrop-blur-md transition-all duration-300 hover:border-white/30 hover:bg-[var(--color-night)]/50 sm:left-5 sm:opacity-0 sm:group-hover/gallery:opacity-100"
                onClick={scrollPrev}
                aria-label="Previous photo"
              >
                <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
              </button>
              <button
                className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[var(--color-night)]/30 text-white backdrop-blur-md transition-all duration-300 hover:border-white/30 hover:bg-[var(--color-night)]/50 sm:right-5 sm:opacity-0 sm:group-hover/gallery:opacity-100"
                onClick={scrollNext}
                aria-label="Next photo"
              >
                <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </>
          )}

          {/* Bottom bar */}
          <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between px-5 pb-4 sm:px-8 sm:pb-6">
            {count > 1 && (
              <div className="flex items-center gap-1.5" role="tablist" aria-label="Photo navigation">
                {images.map((_, i) => (
                  <button
                    key={i}
                    role="tab"
                    onClick={() => scrollTo(i)}
                    aria-selected={i === selectedIndex}
                    aria-label={`Go to photo ${i + 1}`}
                    className={[
                      "h-1.5 rounded-full transition-all duration-300",
                      i === selectedIndex
                        ? "w-6 bg-white"
                        : "w-1.5 bg-white/40 hover:bg-white/70",
                    ].join(" ")}
                  />
                ))}
              </div>
            )}

            <button
              onClick={() => setLightboxOpen(true)}
              className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium tracking-wide text-white backdrop-blur-md transition-all hover:border-white/40 hover:bg-white/20"
              aria-label="View full screen"
            >
              <Expand className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Full screen</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Lightbox ── */}
      <Dialog.Root open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-[var(--color-night)]/95 backdrop-blur-sm" />

          <Dialog.Content
            className="fixed inset-0 z-50 flex items-center justify-center"
            aria-label={`${villaName} photo gallery`}
          >
            <VisuallyHidden.Root>
              <Dialog.Title>Photo gallery</Dialog.Title>
              <Dialog.Description>
                Photo {selectedIndex + 1} of {count}, {villaName}
              </Dialog.Description>
            </VisuallyHidden.Root>

            {/* Close */}
            <Dialog.Close asChild>
              <button
                className="absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white/70 transition-all hover:border-white/30 hover:text-white"
                aria-label="Close gallery"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </Dialog.Close>

            {/* Navigation */}
            {count > 1 && (
              <>
                <button
                  className="absolute left-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 text-white/70 transition-all hover:border-white/30 hover:text-white sm:left-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    scrollPrev();
                  }}
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="h-6 w-6" strokeWidth={1.5} />
                </button>
                <button
                  className="absolute right-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 text-white/70 transition-all hover:border-white/30 hover:text-white sm:right-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    scrollNext();
                  }}
                  aria-label="Next photo"
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

                <div className="flex gap-1.5" role="tablist" aria-label="Photo navigation">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      role="tab"
                      aria-selected={i === selectedIndex}
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
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
