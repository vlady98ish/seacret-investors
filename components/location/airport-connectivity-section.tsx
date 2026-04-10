import { Plane, Clock, Globe } from "lucide-react";

import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/sections/section-heading";

interface AirportProp {
  code: string;
  name: string;
  city: string;
  travelTime: string;
  destinations: number;
  countries?: number | null;
  note: string;
  isNearest?: boolean;
}

interface AirportConnectivitySectionProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  airports?: AirportProp[];
  labelFromChiliadou?: string;
  labelDestinations?: string;
  labelCountries?: string;
  labelWorldwide?: string;
  labelNearest?: string;
}

export function AirportConnectivitySection({
  eyebrow,
  title,
  description,
  airports,
  labelFromChiliadou,
  labelDestinations,
  labelCountries,
  labelWorldwide,
  labelNearest,
}: AirportConnectivitySectionProps = {}) {
  if (!airports?.length) return null;

  return (
    <section className="py-20" style={{ background: "var(--color-sand)" }}>
      <div className="section-shell flex flex-col gap-12">
        <ScrollReveal>
          <SectionHeading
            eyebrow={eyebrow}
            title={title}
            description={description}
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {airports.map((airport, i) => (
            <ScrollReveal key={airport.code || i} delay={i * 0.1}>
              <div
                className="tile relative flex flex-col gap-5 h-full"
                style={
                  airport.isNearest
                    ? {
                        border: "1px solid rgba(239,198,118,0.4)",
                        background: "rgba(255,250,241,0.98)",
                        boxShadow: "0 8px 40px rgba(239,198,118,0.15)",
                      }
                    : undefined
                }
              >
                {airport.isNearest && labelNearest && (
                  <span className="absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[var(--color-gold-sun)] px-3 py-0.5 text-[0.6875rem] font-bold uppercase tracking-widest text-[var(--color-night)]">
                    {labelNearest}
                  </span>
                )}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-serif text-4xl font-bold leading-none tracking-wide text-[var(--color-deep-teal)]">
                      {airport.code}
                    </span>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">
                      {airport.city}
                    </p>
                  </div>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[rgba(13,103,119,0.10)]">
                    <Plane size={18} className="text-[var(--color-deep-teal)]" strokeWidth={1.5} />
                  </div>
                </div>

                {/* Airport name */}
                <p className="text-sm text-[var(--color-ink)] leading-normal">
                  {airport.name}
                </p>

                {/* Stats */}
                <div className="mt-auto flex flex-col gap-2">
                  {labelFromChiliadou && (
                    <div className="flex items-center gap-2 border-t border-[rgba(13,103,119,0.08)] pt-3">
                      <Clock size={14} className="shrink-0 text-[var(--color-deep-teal)]" strokeWidth={1.5} />
                      <span className="text-sm font-semibold text-[var(--color-ink)]">
                        {airport.travelTime} {labelFromChiliadou}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Globe size={14} className="shrink-0 text-[var(--color-deep-teal)]" strokeWidth={1.5} />
                    <span className="text-sm text-[var(--color-muted)]">
                      {airport.destinations}
                      {airport.destinations === 160 ? "+" : ""}{labelDestinations ? ` ${labelDestinations}` : ""}
                      {airport.countries
                        ? labelCountries ? ` · ${airport.countries} ${labelCountries}` : ` · ${airport.countries}`
                        : labelWorldwide ? ` ${labelWorldwide}` : ""}
                    </span>
                  </div>
                </div>

                {/* Note */}
                <p className="text-xs italic leading-normal text-[var(--color-muted)]">
                  {airport.note}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
