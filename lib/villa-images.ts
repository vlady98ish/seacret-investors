/**
 * Static image paths for each villa type.
 * Used as fallback when Sanity CMS images are not available.
 */

type VillaImageSet = {
  hero: string;
  gallery: string[];
  plans: string[];
};

const villaImages: Record<string, VillaImageSet> = {
  tai: {
    hero: "/assets/pdf/villas/tai-hero.png",
    gallery: [
      "/assets/pdf/villas/tai-hero.png",
      "/assets/pdf/villas/tai-gallery.png",
      "/assets/pdf/villas/tai-living.png",
      "/assets/pdf/page-20-villa-tai.jpg",
    ],
    plans: ["/assets/pdf/villas/tai-plans.png"],
  },
  yehonatan: {
    hero: "/assets/pdf/villas/yehonatan-hero.png",
    gallery: [
      "/assets/pdf/villas/yehonatan-hero.png",
      "/assets/pdf/villas/yehonatan-gallery.png",
      "/assets/pdf/villas/yehonatan-pool.png",
      "/assets/pdf/page-23-villa-yehonatan.jpg",
    ],
    plans: ["/assets/pdf/villas/yehonatan-plans.png"],
  },
  michal: {
    hero: "/assets/pdf/villas/michal-hero.png",
    gallery: [
      "/assets/pdf/villas/michal-hero.png",
      "/assets/pdf/villas/michal-gallery.png",
      "/assets/pdf/villas/michal-pool.png",
      "/assets/pdf/page-27-villa-michal.jpg",
    ],
    plans: ["/assets/pdf/villas/michal-plans.png"],
  },
  yair: {
    hero: "/assets/pdf/villas/yair-hero.png",
    gallery: [
      "/assets/pdf/villas/yair-hero.png",
      "/assets/pdf/villas/yair-gallery.png",
      "/assets/pdf/page-29-villa-yair.jpg",
    ],
    plans: ["/assets/pdf/villas/yair-plans.png"],
  },
  lola: {
    hero: "/assets/pdf/villas/green-hero.png",
    gallery: [
      "/assets/pdf/villas/green-hero.png",
      "/assets/pdf/villas/green-gallery.png",
      "/assets/pdf/villas/green-interior.png",
    ],
    plans: ["/assets/pdf/villas/green-plans.png"],
  },
  mikka: {
    hero: "/assets/pdf/villas/green-hero.png",
    gallery: [
      "/assets/pdf/villas/green-hero.png",
      "/assets/pdf/villas/green-gallery.png",
      "/assets/pdf/villas/green-interior.png",
    ],
    plans: ["/assets/pdf/villas/green-plans.png"],
  },
};

export function getVillaImages(slug: string): VillaImageSet {
  return villaImages[slug] ?? {
    hero: "/assets/pdf/page-02-hero.jpg",
    gallery: [],
    plans: [],
  };
}
