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

export function WhyChiliadouSection({
  locale,
  content,
  eyebrow,
  title,
  description,
  features,
}: WhyChiliadouSectionProps) {
  void locale;

  if (!features?.length && !description) return null;

  return (
    <section className="py-20" style={{ background: "var(--color-sand)" }}>
      <div className="section-shell flex flex-col gap-12">
        <ScrollReveal>
          <SectionHeading
            eyebrow={eyebrow}
            title={title}
            description={description ?? content}
          />
        </ScrollReveal>

        {features && features.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {features.map((feature, i) => {
              const Icon = feature.icon ? iconMap[feature.icon.toLowerCase()] : undefined;
              return (
                <ScrollReveal key={feature.heading || i} delay={i * 0.1}>
                  <div className="tile flex flex-col gap-5 h-full">
                    {Icon && (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(13,103,119,0.10)]">
                        <Icon size={18} className="text-[var(--color-deep-teal)]" strokeWidth={1.5} />
                      </div>
                    )}
                    <div className="flex flex-col gap-2">
                      <h3 className="text-h3">{feature.heading}</h3>
                      <p className="text-body-muted">{feature.description}</p>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
