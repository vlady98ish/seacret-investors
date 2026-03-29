import type { Locale } from "@/lib/i18n";
import type { Villa } from "@/lib/sanity/types";
import { VillaCard } from "@/components/sections/villa-card";
import { SectionHeading } from "@/components/sections/section-heading";

type RelatedVillasProps = {
  allVillas: Villa[];
  currentSlug: string;
  locale: Locale;
};

export function RelatedVillas({ allVillas, currentSlug, locale }: RelatedVillasProps) {
  const related = allVillas.filter((v) => v.slug.current !== currentSlug).slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section className="section-shell py-20">
      <SectionHeading
        eyebrow="EXPLORE MORE"
        title="You Might Also Like"
        description="Discover our other exclusive villa types at Sea'cret Residences."
      />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((villa) => (
          <VillaCard key={villa._id} villa={villa} locale={locale} />
        ))}
      </div>
    </section>
  );
}
