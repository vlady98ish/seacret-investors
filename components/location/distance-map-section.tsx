import { Car, Clock } from "lucide-react";

import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/sections/section-heading";

interface MarkerProp {
  place: string;
  time: string;
  detail: string;
}

interface DistanceMapSectionProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  markers?: MarkerProp[];
  locationLabel?: string;
}

export function DistanceMapSection({
  eyebrow,
  title,
  description,
  markers,
  locationLabel,
}: DistanceMapSectionProps = {}) {
  if (!markers?.length) return null;

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

        {/* Map placeholder + distance grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "2rem",
          }}
          className="lg:grid-cols-2"
        >
          {/* Styled map placeholder */}
          <ScrollReveal direction="left">
            <div
              className="tile flex items-center justify-center"
              style={{
                minHeight: "360px",
                background:
                  "linear-gradient(135deg, rgba(13,103,119,0.08) 0%, rgba(13,103,119,0.18) 100%)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Decorative grid lines suggesting a map */}
              <svg
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  opacity: 0.18,
                }}
                viewBox="0 0 400 360"
                preserveAspectRatio="xMidYMid slice"
              >
                {/* Horizontal lines */}
                {[60, 120, 180, 240, 300].map((y) => (
                  <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="#0d6777" strokeWidth="1" />
                ))}
                {/* Vertical lines */}
                {[80, 160, 240, 320].map((x) => (
                  <line key={x} x1={x} y1="0" x2={x} y2="360" stroke="#0d6777" strokeWidth="1" />
                ))}
                {/* Coastline hint */}
                <path
                  d="M 20 200 Q 80 180 140 195 Q 200 210 260 190 Q 320 170 390 185"
                  fill="none"
                  stroke="#0d6777"
                  strokeWidth="2.5"
                  strokeDasharray="6 3"
                />
                {/* Location dot */}
                <circle cx="200" cy="195" r="8" fill="#efc676" opacity="0.9" />
                <circle cx="200" cy="195" r="14" fill="#efc676" opacity="0.3" />
              </svg>

              <div className="relative z-10 flex flex-col items-center gap-2 text-center">
                <span
                  className="eyebrow"
                  style={{ color: "var(--color-deep-teal)" }}
                >
                  CHILIADOU
                </span>
                {locationLabel && (
                  <p
                    className="text-body-muted text-sm"
                    style={{ maxWidth: "200px" }}
                  >
                    {locationLabel}
                  </p>
                )}
              </div>
            </div>
          </ScrollReveal>

          {/* Distance markers */}
          <ScrollReveal direction="right">
            <div className="flex flex-col gap-3">
              {markers.map((d, i) => (
                <ScrollReveal key={d.place || i} delay={i * 0.06}>
                  <div
                    className="tile flex items-center gap-4"
                    style={{ padding: "1rem 1.25rem" }}
                  >
                    <div
                      style={{
                        flexShrink: 0,
                        width: "2.5rem",
                        height: "2.5rem",
                        borderRadius: "var(--radius-full)",
                        background: "rgba(13,103,119,0.10)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Car
                        size={16}
                        style={{ color: "var(--color-deep-teal)" }}
                        strokeWidth={1.5}
                      />
                    </div>

                    <div className="flex flex-col flex-1 min-w-0">
                      <span
                        style={{
                          fontFamily: "var(--font-serif), Cinzel, serif",
                          fontWeight: 600,
                          fontSize: "0.95rem",
                          color: "var(--color-ink)",
                        }}
                      >
                        {d.place}
                      </span>
                      <span className="text-body-muted" style={{ fontSize: "0.8rem" }}>
                        {d.detail}
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.35rem",
                        flexShrink: 0,
                      }}
                    >
                      <Clock
                        size={13}
                        style={{ color: "var(--color-deep-teal)" }}
                        strokeWidth={1.5}
                      />
                      <span
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          color: "var(--color-deep-teal)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {d.time}
                      </span>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
