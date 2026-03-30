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

const defaultAirports: AirportProp[] = [
  {
    code: "PVK",
    name: "Aktion National Airport",
    city: "Preveza",
    travelTime: "1h 45m",
    destinations: 38,
    countries: 14,
    note: "Closest summer gateway — direct from major EU cities",
    isNearest: false,
  },
  {
    code: "GPA",
    name: "Araxos Airport",
    city: "Patras",
    travelTime: "1h 10m",
    destinations: 17,
    countries: 9,
    note: "Nearest airport, expanding international routes every season",
    isNearest: true,
  },
  {
    code: "ATH",
    name: "Athens Int'l Airport",
    city: "Eleftherios Venizelos",
    travelTime: "2h 44m",
    destinations: 160,
    countries: null,
    note: "Year-round hub connecting 160+ airports worldwide",
    isNearest: false,
  },
];

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
  const resolvedEyebrow = eyebrow || "AIR CONNECTIVITY";
  const resolvedTitle = title || "Three gateways to paradise.";
  const resolvedDescription =
    description ||
    "Whether you fly direct from Europe or connect through Athens, the Corinthian Gulf is closer than you think.";

  const resolvedAirports =
    airports && airports.length > 0 ? airports : defaultAirports;

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
          {resolvedAirports.map((airport, i) => (
            <ScrollReveal key={airport.code || i} delay={i * 0.1}>
              <div
                className="tile flex flex-col gap-5 h-full"
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
                {airport.isNearest && (
                  <div
                    style={{
                      alignSelf: "flex-start",
                      background: "var(--color-gold-sun)",
                      color: "var(--color-night)",
                      borderRadius: "var(--radius-full)",
                      padding: "0.2rem 0.75rem",
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                    }}
                  >
                    {labelNearest || "Nearest"}
                  </div>
                )}

                {/* Airport code */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span
                      style={{
                        fontFamily: "var(--font-serif), Cinzel, serif",
                        fontSize: "2.5rem",
                        fontWeight: 700,
                        lineHeight: 1,
                        color: "var(--color-deep-teal)",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {airport.code}
                    </span>
                    <p
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        color: "var(--color-muted)",
                        marginTop: "0.25rem",
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                      }}
                    >
                      {airport.city}
                    </p>
                  </div>
                  <div
                    style={{
                      width: "2.5rem",
                      height: "2.5rem",
                      borderRadius: "var(--radius-full)",
                      background: "rgba(13,103,119,0.10)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Plane
                      size={18}
                      style={{ color: "var(--color-deep-teal)" }}
                      strokeWidth={1.5}
                    />
                  </div>
                </div>

                {/* Airport name */}
                <p
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 400,
                    color: "var(--color-ink)",
                    lineHeight: 1.5,
                  }}
                >
                  {airport.name}
                </p>

                {/* Stats */}
                <div className="flex flex-col gap-2 mt-auto">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      paddingTop: "0.75rem",
                      borderTop: "1px solid rgba(13,103,119,0.08)",
                    }}
                  >
                    <Clock
                      size={14}
                      style={{ color: "var(--color-deep-teal)", flexShrink: 0 }}
                      strokeWidth={1.5}
                    />
                    <span
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: "var(--color-ink)",
                      }}
                    >
                      {airport.travelTime} {labelFromChiliadou || "from Chiliadou"}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <Globe
                      size={14}
                      style={{ color: "var(--color-deep-teal)", flexShrink: 0 }}
                      strokeWidth={1.5}
                    />
                    <span
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--color-muted)",
                      }}
                    >
                      {airport.destinations}
                      {airport.destinations === 160 ? "+" : ""} {labelDestinations || "destinations"}
                      {airport.countries ? ` · ${airport.countries} ${labelCountries || "countries"}` : ` ${labelWorldwide || "worldwide"}`}
                    </span>
                  </div>
                </div>

                {/* Note */}
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--color-muted)",
                    fontStyle: "italic",
                    lineHeight: 1.5,
                  }}
                >
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
