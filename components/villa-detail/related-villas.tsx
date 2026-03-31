import type { Locale } from "@/lib/i18n";
import type { Villa } from "@/lib/sanity/types";
import { VillaCard } from "@/components/sections/villa-card";
import { SectionHeading } from "@/components/sections/section-heading";

type RelatedVillasProps = {
  allVillas: Villa[];
  currentSlug: string;
  locale: Locale;
  labelEyebrow?: string;
  labelTitle?: string;
  labelDescription?: string;
  labelSoldOut?: string;
  labelBed?: string;
  labelContactForPricing?: string;
  labelAvailable?: string;
};

export function RelatedVillas({ allVillas, currentSlug, locale, labelEyebrow, labelTitle, labelDescription, labelSoldOut, labelBed, labelContactForPricing, labelAvailable }: RelatedVillasProps) {
  if (!allVillas?.length) return null;

  const related = allVillas.filter((v) => v.slug.current !== currentSlug).slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section className="section-shell py-20">
      <SectionHeading
        eyebrow={labelEyebrow}
        title={labelTitle}
        description={labelDescription}
      />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((villa) => (
          <VillaCard
            key={villa._id}
            villa={villa}
            locale={locale}
            labelSoldOut={labelSoldOut}
            labelBed={labelBed}
            labelContactForPricing={labelContactForPricing}
            labelAvailable={labelAvailable}
            luxury
          />
        ))}
      </div>
    </section>
  );
}
