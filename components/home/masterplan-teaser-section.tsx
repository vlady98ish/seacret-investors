import Image from "next/image";
import Link from "next/link";

import { ImageGallery } from "@/components/villa-detail/image-gallery";
import { getPublicMasterplanGalleryUrls } from "@/lib/home-masterplan-gallery";
import { type Locale } from "@/lib/i18n";
import { getSanityImageUrl } from "@/lib/sanity/image";
import type { HomePage } from "@/lib/sanity/types";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/sections/section-heading";
import { StatsBar } from "@/components/sections/stats-bar";

type MasterplanTeaserSectionProps = {
  data: HomePage | null;
  stats: { total: number; available: number; reserved: number; sold: number } | null;
  locale: Locale;
  title?: string;
  description?: string;
  statTotalLabel?: string;
  /** @deprecated no longer rendered — plots count is not in the stats query */
  statPlotsLabel?: string;
  statAvailableLabel?: string;
  eyebrowLabel?: string;
  ctaLabel?: string;
};

export function MasterplanTeaserSection({ data, stats, locale, title, description, statTotalLabel, statPlotsLabel, statAvailableLabel, eyebrowLabel, ctaLabel }: MasterplanTeaserSectionProps) {
  const galleryUrls =
    data?.masterplanGallery
      ?.map((img) => getSanityImageUrl(img, 1920))
      .filter((u): u is string => Boolean(u)) ?? [];
  const fallbackSingle = getSanityImageUrl(data?.masterplanImage, 1200);
  const publicGallery = getPublicMasterplanGalleryUrls();
  /** CMS gallery first; then static folder (2+ files) so local/public assets can replace one bad CMS shot. */
  const imageUrls =
    galleryUrls.length > 0
      ? galleryUrls
      : publicGallery.length >= 2
        ? publicGallery
        : fallbackSingle
          ? [fallbackSingle]
          : publicGallery.length === 1
            ? publicGallery
            : [];
  const galleryAltBase = title?.trim() || "Sea'cret Residences masterplan";

  if (!imageUrls.length && !stats) return null;

  return (
    <section className="bg-[var(--color-sand)] py-16 sm:py-20 lg:py-24">
      <div className="section-shell">
        <ScrollReveal>
          <SectionHeading
            eyebrow={eyebrowLabel}
            title={title}
            description={description}
            align="center"
            titleClassName="uppercase tracking-[0.08em]"
          />
        </ScrollReveal>

        {imageUrls.length > 1 ? (
          <ScrollReveal className="mt-12" delay={0.1}>
            <ImageGallery images={imageUrls} villaName={galleryAltBase} variant="masterplan" />
          </ScrollReveal>
        ) : imageUrls.length === 1 ? (
          <ScrollReveal className="mt-12" delay={0.1}>
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
              <Image
                src={imageUrls[0]}
                alt={`${galleryAltBase} — aerial view`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 80vw"
              />
            </div>
          </ScrollReveal>
        ) : null}

        {stats && (
          <ScrollReveal className="mt-12" delay={0.2}>
            <StatsBar
              stats={[
                { label: statTotalLabel, value: stats.total },
                { label: statPlotsLabel, value: 6 },
                { label: statAvailableLabel, value: stats.available },
              ]}
            />
          </ScrollReveal>
        )}

        {ctaLabel && (
          <ScrollReveal className="mt-12 text-center" delay={0.25}>
            <Link href={`/${locale}/masterplan`} className="btn btn-outline">
              {ctaLabel} &rarr;
            </Link>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
