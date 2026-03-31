import imageUrlBuilder from "@sanity/image-url";

import { dataset, projectId } from "@/sanity/env";
import type { SanityImage } from "@/lib/sanity/types";

const builder = imageUrlBuilder({ projectId, dataset });

export function urlFor(source: SanityImage) {
  return builder.image(source);
}

export function getSanityImageUrl(
  image: SanityImage | null | undefined,
  width?: number
): string | null {
  if (!image?.asset) return null;
  const b = urlFor(image).auto("format");
  return width ? b.width(width).url() : b.url();
}
