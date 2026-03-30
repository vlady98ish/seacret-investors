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
  categoryLabels?: { culture?: string; nature?: string; gastronomy?: string };
}

type CategoryKey = "culture" | "nature" | "gastronomy";

const categoryIcons: Record<CategoryKey, typeof Landmark> = {
  culture: Landmark,
  nature: Leaf,
  gastronomy: UtensilsCrossed,
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
  categoryLabels: catLabels,
}: ExperiencesSectionProps) {
  if (!experiences?.length) return null;

  const grouped = groupExperiences(experiences);

  return (
    <section className="py-20" style={{ background: "var(--color-cream)" }}>
      <div className="section-shell flex flex-col gap-12">
        <ScrollReveal>
          <SectionHeading
            eyebrow={eyebrow}
            title={title}
            description={description}
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
          {(Object.keys(categoryIcons) as CategoryKey[]).map((key, i) => {
            const items = grouped[key];
            if (!items.length) return null;
            const Icon = categoryIcons[key];

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
                    <h3 className="text-h3">{catLabels?.[key] ?? key}</h3>
                  </div>

                  {/* Items list */}
                  <ul
                    className="flex flex-col gap-2 mt-auto"
                    style={{ listStyle: "none", padding: 0, margin: 0 }}
                  >
                    {items.map((exp) => (
                      <li
                        key={exp._id}
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
                        {exp.title[locale] ?? exp.title.en}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
