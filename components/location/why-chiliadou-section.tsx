import { Waves, Users, Heart } from "lucide-react";

import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/sections/section-heading";
import type { Locale } from "@/lib/i18n";

interface WhyChiliadouSectionProps {
  locale: Locale;
  content?: string;
}

const features = [
  {
    icon: Waves,
    heading: "Blue Flag Beach",
    description:
      "Chiliadou boasts an EU Blue Flag certified beach — a mark of exceptional water quality, safety, and environmental management. Crystal-clear waters of the Corinthian Gulf, just steps from your doorstep.",
  },
  {
    icon: Users,
    heading: "No Crowds",
    description:
      "Hidden from mass tourism, Chiliadou remains one of the last unspoiled stretches of the Greek coastline. No resort hotels. No noisy beach bars. Just the sea, the olive groves, and absolute peace.",
  },
  {
    icon: Heart,
    heading: "Pure Authenticity",
    description:
      "Life here moves at the rhythm of the tides and the harvest seasons. Stone-built tavernas, olive oil pressed from century-old trees, local fishermen bringing in the day's catch — Greece as it was meant to be.",
  },
] as const;

export function WhyChiliadouSection({ locale, content }: WhyChiliadouSectionProps) {
  void locale; // locale reserved for future i18n expansion

  return (
    <section className="py-20" style={{ background: "var(--color-sand)" }}>
      <div className="section-shell flex flex-col gap-12">
        <ScrollReveal>
          <SectionHeading
            eyebrow="WHY CHILIADOU"
            title="Hidden from many. Perfect for few."
            description={
              content ??
              "A village that still belongs to those who seek authenticity over convenience — and find it in abundance."
            }
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
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <ScrollReveal key={feature.heading} delay={i * 0.1}>
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
