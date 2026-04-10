import Image from "next/image";

import { cn } from "@/lib/cn";

type PageHeroProps = {
  backgroundImage?: string | null;
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  compact?: boolean;
  largeSubtitle?: boolean;
};

export function PageHero({ backgroundImage, title, subtitle, children, compact, largeSubtitle }: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative flex items-end overflow-hidden bg-[var(--color-night)]",
        compact ? "min-h-[50vh]" : "min-h-screen"
      )}
    >
      {backgroundImage && (
        <Image
          src={backgroundImage}
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-night)] via-[var(--color-night)]/60 via-30% to-transparent to-70%" />

      <div className="section-shell relative z-10 pb-16 pt-32 sm:pb-24">
        {title && <h1 className="text-display text-white animate-rise">{title}</h1>}
        {subtitle && (
          <p className={`mt-3 font-light animate-rise ${largeSubtitle ? "text-display text-white" : "text-lg tracking-wide text-white/70"}`} style={{ animationDelay: "100ms" }}>
            {subtitle}
          </p>
        )}
        {children && (
          <div className="mt-8 flex flex-wrap gap-4 animate-rise" style={{ animationDelay: "200ms" }}>
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
