"use client";

import { useState } from "react";
import Image from "next/image";
import { Landmark, Leaf, UtensilsCrossed } from "lucide-react";

import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/sections/section-heading";
import { getSanityImageUrl } from "@/lib/sanity/image";
import type { Experience } from "@/lib/sanity/types";
import type { Locale } from "@/lib/i18n";

type CategoryKey = "culture" | "nature" | "gastronomy";

const CATEGORIES: { key: CategoryKey; Icon: typeof Landmark }[] = [
  { key: "culture", Icon: Landmark },
  { key: "nature", Icon: Leaf },
  { key: "gastronomy", Icon: UtensilsCrossed },
];

const FALLBACK_GRADIENTS: Record<CategoryKey, string> = {
  culture: "linear-gradient(135deg, #6B8E7B 0%, #2d5a3a 40%, #1a3d2a 100%)",
  nature: "linear-gradient(135deg, #64B5CE 0%, #2d8a9e 40%, #1a6b7e 100%)",
  gastronomy: "linear-gradient(135deg, #CE9464 0%, #9e6a2d 40%, #7e4a1a 100%)",
};

function groupExperiences(
  experiences: Experience[]
): Record<CategoryKey, Experience[]> {
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
  // Ensure featured card (items[0]) is the lowest sortOrder
  for (const key of Object.keys(grouped) as CategoryKey[]) {
    grouped[key].sort((a, b) => a.sortOrder - b.sortOrder);
  }
  return grouped;
}

interface ExperiencesSectionProps {
  locale: Locale;
  experiences?: Experience[];
  eyebrow?: string;
  title?: string;
  description?: string;
  categoryLabels?: { culture?: string; nature?: string; gastronomy?: string };
}

export function ExperiencesSection({
  locale,
  experiences,
  eyebrow,
  title,
  description,
  categoryLabels: catLabels,
}: ExperiencesSectionProps) {
  const grouped = experiences?.length ? groupExperiences(experiences) : null;

  // Find first non-empty category as default
  const availableCategories = CATEGORIES.filter(
    (c) => grouped && grouped[c.key].length > 0
  );
  const [activeCategory, setActiveCategory] = useState<CategoryKey>(
    availableCategories[0]?.key ?? "culture"
  );
  const [fading, setFading] = useState(false);

  if (!grouped || availableCategories.length === 0) return null;

  const items = grouped[activeCategory];
  const featured = items[0];
  const rest = items.slice(1);

  function switchCategory(cat: CategoryKey) {
    if (cat === activeCategory) return;
    setFading(true);
    setTimeout(() => {
      setActiveCategory(cat);
      setFading(false);
    }, 300);
  }

  return (
    <section className="py-20" style={{ background: "var(--color-cream)" }}>
      <div className="section-shell flex flex-col gap-10">
        <ScrollReveal>
          <SectionHeading
            eyebrow={eyebrow}
            title={title}
            description={description}
          />
        </ScrollReveal>

        {/* Category navigation */}
        <div className="flex justify-center gap-10">
          {availableCategories.map(({ key, Icon }) => (
            <button
              key={key}
              onClick={() => switchCategory(key)}
              className="flex flex-col items-center gap-2 transition-opacity duration-300"
              style={{ opacity: activeCategory === key ? 1 : 0.4 }}
              aria-pressed={activeCategory === key}
            >
              <div
                className="flex h-[52px] w-[52px] items-center justify-center rounded-full transition-all duration-300"
                style={{
                  background: "rgba(26,107,110,0.08)",
                  boxShadow:
                    activeCategory === key
                      ? "0 0 0 2px rgba(26,107,110,0.25)"
                      : "none",
                }}
              >
                <Icon
                  size={22}
                  className="text-[var(--color-deep-teal)]"
                  strokeWidth={1.5}
                />
              </div>
              <span className="eyebrow" style={{ marginBottom: 0 }}>
                {catLabels?.[key] ?? key}
              </span>
              {/* Active underline */}
              <div
                className="h-[2px] w-6 rounded-full transition-transform duration-300"
                style={{
                  background: "var(--color-deep-teal)",
                  transform:
                    activeCategory === key ? "scaleX(1)" : "scaleX(0)",
                }}
              />
            </button>
          ))}
        </div>

        {/* Card grid */}
        <div
          className="flex flex-col gap-4 transition-opacity duration-300"
          style={{ opacity: fading ? 0 : 1 }}
        >
          {/* Featured card */}
          {featured && (
            <ExperienceCard
              experience={featured}
              locale={locale}
              category={activeCategory}
              variant="featured"
              catLabel={catLabels?.[activeCategory]}
            />
          )}

          {/* Bottom row */}
          {rest.length > 0 && (
            <div
              className={`grid gap-4 grid-cols-1 ${
                rest.length === 1
                  ? "sm:grid-cols-1"
                  : rest.length === 2
                    ? "sm:grid-cols-2"
                    : "sm:grid-cols-3"
              }`}
            >
              {rest.map((exp) => (
                <ExperienceCard
                  key={exp._id}
                  experience={exp}
                  locale={locale}
                  category={activeCategory}
                  variant="small"
                  catLabel={catLabels?.[activeCategory]}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ── Individual Card ────────────────────────────────────────── */

function ExperienceCard({
  experience,
  locale,
  category,
  variant,
  catLabel,
}: {
  experience: Experience;
  locale: Locale;
  category: CategoryKey;
  variant: "featured" | "small";
  catLabel?: string;
}) {
  const imageUrl = getSanityImageUrl(
    experience.image,
    variant === "featured" ? 1440 : 600
  );
  const titleText = experience.title[locale] ?? experience.title.en;
  const descText =
    experience.description?.[locale] ?? experience.description?.en;

  const isFeatured = variant === "featured";
  const height = isFeatured ? "h-[400px] max-sm:h-[320px]" : "h-[260px] max-sm:h-[220px]";

  return (
    <div
      className={`group relative overflow-hidden rounded-[var(--radius-xl)] cursor-pointer
        transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]
        ${height}`}
    >
      {/* Background image or fallback gradient */}
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={titleText}
          fill
          sizes={isFeatured ? "100vw" : "(max-width: 768px) 100vw, 33vw"}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      ) : (
        <div
          className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.04]"
          style={{ background: FALLBACK_GRADIENTS[category] }}
        />
      )}

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(9,34,42,0.92) 0%, rgba(9,34,42,0.45) 40%, rgba(9,34,42,0.08) 100%)",
        }}
      />

      {/* Content */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ padding: isFeatured ? "28px" : "20px" }}
      >
        <div className="mb-2.5 flex items-center gap-2.5">
          <span
            className="rounded-full px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.25em]"
            style={{
              color: "var(--color-gold-sun)",
              background: "rgba(232,163,64,0.15)",
              backdropFilter: "blur(8px)",
            }}
          >
            {catLabel ?? category}
          </span>
        </div>

        <h3
          className="font-serif font-semibold text-white leading-tight tracking-wide"
          style={{ fontSize: isFeatured ? "1.55rem" : "1.05rem" }}
        >
          {titleText}
        </h3>

        {descText && (
          <p
            className={`mt-1.5 leading-relaxed ${!isFeatured ? "line-clamp-2" : ""}`}
            style={{
              color: "rgba(255,255,255,0.75)",
              fontSize: isFeatured ? "0.95rem" : "0.8rem",
              maxWidth: isFeatured ? "580px" : undefined,
            }}
          >
            {descText}
          </p>
        )}
      </div>
    </div>
  );
}
