import { Globe, Handshake, Key, MapPin, Shield, TrendingUp } from "lucide-react";

import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/sections/section-heading";

const VALUES = [
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

export function ValuesSection() {
  return (
    <section className="bg-[var(--color-sand)] py-24 sm:py-32">
      <div className="section-shell">
        <ScrollReveal>
          <SectionHeading
            eyebrow="Why Live Better"
            title="A 360° approach to real estate investment"
          />
        </ScrollReveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {VALUES.map((item, i) => (
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
