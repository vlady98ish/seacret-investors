import type React from "react";
import { Globe, Handshake, Key, MapPin, Shield, TrendingUp } from "lucide-react";

import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/sections/section-heading";

type CmsValue = {
  icon: string;
  title: string;
  description: string;
};

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Shield,
  Key,
  Globe,
  TrendingUp,
  Handshake,
  MapPin,
};

type ValuesSectionProps = {
  eyebrow?: string;
  title?: string;
  values?: CmsValue[];
};

export function ValuesSection({ eyebrow, title, values }: ValuesSectionProps) {
  if (!values?.length) return null;

  return (
    <section className="bg-[var(--color-sand)] py-16 sm:py-20 lg:py-24">
      <div className="section-shell">
        {(eyebrow || title) && (
          <ScrollReveal>
            <SectionHeading
              eyebrow={eyebrow}
              title={title}
            />
          </ScrollReveal>
        )}

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((item, i) => {
            const IconComponent = ICON_MAP[item.icon] ?? Shield;
            return (
              <ScrollReveal key={item.title} delay={i * 0.08}>
                <div className="rounded-md bg-white p-6 shadow-[var(--shadow-card)]">
                  <IconComponent className="h-7 w-7 text-[var(--color-deep-teal)]" />
                  <h3 className="text-h3 mt-4">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">{item.description}</p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
