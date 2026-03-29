import { ScrollReveal } from "@/components/scroll-reveal";
import { VillaCard } from "@/components/sections/villa-card";
import type { Locale } from "@/lib/i18n";
import type { UnitFlat, Villa } from "@/lib/sanity/types";
import { getVillaImages } from "@/lib/villa-images";

type VillaTypeGridProps = {
  villas: Villa[];
  units: UnitFlat[];
  locale: Locale;
};

export function VillaTypeGrid({ villas, units, locale }: VillaTypeGridProps) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {villas.map((villa, index) => {
        const villaUnits = units.filter(
          (u) => u.villaTypeName === villa.name || u.villaTypeSlug === villa.slug.current
        );

        return (
          <ScrollReveal key={villa._id} delay={index * 0.08}>
            <VillaCard
              villa={villa}
              locale={locale}
              units={villaUnits.map((u) => ({ totalArea: u.totalArea, status: u.status }))}
              staticImageSrc={getVillaImages(villa.slug.current).hero}
            />
          </ScrollReveal>
        );
      })}
    </div>
  );
}
