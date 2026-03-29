import Image from "next/image";

import { cn } from "@/lib/cn";
import { getSanityImageUrl } from "@/lib/sanity/image";
import type { SanityImage } from "@/lib/sanity/types";

type ImageWithFallbackProps = {
  sanityImage?: SanityImage | null;
  staticSrc?: string | null;
  alt: string;
  width: number;
  height: number;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
};

export function ImageWithFallback({
  sanityImage,
  staticSrc,
  alt,
  width,
  height,
  className,
  fill,
  priority,
  sizes,
}: ImageWithFallbackProps) {
  const sanityUrl = sanityImage ? getSanityImageUrl(sanityImage, width) : null;
  const src = sanityUrl ?? staticSrc;

  if (src) {
    return fill ? (
      <Image src={src} alt={alt} fill className={className} priority={priority} sizes={sizes} />
    ) : (
      <Image src={src} alt={alt} width={width} height={height} className={className} priority={priority} sizes={sizes} />
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center bg-gradient-to-br from-[var(--color-stone)] to-[var(--color-sand)] text-[var(--color-muted)]",
        className
      )}
      style={fill ? { position: "absolute", inset: 0 } : { width, height }}
    >
      <span className="text-sm">No image</span>
    </div>
  );
}
