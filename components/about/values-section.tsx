import type React from "react";
import { Globe, Handshake, Key, MapPin, Shield, TrendingUp } from "lucide-react";

import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/sections/section-heading";

type CmsValue = {
  icon: string;
  title: string;
  description: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type HardcodedValue = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
};

const FALLBACK_VALUES: HardcodedValue[] = [
  {
    icon: Shield,
    title: "Full Transparency",
    description: "Honesty at every stage. Online access to construction monitoring.",
  },
  {
    icon: Key,
    title: "Real Ownership",
    description: "Full property rights registered in your name from day one.",
  },
  {
    icon: Globe,
    title: "Global Investor Base",
    description: "Dozens of investors from Israel, Greece, Poland, Germany, USA, and beyond.",
  },
  {
    icon: TrendingUp,
    title: "Above-Market Returns",
    description: "Investment profitability exceeded 45% in 2023–2024. Expected 7–10% annual rental yield.",
  },
  {
    icon: Handshake,
    title: "End-to-End Support",
    description: "Full transaction support from property selection to key handover.",
  },
  {
    icon: MapPin,
    title: "Local Expertise",
    description: "Deep relationships with Greek agents, architects, engineers, contractors, and authorities.",
  },
];

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
  const resolvedEyebrow = eyebrow || "Why Live Better";
  const resolvedTitle = title || "A 360° approach to real estate investment";

  return (
    <section className="bg-[var(--color-sand)] py-24 sm:py-32">
      <div className="section-shell">
        <ScrollReveal>
          <SectionHeading
            eyebrow={resolvedEyebrow}
            title={resolvedTitle}
          />
        </ScrollReveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {values && values.length > 0
            ? values.map((item, i) => {
                const IconComponent = ICON_MAP[item.icon] ?? Shield;
                return (
                  <ScrollReveal key={item.title} delay={i * 0.08}>
                    <div className="rounded-xl bg-white p-6 shadow-[var(--shadow-card)]">
                      <IconComponent className="h-7 w-7 text-[var(--color-deep-teal)]" />
                      <h3 className="text-h3 mt-4">{item.title}</h3>
                      <p className="text-body-muted mt-2 text-sm">{item.description}</p>
                    </div>
                  </ScrollReveal>
                );
              })
            : FALLBACK_VALUES.map((item, i) => (
                <ScrollReveal key={item.title} delay={i * 0.08}>
                  <div className="rounded-xl bg-white p-6 shadow-[var(--shadow-card)]">
                    <item.icon className="h-7 w-7 text-[var(--color-deep-teal)]" />
                    <h3 className="text-h3 mt-4">{item.title}</h3>
                    <p className="text-body-muted mt-2 text-sm">{item.description}</p>
                  </div>
                </ScrollReveal>
              ))}
        </div>
      </div>
    </section>
  );
}
