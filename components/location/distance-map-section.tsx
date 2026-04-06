import Image from "next/image";
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
  mapImageUrl?: string | null;
}

export function DistanceMapSection({
  eyebrow,
  title,
  description,
  markers,
  locationLabel,
  mapImageUrl,
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
          {/* Location map image */}
          <ScrollReveal direction="left">
            <div
              className="relative overflow-hidden"
              style={{
                minHeight: "360px",
                borderRadius: "var(--radius-lg)",
                border: "1px solid rgba(13,103,119,0.08)",
              }}
            >
              <Image
                src={mapImageUrl || "/images/location/chiliadou-map.png"}
                alt="Sea'cret Residences location — Chiliadou, Dorida, Fokida, Corinthian Gulf"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={95}
                unoptimized={!!mapImageUrl}
              />
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
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[rgba(13,103,119,0.10)]">
                      <Car size={18} className="text-[var(--color-deep-teal)]" strokeWidth={1.5} />
                    </div>

                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="font-serif text-sm font-semibold text-[var(--color-ink)]">
                        {d.place}
                      </span>
                      <span className="text-xs leading-relaxed text-[var(--color-muted)]">
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
                      <span className="text-sm font-semibold text-[var(--color-deep-teal)] whitespace-nowrap">
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
