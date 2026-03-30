import { Waves, Users, Heart, type LucideIcon } from "lucide-react";

import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/sections/section-heading";
import type { Locale } from "@/lib/i18n";

interface FeatureProp {
  heading: string;
  description: string;
  icon?: string;
}

interface WhyChiliadouSectionProps {
  locale: Locale;
  /** @deprecated use eyebrow/title/description/features props instead */
  content?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  features?: FeatureProp[];
}

const iconMap: Record<string, LucideIcon> = {
  waves: Waves,
  users: Users,
  heart: Heart,
};

const defaultFeatures: FeatureProp[] = [
  {
    icon: "waves",
    heading: "Blue Flag Beach",
    description:
      "Chiliadou boasts an EU Blue Flag certified beach — a mark of exceptional water quality, safety, and environmental management. Crystal-clear waters of the Corinthian Gulf, just steps from your doorstep.",
  },
  {
    icon: "users",
    heading: "No Crowds",
    description:
      "Hidden from mass tourism, Chiliadou remains one of the last unspoiled stretches of the Greek coastline. No resort hotels. No noisy beach bars. Just the sea, the olive groves, and absolute peace.",
  },
  {
    icon: "heart",
    heading: "Pure Authenticity",
    description:
      "Life here moves at the rhythm of the tides and the harvest seasons. Stone-built tavernas, olive oil pressed from century-old trees, local fishermen bringing in the day's catch — Greece as it was meant to be.",
  },
];

const defaultIcons: LucideIcon[] = [Waves, Users, Heart];

export function WhyChiliadouSection({
  locale,
  content,
  eyebrow,
  title,
  description,
  features,
}: WhyChiliadouSectionProps) {
  void locale;

  const resolvedEyebrow = eyebrow || "WHY CHILIADOU";
  const resolvedTitle = title || "Hidden from many. Perfect for few.";
  const resolvedDescription =
    description ||
    content ||
    "A village that still belongs to those who seek authenticity over convenience — and find it in abundance.";

  const resolvedFeatures = features && features.length > 0 ? features : defaultFeatures;

  return (
    <section className="py-20" style={{ background: "var(--color-sand)" }}>
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
          {resolvedFeatures.map((feature, i) => {
            const Icon =
              (feature.icon ? iconMap[feature.icon.toLowerCase()] : undefined) ??
              defaultIcons[i % defaultIcons.length];
            return (
              <ScrollReveal key={feature.heading || i} delay={i * 0.1}>
                <div className="tile flex flex-col gap-5 h-full">
                  <div
                    className="flex items-center justify-center w-12 h-12 rounded-full"
                    style={{
                      background: "rgba(13, 103, 119, 0.10)",
                    }}
                  >
                    <Icon
                      size={22}
                      style={{ color: "var(--color-deep-teal)" }}
                      strokeWidth={1.5}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-h3">{feature.heading}</h3>
                    <p className="text-body-muted">{feature.description}</p>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
