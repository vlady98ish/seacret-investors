import { Landmark, Leaf, UtensilsCrossed } from "lucide-react";

import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/sections/section-heading";
import type { Experience } from "@/lib/sanity/types";
import type { Locale } from "@/lib/i18n";

interface ExperiencesSectionProps {
  locale: Locale;
  experiences?: Experience[];
  eyebrow?: string;
  title?: string;
  description?: string;
}

type CategoryKey = "culture" | "nature" | "gastronomy";

const categoryMeta: Record<
  CategoryKey,
  { label: string; icon: typeof Landmark; items: string[] }
> = {
  culture: {
    label: "Culture",
    icon: Landmark,
    items: [
      "Ancient Delphi — Oracle of the ancient world",
      "Galaxidi — A preserved 19th-century seafaring town",
      "Byzantine monasteries in the hills",
      "Local tavernas with generational recipes",
    ],
  },
  nature: {
    label: "Nature",
    icon: Leaf,
    items: [
      "Blue Flag beaches minutes from home",
      "Private pools with Corinthian Gulf views",
      "Olive grove hiking trails through ancient trees",
      "Kayaking in secluded coastal bays",
    ],
  },
  gastronomy: {
    label: "Gastronomy",
    icon: UtensilsCrossed,
    items: [
      "Amfissa olives — PDO protected, world-renowned",
      "Fresh gulf seafood caught daily",
      "Local cheeses and artisan honey",
      "Wine tastings at regional estates",
    ],
  },
};

function groupExperiences(experiences: Experience[]): Record<CategoryKey, Experience[]> {
  const grouped: Record<CategoryKey, Experience[]> = {
    culture: [],
    nature: [],
    gastronomy: [],
  };
  for (const exp of experiences) {
    if (exp.category in grouped) {
      grouped[exp.category as CategoryKey].push(exp);
    }
  }
  return grouped;
}

export function ExperiencesSection({
  locale,
  experiences,
  eyebrow,
  title,
  description,
}: ExperiencesSectionProps) {
  const hasCmsData = experiences && experiences.length > 0;
  const grouped = hasCmsData ? groupExperiences(experiences) : null;

  const resolvedEyebrow = eyebrow || "LOCAL EXPERIENCES";
  const resolvedTitle = title || "A life well-lived, every day.";
  const resolvedDescription =
    description ||
    "From ancient ruins to fresh-caught seafood — the richness of this region becomes your everyday backdrop.";

  return (
    <section className="py-20" style={{ background: "var(--color-cream)" }}>
      <div className="section-shell flex flex-col gap-12">
        <ScrollReveal>
          <SectionHeading
            eyebrow={resolvedEyebrow}
            title={resolvedTitle}
            description={resolvedDescription}
          />
        </ScrollReveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(1, 1fr)",
            gap: "1.5rem",
          }}
          className="sm:grid-cols-3"
        >
          {(Object.entries(categoryMeta) as [CategoryKey, typeof categoryMeta[CategoryKey]][]).map(
            ([key, meta], i) => {
              const Icon = meta.icon;
              const cmsItems =
                grouped?.[key].map((exp) => exp.title[locale] ?? exp.title.en) ?? null;
              const displayItems = cmsItems ?? meta.items;

              return (
                <ScrollReveal key={key} delay={i * 0.1}>
                  <div className="tile flex flex-col gap-5 h-full">
                    {/* Category header */}
                    <div className="flex items-center gap-3">
                      <div
                        style={{
                          width: "2.75rem",
                          height: "2.75rem",
                          borderRadius: "var(--radius-full)",
                          background: "rgba(13,103,119,0.10)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Icon
                          size={18}
                          style={{ color: "var(--color-deep-teal)" }}
                          strokeWidth={1.5}
                        />
                      </div>
                      <h3 className="text-h3">{meta.label}</h3>
                    </div>

                    {/* Items list */}
                    <ul
                      className="flex flex-col gap-2 mt-auto"
                      style={{ listStyle: "none", padding: 0, margin: 0 }}
                    >
                      {displayItems.map((item, idx) => (
                        <li
                          key={idx}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "0.6rem",
                            fontSize: "0.875rem",
                            color: "var(--color-ink)",
                            lineHeight: 1.5,
                          }}
                        >
                          <span
                            style={{
                              flexShrink: 0,
                              marginTop: "0.45rem",
                              width: "5px",
                              height: "5px",
                              borderRadius: "50%",
                              background: "var(--color-deep-teal)",
                              display: "inline-block",
                            }}
                            aria-hidden="true"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollReveal>
              );
            }
          )}
        </div>
      </div>
    </section>
  );
}
